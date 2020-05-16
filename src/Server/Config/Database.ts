import path from "path";
import Database from "sqlite-async";

let db: Database = null;

const dbPath = path.resolve(__dirname, "../../../degen.r8.db");
export const connect = async () => {
    if (db !== null)
        return db;
    db = await Database.open(dbPath);
    await db.run(`
        CREATE TABLE IF NOT EXISTS User (
                id INTEGER PRIMARY KEY,
                name TEXT NOT NULL,
                passwordHash TEXT NOT NULL)`);
    await db.run(`
        CREATE TABLE IF NOT EXISTS Room (
                id INTEGER PRIMARY KEY,
                secret TEXT,
                capacity INTEGER NOT NULL,
                numSitting INTEGER NOT NULL,
                numStanding INTEGER NOT NULL,
                json TEXT NOT NULL)`);
    return db;
};
