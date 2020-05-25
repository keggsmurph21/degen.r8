import {FloatInputWidget} from "../Input";
import {createSVGElement, SVGWidget} from "../SVG";
import {EmbeddedFloatInputData, EmbeddedFloatInputWidget} from "../SVGInput";

type ButtonData = {
    buttonText: string,
}

export class ButtonWidget extends SVGWidget<ButtonData> {
    public container: SVGGElement;
    constructor(data: ButtonData, onClick: (name: string) => void) {
        super(data);
        const width = 30 + 10 * data.buttonText.length;
        const height = 27;
        const x = -width / 2;
        const y = -19;
        this.container = createSVGElement<SVGGElement>("g", {
            classes: ["button"],
            children: [
                createSVGElement<SVGRectElement>(
                    "rect", {attrs: {x, y, width, height, rx: 10}}),
                createSVGElement<SVGTextElement>(
                    "text",
                    {textContent: data.buttonText, attrs: {x: 0, y: 0}})
            ]
        });
        this.container.addEventListener("click",
                                        _ => { onClick(data.buttonText); });
    }
}

type SliderButtonData = {
    buttonText: string,
    input: EmbeddedFloatInputData,
}

export class SliderButtonWidget extends SVGWidget<SliderButtonData> {
    public container: SVGGElement;
    public button: ButtonWidget;
    public input: EmbeddedFloatInputWidget;
    constructor(data: SliderButtonData,
                onClick: (name: string, value: number) => void) {
        super(data);
        this.container = createSVGElement<SVGGElement>("g");

        this.button =
            new ButtonWidget({buttonText: data.buttonText}, (name: string) => {
                // Call *my* callback, using the *Button's*
                // name, but *my* input value()
                onClick(name, this.input.value());
            });
        this.button.transform({translate: {y: -15}});
        this.container.appendChild(this.button.container);

        this.input = new EmbeddedFloatInputWidget(data.input);
        this.input.transform({translate: {y: -5}});
        this.container.appendChild(this.input.container);
    }
}

