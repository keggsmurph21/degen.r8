import {
    Card,
    charForRank,
    charForSuit,
    displayNameForSuit,
    Rank,
    Suit
} from "Poker/Card";

import {createSVGElement, SVGWidget} from "../SVG";

import {cardHeight, cardWidth} from "./Constants";

export type CardData = Card|null;

export class CardWidget extends SVGWidget<CardData> {
    public container: SVGGElement;
    public text: SVGTextElement = null;
    public rankSpan: SVGTSpanElement = null;
    public suitSpan: SVGTSpanElement = null;
    constructor(data: CardData) {
        super(data);

        const isFaceUp = data != null;

        this.container = createSVGElement<SVGGElement>("g", {
            classes: ["card", isFaceUp ? "card-up" : "card-down"],
            children: [createSVGElement<SVGRectElement>("rect", {
                attrs: {
                    x: -cardWidth / 2,
                    width: cardWidth,
                    y: -cardHeight / 2,
                    height: cardHeight,
                    rx: 10,
                }
            })],
        });

        if (isFaceUp) {
            this.text = createSVGElement<SVGTextElement>(
                "text", {classes: [displayNameForSuit(data.suit)]});
            this.container.appendChild(this.text);

            this.rankSpan = createSVGElement<SVGTSpanElement>("tspan", {
                textContent: charForRank(data.rank),
                attrs: {
                    x: 0,
                    dy: "-0.1em",
                }
            });
            this.text.appendChild(this.rankSpan);

            this.suitSpan = createSVGElement<SVGTSpanElement>("tspan", {
                textContent: charForSuit(data.suit),
                attrs: {
                    x: 0,
                    dy: "0.8em",
                }
            });
            this.text.appendChild(this.suitSpan);
        }
    }
}
