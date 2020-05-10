import {Request, Response} from "express";

export namespace homeController {

export const getHome =
    (req, res) => { res.render("index", {isLoggedIn: !!req.user});}

}
