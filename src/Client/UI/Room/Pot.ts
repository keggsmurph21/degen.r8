import {createSVGElement, SVGWidget} from "../SVG";

export interface PotData {
    contributions: number[];
}

export class PotWidget extends SVGWidget<PotData> {
    constructor(data: PotData) {
        super(data);
        this.container =
            createSVGElement<SVGTextElement>("text", {classes: ["caption"]});
        const sum =
            data.contributions.reduce((acc, contrib) => acc += contrib, 0);
        this.container.textContent = sum.toFixed(2);
    }
}

