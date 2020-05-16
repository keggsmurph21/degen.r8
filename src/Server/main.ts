import {app} from "./App"
import {configureSocketIO} from "./Config/SocketIO";

const PORT = process.env.PORT;

export const server = app.listen(
    PORT, () => { console.log(`Listening at http://localhost:${PORT}`);});

configureSocketIO(server);
