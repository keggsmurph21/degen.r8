/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/Client/Page/Room.ts");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/Client/Page/Room.ts":
/*!*********************************!*\
  !*** ./src/Client/Page/Room.ts ***!
  \*********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

exports.__esModule = true;
var Utils_1 = __webpack_require__(/*! Utils */ "./src/Utils/index.ts");
var Constants_1 = __webpack_require__(/*! ../UI/Room/Constants */ "./src/Client/UI/Room/Constants.ts");
var Table_1 = __webpack_require__(/*! ../UI/Room/Table */ "./src/Client/UI/Room/Table.ts");
var SVG_1 = __webpack_require__(/*! ../UI/SVG */ "./src/Client/UI/SVG.ts");
function getRandomUsername() {
    var username = "";
    var len = Utils_1.randomInRange(6, 25);
    for (var i = 0; i < len; ++i) {
        var ch = String.fromCharCode(Utils_1.randomInRange(98, 123));
        username += ch;
    }
    return username;
}
function massage(view) {
    console.log(view);
    var seats = view.sitting.map(function (playerId) {
        if (playerId == null) {
            return { isAvailable: true, canSit: !view.isSitting, seat: null };
        }
        var caption = {
            username: getRandomUsername(),
            balance: view.balances[playerId],
        };
        var hand = null;
        if (view.round != null) {
            view.round.playerStates.forEach(function (ps) {
                if (hand !== null)
                    return;
                if (ps.playerId !== playerId)
                    return;
                hand = ps.holeCards;
            });
        }
        return { isAvailable: false, canSit: false, seat: { caption: caption, hand: hand } };
    });
    var communityCards = null;
    var betting = null;
    var pots = null;
    if (view.round != null) {
        communityCards = view.round.communityCards;
        var maxBet = view.balances[view.playerId];
        if (view.isPlaying) {
            betting = {
                addBalance: {
                    min: 10 * view.params.bigBlindBet,
                    "default": 20.00,
                    max: 100 * view.params.bigBlindBet,
                },
                raise: {
                    min: view.params.minimumBet,
                    "default": Math.min(5 * view.params.minimumBet, maxBet),
                    max: maxBet,
                },
            };
        }
        pots = view.round.pots.map(function (pot) { return { contributions: pot.contributions }; });
    }
    return {
        nPlayers: view.sitting.length,
        showStartButton: view.canStartRound,
        communityCards: communityCards,
        seats: seats,
        betting: betting,
        pots: pots,
    };
}
window.main = function (view) {
    var container = document.getElementById("table-container");
    SVG_1.removeChildren(container);
    var svg = SVG_1.createSVGElement("svg", {
        attrs: {
            xmlns: SVG_1.SVG_NS,
            viewBox: Constants_1.viewBox,
            height: "100%",
            width: "100%",
        }
    });
    container.appendChild(svg);
    var data = massage(view);
    console.log(data);
    var table = new Table_1.TableWidget(data, console.log);
    table.transform({ translate: { y: -Constants_1.tableRadius * 0.2 } });
    svg.appendChild(table.container);
};


/***/ }),

/***/ "./src/Client/UI/Input.ts":
/*!********************************!*\
  !*** ./src/Client/UI/Input.ts ***!
  \********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

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


/***/ }),

/***/ "./src/Client/UI/Room/Betting.ts":
/*!***************************************!*\
  !*** ./src/Client/UI/Room/Betting.ts ***!
  \***************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

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
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
exports.__esModule = true;
var SVG_1 = __webpack_require__(/*! ../SVG */ "./src/Client/UI/SVG.ts");
var Button_1 = __webpack_require__(/*! ./Button */ "./src/Client/UI/Room/Button.ts");
var Constants_1 = __webpack_require__(/*! ./Constants */ "./src/Client/UI/Room/Constants.ts");
var BettingWidget = (function (_super) {
    __extends(BettingWidget, _super);
    function BettingWidget(data, onClick) {
        var _this = _super.call(this, data) || this;
        _this.container = SVG_1.createSVGElement("g");
        _this.addBalanceSliderButton = new Button_1.SliderButtonWidget({
            buttonText: "add balance",
            input: __assign(__assign({}, data.addBalance), { id: "add-balance-amount", labelText: "add balance amount", step: 0.01 })
        }, onClick);
        _this.addBalanceSliderButton.transform({ translate: { x: -Constants_1.tableRadius * 1.4 } });
        _this.container.appendChild(_this.addBalanceSliderButton.container);
        _this.foldButton = new Button_1.ButtonWidget({ buttonText: "fold" }, onClick);
        _this.foldButton.transform({ translate: { x: -Constants_1.tableRadius * 0.4 } });
        _this.container.appendChild(_this.foldButton.container);
        _this.callButton = new Button_1.ButtonWidget({ buttonText: "call" }, onClick);
        _this.callButton.transform({ translate: { x: Constants_1.tableRadius * 0.4 } });
        _this.container.appendChild(_this.callButton.container);
        _this.raiseSliderButton = new Button_1.SliderButtonWidget({
            buttonText: "raise",
            input: __assign(__assign({}, data.raise), { id: "raise-amount", labelText: "raise amount", step: 0.01 }),
        }, onClick);
        _this.raiseSliderButton.transform({ translate: { x: Constants_1.tableRadius * 1.4 } });
        _this.container.appendChild(_this.raiseSliderButton.container);
        return _this;
    }
    return BettingWidget;
}(SVG_1.SVGWidget));
exports.BettingWidget = BettingWidget;


/***/ }),

/***/ "./src/Client/UI/Room/Button.ts":
/*!**************************************!*\
  !*** ./src/Client/UI/Room/Button.ts ***!
  \**************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

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
var SVG_1 = __webpack_require__(/*! ../SVG */ "./src/Client/UI/SVG.ts");
var SVGInput_1 = __webpack_require__(/*! ../SVGInput */ "./src/Client/UI/SVGInput.ts");
var ButtonWidget = (function (_super) {
    __extends(ButtonWidget, _super);
    function ButtonWidget(data, onClick) {
        var _this = _super.call(this, data) || this;
        var width = 30 + 10 * data.buttonText.length;
        var height = 27;
        var x = -width / 2;
        var y = -19;
        _this.container = SVG_1.createSVGElement("g", {
            classes: ["button"],
            children: [
                SVG_1.createSVGElement("rect", { attrs: { x: x, y: y, width: width, height: height, rx: 10 } }),
                SVG_1.createSVGElement("text", { textContent: data.buttonText, attrs: { x: 0, y: 0 } })
            ]
        });
        _this.container.addEventListener("click", function (_) { onClick(data.buttonText); });
        return _this;
    }
    return ButtonWidget;
}(SVG_1.SVGWidget));
exports.ButtonWidget = ButtonWidget;
var SliderButtonWidget = (function (_super) {
    __extends(SliderButtonWidget, _super);
    function SliderButtonWidget(data, onClick) {
        var _this = _super.call(this, data) || this;
        _this.container = SVG_1.createSVGElement("g");
        _this.button =
            new ButtonWidget({ buttonText: data.buttonText }, function (name) {
                onClick(name, _this.input.value());
            });
        _this.button.transform({ translate: { y: -15 } });
        _this.container.appendChild(_this.button.container);
        _this.input = new SVGInput_1.EmbeddedFloatInputWidget(data.input);
        _this.input.transform({ translate: { y: -5 } });
        _this.container.appendChild(_this.input.container);
        return _this;
    }
    return SliderButtonWidget;
}(SVG_1.SVGWidget));
exports.SliderButtonWidget = SliderButtonWidget;


/***/ }),

/***/ "./src/Client/UI/Room/Caption.ts":
/*!***************************************!*\
  !*** ./src/Client/UI/Room/Caption.ts ***!
  \***************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

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
var SVG_1 = __webpack_require__(/*! ../SVG */ "./src/Client/UI/SVG.ts");
var CaptionWidget = (function (_super) {
    __extends(CaptionWidget, _super);
    function CaptionWidget(data) {
        var _this = _super.call(this, data) || this;
        _this.container = SVG_1.createSVGElement("text", {
            classes: ["caption"],
        });
        _this.usernameSpan = SVG_1.createSVGElement("tspan", {
            classes: ["username"],
            textContent: data.username,
            attrs: { x: 0, dy: "-0.2em" },
        });
        _this.container.appendChild(_this.usernameSpan);
        _this.balanceSpan = SVG_1.createSVGElement("tspan", {
            classes: ["balance"],
            textContent: data.balance.toFixed(2),
            attrs: { x: 0, dy: "1.3em" },
        });
        _this.container.appendChild(_this.balanceSpan);
        return _this;
    }
    return CaptionWidget;
}(SVG_1.SVGWidget));
exports.CaptionWidget = CaptionWidget;


/***/ }),

/***/ "./src/Client/UI/Room/Card.ts":
/*!************************************!*\
  !*** ./src/Client/UI/Room/Card.ts ***!
  \************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

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
var Card_1 = __webpack_require__(/*! Poker/Card */ "./src/Poker/Card.ts");
var SVG_1 = __webpack_require__(/*! ../SVG */ "./src/Client/UI/SVG.ts");
var Constants_1 = __webpack_require__(/*! ./Constants */ "./src/Client/UI/Room/Constants.ts");
var CardWidget = (function (_super) {
    __extends(CardWidget, _super);
    function CardWidget(data) {
        var _this = _super.call(this, data) || this;
        _this.text = null;
        _this.rankSpan = null;
        _this.suitSpan = null;
        var isFaceUp = data != null;
        _this.container = SVG_1.createSVGElement("g", {
            classes: ["card", isFaceUp ? "card-up" : "card-down"],
            children: [SVG_1.createSVGElement("rect", {
                    attrs: {
                        x: -Constants_1.cardWidth / 2,
                        width: Constants_1.cardWidth,
                        y: -Constants_1.cardHeight / 2,
                        height: Constants_1.cardHeight,
                        rx: 10,
                    }
                })],
        });
        if (isFaceUp) {
            _this.text = SVG_1.createSVGElement("text", { classes: [Card_1.displayNameForSuit(data.suit)] });
            _this.container.appendChild(_this.text);
            _this.rankSpan = SVG_1.createSVGElement("tspan", {
                textContent: Card_1.charForRank(data.rank),
                attrs: {
                    x: 0,
                    dy: "-0.1em",
                }
            });
            _this.text.appendChild(_this.rankSpan);
            _this.suitSpan = SVG_1.createSVGElement("tspan", {
                textContent: Card_1.charForSuit(data.suit),
                attrs: {
                    x: 0,
                    dy: "0.8em",
                }
            });
            _this.text.appendChild(_this.suitSpan);
        }
        return _this;
    }
    return CardWidget;
}(SVG_1.SVGWidget));
exports.CardWidget = CardWidget;


/***/ }),

/***/ "./src/Client/UI/Room/CommunityCards.ts":
/*!**********************************************!*\
  !*** ./src/Client/UI/Room/CommunityCards.ts ***!
  \**********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

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
var SVG_1 = __webpack_require__(/*! ../SVG */ "./src/Client/UI/SVG.ts");
var Card_1 = __webpack_require__(/*! ./Card */ "./src/Client/UI/Room/Card.ts");
var Constants_1 = __webpack_require__(/*! ./Constants */ "./src/Client/UI/Room/Constants.ts");
var CommunityCardsWidget = (function (_super) {
    __extends(CommunityCardsWidget, _super);
    function CommunityCardsWidget(data) {
        var _this = _super.call(this, data) || this;
        _this.container = SVG_1.createSVGElement("g");
        data.forEach(function (card, i) {
            var dx = (i - 2) * (Constants_1.cardWidth + Constants_1.cardPaddingX);
            var cardElement = new Card_1.CardWidget(card);
            cardElement.transform({ translate: { x: dx } });
            _this.container.appendChild(cardElement.container);
        });
        return _this;
    }
    return CommunityCardsWidget;
}(SVG_1.SVGWidget));
exports.CommunityCardsWidget = CommunityCardsWidget;


/***/ }),

/***/ "./src/Client/UI/Room/Constants.ts":
/*!*****************************************!*\
  !*** ./src/Client/UI/Room/Constants.ts ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

exports.__esModule = true;
var size = 1000;
var x = -size / 2;
var y = -size / 2;
var width = size;
var height = size;
exports.viewBox = x + " " + y + " " + width + " " + height;
exports.tableRadius = size * 1 / 4;
exports.cardWidth = exports.tableRadius / 4;
exports.cardHeight = exports.cardWidth * 4 / 3;
exports.cardPaddingX = exports.cardWidth / 8;


/***/ }),

/***/ "./src/Client/UI/Room/EmptySeat.ts":
/*!*****************************************!*\
  !*** ./src/Client/UI/Room/EmptySeat.ts ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

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
var SVG_1 = __webpack_require__(/*! ../SVG */ "./src/Client/UI/SVG.ts");
var Button_1 = __webpack_require__(/*! ./Button */ "./src/Client/UI/Room/Button.ts");
var EmptySeatWidget = (function (_super) {
    __extends(EmptySeatWidget, _super);
    function EmptySeatWidget(data, onClick) {
        var _this = _super.call(this, data) || this;
        _this.text = null;
        _this.sitButton = null;
        _this.container = SVG_1.createSVGElement("g");
        if (data.canSit) {
            _this.sitButton = new Button_1.ButtonWidget({ buttonText: "sit" }, function (name) { onClick(name, data.index); });
            _this.container.appendChild(_this.sitButton.container);
        }
        else {
            _this.text = SVG_1.createSVGElement("text", {
                textContent: "\u2013",
                classes: ["caption", "caption-empty"],
                attrs: { x: 0, y: 0 }
            });
            _this.container.appendChild(_this.text);
        }
        return _this;
    }
    return EmptySeatWidget;
}(SVG_1.SVGWidget));
exports.EmptySeatWidget = EmptySeatWidget;


/***/ }),

/***/ "./src/Client/UI/Room/Hand.ts":
/*!************************************!*\
  !*** ./src/Client/UI/Room/Hand.ts ***!
  \************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

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
var SVG_1 = __webpack_require__(/*! ../SVG */ "./src/Client/UI/SVG.ts");
var Card_1 = __webpack_require__(/*! ./Card */ "./src/Client/UI/Room/Card.ts");
var Constants_1 = __webpack_require__(/*! ./Constants */ "./src/Client/UI/Room/Constants.ts");
var HandWidget = (function (_super) {
    __extends(HandWidget, _super);
    function HandWidget(data) {
        var _this = _super.call(this, data) || this;
        _this.container = SVG_1.createSVGElement("g");
        var offsetX = (Constants_1.cardPaddingX + Constants_1.cardWidth) / 2;
        _this.left = new Card_1.CardWidget(data[0]);
        _this.left.transform({ translate: { x: -offsetX } });
        _this.container.appendChild(_this.left.container);
        _this.right = new Card_1.CardWidget(data[1]);
        _this.right.transform({ translate: { x: offsetX } });
        _this.container.appendChild(_this.right.container);
        return _this;
    }
    return HandWidget;
}(SVG_1.SVGWidget));
exports.HandWidget = HandWidget;


/***/ }),

/***/ "./src/Client/UI/Room/Pot.ts":
/*!***********************************!*\
  !*** ./src/Client/UI/Room/Pot.ts ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

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
var SVG_1 = __webpack_require__(/*! ../SVG */ "./src/Client/UI/SVG.ts");
var PotWidget = (function (_super) {
    __extends(PotWidget, _super);
    function PotWidget(data) {
        var _this = _super.call(this, data) || this;
        _this.container =
            SVG_1.createSVGElement("text", { classes: ["caption"] });
        var sum = data.contributions.reduce(function (acc, contrib) { return acc += contrib; }, 0);
        _this.container.textContent = sum.toFixed(2);
        return _this;
    }
    return PotWidget;
}(SVG_1.SVGWidget));
exports.PotWidget = PotWidget;


/***/ }),

/***/ "./src/Client/UI/Room/Pots.ts":
/*!************************************!*\
  !*** ./src/Client/UI/Room/Pots.ts ***!
  \************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

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
var SVG_1 = __webpack_require__(/*! ../SVG */ "./src/Client/UI/SVG.ts");
var Pot_1 = __webpack_require__(/*! ./Pot */ "./src/Client/UI/Room/Pot.ts");
var PotsWidget = (function (_super) {
    __extends(PotsWidget, _super);
    function PotsWidget(data) {
        var _this = _super.call(this, data) || this;
        _this.container = SVG_1.createSVGElement("g");
        data.forEach(function (pot, i) {
            var padding = 100;
            var offsetX = ((data.length - 1) / 2 - i) * padding;
            var potWidget = new Pot_1.PotWidget(pot);
            potWidget.transform({ translate: { x: offsetX } });
            _this.container.appendChild(potWidget.container);
        });
        return _this;
    }
    return PotsWidget;
}(SVG_1.SVGWidget));
exports.PotsWidget = PotsWidget;


/***/ }),

