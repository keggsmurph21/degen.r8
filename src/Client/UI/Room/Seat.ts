import {createSVGElement, SVGWidget} from "../SVG";

import {CaptionData, CaptionWidget} from "./Caption";
import {cardHeight} from "./Constants";
import {HandData, HandWidget} from "./Hand";

export type SeatData = {
    caption: CaptionData,
    hand: HandData,
};

export class SeatWidget extends SVGWidget<SeatData> {
    public container: SVGGElement;
    public caption: CaptionWidget;
    public hand: HandWidget;
    constructor(data: SeatData) {
        super(data);
        this.container = createSVGElement<SVGGElement>("g");

        this.caption = new CaptionWidget(data.caption);
        this.container.appendChild(this.caption.container);

        if (data.hand != null) {
            const offsetY = cardHeight * 3 / 7;
            this.caption.transform({translate: {y: -offsetY}});
            this.hand = new HandWidget(data.hand);
            this.hand.transform({translate: {y: offsetY}});
            this.container.appendChild(this.hand.container);
        }
    }
}
