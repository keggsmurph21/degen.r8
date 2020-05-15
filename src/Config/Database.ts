import path from "path";
import Database from "sqlite-async";

let db: Database = null;

const dbPath = path.join(__dirname, "../../degen.r8.db");
export const connect = async () => {
    if (db !== null)
        return db;
    db = await Database.open(dbPath);
    await db.run(`
        CREATE TABLE IF NOT EXISTS User (
                id INTEGER PRIMARY KEY,
                name TEXT NOT NULL,
                passwordHash TEXT NOT NULL,
                balance INTEGER NOT NULL DEFAULT 0)`);
    await db.run(`
        CREATE TABLE IF NOT EXISTS Room (
                id INTEGER PRIMARY KEY,
                secret TEXT,
                minimumBet REAL NOT NULL,
                useBlinds INTEGER NOT NULL,
                bigBlindBet REAL,
                smallBlindBet REAL,
                useAntes INTEGER NOT NULL,
                anteBet REAL,
                capacity INTEGER NOT NULL,
                dealerIndex INTEGER NOT NULL,
                autoplayInterval INTEGER NOT NULL,
                numSitting INTEGER NOT NULL,
                numStanding INTEGER NOT NULL,
                sittingJson TEXT NOT NULL,
                standingJson TEXT NOT NULL,
                roundJson TEXT)`);
    return db;
};
