import {createSVGElement, SVGWidget} from "../SVG";

import {CardData, CardWidget} from "./Card";
import {cardHeight, cardPaddingX, cardWidth} from "./Constants";

export type HandData = CardData[];

export class HandWidget extends SVGWidget<HandData> {
    public container: SVGGElement;
    public left: CardWidget;
    public right: CardWidget;
    constructor(data: HandData) {
        super(data);
        this.container = createSVGElement<SVGGElement>("g");

        const offsetX = (cardPaddingX + cardWidth) / 2;

        this.left = new CardWidget(data[0]);
        this.left.transform({translate: {x: -offsetX}});
        this.container.appendChild(this.left.container);

        this.right = new CardWidget(data[1]);
        this.right.transform({translate: {x: offsetX}});
        this.container.appendChild(this.right.container);
    }
}
