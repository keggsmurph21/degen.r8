import {createSVGElement, removeChildren, SVGWidget} from "../SVG";

import {PotData, PotWidget} from "./Pot";

export type PotsData = PotData[];

export class PotsWidget extends SVGWidget<PotsData> {
    constructor(data: PotsData) {
        super(data);
        this.container = createSVGElement<SVGGElement>("g");
        data.forEach((pot, i) => {
            // distribute the pots around the y-axis of the table
            const padding = 100;
            const offsetX = ((data.length - 1) / 2 - i) * padding;
            const potWidget = new PotWidget(pot);
            potWidget.transform({translate: {x: offsetX}});
            this.container.appendChild(potWidget.container);
        });
    }
}
