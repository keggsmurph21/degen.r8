import passport from "passport";
import passportLocal from "passport-local";

import {hasPassword, User} from "../Models/User";

const LocalStrategy = passportLocal.Strategy;

passport.serializeUser<any, any>((user, done) => done(null, user.id));
passport.deserializeUser(async (id: number, done) => {
    try {
        const user = await User.byId(id);
        done(null, user);
    } catch (e) {
        done(e, null);
    }
});

passport.use(new LocalStrategy({usernameField: "name"}, async (name, password,
                                                               done) => {
    try {
        const user = await User.byName(name.toLowerCase());
        if (user === null)
            return done(null, false, {message: `Name ${name} not found!`});
        const isMatch = await hasPassword(user, password);
        if (!isMatch)
            return done(null, false, {message: `Invalid name or password!`});
        return done(null, user);
    } catch (e) {
        done(e, null);
    }
}));

export const isAuthenticated = (req, res, next) => {
    if (req.isAuthenticated())
        return next();
    res.redirect("/login.do");
};
