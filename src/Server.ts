import {app} from "./App"

const PORT = process.env.PORT;

export const server = app.listen(
    PORT, () => { console.log(`Listening at http://localhost:${PORT}`);});