/***/ "./src/Client/UI/Room/Seat.ts":
/*!************************************!*\
  !*** ./src/Client/UI/Room/Seat.ts ***!
  \************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

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
var SVG_1 = __webpack_require__(/*! ../SVG */ "./src/Client/UI/SVG.ts");
var Caption_1 = __webpack_require__(/*! ./Caption */ "./src/Client/UI/Room/Caption.ts");
var Constants_1 = __webpack_require__(/*! ./Constants */ "./src/Client/UI/Room/Constants.ts");
var Hand_1 = __webpack_require__(/*! ./Hand */ "./src/Client/UI/Room/Hand.ts");
var SeatWidget = (function (_super) {
    __extends(SeatWidget, _super);
    function SeatWidget(data) {
        var _this = _super.call(this, data) || this;
        _this.container = SVG_1.createSVGElement("g");
        _this.caption = new Caption_1.CaptionWidget(data.caption);
        _this.container.appendChild(_this.caption.container);
        if (data.hand != null) {
            var offsetY = Constants_1.cardHeight * 3 / 7;
            _this.caption.transform({ translate: { y: -offsetY } });
            _this.hand = new Hand_1.HandWidget(data.hand);
            _this.hand.transform({ translate: { y: offsetY } });
            _this.container.appendChild(_this.hand.container);
        }
        return _this;
    }
    return SeatWidget;
}(SVG_1.SVGWidget));
exports.SeatWidget = SeatWidget;


/***/ }),

/***/ "./src/Client/UI/Room/Seats.ts":
/*!*************************************!*\
  !*** ./src/Client/UI/Room/Seats.ts ***!
  \*************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

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
var SVG_1 = __webpack_require__(/*! ../SVG */ "./src/Client/UI/SVG.ts");
var Constants_1 = __webpack_require__(/*! ./Constants */ "./src/Client/UI/Room/Constants.ts");
var EmptySeat_1 = __webpack_require__(/*! ./EmptySeat */ "./src/Client/UI/Room/EmptySeat.ts");
var Seat_1 = __webpack_require__(/*! ./Seat */ "./src/Client/UI/Room/Seat.ts");
function rotatedPosition(index, nPlayers, radius) {
    var theta = index * 2 * Math.PI / nPlayers - Math.PI / 2;
    var x = 1.3 * Math.cos(theta) * radius;
    var y = Math.sin(theta) * radius;
    return [x, y];
}
function scaleFor(nPlayers) { return 1.35 - nPlayers * 0.05; }
var SeatsWidget = (function (_super) {
    __extends(SeatsWidget, _super);
    function SeatsWidget(data, onClick) {
        var _this = _super.call(this, data) || this;
        _this.container = SVG_1.createSVGElement("g");
        data.seats.forEach(function (seatData, i) {
            var radius = Constants_1.tableRadius * 1.25;
            var _a = __read(rotatedPosition(i, data.seats.length, radius), 2), x = _a[0], y = _a[1];
            var scale = scaleFor(data.seats.length);
            var seatWidget;
            if (seatData.isAvailable) {
                seatWidget = new EmptySeat_1.EmptySeatWidget({ index: i, canSit: seatData.canSit }, onClick);
            }
            else {
                seatWidget = new Seat_1.SeatWidget(seatData.seat);
            }
            seatWidget.transform({ translate: { x: x, y: y }, scale: scale });
            _this.container.appendChild(seatWidget.container);
        });
        return _this;
    }
    return SeatsWidget;
}(SVG_1.SVGWidget));
exports.SeatsWidget = SeatsWidget;


/***/ }),

/***/ "./src/Client/UI/Room/Table.ts":
/*!*************************************!*\
  !*** ./src/Client/UI/Room/Table.ts ***!
  \*************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

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
var SVG_1 = __webpack_require__(/*! ../SVG */ "./src/Client/UI/SVG.ts");
var Betting_1 = __webpack_require__(/*! ./Betting */ "./src/Client/UI/Room/Betting.ts");
var Button_1 = __webpack_require__(/*! ./Button */ "./src/Client/UI/Room/Button.ts");
var CommunityCards_1 = __webpack_require__(/*! ./CommunityCards */ "./src/Client/UI/Room/CommunityCards.ts");
var Constants_1 = __webpack_require__(/*! ./Constants */ "./src/Client/UI/Room/Constants.ts");
var Pots_1 = __webpack_require__(/*! ./Pots */ "./src/Client/UI/Room/Pots.ts");
var Seats_1 = __webpack_require__(/*! ./Seats */ "./src/Client/UI/Room/Seats.ts");
var TableWidget = (function (_super) {
    __extends(TableWidget, _super);
    function TableWidget(data, onClick) {
        var _this = _super.call(this, data) || this;
        _this.communityCards = null;
        _this.pots = null;
        _this.startButton = null;
        _this.betting = null;
        _this.container = SVG_1.createSVGElement("g");
        _this.background = SVG_1.createSVGElement("ellipse", { attrs: { id: "table", rx: 1.3 * Constants_1.tableRadius, ry: Constants_1.tableRadius } });
        _this.container.appendChild(_this.background);
        _this.seats = new Seats_1.SeatsWidget({ seats: data.seats }, onClick);
        _this.container.appendChild(_this.seats.container);
        if (data.showStartButton) {
            _this.startButton = new Button_1.ButtonWidget({ buttonText: "start" }, onClick);
            _this.container.appendChild(_this.startButton.container);
        }
        else {
            if (data.communityCards) {
                _this.communityCards =
                    new CommunityCards_1.CommunityCardsWidget(data.communityCards);
                _this.communityCards.transform({ translate: { y: -Constants_1.tableRadius * 0.1 } });
                _this.container.appendChild(_this.communityCards.container);
            }
            if (data.pots) {
                _this.pots = new Pots_1.PotsWidget(data.pots);
                _this.pots.transform({ translate: { y: Constants_1.tableRadius * 0.3 } });
                _this.container.appendChild(_this.pots.container);
            }
            if (data.betting) {
                _this.betting = new Betting_1.BettingWidget(data.betting, onClick);
                _this.betting.transform({ translate: { y: Constants_1.tableRadius * 1.7 } });
                _this.container.append(_this.betting.container);
            }
        }
        return _this;
    }
    return TableWidget;
}(SVG_1.SVGWidget));
exports.TableWidget = TableWidget;


/***/ }),

/***/ "./src/Client/UI/SVG.ts":
/*!******************************!*\
  !*** ./src/Client/UI/SVG.ts ***!
  \******************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

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


/***/ }),

/***/ "./src/Client/UI/SVGInput.ts":
/*!***********************************!*\
  !*** ./src/Client/UI/SVGInput.ts ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

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
var Input_1 = __webpack_require__(/*! ./Input */ "./src/Client/UI/Input.ts");
var SVG_1 = __webpack_require__(/*! ./SVG */ "./src/Client/UI/SVG.ts");
var EmbeddedFloatInputWidget = (function (_super) {
    __extends(EmbeddedFloatInputWidget, _super);
    function EmbeddedFloatInputWidget(data) {
        var _this = _super.call(this, data) || this;
        _this.container = SVG_1.createSVGElement("foreignObject", { classes: ["caption", "wrapped-input"] });
        _this.floatInputWidget = new Input_1.FloatInputWidget(data);
        _this.container.appendChild(_this.floatInputWidget.container);
        return _this;
    }
    EmbeddedFloatInputWidget.prototype.value = function () { return this.floatInputWidget.value(); };
    return EmbeddedFloatInputWidget;
}(SVG_1.SVGWidget));
exports.EmbeddedFloatInputWidget = EmbeddedFloatInputWidget;


/***/ }),

/***/ "./src/Poker/Card.ts":
/*!***************************!*\
  !*** ./src/Poker/Card.ts ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

exports.__esModule = true;
var Utils_1 = __webpack_require__(/*! ../Utils */ "./src/Utils/index.ts");
var Suit;
(function (Suit) {
    Suit[Suit["Clubs"] = 0] = "Clubs";
    Suit[Suit["Diamonds"] = 1] = "Diamonds";
    Suit[Suit["Hearts"] = 2] = "Hearts";
    Suit[Suit["Spades"] = 3] = "Spades";
})(Suit = exports.Suit || (exports.Suit = {}));
function forEachSuit(callback) {
    for (var suit = Suit.Clubs; suit <= Suit.Spades; ++suit) {
        callback(suit);
    }
}
exports.forEachSuit = forEachSuit;
var Rank;
(function (Rank) {
    Rank[Rank["Two"] = 2] = "Two";
    Rank[Rank["Three"] = 3] = "Three";
    Rank[Rank["Four"] = 4] = "Four";
    Rank[Rank["Five"] = 5] = "Five";
    Rank[Rank["Six"] = 6] = "Six";
    Rank[Rank["Seven"] = 7] = "Seven";
    Rank[Rank["Eight"] = 8] = "Eight";
    Rank[Rank["Nine"] = 9] = "Nine";
    Rank[Rank["Ten"] = 10] = "Ten";
    Rank[Rank["Jack"] = 11] = "Jack";
    Rank[Rank["Queen"] = 12] = "Queen";
    Rank[Rank["King"] = 13] = "King";
    Rank[Rank["Ace"] = 14] = "Ace";
})(Rank = exports.Rank || (exports.Rank = {}));
function forEachRank(callback) {
    for (var rank = Rank.Two; rank <= Rank.Ace; ++rank) {
        callback(rank);
    }
}
exports.forEachRank = forEachRank;
;
function getShuffledDeck() {
    var cards = [];
    forEachSuit(function (suit) { forEachRank(function (rank) { cards.push({ suit: suit, rank: rank }); }); });
    return Utils_1.shuffled(cards);
}
exports.getShuffledDeck = getShuffledDeck;
function charForSuit(suit) {
    switch (suit) {
        case Suit.Clubs:
            return "\u2663";
        case Suit.Diamonds:
            return "\u2666";
        case Suit.Hearts:
            return "\u2665";
        case Suit.Spades:
            return "\u2660";
    }
    return null;
}
exports.charForSuit = charForSuit;
function displayNameForSuit(suit) {
    switch (suit) {
        case Suit.Clubs:
            return "clubs";
        case Suit.Diamonds:
            return "diamonds";
        case Suit.Hearts:
            return "hearts";
        case Suit.Spades:
            return "spades";
    }
    return null;
}
exports.displayNameForSuit = displayNameForSuit;
function charForRank(rank) {
    if (!rank)
        return null;
    switch (rank) {
        case Rank.Jack:
            return "J";
        case Rank.Queen:
            return "Q";
        case Rank.King:
            return "K";
        case Rank.Ace:
            return "A";
        default:
            return rank.toString();
    }
}
exports.charForRank = charForRank;


/***/ }),

/***/ "./src/Utils/index.ts":
/*!****************************!*\
  !*** ./src/Utils/index.ts ***!
  \****************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

exports.__esModule = true;
function shuffled(arr) {
    for (var i = arr.length; i > 0;) {
        var j = Math.floor(Math.random() * i);
        --i;
        var tmp = arr[i];
        arr[i] = arr[j];
        arr[j] = tmp;
    }
    return arr;
}
exports.shuffled = shuffled;
function zip(ts, us) {
    var ret = [];
    var len = Math.min(ts.length, us.length);
    for (var i = 0; i < len; ++i)
        ret.push([ts[i], us[i]]);
    return ret;
}
exports.zip = zip;
function sortIntoTiers(ts, comparator) {
    var sortedTs = ts.sort(comparator);
    if (ts.length === 0)
        return [];
    var tiers = [];
    var lastValue = sortedTs.shift();
    var tier = [lastValue];
    sortedTs.forEach(function (t) {
        if (comparator(lastValue, t) === 0) {
            tier.push(t);
            lastValue = t;
            return;
        }
        tiers.push(tier);
        lastValue = t;
        tier = [lastValue];
    });
    tiers.push(tier);
    return tiers;
}
exports.sortIntoTiers = sortIntoTiers;
function clamp(min, value, max) {
    return Math.min(max, Math.max(min, value));
}
exports.clamp = clamp;
function permute(ts, permuteBy) {
    if (ts.length === 0)
        return ts;
    var normalizedPermuteBy = permuteBy;
    while (normalizedPermuteBy < 0)
        normalizedPermuteBy += ts.length;
    while (normalizedPermuteBy >= ts.length)
        normalizedPermuteBy -= ts.length;
    var ret = new Array(ts.length);
    for (var i = 0; i < ts.length; ++i) {
        var permutedIndex = i - normalizedPermuteBy;
        if (permutedIndex < 0)
            permutedIndex += ts.length;
        ret[i] = ts[permutedIndex];
    }
    return ret;
}
exports.permute = permute;
function findFirst(ts, predicate) {
    if (!ts)
        return null;
    return ts.filter(predicate)[0] || null;
}
exports.findFirst = findFirst;
function randomInRange(min, max) {
    return min + Math.floor((max - min) * Math.random());
}
exports.randomInRange = randomInRange;


/***/ })

