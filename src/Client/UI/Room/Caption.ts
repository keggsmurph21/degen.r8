import {createSVGElement, SVGWidget} from "../SVG";

export type CaptionData = {
    username: string,
    balance: number
};

export class CaptionWidget extends SVGWidget<CaptionData> {
    public container: SVGTextElement;
    public usernameSpan: SVGTSpanElement;
    public balanceSpan: SVGTSpanElement;
    constructor(data: CaptionData) {
        super(data);
        this.container = createSVGElement<SVGTextElement>("text", {
            classes: ["caption"],
        });

        this.usernameSpan = createSVGElement<SVGTSpanElement>("tspan", {
            classes: ["username"],
            textContent: data.username,
            attrs: {x: 0, dy: "-0.2em"},
        });
        this.container.appendChild(this.usernameSpan);

        this.balanceSpan = createSVGElement<SVGTSpanElement>("tspan", {
            classes: ["balance"],
            textContent: data.balance.toFixed(2),
            attrs: {x: 0, dy: "1.3em"},
        });
        this.container.appendChild(this.balanceSpan);
    }
}
