import bodyParser from "body-parser";
import express from "express";
import {Request, Response} from "express";
import flash from "express-flash";
import morgan from "morgan";
import passport from "passport";
import path from "path";

import {configurePassport} from "./Config/Passport";
import {sessionMiddleware} from "./Config/Session";
import {configureSocketIO} from "./Config/SocketIO";
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
import {
    onCreateRoom,
    onJoinRoom,
    onQueryRooms,
} from "./SocketControllers/Lobby";
import {onMessage} from "./SocketControllers/Messaging";
import {
    onAddBalance,
    onCall,
    onFold,
    onLeave,
    onRaise,
    onSit,
    onStand,
    onStart,
} from "./SocketControllers/Room";

const app = express();
const PORT = process.env.PORT;

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

export const serve = () => {
    const server = app.listen(
        PORT, () => { console.log(`Listening at http://localhost:${PORT}`); });

    configureSocketIO(server, socket => {
        // global channels
        socket.on("message", data => { onMessage(socket, data); });

        // lobby channels
        socket.on("query-rooms",
                  async data => { await onQueryRooms(socket, data); });
        socket.on("join-room",
                  async data => { await onJoinRoom(socket, data); });
        socket.on("create-room",
                  async data => { await onCreateRoom(socket, data); });

        // room channels
        socket.on("sit", async data => { await onSit(socket, data); });
        socket.on("stand", async data => { await onStand(socket, data); });
        socket.on("leave", async data => { await onLeave(socket, data); });
        socket.on("start", async data => { await onStart(socket, data); });
        socket.on("add-balance",
                  async data => { await onAddBalance(socket, data); });
        socket.on("fold", async data => { await onFold(socket, data); });
        socket.on("call", async data => { await onCall(socket, data); });
        socket.on("raise", async data => { await onRaise(socket, data); });
    });
};
