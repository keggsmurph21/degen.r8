import {clamp} from "Utils";

export type ParamType = boolean|number|string;
type TypeName = "bool"|"int"|"float"|"str";

export interface IParam<T extends ParamType> {
    type: TypeName;
    DEFAULT: T;
    name: string;        // camelCase
    displayName: string; // human readable
    validate(value: any): T;
}

class BoolParam implements IParam<boolean> {
    public readonly type = "bool";
    constructor(public readonly name: string,
                public readonly displayName: string,
                public readonly DEFAULT: boolean) {}
    validate(originalValue: any): boolean {
        // NB: By default, form-encoded HTML checkboxes will send "on" & "off"
        //     instead of "0" & "1" or "true" & "false", so this is slightly
        //     special-cased.
        return originalValue === "off" ? false : !!originalValue;
    }
}

class IntParam implements IParam<number> {
    public readonly type = "int";
    constructor(public readonly name: string,
                public readonly displayName: string,
                public readonly MIN: number, public readonly DEFAULT: number,
                public readonly MAX: number) {}
    validate(originalValue: any): number {
        const value = parseInt(originalValue);
        if (isNaN(value)) {
            throw new Error(
                `value '${originalValue}' for '${this.name}' is not an int`);
        }
        if (clamp(this.MIN, value, this.MAX) !== value) {
            throw new Error(`value '${value}' for '${
                this.name}' is outside range ${this.MIN} to ${this.MAX}`);
        }
        return value;
    }
}

class FloatParam implements IParam<number> {
    public readonly type = "float";
    constructor(public readonly name: string,
                public readonly displayName: string,
                public readonly MIN: number, public readonly DEFAULT: number,
                public readonly MAX: number,
                public readonly PRECISION: number = 2) {}
    validate(originalValue: any): number {
        const offset = 10 ** this.PRECISION;
        const value =
            Math.round((parseFloat(originalValue) + Number.EPSILON) * offset) /
            offset;
        if (isNaN(value)) {
            throw new Error(
                `value '${originalValue}' for '${this.name}' is not a float`);
        }
        if (clamp(this.MIN, value, this.MAX) !== value) {
            throw new Error(`value '${value}' for '${
                this.name}' is outside range ${this.MIN} to ${this.MAX}`);
        }
        return value;
    }
}

export class StrParam implements IParam<string> {
    public readonly type = "str";
    constructor(public readonly name: string,
                public readonly displayName: string,
                public readonly PATTERN: RegExp,
                public readonly DEFAULT: string|null) {}
    validate(originalValue: any): string {
        if (!originalValue.toString().test(this.PATTERN)) {
            throw new Error(`value '${originalValue}' for '${
                this.name}' doesn't match pattern ${this.PATTERN}`);
        }
        return originalValue;
    }
}

export type Param = BoolParam|IntParam|FloatParam|StrParam;
export interface Params {
    [name: string]: Param;
}

export const CAPACITY = new IntParam("capacity", "capacity", 2, 4, 16);
export const AUTOPLAY_INTERVAL =
    new IntParam("autoplayInterval", "autoplay interval", 0, 10, 60);
export const MINIMUM_BET =
    new FloatParam("minimumBet", "minimum bet", 0.01, 1.00, 10.00);
export const USE_BLINDS = new BoolParam("useBlinds", "use blinds", true);
export const BIG_BLIND_BET =
    new FloatParam("bigBlindBet", "big blind bet", MINIMUM_BET.MIN,
                   MINIMUM_BET.DEFAULT, 10 * MINIMUM_BET.MAX);
export const SMALL_BLIND_BET =
    new FloatParam("smallBlindBet", "small blind bet", MINIMUM_BET.MIN / 2,
                   MINIMUM_BET.DEFAULT / 2, 50 * MINIMUM_BET.MAX);
export const USE_ANTES = new BoolParam("useAntes", "use antes", true);
export const ANTE_BET =
    new FloatParam("anteBet", "ante bet", MINIMUM_BET.MIN / 2,
                   MINIMUM_BET.DEFAULT, MINIMUM_BET.MAX);

export const PARAMS: Param[] = [
    CAPACITY,
    AUTOPLAY_INTERVAL,
    MINIMUM_BET,
    USE_BLINDS,
    BIG_BLIND_BET,
    SMALL_BLIND_BET,
    USE_ANTES,
    ANTE_BET,
];

export const ADD_BALANCE = new FloatParam(
    "addBalance", "add balance", MINIMUM_BET.MIN, 20.00, 10 * MINIMUM_BET.MAX);
