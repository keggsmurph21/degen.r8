import session from "express-session";

export const sessionMiddleware = session({
    resave: false,
    saveUninitialized: true,
    secret: process.env.SESSION_SECRET,
});
