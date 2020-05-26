import {NextFunction, Request, Response} from "express";
import passport from "passport";

import {UserModel} from "../Models/UserModel";

// FIXME: There's probably a better place for these ...
const PASSWORD_REGEX = /.{6,32}/;
const USERNAME_REGEX = /[a-zA-Z][a-zA-Z0-9_.-]{4,32}/;

export const authenticate = passport.authenticate("local", {
    "successRedirect": "/",
    "failureRedirect": "/login.do",
    "failureFlash": true,
});

export const isAuthenticated =
    (req: Request, res: Response, next: NextFunction) => {
        if (req.isAuthenticated())
            return next();
        res.redirect("/login.do");
    };

export const register = async (name: string, password: string) => {
    if (!name)
        throw new Error("missing required field: username");
    if (!name.match(USERNAME_REGEX))
        throw new Error("invalid username");
    const existingUser = await UserModel.byName(name);
    if (existingUser !== null)
        throw new Error("a user with this name already exists!");
    if (!password)
        throw new Error("missing required field: password");
    if (!password.match(PASSWORD_REGEX))
        throw new Error("invalid password");
    return await UserModel.create(name, password);
}
