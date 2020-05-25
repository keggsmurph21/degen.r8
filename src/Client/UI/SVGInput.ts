import {FloatInputParams, FloatInputWidget} from "./Input";
import {createSVGElement, SVGWidget} from "./SVG";

export type EmbeddedFloatInputData = FloatInputParams;

export class EmbeddedFloatInputWidget extends
    SVGWidget<EmbeddedFloatInputData> {
    public floatInputWidget: FloatInputWidget;
    constructor(data: EmbeddedFloatInputData) {
        super(data);
        this.container = createSVGElement<SVGForeignObjectElement>(
            "foreignObject", {classes: ["caption", "wrapped-input"]});

        this.floatInputWidget = new FloatInputWidget(data);
        this.container.appendChild(this.floatInputWidget.container);
    }
    public value(): number { return this.floatInputWidget.value(); }
}