/******/ });
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy9wdWJsaWMvanMvaG9tZS9rZXZpbm11cnBoeS9zcmMva2VnZ3NtdXJwaDIxL2RlZ2VuLnI4L3NyYy9DbGllbnQvUGFnZS9Sb29tLnRzIiwid2VicGFjazovLy8vcHVibGljL2pzL2hvbWUva2V2aW5tdXJwaHkvc3JjL2tlZ2dzbXVycGgyMS9kZWdlbi5yOC9zcmMvQ2xpZW50L1VJL0lucHV0LnRzIiwid2VicGFjazovLy8vcHVibGljL2pzL2hvbWUva2V2aW5tdXJwaHkvc3JjL2tlZ2dzbXVycGgyMS9kZWdlbi5yOC9zcmMvQ2xpZW50L1VJL1Jvb20vQmV0dGluZy50cyIsIndlYnBhY2s6Ly8vL3B1YmxpYy9qcy9ob21lL2tldmlubXVycGh5L3NyYy9rZWdnc211cnBoMjEvZGVnZW4ucjgvc3JjL0NsaWVudC9VSS9Sb29tL0J1dHRvbi50cyIsIndlYnBhY2s6Ly8vL3B1YmxpYy9qcy9ob21lL2tldmlubXVycGh5L3NyYy9rZWdnc211cnBoMjEvZGVnZW4ucjgvc3JjL0NsaWVudC9VSS9Sb29tL0NhcHRpb24udHMiLCJ3ZWJwYWNrOi8vLy9wdWJsaWMvanMvaG9tZS9rZXZpbm11cnBoeS9zcmMva2VnZ3NtdXJwaDIxL2RlZ2VuLnI4L3NyYy9DbGllbnQvVUkvUm9vbS9DYXJkLnRzIiwid2VicGFjazovLy8vcHVibGljL2pzL2hvbWUva2V2aW5tdXJwaHkvc3JjL2tlZ2dzbXVycGgyMS9kZWdlbi5yOC9zcmMvQ2xpZW50L1VJL1Jvb20vQ29tbXVuaXR5Q2FyZHMudHMiLCJ3ZWJwYWNrOi8vLy9wdWJsaWMvanMvaG9tZS9rZXZpbm11cnBoeS9zcmMva2VnZ3NtdXJwaDIxL2RlZ2VuLnI4L3NyYy9DbGllbnQvVUkvUm9vbS9Db25zdGFudHMudHMiLCJ3ZWJwYWNrOi8vLy9wdWJsaWMvanMvaG9tZS9rZXZpbm11cnBoeS9zcmMva2VnZ3NtdXJwaDIxL2RlZ2VuLnI4L3NyYy9DbGllbnQvVUkvUm9vbS9FbXB0eVNlYXQudHMiLCJ3ZWJwYWNrOi8vLy9wdWJsaWMvanMvaG9tZS9rZXZpbm11cnBoeS9zcmMva2VnZ3NtdXJwaDIxL2RlZ2VuLnI4L3NyYy9DbGllbnQvVUkvUm9vbS9IYW5kLnRzIiwid2VicGFjazovLy8vcHVibGljL2pzL2hvbWUva2V2aW5tdXJwaHkvc3JjL2tlZ2dzbXVycGgyMS9kZWdlbi5yOC9zcmMvQ2xpZW50L1VJL1Jvb20vUG90LnRzIiwid2VicGFjazovLy8vcHVibGljL2pzL2hvbWUva2V2aW5tdXJwaHkvc3JjL2tlZ2dzbXVycGgyMS9kZWdlbi5yOC9zcmMvQ2xpZW50L1VJL1Jvb20vUG90cy50cyIsIndlYnBhY2s6Ly8vL3B1YmxpYy9qcy9ob21lL2tldmlubXVycGh5L3NyYy9rZWdnc211cnBoMjEvZGVnZW4ucjgvc3JjL0NsaWVudC9VSS9Sb29tL1NlYXQudHMiLCJ3ZWJwYWNrOi8vLy9wdWJsaWMvanMvaG9tZS9rZXZpbm11cnBoeS9zcmMva2VnZ3NtdXJwaDIxL2RlZ2VuLnI4L3NyYy9DbGllbnQvVUkvUm9vbS9TZWF0cy50cyIsIndlYnBhY2s6Ly8vL3B1YmxpYy9qcy9ob21lL2tldmlubXVycGh5L3NyYy9rZWdnc211cnBoMjEvZGVnZW4ucjgvc3JjL0NsaWVudC9VSS9Sb29tL1RhYmxlLnRzIiwid2VicGFjazovLy8vcHVibGljL2pzL2hvbWUva2V2aW5tdXJwaHkvc3JjL2tlZ2dzbXVycGgyMS9kZWdlbi5yOC9zcmMvQ2xpZW50L1VJL1NWRy50cyIsIndlYnBhY2s6Ly8vL3B1YmxpYy9qcy9ob21lL2tldmlubXVycGh5L3NyYy9rZWdnc211cnBoMjEvZGVnZW4ucjgvc3JjL0NsaWVudC9VSS9TVkdJbnB1dC50cyIsIndlYnBhY2s6Ly8vL3B1YmxpYy9qcy9ob21lL2tldmlubXVycGh5L3NyYy9rZWdnc211cnBoMjEvZGVnZW4ucjgvc3JjL1Bva2VyL0NhcmQudHMiLCJ3ZWJwYWNrOi8vLy9wdWJsaWMvanMvaG9tZS9rZXZpbm11cnBoeS9zcmMva2Vn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LElBQUksQ0FBQztJQUNoQixPQUFPLEVBQUUsQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksSUFBSSxDQUFDO0FBQzNDLENBQUM7QUFMRCw4QkFLQztBQUdELFNBQWdCLGFBQWEsQ0FBQyxHQUFXLEVBQUUsR0FBVztJQUNsRCxPQUFPLEdBQUcsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsR0FBRyxHQUFHLEdBQUcsQ0FBQyxHQUFHLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDO0FBQ3pELENBQUM7QUFGRCxzQ0FFQyIsImZpbGUiOiJyb29tLmJ1bmRsZS5qcyIsInNvdXJjZXNDb250ZW50IjpbIiBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbiBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG5cbiBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cbiBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKSB7XG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG4gXHRcdH1cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGk6IG1vZHVsZUlkLFxuIFx0XHRcdGw6IGZhbHNlLFxuIFx0XHRcdGV4cG9ydHM6IHt9XG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmwgPSB0cnVlO1xuXG4gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbiBcdH1cblxuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbiBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG5cbiBcdC8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb24gZm9yIGhhcm1vbnkgZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kID0gZnVuY3Rpb24oZXhwb3J0cywgbmFtZSwgZ2V0dGVyKSB7XG4gXHRcdGlmKCFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywgbmFtZSkpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgbmFtZSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGdldHRlciB9KTtcbiBcdFx0fVxuIFx0fTtcblxuIFx0Ly8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5yID0gZnVuY3Rpb24oZXhwb3J0cykge1xuIFx0XHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcbiBcdFx0fVxuIFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xuIFx0fTtcblxuIFx0Ly8gY3JlYXRlIGEgZmFrZSBuYW1lc3BhY2Ugb2JqZWN0XG4gXHQvLyBtb2RlICYgMTogdmFsdWUgaXMgYSBtb2R1bGUgaWQsIHJlcXVpcmUgaXRcbiBcdC8vIG1vZGUgJiAyOiBtZXJnZSBhbGwgcHJvcGVydGllcyBvZiB2YWx1ZSBpbnRvIHRoZSBuc1xuIFx0Ly8gbW9kZSAmIDQ6IHJldHVybiB2YWx1ZSB3aGVuIGFscmVhZHkgbnMgb2JqZWN0XG4gXHQvLyBtb2RlICYgOHwxOiBiZWhhdmUgbGlrZSByZXF1aXJlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnQgPSBmdW5jdGlvbih2YWx1ZSwgbW9kZSkge1xuIFx0XHRpZihtb2RlICYgMSkgdmFsdWUgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKHZhbHVlKTtcbiBcdFx0aWYobW9kZSAmIDgpIHJldHVybiB2YWx1ZTtcbiBcdFx0aWYoKG1vZGUgJiA0KSAmJiB0eXBlb2YgdmFsdWUgPT09ICdvYmplY3QnICYmIHZhbHVlICYmIHZhbHVlLl9fZXNNb2R1bGUpIHJldHVybiB2YWx1ZTtcbiBcdFx0dmFyIG5zID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5yKG5zKTtcbiBcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KG5zLCAnZGVmYXVsdCcsIHsgZW51bWVyYWJsZTogdHJ1ZSwgdmFsdWU6IHZhbHVlIH0pO1xuIFx0XHRpZihtb2RlICYgMiAmJiB0eXBlb2YgdmFsdWUgIT0gJ3N0cmluZycpIGZvcih2YXIga2V5IGluIHZhbHVlKSBfX3dlYnBhY2tfcmVxdWlyZV9fLmQobnMsIGtleSwgZnVuY3Rpb24oa2V5KSB7IHJldHVybiB2YWx1ZVtrZXldOyB9LmJpbmQobnVsbCwga2V5KSk7XG4gXHRcdHJldHVybiBucztcbiBcdH07XG5cbiBcdC8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSBmdW5jdGlvbihtb2R1bGUpIHtcbiBcdFx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0RGVmYXVsdCgpIHsgcmV0dXJuIG1vZHVsZVsnZGVmYXVsdCddOyB9IDpcbiBcdFx0XHRmdW5jdGlvbiBnZXRNb2R1bGVFeHBvcnRzKCkgeyByZXR1cm4gbW9kdWxlOyB9O1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCAnYScsIGdldHRlcik7XG4gXHRcdHJldHVybiBnZXR0ZXI7XG4gXHR9O1xuXG4gXHQvLyBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGxcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubyA9IGZ1bmN0aW9uKG9iamVjdCwgcHJvcGVydHkpIHsgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIHByb3BlcnR5KTsgfTtcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiXCI7XG5cblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXyhfX3dlYnBhY2tfcmVxdWlyZV9fLnMgPSBcIi4vc3JjL0NsaWVudC9QYWdlL1Jvb20udHNcIik7XG4iLCJpbXBvcnQge2NoYXJGb3JSYW5rLCBSYW5rLCBTdWl0fSBmcm9tIFwiUG9rZXIvQ2FyZFwiO1xuaW1wb3J0IHtnZXRFbGlnaWJsZVBsYXllcklkcywgUm9vbSwgUm9vbVZpZXd9IGZyb20gXCJQb2tlci9Sb29tXCI7XG5pbXBvcnQge3JhbmRvbUluUmFuZ2V9IGZyb20gXCJVdGlsc1wiO1xuXG5pbXBvcnQge3RhYmxlUmFkaXVzLCB2aWV3Qm94fSBmcm9tIFwiLi4vVUkvUm9vbS9Db25zdGFudHNcIjtcbmltcG9ydCB7VGFibGVEYXRhLCBUYWJsZVdpZGdldH0gZnJvbSBcIi4uL1VJL1Jvb20vVGFibGVcIjtcbmltcG9ydCB7Y3JlYXRlU1ZHRWxlbWVudCwgcmVtb3ZlQ2hpbGRyZW4sIFNWR19OU30gZnJvbSBcIi4uL1VJL1NWR1wiO1xuXG5pbnRlcmZhY2UgUm9vbVdpbmRvdyBleHRlbmRzIFdpbmRvdyB7XG4gICAgbWFpbjogKHZpZXc6IFJvb21WaWV3KSA9PiB2b2lkO1xufVxuXG5kZWNsYXJlIHZhciB3aW5kb3c6IFJvb21XaW5kb3c7XG5cbmZ1bmN0aW9uIGdldFJhbmRvbVVzZXJuYW1lKCkge1xuICAgIGxldCB1c2VybmFtZSA9IFwiXCI7XG4gICAgY29uc3QgbGVuID0gcmFuZG9tSW5SYW5nZSg2LCAyNSk7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBsZW47ICsraSkge1xuICAgICAgICBjb25zdCBjaCA9IFN0cmluZy5mcm9tQ2hhckNvZGUocmFuZG9tSW5SYW5nZSg5OCwgMTIzKSk7XG4gICAgICAgIHVzZXJuYW1lICs9IGNoO1xuICAgIH1cbiAgICByZXR1cm4gdXNlcm5hbWU7XG59XG5cbmZ1bmN0aW9uIG1hc3NhZ2UodmlldzogUm9vbVZpZXcpOiBUYWJsZURhdGEge1xuICAgIGNvbnNvbGUubG9nKHZpZXcpO1xuICAgIGNvbnN0IHNlYXRzID0gdmlldy5zaXR0aW5nLm1hcChwbGF5ZXJJZCA9PiB7XG4gICAgICAgIGlmIChwbGF5ZXJJZCA9PSBudWxsKSB7XG4gICAgICAgICAgICByZXR1cm4ge2lzQXZhaWxhYmxlOiB0cnVlLCBjYW5TaXQ6ICF2aWV3LmlzU2l0dGluZywgc2VhdDogbnVsbH07XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgY2FwdGlvbiA9IHtcbiAgICAgICAgICAgIHVzZXJuYW1lOiBnZXRSYW5kb21Vc2VybmFtZSgpLCAvLyBGSVhNRVxuICAgICAgICAgICAgYmFsYW5jZTogdmlldy5iYWxhbmNlc1twbGF5ZXJJZF0sXG4gICAgICAgIH07XG4gICAgICAgIGxldCBoYW5kID0gbnVsbDtcbiAgICAgICAgaWYgKHZpZXcucm91bmQgIT0gbnVsbCkge1xuICAgICAgICAgICAgdmlldy5yb3VuZC5wbGF5ZXJTdGF0ZXMuZm9yRWFjaChwcyA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKGhhbmQgIT09IG51bGwpXG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICBpZiAocHMucGxheWVySWQgIT09IHBsYXllcklkKVxuICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgaGFuZCA9IHBzLmhvbGVDYXJkcztcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB7aXNBdmFpbGFibGU6IGZhbHNlLCBjYW5TaXQ6IGZhbHNlLCBzZWF0OiB7Y2FwdGlvbiwgaGFuZH19O1xuICAgIH0pO1xuICAgIGxldCBjb21tdW5pdHlDYXJkcyA9IG51bGw7XG4gICAgbGV0IGJldHRpbmcgPSBudWxsO1xuICAgIGxldCBwb3RzID0gbnVsbDtcbiAgICBpZiAodmlldy5yb3VuZCAhPSBudWxsKSB7XG4gICAgICAgIGNvbW11bml0eUNhcmRzID0gdmlldy5yb3VuZC5jb21tdW5pdHlDYXJkcztcbiAgICAgICAgY29uc3QgbWF4QmV0ID0gdmlldy5iYWxhbmNlc1t2aWV3LnBsYXllcklkXTtcbiAgICAgICAgaWYgKHZpZXcuaXNQbGF5aW5nKSB7XG4gICAgICAgICAgICBiZXR0aW5nID0ge1xuICAgICAgICAgICAgICAgIGFkZEJhbGFuY2U6IHtcbiAgICAgICAgICAgICAgICAgICAgbWluOiAxMCAqIHZpZXcucGFyYW1zLmJpZ0JsaW5kQmV0LFxuICAgICAgICAgICAgICAgICAgICBkZWZhdWx0OiAyMC4wMCxcbiAgICAgICAgICAgICAgICAgICAgbWF4OiAxMDAgKiB2aWV3LnBhcmFtcy5iaWdCbGluZEJldCxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHJhaXNlOiB7XG4gICAgICAgICAgICAgICAgICAgIG1pbjogdmlldy5wYXJhbXMubWluaW11bUJldCxcbiAgICAgICAgICAgICAgICAgICAgZGVmYXVsdDogTWF0aC5taW4oNSAqIHZpZXcucGFyYW1zLm1pbmltdW1CZXQsIG1heEJldCksXG4gICAgICAgICAgICAgICAgICAgIG1heDogbWF4QmV0LFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgICAgIHBvdHMgPSB2aWV3LnJvdW5kLnBvdHMubWFwKFxuICAgICAgICAgICAgcG90ID0+IHsgcmV0dXJuIHtjb250cmlidXRpb25zOiBwb3QuY29udHJpYnV0aW9uc307IH0pO1xuICAgIH1cbiAgICByZXR1cm4ge1xuICAgICAgICBuUGxheWVyczogdmlldy5zaXR0aW5nLmxlbmd0aCxcbiAgICAgICAgc2hvd1N0YXJ0QnV0dG9uOiB2aWV3LmNhblN0YXJ0Um91bmQsXG4gICAgICAgIGNvbW11bml0eUNhcmRzLFxuICAgICAgICBzZWF0cyxcbiAgICAgICAgYmV0dGluZyxcbiAgICAgICAgcG90cyxcbiAgICB9O1xufVxuXG53aW5kb3cubWFpbiA9ICh2aWV3OiBSb29tVmlldykgPT4ge1xuICAgIGNvbnN0IGNvbnRhaW5lciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwidGFibGUtY29udGFpbmVyXCIpO1xuICAgIHJlbW92ZUNoaWxkcmVuKGNvbnRhaW5lcik7XG5cbiAgICBjb25zdCBzdmcgPSBjcmVhdGVTVkdFbGVtZW50KFwic3ZnXCIsIHtcbiAgICAgICAgYXR0cnM6IHtcbiAgICAgICAgICAgIHhtbG5zOiBTVkdfTlMsXG4gICAgICAgICAgICB2aWV3Qm94LFxuICAgICAgICAgICAgaGVpZ2h0OiBcIjEwMCVcIixcbiAgICAgICAgICAgIHdpZHRoOiBcIjEwMCVcIixcbiAgICAgICAgfVxuICAgIH0pO1xuICAgIGNvbnRhaW5lci5hcHBlbmRDaGlsZChzdmcpO1xuXG4gICAgY29uc3QgZGF0YSA9IG1hc3NhZ2Uodmlldyk7XG4gICAgY29uc29sZS5sb2coZGF0YSk7XG4gICAgY29uc3QgdGFibGUgPSBuZXcgVGFibGVXaWRnZXQoZGF0YSwgY29uc29sZS5sb2cpO1xuICAgIHRhYmxlLnRyYW5zZm9ybSh7dHJhbnNsYXRlOiB7eTogLXRhYmxlUmFkaXVzICogMC4yfX0pO1xuICAgIHN2Zy5hcHBlbmRDaGlsZCh0YWJsZS5jb250YWluZXIpO1xufTtcbiIsImltcG9ydCB7UGFyYW1UeXBlfSBmcm9tIFwiUG9rZXIvRGVmYXVsdHNcIjtcblxuaW50ZXJmYWNlIElDb250cm9sbGVyIHtcbiAgICBpbnB1dDogSFRNTElucHV0RWxlbWVudDtcbiAgICB2YWx1ZSgpOiBhbnk7XG59XG5cbmludGVyZmFjZSBCYXNlSW5wdXRQYXJhbXM8VCBleHRlbmRzIFBhcmFtVHlwZT4ge1xuICAgIGlkOiBzdHJpbmc7XG4gICAgbGFiZWxUZXh0OiBzdHJpbmc7XG4gICAgZGVmYXVsdDogVDtcbn1cblxuYWJzdHJhY3QgY2xhc3MgQmFzZUlucHV0V2lkZ2V0PFQgZXh0ZW5kcyBQYXJhbVR5cGUsIFBhcmFtcyBleHRlbmRzXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIEJhc2VJbnB1dFBhcmFtczxUPj4gaW1wbGVtZW50cyBJQ29udHJvbGxlciB7XG4gICAgcHVibGljIGNvbnRhaW5lcjogSFRNTERpdkVsZW1lbnQ7XG4gICAgcHVibGljIGlucHV0OiBIVE1MSW5wdXRFbGVtZW50O1xuICAgIHB1YmxpYyBsYWJlbDogSFRNTExhYmVsRWxlbWVudDtcbiAgICBjb25zdHJ1Y3RvcihwdWJsaWMgaW5wdXRUeXBlOiBzdHJpbmcsIHB1YmxpYyBwYXJhbXM6IFBhcmFtcykge1xuICAgICAgICB0aGlzLmNvbnRhaW5lciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIikgYXMgSFRNTERpdkVsZW1lbnQ7XG5cbiAgICAgICAgdGhpcy5sYWJlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJsYWJlbFwiKSBhcyBIVE1MTGFiZWxFbGVtZW50O1xuICAgICAgICB0aGlzLmxhYmVsLnNldEF0dHJpYnV0ZShcImZvclwiLCBwYXJhbXMuaWQpO1xuICAgICAgICB0aGlzLmxhYmVsLmlubmVyVGV4dCA9IHBhcmFtcy5sYWJlbFRleHQ7XG4gICAgICAgIHRoaXMuY29udGFpbmVyLmFwcGVuZENoaWxkKHRoaXMubGFiZWwpO1xuXG4gICAgICAgIHRoaXMuaW5wdXQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiaW5wdXRcIikgYXMgSFRNTElucHV0RWxlbWVudDtcbiAgICAgICAgdGhpcy5pbnB1dC5zZXRBdHRyaWJ1dGUoXCJpZFwiLCBwYXJhbXMuaWQpO1xuICAgICAgICB0aGlzLmlucHV0LnNldEF0dHJpYnV0ZShcInR5cGVcIiwgaW5wdXRUeXBlKTtcbiAgICAgICAgdGhpcy5jb250YWluZXIuYXBwZW5kQ2hpbGQodGhpcy5pbnB1dCk7XG4gICAgfVxuICAgIHB1YmxpYyBhYnN0cmFjdCB2YWx1ZSgpOiBUO1xuICAgIHB1YmxpYyBhYnN0cmFjdCBzZXRWYWx1ZSh2YWx1ZTogVCk6IHZvaWQ7XG4gICAgcHJpdmF0ZSBzZXREaXNhYmxlZChkaXNhYmxlZDogYm9vbGVhbik6IHZvaWQge1xuICAgICAgICBpZiAoZGlzYWJsZWQpIHtcbiAgICAgICAgICAgIHRoaXMuaW5wdXQucmVtb3ZlQXR0cmlidXRlKFwiZGlzYWJsZWRcIik7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLmlucHV0LnNldEF0dHJpYnV0ZShcImRpc2FibGVkXCIsIFwiXCIpO1xuICAgICAgICB9XG4gICAgfVxuICAgIHB1YmxpYyBzZXRDb250cm9sbGVyKGNvbnRyb2xsZXI6IElDb250cm9sbGVyKTogdm9pZCB7XG4gICAgICAgIGlmIChjb250cm9sbGVyICE9IG51bGwpIHtcbiAgICAgICAgICAgIGNvbnRyb2xsZXIuaW5wdXQuYWRkRXZlbnRMaXN0ZW5lcihcbiAgICAgICAgICAgICAgICBcImNoYW5nZVwiLCBfID0+IHRoaXMuc2V0RGlzYWJsZWQoISFjb250cm9sbGVyLnZhbHVlKCkpKTtcbiAgICAgICAgICAgIHRoaXMuc2V0RGlzYWJsZWQoISFjb250cm9sbGVyLnZhbHVlKCkpO1xuICAgICAgICB9XG4gICAgfVxufVxuXG5leHBvcnQgaW50ZXJmYWNlIEJvb2xJbnB1dFBhcmFtcyBleHRlbmRzIEJhc2VJbnB1dFBhcmFtczxib29sZWFuPiB7fVxuXG5leHBvcnQgY2xhc3MgQm9vbElucHV0V2lkZ2V0IGV4dGVuZHMgQmFzZUlucHV0V2lkZ2V0PGJvb2xlYW4sIEJvb2xJbnB1dFBhcmFtcz4ge1xuICAgIGNvbnN0cnVjdG9yKHBhcmFtczogQm9vbElucHV0UGFyYW1zKSB7XG4gICAgICAgIHN1cGVyKFwiY2hlY2tib3hcIiwgcGFyYW1zKTtcbiAgICAgICAgaWYgKHBhcmFtcy5kZWZhdWx0KVxuICAgICAgICAgICAgdGhpcy5pbnB1dC5zZXRBdHRyaWJ1dGUoXCJjaGVja2VkXCIsIFwiXCIpO1xuICAgIH1cbiAgICBwdWJsaWMgdmFsdWUoKTogYm9vbGVhbiB7IHJldHVybiB0aGlzLmlucHV0LmNoZWNrZWQ7IH1cbiAgICBwdWJsaWMgc2V0VmFsdWUodmFsdWU6IGJvb2xlYW4pOiB2b2lkIHsgdGhpcy5pbnB1dC5jaGVja2VkID0gdmFsdWU7IH1cbn1cblxuZXhwb3J0IGNsYXNzIFNsaWRlclZpZXdXaWRnZXQge1xuICAgIHB1YmxpYyBjb250YWluZXI6IEhUTUxTcGFuRWxlbWVudDtcbiAgICBjb25zdHJ1Y3RvcihwdWJsaWMgY29udHJvbGxlcjpcbiAgICAgICAgICAgICAgICAgICAgQmFzZUlucHV0V2lkZ2V0PG51bWJlciwgSW50SW5wdXRQYXJhbXN8RmxvYXRJbnB1dFBhcmFtcz4sXG4gICAgICAgICAgICAgICAgcHVibGljIGZvcm1hdFZhbHVlOiAodmFsdWU6IG51bWJlcikgPT4gc3RyaW5nKSB7XG4gICAgICAgIHRoaXMuY29udGFpbmVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInNwYW5cIikgYXMgSFRNTFNwYW5FbGVtZW50O1xuICAgICAgICB0aGlzLmNvbnRhaW5lci5jbGFzc0xpc3QuYWRkKFwic2xpZGVyLXZpZXdcIik7XG4gICAgICAgIGNvbnRyb2xsZXIuaW5wdXQuYWRkRXZlbnRMaXN0ZW5lcihcImlucHV0XCIsIF8gPT4gdGhpcy51cGRhdGUoKSk7XG4gICAgfVxuICAgIHB1YmxpYyB1cGRhdGUoKTogdm9pZCB7XG4gICAgICAgIHRoaXMuY29udGFpbmVyLmlubmVyVGV4dCA9IHRoaXMuZm9ybWF0VmFsdWUodGhpcy5jb250cm9sbGVyLnZhbHVlKCkpO1xuICAgIH1cbn1cblxuZXhwb3J0IGludGVyZmFjZSBJbnRJbnB1dFBhcmFtcyBleHRlbmRzIEJhc2VJbnB1dFBhcmFtczxudW1iZXI+IHtcbiAgICBtaW46IG51bWJlcjtcbiAgICBtYXg6IG51bWJlcjtcbn1cblxuZXhwb3J0IGNsYXNzIEludElucHV0V2lkZ2V0IGV4dGVuZHMgQmFzZUlucHV0V2lkZ2V0PG51bWJlciwgSW50SW5wdXRQYXJhbXM+IHtcbiAgICBwdWJsaWMgdmlld1dpZGdldDogU2xpZGVyVmlld1dpZGdldDtcbiAgICBjb25zdHJ1Y3RvcihwYXJhbXM6IEludElucHV0UGFyYW1zKSB7XG4gICAgICAgIHN1cGVyKFwicmFuZ2VcIiwgcGFyYW1zKTtcbiAgICAgICAgdGhpcy5pbnB1dC5zZXRBdHRyaWJ1dGUoXCJtaW5cIiwgcGFyYW1zLm1pbi50b1N0cmluZygpKTtcbiAgICAgICAgdGhpcy5pbnB1dC5zZXRBdHRyaWJ1dGUoXCJtYXhcIiwgcGFyYW1zLm1heC50b1N0cmluZygpKTtcbiAgICAgICAgdGhpcy5pbnB1dC5zZXRBdHRyaWJ1dGUoXCJzdGVwXCIsIFwiMVwiKTtcbiAgICAgICAgdGhpcy5pbnB1dC5zZXRBdHRyaWJ1dGUoXCJ2YWx1ZVwiLCBwYXJhbXMuZGVmYXVsdC50b1N0cmluZygpKTtcblxuICAgICAgICB0aGlzLnZpZXdXaWRnZXQgPVxuICAgICAgICAgICAgbmV3IFNsaWRlclZpZXdXaWRnZXQodGhpcywgKHZhbHVlOiBudW1iZXIpID0+IHZhbHVlLnRvU3RyaW5nKCkpO1xuICAgICAgICB0aGlzLnZpZXdXaWRnZXQudXBkYXRlKCk7XG4gICAgICAgIHRoaXMuY29udGFpbmVyLmFwcGVuZENoaWxkKHRoaXMudmlld1dpZGdldC5jb250YWluZXIpO1xuICAgIH1cbiAgICBwdWJsaWMgdmFsdWUoKTogbnVtYmVyIHsgcmV0dXJuIHBhcnNlSW50KHRoaXMuaW5wdXQudmFsdWUpOyB9XG4gICAgcHVibGljIHNldFZhbHVlKHZhbHVlOiBudW1iZXIpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5pbnB1dC52YWx1ZSA9IHZhbHVlLnRvU3RyaW5nKCk7XG4gICAgICAgIHRoaXMudmlld1dpZGdldC51cGRhdGUoKTtcbiAgICB9XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgRmxvYXRJbnB1dFBhcmFtcyBleHRlbmRzIEJhc2VJbnB1dFBhcmFtczxudW1iZXI+IHtcbiAgICBtaW46IG51bWJlcjtcbiAgICBtYXg6IG51bWJlcjtcbiAgICBzdGVwOiBudW1iZXI7XG59XG5cbmV4cG9ydCBjbGFzcyBGbG9hdElucHV0V2lkZ2V0IGV4dGVuZHNcbiAgICBCYXNlSW5wdXRXaWRnZXQ8bnVtYmVyLCBGbG9hdElucHV0UGFyYW1zPiB7XG4gICAgcHVibGljIHZpZXdXaWRnZXQ6IFNsaWRlclZpZXdXaWRnZXQ7XG4gICAgY29uc3RydWN0b3IocGFyYW1zOiBGbG9hdElucHV0UGFyYW1zKSB7XG4gICAgICAgIHN1cGVyKFwicmFuZ2VcIiwgcGFyYW1zKTtcbiAgICAgICAgdGhpcy5pbnB1dC5zZXRBdHRyaWJ1dGUoXCJtaW5cIiwgcGFyYW1zLm1pbi50b1N0cmluZygpKTtcbiAgICAgICAgdGhpcy5pbnB1dC5zZXRBdHRyaWJ1dGUoXCJtYXhcIiwgcGFyYW1zLm1heC50b1N0cmluZygpKTtcbiAgICAgICAgdGhpcy5pbnB1dC5zZXRBdHRyaWJ1dGUoXCJzdGVwXCIsIHBhcmFtcy5zdGVwLnRvU3RyaW5nKCkpO1xuICAgICAgICB0aGlzLmlucHV0LnNldEF0dHJpYnV0ZShcInZhbHVlXCIsIHBhcmFtcy5kZWZhdWx0LnRvU3RyaW5nKCkpO1xuXG4gICAgICAgIHRoaXMudmlld1dpZGdldCA9XG4gICAgICAgICAgICBuZXcgU2xpZGVyVmlld1dpZGdldCh0aGlzLCAodmFsdWU6IG51bWJlcikgPT4gdmFsdWUudG9GaXhlZCgyKSk7XG4gICAgICAgIHRoaXMudmlld1dpZGdldC51cGRhdGUoKTtcbiAgICAgICAgdGhpcy5jb250YWluZXIuYXBwZW5kQ2hpbGQodGhpcy52aWV3V2lkZ2V0LmNvbnRhaW5lcik7XG4gICAgfVxuICAgIHB1YmxpYyB2YWx1ZSgpOiBudW1iZXIgeyByZXR1cm4gcGFyc2VGbG9hdCh0aGlzLmlucHV0LnZhbHVlKTsgfVxuICAgIHB1YmxpYyBzZXRWYWx1ZSh2YWx1ZTogbnVtYmVyKTogdm9pZCB7XG4gICAgICAgIHRoaXMuaW5wdXQudmFsdWUgPSB2YWx1ZS50b1N0cmluZygpO1xuICAgICAgICB0aGlzLnZpZXdXaWRnZXQudXBkYXRlKCk7XG4gICAgfVxufVxuXG5leHBvcnQgaW50ZXJmYWNlIFN0cklucHV0UGFyYW1zIGV4dGVuZHMgQmFzZUlucHV0UGFyYW1zPHN0cmluZz4ge1xuICAgIHBhdHRlcm46IFJlZ0V4cDtcbn1cblxuZXhwb3J0IGNsYXNzIFN0cklucHV0V2lkZ2V0IGV4dGVuZHMgQmFzZUlucHV0V2lkZ2V0PHN0cmluZywgU3RySW5wdXRQYXJhbXM+IHtcbiAgICBjb25zdHJ1Y3RvcihwYXJhbXM6IFN0cklucHV0UGFyYW1zKSB7XG4gICAgICAgIHN1cGVyKFwidGV4dFwiLCBwYXJhbXMpO1xuICAgICAgICAvLyBcInBhdHRlcm5cIiBhdHRyIHNob3VsZG4ndCBoYXZlIGVuY2xvc2luZyAvc2xhc2hlcy9cbiAgICAgICAgY29uc3QgcGF0dGVyblN0cmluZyA9IHBhcmFtcy5wYXR0ZXJuLnRvU3RyaW5nKCk7XG4gICAgICAgIHRoaXMuaW5wdXQuc2V0QXR0cmlidXRlKFxuICAgICAgICAgICAgXCJwYXR0ZXJuXCIsIHBhdHRlcm5TdHJpbmcuc2xpY2UoMSwgcGF0dGVyblN0cmluZy5sZW5ndGggLSAxKSk7XG4gICAgICAgIGlmIChwYXJhbXMuZGVmYXVsdCAhPSBudWxsKVxuICAgICAgICAgICAgdGhpcy5pbnB1dC5zZXRBdHRyaWJ1dGUoXCJ2YWx1ZVwiLCBwYXJhbXMuZGVmYXVsdCk7XG4gICAgfVxuICAgIHB1YmxpYyB2YWx1ZSgpOiBzdHJpbmcgeyByZXR1cm4gdGhpcy5pbnB1dC52YWx1ZTsgfVxuICAgIHB1YmxpYyBzZXRWYWx1ZSh2YWx1ZTogc3RyaW5nKTogdm9pZCB7IHRoaXMuaW5wdXQudmFsdWUgPSB2YWx1ZTsgfVxufVxuXG5leHBvcnQgdHlwZSBJbnB1dFdpZGdldCA9XG4gICAgQm9vbElucHV0V2lkZ2V0fEludElucHV0V2lkZ2V0fEZsb2F0SW5wdXRXaWRnZXR8U3RySW5wdXRXaWRnZXQ7XG4iLCJpbXBvcnQge0Zsb2F0SW5wdXRXaWRnZXR9IGZyb20gXCIuLi9JbnB1dFwiO1xuaW1wb3J0IHtjcmVhdGVTVkdFbGVtZW50LCBTVkdXaWRnZXR9IGZyb20gXCIuLi9TVkdcIjtcbmltcG9ydCB7RW1iZWRkZWRGbG9hdElucHV0RGF0YX0gZnJvbSBcIi4uL1NWR0lucHV0XCI7XG5cbmltcG9ydCB7QnV0dG9uV2lkZ2V0LCBTbGlkZXJCdXR0b25XaWRnZXR9IGZyb20gXCIuL0J1dHRvblwiO1xuaW1wb3J0IHt0YWJsZVJhZGl1c30gZnJvbSBcIi4vQ29uc3RhbnRzXCI7XG5cbmV4cG9ydCBpbnRlcmZhY2UgQmV0dGluZ0RhdGEge1xuICAgIGFkZEJhbGFuY2U6IHtkZWZhdWx0OiBudW1iZXIsIG1pbjogbnVtYmVyLCBtYXg6IG51bWJlcn07XG4gICAgcmFpc2U6IHtkZWZhdWx0OiBudW1iZXIsIG1pbjogbnVtYmVyLCBtYXg6IG51bWJlcn07XG59XG5cbmV4cG9ydCBjbGFzcyBCZXR0aW5nV2lkZ2V0IGV4dGVuZHMgU1ZHV2lkZ2V0PEJldHRpbmdEYXRhPiB7XG4gICAgcHVibGljIGNvbnRhaW5lcjogU1ZHR0VsZW1lbnQ7XG4gICAgcHVibGljIGFkZEJhbGFuY2VTbGlkZXJCdXR0b246IFNsaWRlckJ1dHRvbldpZGdldDtcbiAgICBwdWJsaWMgZm9sZEJ1dHRvbjogQnV0dG9uV2lkZ2V0O1xuICAgIHB1YmxpYyBjYWxsQnV0dG9uOiBCdXR0b25XaWRnZXQ7XG4gICAgcHVibGljIHJhaXNlU2xpZGVyQnV0dG9uOiBTbGlkZXJCdXR0b25XaWRnZXQ7XG4gICAgY29uc3RydWN0b3IoZGF0YTogQmV0dGluZ0RhdGEsXG4gICAgICAgICAgICAgICAgb25DbGljazogKG5hbWU6IHN0cmluZywgdmFsdWU/OiBudW1iZXIpID0+IHZvaWQpIHtcbiAgICAgICAgc3VwZXIoZGF0YSk7XG4gICAgICAgIHRoaXMuY29udGFpbmVyID0gY3JlYXRlU1ZHRWxlbWVudDxTVkdHRWxlbWVudD4oXCJnXCIpO1xuXG4gICAgICAgIHRoaXMuYWRkQmFsYW5jZVNsaWRlckJ1dHRvbiA9IG5ldyBTbGlkZXJCdXR0b25XaWRnZXQoe1xuICAgICAgICAgICAgYnV0dG9uVGV4dDogXCJhZGQgYmFsYW5jZVwiLFxuICAgICAgICAgICAgaW5wdXQ6IHtcbiAgICAgICAgICAgICAgICAuLi5kYXRhLmFkZEJhbGFuY2UsXG4gICAgICAgICAgICAgICAgaWQ6IFwiYWRkLWJhbGFuY2UtYW1vdW50XCIsXG4gICAgICAgICAgICAgICAgbGFiZWxUZXh0OiBcImFkZCBiYWxhbmNlIGFtb3VudFwiLFxuICAgICAgICAgICAgICAgIHN0ZXA6IDAuMDFcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvbkNsaWNrKTtcbiAgICAgICAgdGhpcy5hZGRCYWxhbmNlU2xpZGVyQnV0dG9uLnRyYW5zZm9ybShcbiAgICAgICAgICAgIHt0cmFuc2xhdGU6IHt4OiAtdGFibGVSYWRpdXMgKiAxLjR9fSk7XG4gICAgICAgIHRoaXMuY29udGFpbmVyLmFwcGVuZENoaWxkKHRoaXMuYWRkQmFsYW5jZVNsaWRlckJ1dHRvbi5jb250YWluZXIpO1xuXG4gICAgICAgIHRoaXMuZm9sZEJ1dHRvbiA9IG5ldyBCdXR0b25XaWRnZXQoe2J1dHRvblRleHQ6IFwiZm9sZFwifSwgb25DbGljayk7XG4gICAgICAgIHRoaXMuZm9sZEJ1dHRvbi50cmFuc2Zvcm0oe3RyYW5zbGF0ZToge3g6IC10YWJsZVJhZGl1cyAqIDAuNH19KTtcbiAgICAgICAgdGhpcy5jb250YWluZXIuYXBwZW5kQ2hpbGQodGhpcy5mb2xkQnV0dG9uLmNvbnRhaW5lcik7XG5cbiAgICAgICAgdGhpcy5jYWxsQnV0dG9uID0gbmV3IEJ1dHRvbldpZGdldCh7YnV0dG9uVGV4dDogXCJjYWxsXCJ9LCBvbkNsaWNrKTtcbiAgICAgICAgdGhpcy5jYWxsQnV0dG9uLnRyYW5zZm9ybSh7dHJhbnNsYXRlOiB7eDogdGFibGVSYWRpdXMgKiAwLjR9fSk7XG4gICAgICAgIHRoaXMuY29udGFpbmVyLmFwcGVuZENoaWxkKHRoaXMuY2FsbEJ1dHRvbi5jb250YWluZXIpO1xuXG4gICAgICAgIHRoaXMucmFpc2VTbGlkZXJCdXR0b24gPSBuZXcgU2xpZGVyQnV0dG9uV2lkZ2V0KHtcbiAgICAgICAgICAgIGJ1dHRvblRleHQ6IFwicmFpc2VcIixcbiAgICAgICAgICAgIGlucHV0OiB7XG4gICAgICAgICAgICAgICAgLi4uZGF0YS5yYWlzZSxcbiAgICAgICAgICAgICAgICBpZDogXCJyYWlzZS1hbW91bnRcIixcbiAgICAgICAgICAgICAgICBsYWJlbFRleHQ6IFwicmFpc2UgYW1vdW50XCIsXG4gICAgICAgICAgICAgICAgc3RlcDogMC4wMVxuICAgICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb25DbGljayk7XG4gICAgICAgIHRoaXMucmFpc2VTbGlkZXJCdXR0b24udHJhbnNmb3JtKHt0cmFuc2xhdGU6IHt4OiB0YWJsZVJhZGl1cyAqIDEuNH19KTtcbiAgICAgICAgdGhpcy5jb250YWluZXIuYXBwZW5kQ2hpbGQodGhpcy5yYWlzZVNsaWRlckJ1dHRvbi5jb250YWluZXIpO1xuICAgIH1cbn1cbiIsImltcG9ydCB7RmxvYXRJbnB1dFdpZGdldH0gZnJvbSBcIi4uL0lucHV0XCI7XG5pbXBvcnQge2NyZWF0ZVNWR0VsZW1lbnQsIFNWR1dpZGdldH0gZnJvbSBcIi4uL1NWR1wiO1xuaW1wb3J0IHtFbWJlZGRlZEZsb2F0SW5wdXREYXRhLCBFbWJlZGRlZEZsb2F0SW5wdXRXaWRnZXR9IGZyb20gXCIuLi9TVkdJbnB1dFwiO1xuXG50eXBlIEJ1dHRvbkRhdGEgPSB7XG4gICAgYnV0dG9uVGV4dDogc3RyaW5nLFxufVxuXG5leHBvcnQgY2xhc3MgQnV0dG9uV2lkZ2V0IGV4dGVuZHMgU1ZHV2lkZ2V0PEJ1dHRvbkRhdGE+IHtcbiAgICBwdWJsaWMgY29udGFpbmVyOiBTVkdHRWxlbWVudDtcbiAgICBjb25zdHJ1Y3RvcihkYXRhOiBCdXR0b25EYXRhLCBvbkNsaWNrOiAobmFtZTogc3RyaW5nKSA9PiB2b2lkKSB7XG4gICAgICAgIHN1cGVyKGRhdGEpO1xuICAgICAgICBjb25zdCB3aWR0aCA9IDMwICsgMTAgKiBkYXRhLmJ1dHRvblRleHQubGVuZ3RoO1xuICAgICAgICBjb25zdCBoZWlnaHQgPSAyNztcbiAgICAgICAgY29uc3QgeCA9IC13aWR0aCAvIDI7XG4gICAgICAgIGNvbnN0IHkgPSAtMTk7XG4gICAgICAgIHRoaXMuY29udGFpbmVyID0gY3JlYXRlU1ZHRWxlbWVudDxTVkdHRWxlbWVudD4oXCJnXCIsIHtcbiAgICAgICAgICAgIGNsYXNzZXM6IFtcImJ1dHRvblwiXSxcbiAgICAgICAgICAgIGNoaWxkcmVuOiBbXG4gICAgICAgICAgICAgICAgY3JlYXRlU1ZHRWxlbWVudDxTVkdSZWN0RWxlbWVudD4oXG4gICAgICAgICAgICAgICAgICAgIFwicmVjdFwiLCB7YXR0cnM6IHt4LCB5LCB3aWR0aCwgaGVpZ2h0LCByeDogMTB9fSksXG4gICAgICAgICAgICAgICAgY3JlYXRlU1ZHRWxlbWVudDxTVkdUZXh0RWxlbWVudD4oXG4gICAgICAgICAgICAgICAgICAgIFwidGV4dFwiLFxuICAgICAgICAgICAgICAgICAgICB7dGV4dENvbnRlbnQ6IGRhdGEuYnV0dG9uVGV4dCwgYXR0cnM6IHt4OiAwLCB5OiAwfX0pXG4gICAgICAgICAgICBdXG4gICAgICAgIH0pO1xuICAgICAgICB0aGlzLmNvbnRhaW5lci5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBfID0+IHsgb25DbGljayhkYXRhLmJ1dHRvblRleHQpOyB9KTtcbiAgICB9XG59XG5cbnR5cGUgU2xpZGVyQnV0dG9uRGF0YSA9IHtcbiAgICBidXR0b25UZXh0OiBzdHJpbmcsXG4gICAgaW5wdXQ6IEVtYmVkZGVkRmxvYXRJbnB1dERhdGEsXG59XG5cbmV4cG9ydCBjbGFzcyBTbGlkZXJCdXR0b25XaWRnZXQgZXh0ZW5kcyBTVkdXaWRnZXQ8U2xpZGVyQnV0dG9uRGF0YT4ge1xuICAgIHB1YmxpYyBjb250YWluZXI6IFNWR0dFbGVtZW50O1xuICAgIHB1YmxpYyBidXR0b246IEJ1dHRvbldpZGdldDtcbiAgICBwdWJsaWMgaW5wdXQ6IEVtYmVkZGVkRmxvYXRJbnB1dFdpZGdldDtcbiAgICBjb25zdHJ1Y3RvcihkYXRhOiBTbGlkZXJCdXR0b25EYXRhLFxuICAgICAgICAgICAgICAgIG9uQ2xpY2s6IChuYW1lOiBzdHJpbmcsIHZhbHVlOiBudW1iZXIpID0+IHZvaWQpIHtcbiAgICAgICAgc3VwZXIoZGF0YSk7XG4gICAgICAgIHRoaXMuY29udGFpbmVyID0gY3JlYXRlU1ZHRWxlbWVudDxTVkdHRWxlbWVudD4oXCJnXCIpO1xuXG4gICAgICAgIHRoaXMuYnV0dG9uID1cbiAgICAgICAgICAgIG5ldyBCdXR0b25XaWRnZXQoe2J1dHRvblRleHQ6IGRhdGEuYnV0dG9uVGV4dH0sIChuYW1lOiBzdHJpbmcpID0+IHtcbiAgICAgICAgICAgICAgICAvLyBDYWxsICpteSogY2FsbGJhY2ssIHVzaW5nIHRoZSAqQnV0dG9uJ3MqXG4gICAgICAgICAgICAgICAgLy8gbmFtZSwgYnV0ICpteSogaW5wdXQgdmFsdWUoKVxuICAgICAgICAgICAgICAgIG9uQ2xpY2sobmFtZSwgdGhpcy5pbnB1dC52YWx1ZSgpKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB0aGlzLmJ1dHRvbi50cmFuc2Zvcm0oe3RyYW5zbGF0ZToge3k6IC0xNX19KTtcbiAgICAgICAgdGhpcy5jb250YWluZXIuYXBwZW5kQ2hpbGQodGhpcy5idXR0b24uY29udGFpbmVyKTtcblxuICAgICAgICB0aGlzLmlucHV0ID0gbmV3IEVtYmVkZGVkRmxvYXRJbnB1dFdpZGdldChkYXRhLmlucHV0KTtcbiAgICAgICAgdGhpcy5pbnB1dC50cmFuc2Zvcm0oe3RyYW5zbGF0ZToge3k6IC01fX0pO1xuICAgICAgICB0aGlzLmNvbnRhaW5lci5hcHBlbmRDaGlsZCh0aGlzLmlucHV0LmNvbnRhaW5lcik7XG4gICAgfVxufVxuXG4iLCJpbXBvcnQge2NyZWF0ZVNWR0VsZW1lbnQsIFNWR1dpZGdldH0gZnJvbSBcIi4uL1NWR1wiO1xuXG5leHBvcnQgdHlwZSBDYXB0aW9uRGF0YSA9IHtcbiAgICB1c2VybmFtZTogc3RyaW5nLFxuICAgIGJhbGFuY2U6IG51bWJlclxufTtcblxuZXhwb3J0IGNsYXNzIENhcHRpb25XaWRnZXQgZXh0ZW5kcyBTVkdXaWRnZXQ8Q2FwdGlvbkRhdGE+IHtcbiAgICBwdWJsaWMgY29udGFpbmVyOiBTVkdUZXh0RWxlbWVudDtcbiAgICBwdWJsaWMgdXNlcm5hbWVTcGFuOiBTVkdUU3BhbkVsZW1lbnQ7XG4gICAgcHVibGljIGJhbGFuY2VTcGFuOiBTVkdUU3BhbkVsZW1lbnQ7XG4gICAgY29uc3RydWN0b3IoZGF0YTogQ2FwdGlvbkRhdGEpIHtcbiAgICAgICAgc3VwZXIoZGF0YSk7XG4gICAgICAgIHRoaXMuY29udGFpbmVyID0gY3JlYXRlU1ZHRWxlbWVudDxTVkdUZXh0RWxlbWVudD4oXCJ0ZXh0XCIsIHtcbiAgICAgICAgICAgIGNsYXNzZXM6IFtcImNhcHRpb25cIl0sXG4gICAgICAgIH0pO1xuXG4gICAgICAgIHRoaXMudXNlcm5hbWVTcGFuID0gY3JlYXRlU1ZHRWxlbWVudDxTVkdUU3BhbkVsZW1lbnQ+KFwidHNwYW5cIiwge1xuICAgICAgICAgICAgY2xhc3NlczogW1widXNlcm5hbWVcIl0sXG4gICAgICAgICAgICB0ZXh0Q29udGVudDogZGF0YS51c2VybmFtZSxcbiAgICAgICAgICAgIGF0dHJzOiB7eDogMCwgZHk6IFwiLTAuMmVtXCJ9LFxuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy5jb250YWluZXIuYXBwZW5kQ2hpbGQodGhpcy51c2VybmFtZVNwYW4pO1xuXG4gICAgICAgIHRoaXMuYmFsYW5jZVNwYW4gPSBjcmVhdGVTVkdFbGVtZW50PFNWR1RTcGFuRWxlbWVudD4oXCJ0c3BhblwiLCB7XG4gICAgICAgICAgICBjbGFzc2VzOiBbXCJiYWxhbmNlXCJdLFxuICAgICAgICAgICAgdGV4dENvbnRlbnQ6IGRhdGEuYmFsYW5jZS50b0ZpeGVkKDIpLFxuICAgICAgICAgICAgYXR0cnM6IHt4OiAwLCBkeTogXCIxLjNlbVwifSxcbiAgICAgICAgfSk7XG4gICAgICAgIHRoaXMuY29udGFpbmVyLmFwcGVuZENoaWxkKHRoaXMuYmFsYW5jZVNwYW4pO1xuICAgIH1cbn1cbiIsImltcG9ydCB7XG4gICAgQ2FyZCxcbiAgICBjaGFyRm9yUmFuayxcbiAgICBjaGFyRm9yU3VpdCxcbiAgICBkaXNwbGF5TmFtZUZvclN1aXQsXG4gICAgUmFuayxcbiAgICBTdWl0XG59IGZyb20gXCJQb2tlci9DYXJkXCI7XG5cbmltcG9ydCB7Y3JlYXRlU1ZHRWxlbWVudCwgU1ZHV2lkZ2V0fSBmcm9tIFwiLi4vU1ZHXCI7XG5cbmltcG9ydCB7Y2FyZEhlaWdodCwgY2FyZFdpZHRofSBmcm9tIFwiLi9Db25zdGFudHNcIjtcblxuZXhwb3J0IHR5cGUgQ2FyZERhdGEgPSBDYXJkfG51bGw7XG5cbmV4cG9ydCBjbGFzcyBDYXJkV2lkZ2V0IGV4dGVuZHMgU1ZHV2lkZ2V0PENhcmREYXRhPiB7XG4gICAgcHVibGljIGNvbnRhaW5lcjogU1ZHR0VsZW1lbnQ7XG4gICAgcHVibGljIHRleHQ6IFNWR1RleHRFbGVtZW50ID0gbnVsbDtcbiAgICBwdWJsaWMgcmFua1NwYW46IFNWR1RTcGFuRWxlbWVudCA9IG51bGw7XG4gICAgcHVibGljIHN1aXRTcGFuOiBTVkdUU3BhbkVsZW1lbnQgPSBudWxsO1xuICAgIGNvbnN0cnVjdG9yKGRhdGE6IENhcmREYXRhKSB7XG4gICAgICAgIHN1cGVyKGRhdGEpO1xuXG4gICAgICAgIGNvbnN0IGlzRmFjZVVwID0gZGF0YSAhPSBudWxsO1xuXG4gICAgICAgIHRoaXMuY29udGFpbmVyID0gY3JlYXRlU1ZHRWxlbWVudDxTVkdHRWxlbWVudD4oXCJnXCIsIHtcbiAgICAgICAgICAgIGNsYXNzZXM6IFtcImNhcmRcIiwgaXNGYWNlVXAgPyBcImNhcmQtdXBcIiA6IFwiY2FyZC1kb3duXCJdLFxuICAgICAgICAgICAgY2hpbGRyZW46IFtjcmVhdGVTVkdFbGVtZW50PFNWR1JlY3RFbGVtZW50PihcInJlY3RcIiwge1xuICAgICAgICAgICAgICAgIGF0dHJzOiB7XG4gICAgICAgICAgICAgICAgICAgIHg6IC1jYXJkV2lkdGggLyAyLFxuICAgICAgICAgICAgICAgICAgICB3aWR0aDogY2FyZFdpZHRoLFxuICAgICAgICAgICAgICAgICAgICB5OiAtY2FyZEhlaWdodCAvIDIsXG4gICAgICAgICAgICAgICAgICAgIGhlaWdodDogY2FyZEhlaWdodCxcbiAgICAgICAgICAgICAgICAgICAgcng6IDEwLFxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pXSxcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaWYgKGlzRmFjZVVwKSB7XG4gICAgICAgICAgICB0aGlzLnRleHQgPSBjcmVhdGVTVkdFbGVtZW50PFNWR1RleHRFbGVtZW50PihcbiAgICAgICAgICAgICAgICBcInRleHRcIiwge2NsYXNzZXM6IFtkaXNwbGF5TmFtZUZvclN1aXQoZGF0YS5zdWl0KV19KTtcbiAgICAgICAgICAgIHRoaXMuY29udGFpbmVyLmFwcGVuZENoaWxkKHRoaXMudGV4dCk7XG5cbiAgICAgICAgICAgIHRoaXMucmFua1NwYW4gPSBjcmVhdGVTVkdFbGVtZW50PFNWR1RTcGFuRWxlbWVudD4oXCJ0c3BhblwiLCB7XG4gICAgICAgICAgICAgICAgdGV4dENvbnRlbnQ6IGNoYXJGb3JSYW5rKGRhdGEucmFuayksXG4gICAgICAgICAgICAgICAgYXR0cnM6IHtcbiAgICAgICAgICAgICAgICAgICAgeDogMCxcbiAgICAgICAgICAgICAgICAgICAgZHk6IFwiLTAuMWVtXCIsXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB0aGlzLnRleHQuYXBwZW5kQ2hpbGQodGhpcy5yYW5rU3Bhbik7XG5cbiAgICAgICAgICAgIHRoaXMuc3VpdFNwYW4gPSBjcmVhdGVTVkdFbGVtZW50PFNWR1RTcGFuRWxlbWVudD4oXCJ0c3BhblwiLCB7XG4gICAgICAgICAgICAgICAgdGV4dENvbnRlbnQ6IGNoYXJGb3JTdWl0KGRhdGEuc3VpdCksXG4gICAgICAgICAgICAgICAgYXR0cnM6IHtcbiAgICAgICAgICAgICAgICAgICAgeDogMCxcbiAgICAgICAgICAgICAgICAgICAgZHk6IFwiMC44ZW1cIixcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHRoaXMudGV4dC5hcHBlbmRDaGlsZCh0aGlzLnN1aXRTcGFuKTtcbiAgICAgICAgfVxuICAgIH1cbn1cbiIsImltcG9ydCB7Q2FyZH0gZnJvbSBcIlBva2VyL0NhcmRcIjtcblxuaW1wb3J0IHtjcmVhdGVTVkdFbGVtZW50LCBTVkdXaWRnZXR9IGZyb20gXCIuLi9TVkdcIjtcblxuaW1wb3J0IHtDYXJkRGF0YSwgQ2FyZFdpZGdldH0gZnJvbSBcIi4vQ2FyZFwiO1xuaW1wb3J0IHtjYXJkUGFkZGluZ1gsIGNhcmRXaWR0aH0gZnJvbSBcIi4vQ29uc3RhbnRzXCI7XG5cbmV4cG9ydCB0eXBlIENvbW11bml0eUNhcmRzRGF0YSA9IChDYXJkfG51bGwpW107XG5cbmV4cG9ydCBjbGFzcyBDb21tdW5pdHlDYXJkc1dpZGdldCBleHRlbmRzIFNWR1dpZGdldDxDb21tdW5pdHlDYXJkc0RhdGE+IHtcbiAgICBwdWJsaWMgY29udGFpbmVyOiBTVkdHRWxlbWVudDtcbiAgICBjb25zdHJ1Y3RvcihkYXRhOiBDb21tdW5pdHlDYXJkc0RhdGEpIHtcbiAgICAgICAgc3VwZXIoZGF0YSk7XG4gICAgICAgIHRoaXMuY29udGFpbmVyID0gY3JlYXRlU1ZHRWxlbWVudDxTVkdHRWxlbWVudD4oXCJnXCIpO1xuXG4gICAgICAgIGRhdGEuZm9yRWFjaCgoY2FyZCwgaSkgPT4ge1xuICAgICAgICAgICAgY29uc3QgZHggPSAoaSAtIDIpICogKGNhcmRXaWR0aCArIGNhcmRQYWRkaW5nWCk7XG4gICAgICAgICAgICBjb25zdCBjYXJkRWxlbWVudCA9IG5ldyBDYXJkV2lkZ2V0KGNhcmQpO1xuICAgICAgICAgICAgY2FyZEVsZW1lbnQudHJhbnNmb3JtKHt0cmFuc2xhdGU6IHt4OiBkeH19KTtcbiAgICAgICAgICAgIHRoaXMuY29udGFpbmVyLmFwcGVuZENoaWxkKGNhcmRFbGVtZW50LmNvbnRhaW5lcik7XG4gICAgICAgIH0pO1xuICAgIH1cbn1cbiIsImNvbnN0IHNpemUgPSAxMDAwO1xuXG4vLyB2aWV3Qm94IGNvb3Jkc1xuY29uc3QgeCA9IC1zaXplIC8gMjtcbmNvbnN0IHkgPSAtc2l6ZSAvIDI7XG5jb25zdCB3aWR0aCA9IHNpemU7XG5jb25zdCBoZWlnaHQgPSBzaXplXG5leHBvcnQgY29uc3Qgdmlld0JveCA9IGAke3h9ICR7eX0gJHt3aWR0aH0gJHtoZWlnaHR9YDtcblxuZXhwb3J0IGNvbnN0IHRhYmxlUmFkaXVzID0gc2l6ZSAqIDEgLyA0O1xuZXhwb3J0IGNvbnN0IGNhcmRXaWR0aCA9IHRhYmxlUmFkaXVzIC8gNDtcbmV4cG9ydCBjb25zdCBjYXJkSGVpZ2h0ID0gY2FyZFdpZHRoICogNCAvIDM7XG5leHBvcnQgY29uc3QgY2FyZFBhZGRpbmdYID0gY2FyZFdpZHRoIC8gODtcblxuIiwiaW1wb3J0IHtjcmVhdGVTVkdFbGVtZW50LCBTVkdXaWRnZXR9IGZyb20gXCIuLi9TVkdcIjtcblxuaW1wb3J0IHtCdXR0b25XaWRnZXR9IGZyb20gXCIuL0J1dHRvblwiO1xuXG50eXBlIEVtcHR5U2VhdERhdGEgPSB7XG4gICAgaW5kZXg6IG51bWJlcixcbiAgICBjYW5TaXQ6IGJvb2xlYW4sXG59XG5cbmV4cG9ydCBjbGFzcyBFbXB0eVNlYXRXaWRnZXQgZXh0ZW5kcyBTVkdXaWRnZXQ8RW1wdHlTZWF0RGF0YT4ge1xuICAgIHB1YmxpYyBjb250YWluZXI6IFNWR0dFbGVtZW50O1xuICAgIHB1YmxpYyB0ZXh0OiBTVkdUZXh0RWxlbWVudCA9IG51bGw7XG4gICAgcHVibGljIHNpdEJ1dHRvbjogQnV0dG9uV2lkZ2V0ID0gbnVsbDtcbiAgICBjb25zdHJ1Y3RvcihkYXRhOiBFbXB0eVNlYXREYXRhLFxuICAgICAgICAgICAgICAgIG9uQ2xpY2s6IChuYW1lOiBzdHJpbmcsIHZhbHVlOiBudW1iZXIpID0+IHZvaWQpIHtcbiAgICAgICAgc3VwZXIoZGF0YSk7XG4gICAgICAgIHRoaXMuY29udGFpbmVyID0gY3JlYXRlU1ZHRWxlbWVudDxTVkdHRWxlbWVudD4oXCJnXCIpO1xuXG4gICAgICAgIGlmIChkYXRhLmNhblNpdCkge1xuICAgICAgICAgICAgdGhpcy5zaXRCdXR0b24gPSBuZXcgQnV0dG9uV2lkZ2V0KFxuICAgICAgICAgICAgICAgIHtidXR0b25UZXh0OiBcInNpdFwifSxcbiAgICAgICAgICAgICAgICAvLyBDYWxsICpteSogY2FsbGJhY2ssIHVzaW5nIHRoZSAqQnV0dG9uJ3MqXG4gICAgICAgICAgICAgICAgLy8gbmFtZSwgYnV0ICpteSogaW5kZXhcbiAgICAgICAgICAgICAgICAobmFtZTogc3RyaW5nKSA9PiB7IG9uQ2xpY2sobmFtZSwgZGF0YS5pbmRleCk7IH0pO1xuICAgICAgICAgICAgdGhpcy5jb250YWluZXIuYXBwZW5kQ2hpbGQodGhpcy5zaXRCdXR0b24uY29udGFpbmVyKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMudGV4dCA9IGNyZWF0ZVNWR0VsZW1lbnQ8U1ZHVGV4dEVsZW1lbnQ+KFwidGV4dFwiLCB7XG4gICAgICAgICAgICAgICAgdGV4dENvbnRlbnQ6IFwiXFx1MjAxM1wiLCAvLyAmbmRhc2g7XG4gICAgICAgICAgICAgICAgY2xhc3NlczogW1wiY2FwdGlvblwiLCBcImNhcHRpb24tZW1wdHlcIl0sXG4gICAgICAgICAgICAgICAgYXR0cnM6IHt4OiAwLCB5OiAwfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB0aGlzLmNvbnRhaW5lci5hcHBlbmRDaGlsZCh0aGlzLnRleHQpO1xuICAgICAgICB9XG4gICAgfVxufVxuIiwiaW1wb3J0IHtjcmVhdGVTVkdFbGVtZW50LCBTVkdXaWRnZXR9IGZyb20gXCIuLi9TVkdcIjtcblxuaW1wb3J0IHtDYXJkRGF0YSwgQ2FyZFdpZGdldH0gZnJvbSBcIi4vQ2FyZFwiO1xuaW1wb3J0IHtjYXJkSGVpZ2h0LCBjYXJkUGFkZGluZ1gsIGNhcmRXaWR0aH0gZnJvbSBcIi4vQ29uc3RhbnRzXCI7XG5cbmV4cG9ydCB0eXBlIEhhbmREYXRhID0gQ2FyZERhdGFbXTtcblxuZXhwb3J0IGNsYXNzIEhhbmRXaWRnZXQgZXh0ZW5kcyBTVkdXaWRnZXQ8SGFuZERhdGE+IHtcbiAgICBwdWJsaWMgY29udGFpbmVyOiBTVkdHRWxlbWVudDtcbiAgICBwdWJsaWMgbGVmdDogQ2FyZFdpZGdldDtcbiAgICBwdWJsaWMgcmlnaHQ6IENhcmRXaWRnZXQ7XG4gICAgY29uc3RydWN0b3IoZGF0YTogSGFuZERhdGEpIHtcbiAgICAgICAgc3VwZXIoZGF0YSk7XG4gICAgICAgIHRoaXMuY29udGFpbmVyID0gY3JlYXRlU1ZHRWxlbWVudDxTVkdHRWxlbWVudD4oXCJnXCIpO1xuXG4gICAgICAgIGNvbnN0IG9mZnNldFggPSAoY2FyZFBhZGRpbmdYICsgY2FyZFdpZHRoKSAvIDI7XG5cbiAgICAgICAgdGhpcy5sZWZ0ID0gbmV3IENhcmRXaWRnZXQoZGF0YVswXSk7XG4gICAgICAgIHRoaXMubGVmdC50cmFuc2Zvcm0oe3RyYW5zbGF0ZToge3g6IC1vZmZzZXRYfX0pO1xuICAgICAgICB0aGlzLmNvbnRhaW5lci5hcHBlbmRDaGlsZCh0aGlzLmxlZnQuY29udGFpbmVyKTtcblxuICAgICAgICB0aGlzLnJpZ2h0ID0gbmV3IENhcmRXaWRnZXQoZGF0YVsxXSk7XG4gICAgICAgIHRoaXMucmlnaHQudHJhbnNmb3JtKHt0cmFuc2xhdGU6IHt4OiBvZmZzZXRYfX0pO1xuICAgICAgICB0aGlzLmNvbnRhaW5lci5hcHBlbmRDaGlsZCh0aGlzLnJpZ2h0LmNvbnRhaW5lcik7XG4gICAgfVxufVxuIiwiaW1wb3J0IHtjcmVhdGVTVkdFbGVtZW50LCBTVkdXaWRnZXR9IGZyb20gXCIuLi9TVkdcIjtcblxuZXhwb3J0IGludGVyZmFjZSBQb3REYXRhIHtcbiAgICBjb250cmlidXRpb25zOiBudW1iZXJbXTtcbn1cblxuZXhwb3J0IGNsYXNzIFBvdFdpZGdldCBleHRlbmRzIFNWR1dpZGdldDxQb3REYXRhPiB7XG4gICAgY29uc3RydWN0b3IoZGF0YTogUG90RGF0YSkge1xuICAgICAgICBzdXBlcihkYXRhKTtcbiAgICAgICAgdGhpcy5jb250YWluZXIgPVxuICAgICAgICAgICAgY3JlYXRlU1ZHRWxlbWVudDxTVkdUZXh0RWxlbWVudD4oXCJ0ZXh0XCIsIHtjbGFzc2VzOiBbXCJjYXB0aW9uXCJdfSk7XG4gICAgICAgIGNvbnN0IHN1bSA9XG4gICAgICAgICAgICBkYXRhLmNvbnRyaWJ1dGlvbnMucmVkdWNlKChhY2MsIGNvbnRyaWIpID0+IGFjYyArPSBjb250cmliLCAwKTtcbiAgICAgICAgdGhpcy5jb250YWluZXIudGV4dENvbnRlbnQgPSBzdW0udG9GaXhlZCgyKTtcbiAgICB9XG59XG5cbiIsImltcG9ydCB7Y3JlYXRlU1ZHRWxlbWVudCwgcmVtb3ZlQ2hpbGRyZW4sIFNWR1dpZGdldH0gZnJvbSBcIi4uL1NWR1wiO1xuXG5pbXBvcnQge1BvdERhdGEsIFBvdFdpZGdldH0gZnJvbSBcIi4vUG90XCI7XG5cbmV4cG9ydCB0eXBlIFBvdHNEYXRhID0gUG90RGF0YVtdO1xuXG5leHBvcnQgY2xhc3MgUG90c1dpZGdldCBleHRlbmRzIFNWR1dpZGdldDxQb3RzRGF0YT4ge1xuICAgIGNvbnN0cnVjdG9yKGRhdGE6IFBvdHNEYXRhKSB7XG4gICAgICAgIHN1cGVyKGRhdGEpO1xuICAgICAgICB0aGlzLmNvbnRhaW5lciA9IGNyZWF0ZVNWR0VsZW1lbnQ8U1ZHR0VsZW1lbnQ+KFwiZ1wiKTtcbiAgICAgICAgZGF0YS5mb3JFYWNoKChwb3QsIGkpID0+IHtcbiAgICAgICAgICAgIC8vIGRpc3RyaWJ1dGUgdGhlIHBvdHMgYXJvdW5kIHRoZSB5LWF4aXMgb2YgdGhlIHRhYmxlXG4gICAgICAgICAgICBjb25zdCBwYWRkaW5nID0gMTAwO1xuICAgICAgICAgICAgY29uc3Qgb2Zmc2V0WCA9ICgoZGF0YS5sZW5ndGggLSAxKSAvIDIgLSBpKSAqIHBhZGRpbmc7XG4gICAgICAgICAgICBjb25zdCBwb3RXaWRnZXQgPSBuZXcgUG90V2lkZ2V0KHBvdCk7XG4gICAgICAgICAgICBwb3RXaWRnZXQudHJhbnNmb3JtKHt0cmFuc2xhdGU6IHt4OiBvZmZzZXRYfX0pO1xuICAgICAgICAgICAgdGhpcy5jb250YWluZXIuYXBwZW5kQ2hpbGQocG90V2lkZ2V0LmNvbnRhaW5lcik7XG4gICAgICAgIH0pO1xuICAgIH1cbn1cbiIsImltcG9ydCB7Y3JlYXRlU1ZHRWxlbWVudCwgU1ZHV2lkZ2V0fSBmcm9tIFwiLi4vU1ZHXCI7XG5cbmltcG9ydCB7Q2FwdGlvbkRhdGEsIENhcHRpb25XaWRnZXR9IGZyb20gXCIuL0NhcHRpb25cIjtcbmltcG9ydCB7Y2FyZEhlaWdodH0gZnJvbSBcIi4vQ29uc3RhbnRzXCI7XG5pbXBvcnQge0hhbmREYXRhLCBIYW5kV2lkZ2V0fSBmcm9tIFwiLi9IYW5kXCI7XG5cbmV4cG9ydCB0eXBlIFNlYXREYXRhID0ge1xuICAgIGNhcHRpb246IENhcHRpb25EYXRhLFxuICAgIGhhbmQ6IEhhbmREYXRhLFxufTtcblxuZXhwb3J0IGNsYXNzIFNlYXRXaWRnZXQgZXh0ZW5kcyBTVkdXaWRnZXQ8U2VhdERhdGE+IHtcbiAgICBwdWJsaWMgY29udGFpbmVyOiBTVkdHRWxlbWVudDtcbiAgICBwdWJsaWMgY2FwdGlvbjogQ2FwdGlvbldpZGdldDtcbiAgICBwdWJsaWMgaGFuZDogSGFuZFdpZGdldDtcbiAgICBjb25zdHJ1Y3RvcihkYXRhOiBTZWF0RGF0YSkge1xuICAgICAgICBzdXBlcihkYXRhKTtcbiAgICAgICAgdGhpcy5jb250YWluZXIgPSBjcmVhdGVTVkdFbGVtZW50PFNWR0dFbGVtZW50PihcImdcIik7XG5cbiAgICAgICAgdGhpcy5jYXB0aW9uID0gbmV3IENhcHRpb25XaWRnZXQoZGF0YS5jYXB0aW9uKTtcbiAgICAgICAgdGhpcy5jb250YWluZXIuYXBwZW5kQ2hpbGQodGhpcy5jYXB0aW9uLmNvbnRhaW5lcik7XG5cbiAgICAgICAgaWYgKGRhdGEuaGFuZCAhPSBudWxsKSB7XG4gICAgICAgICAgICBjb25zdCBvZmZzZXRZID0gY2FyZEhlaWdodCAqIDMgLyA3O1xuICAgICAgICAgICAgdGhpcy5jYXB0aW9uLnRyYW5zZm9ybSh7dHJhbnNsYXRlOiB7eTogLW9mZnNldFl9fSk7XG4gICAgICAgICAgICB0aGlzLmhhbmQgPSBuZXcgSGFuZFdpZGdldChkYXRhLmhhbmQpO1xuICAgICAgICAgICAgdGhpcy5oYW5kLnRyYW5zZm9ybSh7dHJhbnNsYXRlOiB7eTogb2Zmc2V0WX19KTtcbiAgICAgICAgICAgIHRoaXMuY29udGFpbmVyLmFwcGVuZENoaWxkKHRoaXMuaGFuZC5jb250YWluZXIpO1xuICAgICAgICB9XG4gICAgfVxufVxuIiwiaW1wb3J0IHtjcmVhdGVTVkdFbGVtZW50LCByZW1vdmVDaGlsZHJlbiwgU1ZHV2lkZ2V0fSBmcm9tIFwiLi4vU1ZHXCI7XG5cbmltcG9ydCB7dGFibGVSYWRpdXN9IGZyb20gXCIuL0NvbnN0YW50c1wiO1xuaW1wb3J0IHtFbXB0eVNlYXRXaWRnZXR9IGZyb20gXCIuL0VtcHR5U2VhdFwiO1xuaW1wb3J0IHtTZWF0RGF0YSwgU2VhdFdpZGdldH0gZnJvbSBcIi4vU2VhdFwiO1xuXG4vLyBSZXR1cm5zIHRoZSAoeCwgeSkgY29vcmRpbmF0ZXMgb2YgdGhlIHBvaW50IG9idGFpbmVkIGJ5IHJvdGF0aW5nICgwLCByYWRpdXMpXG4vLyBjbG9ja3dpc2VbMV0gYXJvdW5kIHRoZSBjaXJjbGUgb2YgcmFkaXVzIChyYWRpdXMpIGJ5ICgyz4AgKiBpbmRleCAvIG5QbGF5ZXJzKS5cbi8vXG4vLyBbMV0gQ2xvY2t3aXNlIGIvYyBpbiBTVkctd29ybGQsIGxhcmdlciB5IG1lYW5zIGZhcnRoZXIgZnJvbSB0aGUgdG9wIVxuZnVuY3Rpb24gcm90YXRlZFBvc2l0aW9uKGluZGV4OiBudW1iZXIsIG5QbGF5ZXJzOiBudW1iZXIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgcmFkaXVzOiBudW1iZXIpOiBbbnVtYmVyLCBudW1iZXJdIHtcbiAgICBjb25zdCB0aGV0YSA9IGluZGV4ICogMiAqIE1hdGguUEkgLyBuUGxheWVycyAtIE1hdGguUEkgLyAyO1xuICAgIGNvbnN0IHggPSAxLjMgKiBNYXRoLmNvcyh0aGV0YSkgKiByYWRpdXM7XG4gICAgY29uc3QgeSA9IE1hdGguc2luKHRoZXRhKSAqIHJhZGl1cztcbiAgICByZXR1cm4gW3gsIHldO1xufVxuXG4vLyBTaW1wbGUgbGluZWFyIGZ1bmN0aW9uIHRoYXQgZ2l2ZXMgc21hbGxlciBudW1iZXJzIGFzIG5QbGF5ZXJzIGluY3JlYXNlcy5cbi8vIFRoaXMgaXMgbWVhbnQgdG8gYmUgdXNlZCBzbyB0aGF0IHJvb21zIHdpdGggbG90cyBvZiBwbGF5ZXJzIGRvbid0IGdldCB0b29cbi8vIGNyb3dkZWQuXG5mdW5jdGlvbiBzY2FsZUZvcihuUGxheWVyczogbnVtYmVyKTogbnVtYmVyIHsgcmV0dXJuIDEuMzUgLSBuUGxheWVycyAqIDAuMDU7IH1cblxudHlwZSBCYXNlU2VhdFdpZGdldCA9IEVtcHR5U2VhdFdpZGdldHxTZWF0V2lkZ2V0O1xuXG5leHBvcnQgdHlwZSBCYXNlU2VhdERhdGEgPSB7XG4gICAgY2FuU2l0OiBib29sZWFuLFxuICAgIGlzQXZhaWxhYmxlOiBib29sZWFuLFxuICAgIHNlYXQ6IFNlYXREYXRhfG51bGwsXG59XG5cbmV4cG9ydCB0eXBlIFNlYXRzRGF0YSA9IHtcbiAgICBzZWF0czogQmFzZVNlYXREYXRhW10sXG59XG5cbmV4cG9ydCBjbGFzcyBTZWF0c1dpZGdldCBleHRlbmRzIFNWR1dpZGdldDxTZWF0c0RhdGE+IHtcbiAgICBwdWJsaWMgY29udGFpbmVyOiBTVkdHRWxlbWVudDtcbiAgICBjb25zdHJ1Y3RvcihkYXRhOiBTZWF0c0RhdGEsXG4gICAgICAgICAgICAgICAgb25DbGljazogKG5hbWU6IHN0cmluZywgdmFsdWU6IG51bWJlcikgPT4gdm9pZCkge1xuICAgICAgICBzdXBlcihkYXRhKTtcbiAgICAgICAgdGhpcy5jb250YWluZXIgPSBjcmVhdGVTVkdFbGVtZW50PFNWR0dFbGVtZW50PihcImdcIik7XG4gICAgICAgIGRhdGEuc2VhdHMuZm9yRWFjaCgoc2VhdERhdGEsIGkpID0+IHtcbiAgICAgICAgICAgIC8vIE5COiBBZGp1c3RlZCB0YWJsZVJhZGl1cyBzbyB0aGF0IHBsYXllciBpc24ndCBleGFjdGx5IG9uIHRhYmxlXG4gICAgICAgICAgICAvLyBlZGdlXG4gICAgICAgICAgICBjb25zdCByYWRpdXMgPSB0YWJsZVJhZGl1cyAqIDEuMjU7XG4gICAgICAgICAgICBjb25zdCBbeCwgeV0gPSByb3RhdGVkUG9zaXRpb24oaSwgZGF0YS5zZWF0cy5sZW5ndGgsIHJhZGl1cyk7XG4gICAgICAgICAgICBjb25zdCBzY2FsZSA9IHNjYWxlRm9yKGRhdGEuc2VhdHMubGVuZ3RoKTtcbiAgICAgICAgICAgIGxldCBzZWF0V2lkZ2V0OiBCYXNlU2VhdFdpZGdldDtcbiAgICAgICAgICAgIGlmIChzZWF0RGF0YS5pc0F2YWlsYWJsZSkge1xuICAgICAgICAgICAgICAgIHNlYXRXaWRnZXQgPSBuZXcgRW1wdHlTZWF0V2lkZ2V0KFxuICAgICAgICAgICAgICAgICAgICB7aW5kZXg6IGksIGNhblNpdDogc2VhdERhdGEuY2FuU2l0fSwgb25DbGljayk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHNlYXRXaWRnZXQgPSBuZXcgU2VhdFdpZGdldChzZWF0RGF0YS5zZWF0KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHNlYXRXaWRnZXQudHJhbnNmb3JtKHt0cmFuc2xhdGU6IHt4LCB5fSwgc2NhbGV9KTtcbiAgICAgICAgICAgIHRoaXMuY29udGFpbmVyLmFwcGVuZENoaWxkKHNlYXRXaWRnZXQuY29udGFpbmVyKTtcbiAgICAgICAgfSk7XG4gICAgfVxufVxuIiwiaW1wb3J0IHtjcmVhdGVTVkdFbGVtZW50LCBTVkdXaWRnZXR9IGZyb20gXCIuLi9TVkdcIjtcblxuaW1wb3J0IHtCZXR0aW5nRGF0YSwgQmV0dGluZ1dpZGdldH0gZnJvbSBcIi4vQmV0dGluZ1wiO1xuaW1wb3J0IHtCdXR0b25XaWRnZXR9IGZyb20gXCIuL0J1dHRvblwiO1xuaW1wb3J0IHtDb21tdW5pdHlDYXJkc0RhdGEsIENvbW11bml0eUNhcmRzV2lkZ2V0fSBmcm9tIFwiLi9Db21tdW5pdHlDYXJkc1wiO1xuaW1wb3J0IHt0YWJsZVJhZGl1c30gZnJvbSBcIi4vQ29uc3RhbnRzXCI7XG5pbXBvcnQge1BvdHNEYXRhLCBQb3RzV2lkZ2V0fSBmcm9tIFwiLi9Qb3RzXCI7XG5pbXBvcnQge1NlYXRzRGF0YSwgU2VhdHNXaWRnZXR9IGZyb20gXCIuL1NlYXRzXCI7XG5cbmV4cG9ydCB0eXBlIFRhYmxlRGF0YSA9IHtcbiAgICBuUGxheWVyczogbnVtYmVyOyBjb21tdW5pdHlDYXJkczogQ29tbXVuaXR5Q2FyZHNEYXRhO1xuICAgIHNob3dTdGFydEJ1dHRvbjogYm9vbGVhbjtcbiAgICBwb3RzOiBQb3RzRGF0YTtcbiAgICBiZXR0aW5nOiBCZXR0aW5nRGF0YTtcbn0mU2VhdHNEYXRhO1xuXG5leHBvcnQgY2xhc3MgVGFibGVXaWRnZXQgZXh0ZW5kcyBTVkdXaWRnZXQ8VGFibGVEYXRhPiB7XG4gICAgcHVibGljIGNvbnRhaW5lcjogU1ZHR0VsZW1lbnQ7XG4gICAgcHVibGljIGJhY2tncm91bmQ6IFNWR0VsbGlwc2VFbGVtZW50O1xuICAgIHB1YmxpYyBjb21tdW5pdHlDYXJkczogQ29tbXVuaXR5Q2FyZHNXaWRnZXQgPSBudWxsO1xuICAgIHB1YmxpYyBwb3RzOiBQb3RzV2lkZ2V0ID0gbnVsbDtcbiAgICBwdWJsaWMgc3RhcnRCdXR0b246IEJ1dHRvbldpZGdldCA9IG51bGw7XG4gICAgcHVibGljIHNlYXRzOiBTZWF0c1dpZGdldDtcbiAgICBwdWJsaWMgYmV0dGluZzogQmV0dGluZ1dpZGdldCA9IG51bGw7XG4gICAgY29uc3RydWN0b3IoZGF0YTogVGFibGVEYXRhLFxuICAgICAgICAgICAgICAgIG9uQ2xpY2s6IChuYW1lOiBzdHJpbmcsIHZhbHVlPzogbnVtYmVyKSA9PiB2b2lkKSB7XG4gICAgICAgIHN1cGVyKGRhdGEpO1xuICAgICAgICB0aGlzLmNvbnRhaW5lciA9IGNyZWF0ZVNWR0VsZW1lbnQ8U1ZHR0VsZW1lbnQ+KFwiZ1wiKTtcblxuICAgICAgICB0aGlzLmJhY2tncm91bmQgPSBjcmVhdGVTVkdFbGVtZW50PFNWR0VsbGlwc2VFbGVtZW50PihcbiAgICAgICAgICAgIFwiZWxsaXBzZVwiLFxuICAgICAgICAgICAge2F0dHJzOiB7aWQ6IFwidGFibGVcIiwgcng6IDEuMyAqIHRhYmxlUmFkaXVzLCByeTogdGFibGVSYWRpdXN9fSk7XG4gICAgICAgIHRoaXMuY29udGFpbmVyLmFwcGVuZENoaWxkKHRoaXMuYmFja2dyb3VuZCk7XG5cbiAgICAgICAgdGhpcy5zZWF0cyA9IG5ldyBTZWF0c1dpZGdldCh7c2VhdHM6IGRhdGEuc2VhdHN9LCBvbkNsaWNrKTtcbiAgICAgICAgdGhpcy5jb250YWluZXIuYXBwZW5kQ2hpbGQodGhpcy5zZWF0cy5jb250YWluZXIpO1xuXG4gICAgICAgIGlmIChkYXRhLnNob3dTdGFydEJ1dHRvbikge1xuICAgICAgICAgICAgdGhpcy5zdGFydEJ1dHRvbiA9IG5ldyBCdXR0b25XaWRnZXQoe2J1dHRvblRleHQ6IFwic3RhcnRcIn0sIG9uQ2xpY2spO1xuICAgICAgICAgICAgdGhpcy5jb250YWluZXIuYXBwZW5kQ2hpbGQodGhpcy5zdGFydEJ1dHRvbi5jb250YWluZXIpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaWYgKGRhdGEuY29tbXVuaXR5Q2FyZHMpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmNvbW11bml0eUNhcmRzID1cbiAgICAgICAgICAgICAgICAgICAgbmV3IENvbW11bml0eUNhcmRzV2lkZ2V0KGRhdGEuY29tbXVuaXR5Q2FyZHMpO1xuICAgICAgICAgICAgICAgIHRoaXMuY29tbXVuaXR5Q2FyZHMudHJhbnNmb3JtKFxuICAgICAgICAgICAgICAgICAgICB7dHJhbnNsYXRlOiB7eTogLXRhYmxlUmFkaXVzICogMC4xfX0pO1xuICAgICAgICAgICAgICAgIHRoaXMuY29udGFpbmVyLmFwcGVuZENoaWxkKHRoaXMuY29tbXVuaXR5Q2FyZHMuY29udGFpbmVyKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKGRhdGEucG90cykge1xuICAgICAgICAgICAgICAgIHRoaXMucG90cyA9IG5ldyBQb3RzV2lkZ2V0KGRhdGEucG90cyk7XG4gICAgICAgICAgICAgICAgdGhpcy5wb3RzLnRyYW5zZm9ybSh7dHJhbnNsYXRlOiB7eTogdGFibGVSYWRpdXMgKiAwLjN9fSk7XG4gICAgICAgICAgICAgICAgdGhpcy5jb250YWluZXIuYXBwZW5kQ2hpbGQodGhpcy5wb3RzLmNvbnRhaW5lcik7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChkYXRhLmJldHRpbmcpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmJldHRpbmcgPSBuZXcgQmV0dGluZ1dpZGdldChkYXRhLmJldHRpbmcsIG9uQ2xpY2spO1xuICAgICAgICAgICAgICAgIHRoaXMuYmV0dGluZy50cmFuc2Zvcm0oe3RyYW5zbGF0ZToge3k6IHRhYmxlUmFkaXVzICogMS43fX0pO1xuICAgICAgICAgICAgICAgIHRoaXMuY29udGFpbmVyLmFwcGVuZCh0aGlzLmJldHRpbmcuY29udGFpbmVyKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbn1cbiIsImV4cG9ydCBjb25zdCBTVkdfTlMgPSBcImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCI7XG5cbmludGVyZmFjZSBUcmFuc2Zvcm1hdGlvbiB7XG4gICAgdHJhbnNsYXRlPzoge3g/OiBudW1iZXIsIHk/OiBudW1iZXJ9O1xuICAgIHNjYWxlPzogbnVtYmVyO1xufVxuXG5mdW5jdGlvbiB0cmFuc2Zvcm0oZWxlOiBTVkdFbGVtZW50LCB0cmFuc2Zvcm1hdGlvbjogVHJhbnNmb3JtYXRpb24pOiB2b2lkIHtcbiAgICBjb25zdCBkeCA9IHRyYW5zZm9ybWF0aW9uID8udHJhbnNsYXRlID8ueCB8fCAwO1xuICAgIGNvbnN0IGR5ID0gdHJhbnNmb3JtYXRpb24gPy50cmFuc2xhdGUgPy55IHx8IDA7XG4gICAgY29uc3Qgc2NhbGUgPSB0cmFuc2Zvcm1hdGlvbiA/LnNjYWxlIHx8IDEuMDtcbiAgICBlbGUuc2V0QXR0cmlidXRlKFwidHJhbnNmb3JtXCIsIGB0cmFuc2xhdGUoJHtkeH0sJHtkeX0pIHNjYWxlKCR7c2NhbGV9KWApXG59XG5cbmV4cG9ydCBhYnN0cmFjdCBjbGFzcyBTVkdXaWRnZXQ8VD4ge1xuICAgIHB1YmxpYyBjb250YWluZXI6IFNWR0VsZW1lbnQ7XG4gICAgY29uc3RydWN0b3IocHVibGljIGRhdGE6IFQpIHt9XG4gICAgdHJhbnNmb3JtKHRyYW5zZm9ybWF0aW9uOiBUcmFuc2Zvcm1hdGlvbikge1xuICAgICAgICB0cmFuc2Zvcm0odGhpcy5jb250YWluZXIsIHRyYW5zZm9ybWF0aW9uKTtcbiAgICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVTVkdFbGVtZW50PFQgZXh0ZW5kcyBTVkdFbGVtZW50PihcbiAgICB0YWdOYW1lOiBzdHJpbmcsIHByb3BzPzoge1xuICAgICAgICBjbGFzc2VzPzogc3RyaW5nW10sXG4gICAgICAgIGF0dHJzPzoge1trZXk6IHN0cmluZ106IGFueTt9LFxuICAgICAgICB0cmFuc2Zvcm0/OiBUcmFuc2Zvcm1hdGlvbixcbiAgICAgICAgdGV4dENvbnRlbnQ/OiBzdHJpbmcsXG4gICAgICAgIGNoaWxkcmVuPzogU1ZHRWxlbWVudFtdLFxuICAgIH0pOiBUIHtcbiAgICBjb25zdCBlbGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMoU1ZHX05TLCB0YWdOYW1lKTtcbiAgICBpZiAocHJvcHMpIHtcbiAgICAgICAgaWYgKHByb3BzLmNsYXNzZXMpIHtcbiAgICAgICAgICAgIHByb3BzLmNsYXNzZXMuZmlsdGVyKGNsYXp6ID0+ICEhY2xhenopXG4gICAgICAgICAgICAgICAgLmZvckVhY2goY2xhenogPT4gZWxlLmNsYXNzTGlzdC5hZGQoY2xhenopKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAocHJvcHMuYXR0cnMpIHtcbiAgICAgICAgICAgIE9iamVjdC5lbnRyaWVzKHByb3BzLmF0dHJzKS5mb3JFYWNoKChba2V5LCB2YWx1ZV0pID0+IHtcbiAgICAgICAgICAgICAgICBlbGUuc2V0QXR0cmlidXRlKGtleSwgdmFsdWUudG9TdHJpbmcoKSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICBpZiAocHJvcHMudHJhbnNmb3JtKSB7XG4gICAgICAgICAgICB0cmFuc2Zvcm0oZWxlLCBwcm9wcy50cmFuc2Zvcm0pO1xuICAgICAgICB9XG4gICAgICAgIGlmIChwcm9wcy50ZXh0Q29udGVudCkge1xuICAgICAgICAgICAgZWxlLnRleHRDb250ZW50ID0gcHJvcHMudGV4dENvbnRlbnQ7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHByb3BzLmNoaWxkcmVuKSB7XG4gICAgICAgICAgICBwcm9wcy5jaGlsZHJlbi5mb3JFYWNoKGNoaWxkID0+IHsgZWxlLmFwcGVuZENoaWxkKGNoaWxkKTsgfSk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGVsZSBhcyBUO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gcmVtb3ZlQ2hpbGRyZW4oZWxlOiBFbGVtZW50KSB7XG4gICAgd2hpbGUgKGVsZS5maXJzdENoaWxkKVxuICAgICAgICBlbGUucmVtb3ZlQ2hpbGQoZWxlLmxhc3RDaGlsZCk7XG59XG4iLCJpbXBvcnQge0Zsb2F0SW5wdXRQYXJhbXMsIEZsb2F0SW5wdXRXaWRnZXR9IGZyb20gXCIuL0lucHV0XCI7XG5pbXBvcnQge2NyZWF0ZVNWR0VsZW1lbnQsIFNWR1dpZGdldH0gZnJvbSBcIi4vU1ZHXCI7XG5cbmV4cG9ydCB0eXBlIEVtYmVkZGVkRmxvYXRJbnB1dERhdGEgPSBGbG9hdElucHV0UGFyYW1zO1xuXG5leHBvcnQgY2xhc3MgRW1iZWRkZWRGbG9hdElucHV0V2lkZ2V0IGV4dGVuZHNcbiAgICBTVkdXaWRnZXQ8RW1iZWRkZWRGbG9hdElucHV0RGF0YT4ge1xuICAgIHB1YmxpYyBmbG9hdElucHV0V2lkZ2V0OiBGbG9hdElucHV0V2lkZ2V0O1xuICAgIGNvbnN0cnVjdG9yKGRhdGE6IEVtYmVkZGVkRmxvYXRJbnB1dERhdGEpIHtcbiAgICAgICAgc3VwZXIoZGF0YSk7XG4gICAgICAgIHRoaXMuY29udGFpbmVyID0gY3JlYXRlU1ZHRWxlbWVudDxTVkdGb3JlaWduT2JqZWN0RWxlbWVudD4oXG4gICAgICAgICAgICBcImZvcmVpZ25PYmplY3RcIiwge2NsYXNzZXM6IFtcImNhcHRpb25cIiwgXCJ3cmFwcGVkLWlucHV0XCJdfSk7XG5cbiAgICAgICAgdGhpcy5mbG9hdElucHV0V2lkZ2V0ID0gbmV3IEZsb2F0SW5wdXRXaWRnZXQoZGF0YSk7XG4gICAgICAgIHRoaXMuY29udGFpbmVyLmFwcGVuZENoaWxkKHRoaXMuZmxvYXRJbnB1dFdpZGdldC5jb250YWluZXIpO1xuICAgIH1cbiAgICBwdWJsaWMgdmFsdWUoKTogbnVtYmVyIHsgcmV0dXJuIHRoaXMuZmxvYXRJbnB1dFdpZGdldC52YWx1ZSgpOyB9XG59XG4iLCJpbXBvcnQge3NodWZmbGVkfSBmcm9tIFwiLi4vVXRpbHNcIjtcblxuZXhwb3J0IGVudW0gU3VpdCB7XG4gICAgQ2x1YnMsXG4gICAgRGlhbW9uZHMsXG4gICAgSGVhcnRzLFxuICAgIFNwYWRlcyxcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGZvckVhY2hTdWl0KGNhbGxiYWNrOiAoXzogU3VpdCkgPT4gdm9pZCk6IHZvaWQge1xuICAgIGZvciAobGV0IHN1aXQgPSBTdWl0LkNsdWJzOyBzdWl0IDw9IFN1aXQuU3BhZGVzOyArK3N1aXQpIHtcbiAgICAgICAgY2FsbGJhY2soc3VpdCk7XG4gICAgfVxufVxuXG5leHBvcnQgZW51bSBSYW5rIHtcbiAgICBUd28gPSAyLFxuICAgIFRocmVlLFxuICAgIEZvdXIsXG4gICAgRml2ZSxcbiAgICBTaXgsXG4gICAgU2V2ZW4sXG4gICAgRWlnaHQsXG4gICAgTmluZSxcbiAgICBUZW4sXG4gICAgSmFjayxcbiAgICBRdWVlbixcbiAgICBLaW5nLFxuICAgIEFjZSxcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGZvckVhY2hSYW5rKGNhbGxiYWNrOiAoXzogUmFuaykgPT4gdm9pZCk6IHZvaWQge1xuICAgIGZvciAobGV0IHJhbmsgPSBSYW5rLlR3bzsgcmFuayA8PSBSYW5rLkFjZTsgKytyYW5rKSB7XG4gICAgICAgIGNhbGxiYWNrKHJhbmspO1xuICAgIH1cbn1cblxuZXhwb3J0IGludGVyZmFjZSBDYXJkIHtcbiAgICBzdWl0OiBTdWl0O1xuICAgIHJhbms6IFJhbms7XG59XG47XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRTaHVmZmxlZERlY2soKTogQ2FyZFtdIHtcbiAgICBsZXQgY2FyZHM6IENhcmRbXSA9IFtdO1xuICAgIGZvckVhY2hTdWl0KFxuICAgICAgICBzdWl0ID0+IHsgZm9yRWFjaFJhbmsocmFuayA9PiB7IGNhcmRzLnB1c2goe3N1aXQ6IHN1aXQsIHJhbmt9KTsgfSk7IH0pO1xuICAgIHJldHVybiBzaHVmZmxlZChjYXJkcyk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBjaGFyRm9yU3VpdChzdWl0OiBTdWl0KTogc3RyaW5nIHtcbiAgICBzd2l0Y2ggKHN1aXQpIHtcbiAgICBjYXNlIFN1aXQuQ2x1YnM6XG4gICAgICAgIHJldHVybiBcIlxcdTI2NjNcIjtcbiAgICBjYXNlIFN1aXQuRGlhbW9uZHM6XG4gICAgICAgIHJldHVybiBcIlxcdTI2NjZcIjtcbiAgICBjYXNlIFN1aXQuSGVhcnRzOlxuICAgICAgICByZXR1cm4gXCJcXHUyNjY1XCI7XG4gICAgY2FzZSBTdWl0LlNwYWRlczpcbiAgICAgICAgcmV0dXJuIFwiXFx1MjY2MFwiO1xuICAgIH1cbiAgICByZXR1cm4gbnVsbDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGRpc3BsYXlOYW1lRm9yU3VpdChzdWl0OiBTdWl0KTogc3RyaW5nIHtcbiAgICBzd2l0Y2ggKHN1aXQpIHtcbiAgICBjYXNlIFN1aXQuQ2x1YnM6XG4gICAgICAgIHJldHVybiBcImNsdWJzXCI7XG4gICAgY2FzZSBTdWl0LkRpYW1vbmRzOlxuICAgICAgICByZXR1cm4gXCJkaWFtb25kc1wiO1xuICAgIGNhc2UgU3VpdC5IZWFydHM6XG4gICAgICAgIHJldHVybiBcImhlYXJ0c1wiO1xuICAgIGNhc2UgU3VpdC5TcGFkZXM6XG4gICAgICAgIHJldHVybiBcInNwYWRlc1wiO1xuICAgIH1cbiAgICByZXR1cm4gbnVsbDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGNoYXJGb3JSYW5rKHJhbms6IFJhbmspOiBzdHJpbmcge1xuICAgIGlmICghcmFuaylcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgc3dpdGNoIChyYW5rKSB7XG4gICAgY2FzZSBSYW5rLkphY2s6XG4gICAgICAgIHJldHVybiBcIkpcIjtcbiAgICBjYXNlIFJhbmsuUXVlZW46XG4gICAgICAgIHJldHVybiBcIlFcIjtcbiAgICBjYXNlIFJhbmsuS2luZzpcbiAgICAgICAgcmV0dXJuIFwiS1wiO1xuICAgIGNhc2UgUmFuay5BY2U6XG4gICAgICAgIHJldHVybiBcIkFcIjtcbiAgICBkZWZhdWx0OlxuICAgICAgICByZXR1cm4gcmFuay50b1N0cmluZygpO1xuICAgIH1cbn1cbiIsIi8vIEltcGxlbWVudGF0aW9uIG9mIEZpc2hlci1ZYXRlcyAvIEtudXRoIHNodWZmbGUuICBTaHVmZmxlcyBhbiBhcnJheSBpbi1wbGFjZS5cbmV4cG9ydCBmdW5jdGlvbiBzaHVmZmxlZDxUPihhcnI6IFRbXSk6IFRbXSB7XG4gICAgZm9yIChsZXQgaSA9IGFyci5sZW5ndGg7IGkgPiAwOykge1xuICAgICAgICBsZXQgaiA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIGkpO1xuICAgICAgICAtLWk7XG4gICAgICAgIGxldCB0bXAgPSBhcnJbaV07XG4gICAgICAgIGFycltpXSA9IGFycltqXTtcbiAgICAgICAgYXJyW2pdID0gdG1wO1xuICAgIH1cbiAgICByZXR1cm4gYXJyO1xufVxuXG4vLyBJbXBsZW1lbnRhdGlvbiBvZiBQeXRob24ncyB6aXAoKSBidWlsdGluIGZvciB0d28gc2VxdWVuY2VzIHRoYXQgcmV0dXJucyBhXG4vLyBsaXN0IG9mIHR1cGxlcywgd2hlcmUgdGhlIGktdGggZWxlbWVudCBpcyB0aGUgaS10aCBlbGVtZW50IGZyb20gZWFjaCBvZiB0aGVcbi8vIGlucHV0IHNlcW4ncy5cbi8vXG4vLyBOQjogUHl0aG9uJ3MgaW1wbGVtZW50YXRpb24gY2FuIHppcCBhbiBhcmJpdHJhcnkgbnVtYmVyIG9mIHNlcXVlbmNlcywgd2hlcmVhc1xuLy8gdGhpcyBvbmx5IHN1cHBvcnRzIHR3byFcbmV4cG9ydCBmdW5jdGlvbiB6aXA8VCwgVT4odHM6IFRbXSwgdXM6IFVbXSk6IFtULCBVXVtdIHtcbiAgICBsZXQgcmV0OiBbVCwgVV1bXSA9IFtdO1xuICAgIGNvbnN0IGxlbiA9IE1hdGgubWluKHRzLmxlbmd0aCwgdXMubGVuZ3RoKTtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGxlbjsgKytpKVxuICAgICAgICByZXQucHVzaChbdHNbaV0sIHVzW2ldXSk7XG4gICAgcmV0dXJuIHJldDtcbn1cblxuLy8gVGFrZSBhbiBhcnJheSBhbmQgcmV0dXJuIGFuIGFycmF5IG9mIGFycmF5cywgd2hlcmUgZWFjaCBzdWJhcnJheSBjb250YWluc1xuLy8gb25seSBlbGVtZW50cyB0aGF0IFwiY29tcGFyZVwiIGVxdWFsLiAgVGhlIHN1YmFycmF5cyBhcmUgYWxzbyBndWFyYW50ZWVkIHRvIGJlXG4vLyBvcmRlcmVkIGJ5IHRoZSBjb21wYXJhdG9yLlxuLy9cbi8vIE5COiBUaGUgY29tcGFyYXRvciBzaG91bGQgYmUgY29tbXV0YXRpdmUhXG5leHBvcnQgZnVuY3Rpb24gc29ydEludG9UaWVyczxUPih0czogVFtdLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29tcGFyYXRvcjogKHQwOiBULCB0MTogVCkgPT4gbnVtYmVyKTogVFtdW10ge1xuICAgIGNvbnN0IHNvcnRlZFRzID0gdHMuc29ydChjb21wYXJhdG9yKTtcbiAgICBpZiAodHMubGVuZ3RoID09PSAwKVxuICAgICAgICByZXR1cm4gW107XG4gICAgbGV0IHRpZXJzID0gW107XG4gICAgbGV0IGxhc3RWYWx1ZSA9IHNvcnRlZFRzLnNoaWZ0KCk7XG4gICAgbGV0IHRpZXIgPSBbbGFzdFZhbHVlXTtcbiAgICBzb3J0ZWRUcy5mb3JFYWNoKHQgPT4ge1xuICAgICAgICBpZiAoY29tcGFyYXRvcihsYXN0VmFsdWUsIHQpID09PSAwKSB7XG4gICAgICAgICAgICB0aWVyLnB1c2godCk7XG4gICAgICAgICAgICBsYXN0VmFsdWUgPSB0O1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHRpZXJzLnB1c2godGllcik7XG4gICAgICAgIGxhc3RWYWx1ZSA9IHQ7XG4gICAgICAgIHRpZXIgPSBbbGFzdFZhbHVlXTtcbiAgICB9KTtcbiAgICB0aWVycy5wdXNoKHRpZXIpO1xuICAgIHJldHVybiB0aWVycztcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGNsYW1wKG1pbjogbnVtYmVyLCB2YWx1ZTogbnVtYmVyLCBtYXg6IG51bWJlcik6IG51bWJlciB7XG4gICAgcmV0dXJuIE1hdGgubWluKG1heCwgTWF0aC5tYXgobWluLCB2YWx1ZSkpO1xufVxuXG4vLyBQZXJtdXRlIChjeWNsZSB0aHJ1KSBlbGVtZW50cyByaWdodHdhcmRzIGluIGFuIGFycmF5IDxwZXJtdXRlQnk+IHRpbWVzLiAgRm9yXG4vLyBleGFtcGxlOlxuLy9cbi8vICAgcGVybXV0ZShbMSwgMiwgM10sIDEpOyAvLyB5aWVsZHMgWzMsIDEsIDJdXG4vL1xuZXhwb3J0IGZ1bmN0aW9uIHBlcm11dGU8VD4odHM6IFRbXSwgcGVybXV0ZUJ5OiBudW1iZXIpOiBUW10ge1xuICAgIGlmICh0cy5sZW5ndGggPT09IDApXG4gICAgICAgIHJldHVybiB0cztcbiAgICBsZXQgbm9ybWFsaXplZFBlcm11dGVCeSA9IHBlcm11dGVCeTtcbiAgICB3aGlsZSAobm9ybWFsaXplZFBlcm11dGVCeSA8IDApXG4gICAgICAgIG5vcm1hbGl6ZWRQZXJtdXRlQnkgKz0gdHMubGVuZ3RoO1xuICAgIHdoaWxlIChub3JtYWxpemVkUGVybXV0ZUJ5ID49IHRzLmxlbmd0aClcbiAgICAgICAgbm9ybWFsaXplZFBlcm11dGVCeSAtPSB0cy5sZW5ndGg7XG4gICAgbGV0IHJldCA9IG5ldyBBcnJheSh0cy5sZW5ndGgpO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdHMubGVuZ3RoOyArK2kpIHtcbiAgICAgICAgbGV0IHBlcm11dGVkSW5kZXggPSBpIC0gbm9ybWFsaXplZFBlcm11dGVCeTtcbiAgICAgICAgaWYgKHBlcm11dGVkSW5kZXggPCAwKVxuICAgICAgICAgICAgcGVybXV0ZWRJbmRleCArPSB0cy5sZW5ndGg7XG4gICAgICAgIHJldFtpXSA9IHRzW3Blcm11dGVkSW5kZXhdO1xuICAgIH1cbiAgICByZXR1cm4gcmV0O1xufVxuXG4vLyBSZXR1cm4gdGhlIGZpcnN0IGVsZW1lbnQgaW4gYW4gYXJyYXkgc2F0aXNmeWluZyA8cHJlZGljYXRlPiwgb3IgbnVsbCBpZiBub25lXG4vLyBtYXRjaC5cbmV4cG9ydCBmdW5jdGlvbiBmaW5kRmlyc3Q8VD4odHM6IFRbXSwgcHJlZGljYXRlOiAodDogVCwgaTogbnVtYmVyLCB0czogVFtdKSA9PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYm9vbGVhbik6IFR8bnVsbCB7XG4gICAgaWYgKCF0cylcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgcmV0dXJuIHRzLmZpbHRlcihwcmVkaWNhdGUpWzBdIHx8IG51bGw7XG59XG5cbi8vIEdldCBhIHJhbmRvbSBpbnRlZ2VyIGluIHRoZSByYW5nZSBbbWluLCBtYXgpIChpLmUuLCBub3QgcmlnaHQtaW5jbHVzaXZlKVxuZXhwb3J0IGZ1bmN0aW9uIHJhbmRvbUluUmFuZ2UobWluOiBudW1iZXIsIG1heDogbnVtYmVyKTogbnVtYmVyIHtcbiAgICByZXR1cm4gbWluICsgTWF0aC5mbG9vcigobWF4IC0gbWluKSAqIE1hdGgucmFuZG9tKCkpO1xufVxuIl0sInNvdXJjZVJvb3QiOiIifQ==