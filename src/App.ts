import bodyParser from "body-parser";
import express from "express";
import flash from "express-flash";
import session from "express-session";
import morgan from "morgan";
import passport from "passport";
import path from "path";

import {configurePassport} from "./Config/Passport";
import {homeController} from "./Controllers/Home";
import {roomController} from "./Controllers/Room";
import {userController} from "./Controllers/User";
import {authenticate, isAuthenticated} from "./Services/UserService";

export const app = express();

app.set("views", path.join(__dirname, "Views"));
app.set("view engine", "ejs");
app.set("query parser", "simple");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(session({
    resave: false,
    saveUninitialized: true,
    secret: process.env.SESSION_SECRET,
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use(express.static(path.join(__dirname, "../public")));
app.use(morgan("dev"));

configurePassport();

app.get("/", homeController.getHome);
app.get("/login.do", userController.getLogin);
app.get("/register.do", userController.getRegister);
app.get("/lobby.do", isAuthenticated, roomController.getLobby);
app.get("/room.do", isAuthenticated, roomController.getRoom);

app.post("/login.rest", authenticate);
app.post("/logout.rest", isAuthenticated, userController.postLogout);
app.post("/register.rest", userController.postRegister);
app.post("/room/create.rest", isAuthenticated, roomController.postCreate);
app.post("/room/addBalance.rest", isAuthenticated,
         roomController.postAddBalance);
app.post("/room/enter.rest", isAuthenticated, roomController.postEnter);
app.post("/room/leave.rest", isAuthenticated, roomController.postLeave);
app.post("/room/sit.rest", isAuthenticated, roomController.postSit);
app.post("/room/stand.rest", isAuthenticated, roomController.postStand);
app.post("/room/startRound.rest", isAuthenticated,
         roomController.postStartRound);
app.post("/room/bet.rest", isAuthenticated, roomController.postBet);
