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
var BaseInputWidget = (function () {
    function BaseInputWidget(inputType, params) {
        this.inputType = inputType;
        this.params = params;
        this.container = document.createElement("div");
        this.label = document.createElement("label");
        this.label.setAttribute("for", params.id);
        this.label.innerText = params.labelText;
        this.container.appendChild(this.label);
        this.input = document.createElement("input");
        this.input.setAttribute("id", params.id);
        this.input.setAttribute("type", inputType);
        this.container.appendChild(this.input);
    }
    BaseInputWidget.prototype.setDisabled = function (disabled) {
        if (disabled) {
            this.input.removeAttribute("disabled");
        }
        else {
            this.input.setAttribute("disabled", "");
        }
    };
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
    BoolInputWidget.prototype.value = function () { return this.input.checked; };
    BoolInputWidget.prototype.setValue = function (value) { this.input.checked = value; };
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
var IntInputWidget = (function (_super) {
    __extends(IntInputWidget, _super);
    function IntInputWidget(params) {
        var _this = _super.call(this, "range", params) || this;
        _this.input.setAttribute("min", params.min.toString());
        _this.input.setAttribute("max", params.max.toString());
        _this.input.setAttribute("step", "1");
        _this.input.setAttribute("value", params["default"].toString());
        _this.viewWidget =
            new SliderViewWidget(_this, function (value) { return value.toString(); });
        _this.viewWidget.update();
        _this.container.appendChild(_this.viewWidget.container);
        return _this;
    }
    IntInputWidget.prototype.value = function () { return parseInt(this.input.value); };
    IntInputWidget.prototype.setValue = function (value) {
        this.input.value = value.toString();
        this.viewWidget.update();
    };
    return IntInputWidget;
}(BaseInputWidget));
exports.IntInputWidget = IntInputWidget;
var FloatInputWidget = (function (_super) {
    __extends(FloatInputWidget, _super);
    function FloatInputWidget(params) {
        var _this = _super.call(this, "range", params) || this;
        _this.input.setAttribute("min", params.min.toString());
        _this.input.setAttribute("max", params.max.toString());
        _this.input.setAttribute("step", params.step.toString());
        _this.input.setAttribute("value", params["default"].toString());
        _this.viewWidget =
            new SliderViewWidget(_this, function (value) { return value.toFixed(2); });
        _this.viewWidget.update();
        _this.container.appendChild(_this.viewWidget.container);
        return _this;
    }
    FloatInputWidget.prototype.value = function () { return parseFloat(this.input.value); };
    FloatInputWidget.prototype.setValue = function (value) {
        this.input.value = value.toString();
        this.viewWidget.update();
    };
    return FloatInputWidget;
}(BaseInputWidget));
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
    return StrInputWidget;
}(BaseInputWidget));
exports.StrInputWidget = StrInputWidget;
//# sourceMappingURL=Input.js.map