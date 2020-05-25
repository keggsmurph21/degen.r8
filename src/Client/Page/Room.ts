import {charForRank, Rank, Suit} from "Poker/Card";
import {getEligiblePlayerIds, Room, RoomView} from "Poker/Room";
import {randomInRange} from "Utils";

import {tableRadius, viewBox} from "../UI/Room/Constants";
import {TableData, TableWidget} from "../UI/Room/Table";
import {createSVGElement, removeChildren, SVG_NS} from "../UI/SVG";

interface RoomWindow extends Window {
    main: (view: RoomView) => void;
}

declare var window: RoomWindow;

function getRandomUsername() {
    let username = "";
    const len = randomInRange(6, 25);
    for (let i = 0; i < len; ++i) {
        const ch = String.fromCharCode(randomInRange(98, 123));
        username += ch;
    }
    return username;
}

function massage(view: RoomView): TableData {
    console.log(view);
    const seats = view.sitting.map(playerId => {
        if (playerId == null) {
            return {isAvailable: true, canSit: !view.isSitting, seat: null};
        }
        const caption = {
            username: getRandomUsername(), // FIXME
            balance: view.balances[playerId],
        };
        let hand = null;
        if (view.round != null) {
            view.round.playerStates.forEach(ps => {
                if (hand !== null)
                    return;
                if (ps.playerId !== playerId)
                    return;
                hand = ps.holeCards;
            });
        }
        return {isAvailable: false, canSit: false, seat: {caption, hand}};
    });
    let communityCards = null;
    let betting = null;
    let pots = null;
    if (view.round != null) {
        communityCards = view.round.communityCards;
        const maxBet = view.balances[view.playerId];
        if (view.isPlaying) {
            betting = {
                addBalance: {
                    min: 10 * view.params.bigBlindBet,
                    default: 20.00,
                    max: 100 * view.params.bigBlindBet,
                },
                raise: {
                    min: view.params.minimumBet,
                    default: Math.min(5 * view.params.minimumBet, maxBet),
                    max: maxBet,
                },
            };
        }
        pots = view.round.pots.map(
            pot => { return {contributions: pot.contributions}; });
    }
    return {
        nPlayers: view.sitting.length,
        showStartButton: view.canStartRound,
        communityCards,
        seats,
        betting,
        pots,
    };
}

window.main = (view: RoomView) => {
    const container = document.getElementById("table-container");
    removeChildren(container);

    const svg = createSVGElement("svg", {
        attrs: {
            xmlns: SVG_NS,
            viewBox,
            height: "100%",
            width: "100%",
        }
    });
    container.appendChild(svg);

    const data = massage(view);
    console.log(data);
    const table = new TableWidget(data, console.log);
    table.transform({translate: {y: -tableRadius * 0.2}});
    svg.appendChild(table.container);
};
