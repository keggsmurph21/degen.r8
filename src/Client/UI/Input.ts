import {ParamType} from "Poker/Defaults";

interface IController {
    input: HTMLInputElement;
    value(): any;
}

interface BaseInputParams<T extends ParamType> {
    id: string;
    labelText: string;
    default: T;
}

abstract class BaseInputWidget<T extends ParamType, Params extends
                                   BaseInputParams<T>> implements IController {
    public container: HTMLDivElement;
    public input: HTMLInputElement;
    public label: HTMLLabelElement;
    constructor(public inputType: string, public params: Params) {
        this.container = document.createElement("div") as HTMLDivElement;

        this.label = document.createElement("label") as HTMLLabelElement;
        this.label.setAttribute("for", params.id);
        this.label.innerText = params.labelText;
        this.container.appendChild(this.label);

        this.input = document.createElement("input") as HTMLInputElement;
        this.input.setAttribute("id", params.id);
        this.input.setAttribute("type", inputType);
        this.container.appendChild(this.input);
    }
    public abstract value(): T;
    public abstract setValue(value: T): void;
    private setDisabled(disabled: boolean): void {
        if (disabled) {
            this.input.removeAttribute("disabled");
        } else {
            this.input.setAttribute("disabled", "");
        }
    }
    public setController(controller: IController): void {
        if (controller != null) {
            controller.input.addEventListener(
                "change", _ => this.setDisabled(!!controller.value()));
            this.setDisabled(!!controller.value());
        }
    }
}

export interface BoolInputParams extends BaseInputParams<boolean> {}

export class BoolInputWidget extends BaseInputWidget<boolean, BoolInputParams> {
    constructor(params: BoolInputParams) {
        super("checkbox", params);
        if (params.default)
            this.input.setAttribute("checked", "");
    }
    public value(): boolean { return this.input.checked; }
    public setValue(value: boolean): void { this.input.checked = value; }
}

export class SliderViewWidget {
    public container: HTMLSpanElement;
    constructor(public controller:
                    BaseInputWidget<number, IntInputParams|FloatInputParams>,
                public formatValue: (value: number) => string) {
        this.container = document.createElement("span") as HTMLSpanElement;
        this.container.classList.add("slider-view");
        controller.input.addEventListener("input", _ => this.update());
    }
    public update(): void {
        this.container.innerText = this.formatValue(this.controller.value());
    }
}

export interface IntInputParams extends BaseInputParams<number> {
    min: number;
    max: number;
}

export class IntInputWidget extends BaseInputWidget<number, IntInputParams> {
    public viewWidget: SliderViewWidget;
    constructor(params: IntInputParams) {
        super("range", params);
        this.input.setAttribute("min", params.min.toString());
        this.input.setAttribute("max", params.max.toString());
        this.input.setAttribute("step", "1");
        this.input.setAttribute("value", params.default.toString());

        this.viewWidget =
            new SliderViewWidget(this, (value: number) => value.toString());
        this.viewWidget.update();
        this.container.appendChild(this.viewWidget.container);
    }
    public value(): number { return parseInt(this.input.value); }
    public setValue(value: number): void {
        this.input.value = value.toString();
        this.viewWidget.update();
    }
}

export interface FloatInputParams extends BaseInputParams<number> {
    min: number;
    max: number;
    step: number;
}

export class FloatInputWidget extends
    BaseInputWidget<number, FloatInputParams> {
    public viewWidget: SliderViewWidget;
    constructor(params: FloatInputParams) {
        super("range", params);
        this.input.setAttribute("min", params.min.toString());
        this.input.setAttribute("max", params.max.toString());
        this.input.setAttribute("step", params.step.toString());
        this.input.setAttribute("value", params.default.toString());

        this.viewWidget =
            new SliderViewWidget(this, (value: number) => value.toFixed(2));
        this.viewWidget.update();
        this.container.appendChild(this.viewWidget.container);
    }
    public value(): number { return parseFloat(this.input.value); }
    public setValue(value: number): void {
        this.input.value = value.toString();
        this.viewWidget.update();
    }
}

export interface StrInputParams extends BaseInputParams<string> {
    pattern: RegExp;
}

export class StrInputWidget extends BaseInputWidget<string, StrInputParams> {
    constructor(params: StrInputParams) {
        super("text", params);
        // "pattern" attr shouldn't have enclosing /slashes/
        const patternString = params.pattern.toString();
        this.input.setAttribute(
            "pattern", patternString.slice(1, patternString.length - 1));
        if (params.default != null)
            this.input.setAttribute("value", params.default);
    }
    public value(): string { return this.input.value; }
    public setValue(value: string): void { this.input.value = value; }
}

export type InputWidget =
    BoolInputWidget|IntInputWidget|FloatInputWidget|StrInputWidget;
