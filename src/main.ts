// vim: syntax=typescript

import { InvalidStateError } from "./Poker/Errors";
import { Player } from "./Poker/Player";
import { Table } from "./Poker/Table";

const t = new Table(4, "testing");
t.addPlayer(new Player(), 2);
try {
    t.addPlayer(new Player(), 6);
} catch (e: InvalidStateError) {
    console.log(e);
}
