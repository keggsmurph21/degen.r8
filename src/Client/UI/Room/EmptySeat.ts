import {createSVGElement, SVGWidget} from "../SVG";

import {ButtonWidget} from "./Button";

type EmptySeatData = {
    index: number,
    canSit: boolean,
}

export class EmptySeatWidget extends SVGWidget<EmptySeatData> {
    public container: SVGGElement;
    public text: SVGTextElement = null;
    public sitButton: ButtonWidget = null;
    constructor(data: EmptySeatData,
                onClick: (name: string, value: number) => void) {
        super(data);
        this.container = createSVGElement<SVGGElement>("g");

        if (data.canSit) {
            this.sitButton = new ButtonWidget(
                {buttonText: "sit"},
                // Call *my* callback, using the *Button's*
                // name, but *my* index
                (name: string) => { onClick(name, data.index); });
            this.container.appendChild(this.sitButton.container);
        } else {
            this.text = createSVGElement<SVGTextElement>("text", {
                textContent: "\u2013", // &ndash;
                classes: ["caption", "caption-empty"],
                attrs: {x: 0, y: 0}
            });
            this.container.appendChild(this.text);
        }
    }
}
