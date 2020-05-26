import {Card} from "Poker/Card";
import {RoomView} from "Poker/Room";

import {createSVGElement, removeChildren, SVGWidget} from "../SVG";

import {BettingData, BettingWidget} from "./Betting";
import {ButtonWidget} from "./Button";
import {CommunityCardsData, CommunityCardsWidget} from "./CommunityCards";
import {tableRadius} from "./Constants";
import {PotsData, PotsWidget} from "./Pots";
import {SeatsData, SeatsWidget} from "./Seats";

function toTableData(view: RoomView,
                     usernameLookup: (id: number) => string): TableData {
    const seats = view.sitting.map(playerId => {
        if (playerId == null) {
            return {
                isAvailable: true,
                canSit: !view.isSitting,
                seat: null,
                isCurrentPlayer: false,
            };
        }
        const caption = {
            username: usernameLookup(playerId),
            balance: view.balances[playerId],
        };
        let hand: Card[] = null;
        let isCurrentPlayer = false;
        if (view.round != null) {
            view.round.playerStates.forEach(ps => {
                if (hand !== null)
                    return;
                if (ps.playerId !== playerId)
                    return;
                hand = ps.holeCards;
                isCurrentPlayer = view.isCurrentPlayer;
            });
        }
        return {
            isAvailable: false,
            canSit: false,
            seat: {caption, hand},
            isCurrentPlayer,
        };
    });
    let communityCards = null;
    let betting: BettingData = {
        addBalance: {
            min: 10 * view.params.bigBlindBet,
            default: 20.00,
            max: 100 * view.params.bigBlindBet,
        },
        raise: null,
        isCurrentPlayer: view.isCurrentPlayer,
    };
    let pots = null;
    if (view.round != null) {
        communityCards = view.round.communityCards;
        const maxBet = view.balances[view.playerId];
        if (view.isPlaying) {
            betting.raise = {
                min: view.params.minimumBet,
                default: Math.min(5 * view.params.minimumBet, maxBet),
                max: maxBet,
            };
        }
        pots = view.round.pots.map(
            pot => { return {contributions: pot.contributions}; });
    }
    const tableData = {
        nPlayers: view.sitting.length,
        showStartButton: view.canStartRound,
        communityCards,
        seats,
        betting,
        pots,
    };
    console.log("converted", view, "=>", tableData);
    return tableData;
}

export type TableData = {
    nPlayers: number; communityCards: CommunityCardsData;
    showStartButton: boolean;
    pots: PotsData;
    betting: BettingData;
}&SeatsData;

export class TableWidget extends SVGWidget<RoomView> {
    public container: SVGGElement;
    public background: SVGEllipseElement;
    public communityCards: CommunityCardsWidget = null;
    public pots: PotsWidget = null;
    public startButton: ButtonWidget = null;
    public seats: SeatsWidget;
    public betting: BettingWidget = null;
    constructor(view: RoomView, public usernameLookup: (id: number) => string,
                public onClick: (name: string, value?: number) => void) {
        super(view);
        this.container = createSVGElement<SVGGElement>("g");
        this.update(view);
    }

    public update(view: RoomView): void {

        removeChildren(this.container);
        const data = toTableData(view, this.usernameLookup);

        this.background = createSVGElement<SVGEllipseElement>(
            "ellipse",
            {attrs: {id: "table", rx: 1.3 * tableRadius, ry: tableRadius}});
        this.container.appendChild(this.background);

        this.seats = new SeatsWidget({seats: data.seats}, this.onClick);
        this.container.appendChild(this.seats.container);

        if (data.showStartButton) {
            this.startButton =
                new ButtonWidget({buttonText: "start"}, this.onClick);
            this.container.appendChild(this.startButton.container);
        } else {
            if (data.communityCards) {
                this.communityCards =
                    new CommunityCardsWidget(data.communityCards);
                this.communityCards.transform(
                    {translate: {y: -tableRadius * 0.1}});
                this.container.appendChild(this.communityCards.container);
            }

            if (data.pots) {
                this.pots = new PotsWidget(data.pots);
                this.pots.transform({translate: {y: tableRadius * 0.3}});
                this.container.appendChild(this.pots.container);
            }
        }

        this.betting = new BettingWidget(data.betting, this.onClick);
        this.betting.transform({translate: {y: tableRadius * 1.7}});
        this.container.append(this.betting.container);
    }
}
