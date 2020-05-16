import {Request, Response} from "express";

export namespace homeController {

export const getHome = (req, res) => {
    const user = req.user;
    res.render("index", {
        user: user ? {id: user.id, name: user.name} : null,
    });
};

}
