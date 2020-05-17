import {clamp} from "Utils";

export enum ParamType {
    Bool = 0,
    Int,
    Float,
    Str,
}

interface IParam<T> {
    type: ParamType;
    DEFAULT: T;
    validate(any): T;
}

class BoolParam implements IParam<boolean> {
    public readonly type = ParamType.Bool;
    constructor(public readonly DEFAULT: boolean) {}
    validate(originalValue: any): boolean {
        // NB: By default, form-encoded HTML checkboxes will send "on" & "off"
        //     instead of "0" & "1" or "true" & "false", so this is slightly
        //     special-cased.
        return originalValue === "off" ? false : !!originalValue;
    }
}

class IntParam implements IParam<number> {
    public readonly type = ParamType.Int;
    constructor(public readonly MIN: number, public readonly DEFAULT: number,
                public readonly MAX: number) {}
    validate(originalValue: any): number {
        const value = parseInt(originalValue);
        if (isNaN(value))
            throw new Error(`value '${originalValue}' is not an int`);
        if (clamp(this.MIN, value, this.MAX) !== value)
            throw new Error(
                `value '${value}' is outside range ${this.MIN} to ${this.MAX}`);
        return value;
    }
}

class FloatParam implements IParam<number> {
    public readonly type = ParamType.Float;
    constructor(public readonly MIN: number, public readonly DEFAULT: number,
                public readonly MAX: number,
                public readonly PRECISION: number = 2) {}
    validate(originalValue: any): number {
        const offset = 10 ** this.PRECISION;
        const value =
            Math.round((parseFloat(originalValue) + Number.EPSILON) * offset) /
            offset;
        if (isNaN(value))
            throw new Error(`value '${originalValue}' is not a float`);
        if (clamp(this.MIN, value, this.MAX) !== value)
            throw new Error(
                `value '${value}' is outside range ${this.MIN} to ${this.MAX}`);
        return value;
    }
}

export class StrParam implements IParam<string> {
    public readonly type = ParamType.Str;
    constructor(public readonly PATTERN: RegExp,
                public readonly DEFAULT: string|null) {}
    validate(originalValue: any): string {
        if (!originalValue.toString().test(this.PATTERN))
            throw new Error(`value '${originalValue}' doesn't match pattern ${
                this.PATTERN}`);
        return originalValue;
    }
}

export type Param = BoolParam|IntParam|FloatParam|StrParam;

export const CAPACITY = new IntParam(2, 4, 16);
export const AUTOPLAY_INTERVAL = new IntParam(0, 10, 60);
export const MINIMUM_BET = new FloatParam(0.01, 1.00, 10.00);
export const USE_BLINDS = new BoolParam(true);
export const BIG_BLIND_BET =
    new FloatParam(MINIMUM_BET.MIN, MINIMUM_BET.DEFAULT, 10 * MINIMUM_BET.MAX);
export const SMALL_BLIND_BET = new FloatParam(
    MINIMUM_BET.MIN / 2, MINIMUM_BET.DEFAULT / 2, 50 * MINIMUM_BET.MAX);
export const USE_ANTES = new BoolParam(true);
export const ANTE_BET =
    new FloatParam(MINIMUM_BET.MIN / 2, MINIMUM_BET.DEFAULT, MINIMUM_BET.MAX);
export const ADD_BALANCE =
    new FloatParam(MINIMUM_BET.MIN, 20.00, 10 * MINIMUM_BET.MAX);

