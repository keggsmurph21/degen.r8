"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
var Utils_1 = require("Utils");
var BaseInputWidget = (function () {
    function BaseInputWidget(inputType, params) {
        this.inputType = inputType;
        this.params = params;
        this.container = document.createElement("div");
        this.container.classList.add("input-widget");
        this.container.classList.add(this.widgetClass());
        this.label = document.createElement("label");
        this.label.setAttribute("for", params.id);
        this.label.innerText = params.labelText;
        this.container.appendChild(this.label);
        this.inputContainer = document.createElement("span");
        this.inputContainer.classList.add("input-container");
        this.container.appendChild(this.inputContainer);
        this.input = document.createElement("input");
        this.input.setAttribute("id", params.id);
        this.input.setAttribute("type", inputType);
        this.inputContainer.appendChild(this.input);
    }
    BaseInputWidget.prototype.setController = function (controller) {
        var _this = this;
        if (controller != null) {
            controller.input.addEventListener("change", function (_) { return _this.setDisabled(!!controller.value()); });
            this.setDisabled(!!controller.value());
        }
    };
    return BaseInputWidget;
}());
var BoolInputWidget = (function (_super) {
    __extends(BoolInputWidget, _super);
    function BoolInputWidget(params) {
        var _this = _super.call(this, "checkbox", params) || this;
        if (params["default"])
            _this.input.setAttribute("checked", "");
        return _this;
    }
    BoolInputWidget.prototype.widgetClass = function () { return "bool-input"; };
    BoolInputWidget.prototype.value = function () { return this.input.checked; };
    BoolInputWidget.prototype.setValue = function (value) { this.input.checked = value; };
    BoolInputWidget.prototype.setDisabled = function (disabled) {
        if (disabled) {
            this.input.removeAttribute("disabled");
        }
        else {
            this.input.setAttribute("disabled", "");
        }
    };
    return BoolInputWidget;
}(BaseInputWidget));
exports.BoolInputWidget = BoolInputWidget;
var SliderViewWidget = (function () {
    function SliderViewWidget(controller, formatValue) {
        var _this = this;
        this.controller = controller;
        this.formatValue = formatValue;
        this.container = document.createElement("span");
        this.container.classList.add("slider-view");
        controller.input.addEventListener("input", function (_) { return _this.update(); });
    }
    SliderViewWidget.prototype.update = function () {
        this.container.innerText = this.formatValue(this.controller.value());
    };
    return SliderViewWidget;
}());
exports.SliderViewWidget = SliderViewWidget;
var AdjustButtonWidget = (function () {
    function AdjustButtonWidget(buttonText, isDisabled, onClick) {
        this.buttonText = buttonText;
        this.isDisabled = isDisabled;
        this.onClick = onClick;
        this.button = document.createElement("button");
        this.button.setAttribute("type", "button");
        this.button.classList.add("number-adjust");
        this.button.innerText = buttonText;
        this.button.addEventListener("click", onClick);
    }
    AdjustButtonWidget.prototype.update = function () {
        this.button.removeAttribute("disabled");
        if (this.isDisabled())
            this.button.setAttribute("disabled", "");
    };
    return AdjustButtonWidget;
}());
var NumberInputWidget = (function (_super) {
    __extends(NumberInputWidget, _super);
    function NumberInputWidget(params) {
        var _this = _super.call(this, "range", params) || this;
        _this.input.setAttribute("min", _this.formatValue(params.min));
        _this.input.setAttribute("max", _this.formatValue(params.max));
        _this.input.setAttribute("step", _this.formatValue(params.step));
        _this.input.setAttribute("value", _this.formatValue(params["default"]));
        _this.decrementButton = new AdjustButtonWidget("<", function () { return _this.value() <= _this.params.min; }, function () { return _this.setValue(_this.value() - params.step); });
        _this.inputContainer.insertBefore(_this.decrementButton.button, _this.input);
        _this.incrementButton = new AdjustButtonWidget(">", function () { return _this.value() >= _this.params.max; }, function () { return _this.setValue(_this.value() + params.step); });
        _this.inputContainer.appendChild(_this.incrementButton.button);
        _this.viewWidget = new SliderViewWidget(_this, _this.formatValue);
        _this.viewWidget.update();
        _this.inputContainer.appendChild(_this.viewWidget.container);
        return _this;
    }
    NumberInputWidget.prototype.setValue = function (value) {
        value = Utils_1.clamp(this.params.min, value, this.params.max);
        this.input.value = value.toString();
        this.decrementButton.update();
        this.viewWidget.update();
        this.incrementButton.update();
    };
    NumberInputWidget.prototype.setDisabled = function (disabled) {
        if (disabled) {
            this.input.removeAttribute("disabled");
        }
        else {
            this.input.setAttribute("disabled", "");
        }
    };
    return NumberInputWidget;
}(BaseInputWidget));
var IntInputWidget = (function (_super) {
    __extends(IntInputWidget, _super);
    function IntInputWidget() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    IntInputWidget.prototype.formatValue = function (value) { return value.toString(); };
    IntInputWidget.prototype.value = function () { return parseInt(this.input.value); };
    IntInputWidget.prototype.widgetClass = function () { return "int-input"; };
    return IntInputWidget;
}(NumberInputWidget));
exports.IntInputWidget = IntInputWidget;
var FloatInputWidget = (function (_super) {
    __extends(FloatInputWidget, _super);
    function FloatInputWidget() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    FloatInputWidget.prototype.formatValue = function (value) { return value.toFixed(2); };
    FloatInputWidget.prototype.value = function () { return parseFloat(this.input.value); };
    FloatInputWidget.prototype.widgetClass = function () { return "float-input"; };
    return FloatInputWidget;
}(NumberInputWidget));
exports.FloatInputWidget = FloatInputWidget;
var StrInputWidget = (function (_super) {
    __extends(StrInputWidget, _super);
    function StrInputWidget(params) {
        var _this = _super.call(this, "text", params) || this;
        var patternString = params.pattern.toString();
        _this.input.setAttribute("pattern", patternString.slice(1, patternString.length - 1));
        if (params["default"] != null)
            _this.input.setAttribute("value", params["default"]);
        return _this;
    }
    StrInputWidget.prototype.value = function () { return this.input.value; };
    StrInputWidget.prototype.setValue = function (value) { this.input.value = value; };
    StrInputWidget.prototype.widgetClass = function () { return "str-input"; };
    StrInputWidget.prototype.setDisabled = function (disabled) {
        if (disabled) {
            this.input.removeAttribute("disabled");
        }
        else {
            this.input.setAttribute("disabled", "");
        }
    };
    return StrInputWidget;
}(BaseInputWidget));
exports.StrInputWidget = StrInputWidget;
//# sourceMappingURL=Input.js.map