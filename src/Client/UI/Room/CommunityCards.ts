import {Card} from "Poker/Card";

import {createSVGElement, SVGWidget} from "../SVG";

import {CardData, CardWidget} from "./Card";
import {cardPaddingX, cardWidth} from "./Constants";

export type CommunityCardsData = (Card|null)[];

export class CommunityCardsWidget extends SVGWidget<CommunityCardsData> {
    public container: SVGGElement;
    constructor(data: CommunityCardsData) {
        super(data);
        this.container = createSVGElement<SVGGElement>("g");

        data.forEach((card, i) => {
            const dx = (i - 2) * (cardWidth + cardPaddingX);
            const cardElement = new CardWidget(card);
            cardElement.transform({translate: {x: dx}});
            this.container.appendChild(cardElement.container);
        });
    }
}
