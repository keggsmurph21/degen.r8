import bcrypt from "bcrypt";

import {connect} from "../Config/Database";

const BY_NAME = `
    SELECT id, name, passwordHash
        FROM User
        WHERE name = (?)`;

const BY_ID = `
    SELECT id, name, passwordHash
        FROM User
        WHERE id = (?)`;

const INSERT = `
    INSERT INTO User (name, passwordHash)
        VALUES (?, ?)`;

export interface User {
    id: number;
    name: string;
    passwordHash: string;
}

export namespace User {

export async function byName(name: string): Promise<User|null> {
    const db = await connect();
    const row = await db.get(BY_NAME, name);
    if (row === undefined)
        return null;
    return row;
}

export async function byId(id: number): Promise<User|null> {
    const db = await connect();
    const row = await db.get(BY_ID, id);
    if (row === undefined)
        return null;
    return row;
}

export async function create(name: string, password: string): Promise<number> {
    const db = await connect();
    const passwordHash = await hashPassword(password);
    const {lastID, changed} = await db.run(INSERT, name, passwordHash);
    return lastID;
}

}

async function hashPassword(password: string): Promise<string> {
    const SALT_ROUNDS = 10;
    return await new Promise((resolve, reject) => {bcrypt.hash(
                                 password, SALT_ROUNDS, (err, hash) => {
                                     if (err)
                                         return reject(err);
                                     resolve(hash);
                                 })});
}

export async function hasPassword(user: User,
                                  password: string): Promise<boolean> {
    return await new Promise(
        (resolve, reject) => {
            bcrypt.compare(password, user.passwordHash, (err, isMatch) => {
                if (err)
                    return reject(err);
                resolve(isMatch);
            })});
}
