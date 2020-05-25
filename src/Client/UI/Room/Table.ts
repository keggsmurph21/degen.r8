import {createSVGElement, SVGWidget} from "../SVG";

import {BettingData, BettingWidget} from "./Betting";
import {ButtonWidget} from "./Button";
import {CommunityCardsData, CommunityCardsWidget} from "./CommunityCards";
import {tableRadius} from "./Constants";
import {PotsData, PotsWidget} from "./Pots";
import {SeatsData, SeatsWidget} from "./Seats";

export type TableData = {
    nPlayers: number; communityCards: CommunityCardsData;
    showStartButton: boolean;
    pots: PotsData;
    betting: BettingData;
}&SeatsData;

export class TableWidget extends SVGWidget<TableData> {
    public container: SVGGElement;
    public background: SVGEllipseElement;
    public communityCards: CommunityCardsWidget = null;
    public pots: PotsWidget = null;
    public startButton: ButtonWidget = null;
    public seats: SeatsWidget;
    public betting: BettingWidget = null;
    constructor(data: TableData,
                onClick: (name: string, value?: number) => void) {
        super(data);
        this.container = createSVGElement<SVGGElement>("g");

        this.background = createSVGElement<SVGEllipseElement>(
            "ellipse",
            {attrs: {id: "table", rx: 1.3 * tableRadius, ry: tableRadius}});
        this.container.appendChild(this.background);

        this.seats = new SeatsWidget({seats: data.seats}, onClick);
        this.container.appendChild(this.seats.container);

        if (data.showStartButton) {
            this.startButton = new ButtonWidget({buttonText: "start"}, onClick);
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

            if (data.betting) {
                this.betting = new BettingWidget(data.betting, onClick);
                this.betting.transform({translate: {y: tableRadius * 1.7}});
                this.container.append(this.betting.container);
            }
        }
    }
}
