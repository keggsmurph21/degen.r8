import bcrypt from "bcrypt";

import {connect} from "../Config/Database";

const BY_NAME = `
    SELECT id, name, passwordHash, balance
        FROM User
        WHERE name = (?)`;

const BY_ID = `
    SELECT id, name, passwordHash, balance
        FROM User
        WHERE id = (?)`;

const INSERT = `
    INSERT INTO User (name, passwordHash)
        VALUES (?, ?)`;

const UPDATE = `
    UPDATE USER set balance = (?)
        WHERE id = (?)`;

export interface UserModel {
    id: number;
    name: string;
    passwordHash: string;
    balance: number;
}

export namespace User {

export async function byName(name: string): Promise<UserModel|null> {
    const db = await connect();
    const row = await db.get(BY_NAME, name);
    if (row === undefined)
        return null;
    return row;
}

export async function byId(id: number): Promise<UserModel|null> {
    const db = await connect();
    const row = await db.get(BY_ID, id);
    if (row === undefined)
        return null;
    return row;
}

export async function save(user: UserModel): Promise<number> {
    // NOTE: The `balance` field is the only one that can change at the moment.
    const db = await connect();
    const {lastID, changes} = await db.run(UPDATE, user.balance, user.id);
    return lastID;
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

export async function hasPassword(user: UserModel,
                                  password: string): Promise<boolean> {
    return await new Promise(
        (resolve, reject) => {
            bcrypt.compare(password, user.passwordHash, (err, isMatch) => {
                if (err)
                    return reject(err);
                resolve(isMatch);
            })});
}
