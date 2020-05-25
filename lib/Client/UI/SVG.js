"use strict";
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
exports.__esModule = true;
exports.SVG_NS = "http://www.w3.org/2000/svg";
function transform(ele, transformation) {
    var _a, _b;
    var dx = ((_a = transformation === null || transformation === void 0 ? void 0 : transformation.translate) === null || _a === void 0 ? void 0 : _a.x) || 0;
    var dy = ((_b = transformation === null || transformation === void 0 ? void 0 : transformation.translate) === null || _b === void 0 ? void 0 : _b.y) || 0;
    var scale = (transformation === null || transformation === void 0 ? void 0 : transformation.scale) || 1.0;
    ele.setAttribute("transform", "translate(" + dx + "," + dy + ") scale(" + scale + ")");
}
var SVGWidget = (function () {
    function SVGWidget(data) {
        this.data = data;
    }
    SVGWidget.prototype.transform = function (transformation) {
        transform(this.container, transformation);
    };
    return SVGWidget;
}());
exports.SVGWidget = SVGWidget;
function createSVGElement(tagName, props) {
    var ele = document.createElementNS(exports.SVG_NS, tagName);
    if (props) {
        if (props.classes) {
            props.classes.filter(function (clazz) { return !!clazz; })
                .forEach(function (clazz) { return ele.classList.add(clazz); });
        }
        if (props.attrs) {
            Object.entries(props.attrs).forEach(function (_a) {
                var _b = __read(_a, 2), key = _b[0], value = _b[1];
                ele.setAttribute(key, value.toString());
            });
        }
        if (props.transform) {
            transform(ele, props.transform);
        }
        if (props.textContent) {
            ele.textContent = props.textContent;
        }
        if (props.children) {
            props.children.forEach(function (child) { ele.appendChild(child); });
        }
    }
    return ele;
}
exports.createSVGElement = createSVGElement;
function removeChildren(ele) {
    while (ele.firstChild)
        ele.removeChild(ele.lastChild);
}
exports.removeChildren = removeChildren;
//# sourceMappingURL=SVG.js.map