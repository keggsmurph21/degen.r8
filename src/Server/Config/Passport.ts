import passport from "passport";
import passportLocal from "passport-local";

import {hasPassword, UserModel} from "../Models/UserModel";

export function configurePassport(): void {

    const LocalStrategy = passportLocal.Strategy;

    passport.serializeUser<any, any>((user, done) => done(null, user.id));
    passport.deserializeUser(async (id: number, done) => {
        try {
            const user = await UserModel.byId(id);
            done(null, user);
        } catch (e) {
            done(e, null);
        }
    });

    passport.use(new LocalStrategy(
        {usernameField: "name"}, async (name, password, done) => {
            try {
                const user = await UserModel.byName(name.toLowerCase());
                if (user === null)
                    return done(null, false,
                                {message: `Name ${name} not found!`});
                const isMatch = await hasPassword(user, password);
                if (!isMatch)
                    return done(null, false,
                                {message: `Invalid name or password!`});
                return done(null, user);
            } catch (e) {
                done(e, null);
            }
        }));
}
