import {Request, Response} from "express";
import passport from "passport";

import {User, UserModel} from "../Models/User";

function validateFloat(parameterName: string, rawValue: any, minValue: number,
                       maxValue: number, decimalPrecision: number = 2): number {
    const offset = 10 ** decimalPrecision;
    const value =
        Math.round((parseFloat(rawValue) + Number.EPSILON) * offset) / offset;
    if (isNaN(value))
        throw new Error(
            `invalid ${parameterName}: value '${rawValue}' is not a number`);
    if (value < minValue || maxValue < value)
        throw new Error(`invalid ${parameterName}: value '${
            rawValue}' is outside range ${minValue} to ${maxValue}`);
    return value;
}

export namespace userController {

export const getLogin =
    (req: Request, res: Response) => { res.render("login");};

export const postLogin = async (req: Request, res: Response, next) => {
    try {
        const authenticate =
            passport.authenticate("local", (err, user, info) => {
                if (err)
                    return next(err);
                if (!user) {
                    console.log(info);
                    return res.redirect("/login");
                }
                req.logIn(user, err => {
                    if (err)
                        return next(err);
                    return res.redirect("/");
                });
            });
        authenticate(req, res);
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
};

export const postLogout = (req: Request, res: Response) => {
    req.logout();
    res.redirect("/");
};

export const getRegister =
    (req: Request, res: Response) => { res.render("register");};

export const postRegister = async (req: Request, res: Response) => {
    const PASSWORD_REGEX = /.{6,32}/;
    const USERNAME_REGEX = /[a-zA-Z][a-zA-Z0-9_.-]{4,32}/;
    const name = req.body.name;
    if (!name) {
        req.flash("errors", "missing required field: username");
        return res.redirect("/register.do");
    }
    if (!name.match(USERNAME_REGEX)) {
        req.flash("errors", "invalid username");
        return res.redirect("/register.do");
    }
    const existingUser = await User.byName(name);
    if (existingUser !== null) {
        req.flash("errors", "a user with this name already exists!");
        return res.redirect("/register.do");
    }
    const password = req.body.password;
    if (!password) {
        req.flash("errors", "missing required field: password");
        return res.redirect("/register.do");
    }
    if (!password.match(PASSWORD_REGEX)) {
        req.flash("errors", "invalid password");
        return res.redirect("/register.do");
    }
    const newUser = await User.create(name, password);
    req.flash("info", "success!");
    res.redirect("/login.do");
};

export const postAddBalance = async (req: Request, res: Response) => {
    let credit;
    try {
        credit =
            validateFloat("credit", req.body.credit, 0.01, 100.00); // FIXME
    } catch (e) {
        req.flash("errors", e.message);
        res.sendStatus(501);
    }
    const user = req.user as UserModel;
    user.balance += credit;
    await User.save(user);
    console.log("MAKE THIS VIA AJAX");
    res.sendStatus(501);
};

}
