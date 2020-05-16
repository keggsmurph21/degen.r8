import bodyParser from "body-parser";
import express from "express";
import {Request, Response} from "express";
import flash from "express-flash";
import morgan from "morgan";
import passport from "passport";
import path from "path";

import {configurePassport} from "./Config/Passport";
import {sessionMiddleware} from "./Config/Session";
import {
    getLobby,
    getRoom,
    postAddBalance,
    postBet,
    postCreate,
    postEnter,
    postLeave,
    postSit,
    postStand,
    postStartRound,
} from "./Controllers/RoomController";
import {
    getLogin,
    getRegister,
    postLogout,
    postRegister
} from "./Controllers/UserController";

import {authenticate, isAuthenticated} from "./Services/UserService";

export const app = express();

app.set("views", path.join(__dirname, "Views"));
app.set("view engine", "ejs");
app.set("query parser", "simple");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(sessionMiddleware);
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use("/assets", express.static(path.join(__dirname, "../../public")));
app.use(morgan("dev"));

configurePassport();

app.get("/", (req: Request, res: Response) => res.redirect("/lobby.do"));

app.get("/login.do", getLogin);
app.get("/register.do", getRegister);
app.get("/lobby.do", isAuthenticated, getLobby);
app.get("/room.do", isAuthenticated, getRoom);

app.post("/login.rest", authenticate);
app.post("/logout.rest", isAuthenticated, postLogout);
app.post("/register.rest", postRegister);
app.post("/room/create.rest", isAuthenticated, postCreate);
app.post("/room/addBalance.rest", isAuthenticated, postAddBalance);
app.post("/room/enter.rest", isAuthenticated, postEnter);
app.post("/room/leave.rest", isAuthenticated, postLeave);
app.post("/room/sit.rest", isAuthenticated, postSit);
app.post("/room/stand.rest", isAuthenticated, postStand);
app.post("/room/startRound.rest", isAuthenticated, postStartRound);
app.post("/room/bet.rest", isAuthenticated, postBet);
