import {Request, Response} from "express";
import passport from "passport";

import {register} from "../Services/UserService";

export const getLogin = (req: Request, res: Response) => {
    console.log(req.flash());
    res.render("login");
};

export const postLogout = (req: Request, res: Response) => {
    req.logout();
    req.session.roomId = null;
    req.session.secret = null;
    res.redirect("/");
};

export const getRegister =
    (req: Request, res: Response) => { res.render("register");};

export const postRegister = async (req: Request, res: Response) => {
    try {
        const newUserId = await register(req.body.name, req.body.password);
        res.redirect("/login.do");
    } catch (e) {
        console.log(e);
        req.flash("error", e.message);
        res.redirect("/register.do");
    }
};
