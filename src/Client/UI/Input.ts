import {ParamType} from "Poker/Defaults";
import {clamp} from "Utils";

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
    public inputContainer: HTMLSpanElement;
    public input: HTMLInputElement;
    public label: HTMLLabelElement;
    constructor(public inputType: string, public params: Params) {
        this.container = document.createElement("div") as HTMLDivElement;
        this.container.classList.add("input-widget");
        this.container.classList.add(this.widgetClass());

        this.label = document.createElement("label") as HTMLLabelElement;
        this.label.setAttribute("for", params.id);
        this.label.innerText = params.labelText;
        this.container.appendChild(this.label);

        this.inputContainer = document.createElement("span") as HTMLSpanElement;
        this.inputContainer.classList.add("input-container");
        this.container.appendChild(this.inputContainer);

        this.input = document.createElement("input") as HTMLInputElement;
        this.input.setAttribute("id", params.id);
        this.input.setAttribute("type", inputType);
        this.inputContainer.appendChild(this.input);
    }
    public abstract value(): T;
    public abstract setValue(value: T): void;
    protected abstract widgetClass(): string;
    protected abstract setDisabled(disabled: boolean): void;
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
    protected widgetClass() { return "bool-input"; }
    public value(): boolean { return this.input.checked; }
    public setValue(value: boolean): void { this.input.checked = value; }
    protected setDisabled(disabled: boolean): void {
        if (disabled) {
            this.input.removeAttribute("disabled");
        } else {
            this.input.setAttribute("disabled", "");
        }
    }
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

class AdjustButtonWidget {
    public button: HTMLButtonElement;
    constructor(public buttonText: string, public isDisabled: () => boolean,
                public onClick: () => void) {
        this.button = document.createElement("button") as HTMLButtonElement;
        this.button.setAttribute("type", "button");
        this.button.classList.add("number-adjust");
        this.button.innerText = buttonText;
        this.button.addEventListener("click", onClick);
    }
    public update(): void {
        this.button.removeAttribute("disabled");
        if (this.isDisabled())
            this.button.setAttribute("disabled", "");
    }
}

interface NumberParams extends BaseInputParams<number> {
    min: number;
    max: number;
    step: number;
}

abstract class NumberInputWidget<NumberParamsType extends NumberParams> extends
    BaseInputWidget<number, NumberParamsType> {
    public decrementButton: AdjustButtonWidget;
    public incrementButton: AdjustButtonWidget;
    public viewWidget: SliderViewWidget;
    constructor(params: NumberParamsType) {
        super("range", params);
        this.input.setAttribute("min", this.formatValue(params.min));
        this.input.setAttribute("max", this.formatValue(params.max));
        this.input.setAttribute("step", this.formatValue(params.step));
        this.input.setAttribute("value", this.formatValue(params.default));

        this.decrementButton = new AdjustButtonWidget(
            "<", () => this.value() <= this.params.min,
            () => this.setValue(this.value() - params.step));
        this.inputContainer.insertBefore(this.decrementButton.button,
                                         this.input);

        this.incrementButton = new AdjustButtonWidget(
            ">", () => this.value() >= this.params.max,
            () => this.setValue(this.value() + params.step));
        this.inputContainer.appendChild(this.incrementButton.button);

        this.viewWidget = new SliderViewWidget(this, this.formatValue);
        this.viewWidget.update();
        this.inputContainer.appendChild(this.viewWidget.container);
    }
    protected abstract formatValue(value: number): string;
    public setValue(value: number): void {
        value = clamp(this.params.min, value, this.params.max);
        this.input.value = value.toString();
        this.decrementButton.update();
        this.viewWidget.update();
        this.incrementButton.update();
    }
    protected setDisabled(disabled: boolean): void {
        if (disabled) {
            this.input.removeAttribute("disabled");
        } else {
            this.input.setAttribute("disabled", "");
        }
    }
}

export interface IntInputParams extends NumberParams {}

export class IntInputWidget extends NumberInputWidget<IntInputParams> {
    protected formatValue(value: number) { return value.toString(); }
    public value(): number { return parseInt(this.input.value); }
    protected widgetClass() { return "int-input"; }
}

export interface FloatInputParams extends NumberParams {}

export class FloatInputWidget extends NumberInputWidget<FloatInputParams> {
    protected formatValue(value: number) { return value.toFixed(2); }
    public value(): number { return parseFloat(this.input.value); }
    protected widgetClass() { return "float-input"; }
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
    protected widgetClass() { return "str-input"; }
    protected setDisabled(disabled: boolean): void {
        if (disabled) {
            this.input.removeAttribute("disabled");
        } else {
            this.input.setAttribute("disabled", "");
        }
    }
}

export type InputWidget =
    BoolInputWidget|IntInputWidget|FloatInputWidget|StrInputWidget;
