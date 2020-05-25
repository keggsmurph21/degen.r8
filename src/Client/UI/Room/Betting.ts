import {FloatInputWidget} from "../Input";
import {createSVGElement, SVGWidget} from "../SVG";
import {EmbeddedFloatInputData} from "../SVGInput";

import {ButtonWidget, SliderButtonWidget} from "./Button";
import {tableRadius} from "./Constants";

export interface BettingData {
    addBalance: {default: number, min: number, max: number};
    raise: {default: number, min: number, max: number};
}

export class BettingWidget extends SVGWidget<BettingData> {
    public container: SVGGElement;
    public addBalanceSliderButton: SliderButtonWidget;
    public foldButton: ButtonWidget;
    public callButton: ButtonWidget;
    public raiseSliderButton: SliderButtonWidget;
    constructor(data: BettingData,
                onClick: (name: string, value?: number) => void) {
        super(data);
        this.container = createSVGElement<SVGGElement>("g");

        this.addBalanceSliderButton = new SliderButtonWidget({
            buttonText: "add balance",
            input: {
                ...data.addBalance,
                id: "add-balance-amount",
                labelText: "add balance amount",
                step: 0.01
            }
        },
                                                             onClick);
        this.addBalanceSliderButton.transform(
            {translate: {x: -tableRadius * 1.4}});
        this.container.appendChild(this.addBalanceSliderButton.container);

        this.foldButton = new ButtonWidget({buttonText: "fold"}, onClick);
        this.foldButton.transform({translate: {x: -tableRadius * 0.4}});
        this.container.appendChild(this.foldButton.container);

        this.callButton = new ButtonWidget({buttonText: "call"}, onClick);
        this.callButton.transform({translate: {x: tableRadius * 0.4}});
        this.container.appendChild(this.callButton.container);

        this.raiseSliderButton = new SliderButtonWidget({
            buttonText: "raise",
            input: {
                ...data.raise,
                id: "raise-amount",
                labelText: "raise amount",
                step: 0.01
            },
        },
                                                        onClick);
        this.raiseSliderButton.transform({translate: {x: tableRadius * 1.4}});
        this.container.appendChild(this.raiseSliderButton.container);
    }
}
