/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./toy-react.js":
/*!**********************!*\
  !*** ./toy-react.js ***!
  \**********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ React)
/* harmony export */ });
function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var RENDER_TO_DOM = Symbol["for"]('render to dom');

var ElementWrapper = /*#__PURE__*/function () {
  function ElementWrapper(type) {
    _classCallCheck(this, ElementWrapper);

    this.type = type;
    this.root = document.createElement(type);
  }

  _createClass(ElementWrapper, [{
    key: "setAttribute",
    value: function setAttribute(name, value) {
      if (name.match(/^on([\s\S]+)$/)) {
        if (typeof value !== 'function') {
          return console.error("".concat(RegExp.$1, " event must bind with a function."));
        }

        this.root.addEventListener(RegExp.$1.replace(/^[\s\S]/, function (v) {
          return v.toLocaleLowerCase();
        }), value);
      } else {
        if (name === "className") name = "class";
        this.root.setAttribute(name, value);
      }
    }
  }, {
    key: "appendChild",
    value: function appendChild(component) {
      var range = document.createRange();
      range.setStart(this.root, this.root.childNodes.length);
      range.setEnd(this.root, this.root.childNodes.length);
      component[RENDER_TO_DOM](range);
    }
  }, {
    key: "vdom",
    get: function get() {
      return {
        type: this.type,
        props: this.props,
        children: this.children.map(function (v) {
          return v.vdom;
        })
      };
    }
  }, {
    key: RENDER_TO_DOM,
    value: function value(range) {
      range.deleteContents();
      range.insertNode(this.root);
    }
  }]);

  return ElementWrapper;
}();

var TextWrapper = /*#__PURE__*/function () {
  function TextWrapper(content) {
    _classCallCheck(this, TextWrapper);

    this.root = document.createTextNode(content);
  }

  _createClass(TextWrapper, [{
    key: RENDER_TO_DOM,
    value: function value(range) {
      range.deleteContents();
      range.insertNode(this.root);
    }
  }]);

  return TextWrapper;
}();

var Component = /*#__PURE__*/function () {
  function Component() {
    _classCallCheck(this, Component);

    this.props = Object.create(null);
    this.props.children = [];
    this._root = null;
    this.state = null;
    this._range = null;
  }

  _createClass(Component, [{
    key: "setState",
    value: function setState(partState, callback) {
      var merge = function merge(oldState, newState) {
        for (var i in newState) {
          if (oldState[i] === null || _typeof(oldState[i]) !== 'object') {
            oldState[i] = newState[i];
          } else {
            // if(typeof oldState[i] === 'object' && typeof oldState[i] === 'undefined'){
            //     oldState[i] = (newState[i] instanceof Array)?new Array():Object.create(null);
            // }
            merge(oldState[i], newState[i]);
          }
        }
      };

      merge(this.state, partState);
      console.log(partState, this.state);
      this.rerender();
    }
  }, {
    key: "setAttribute",
    value: function setAttribute(name, value) {
      this.props[name] = value;
    }
  }, {
    key: "appendChild",
    value: function appendChild(component) {
      this.props.children.push(component);
    }
  }, {
    key: RENDER_TO_DOM,
    value: function value(range) {
      this._range = range;
      this.render()[RENDER_TO_DOM](range);
    }
  }, {
    key: "rerender",
    value: function rerender() {
      var oldRange = this._range;
      var range = document.createRange();
      range.setStart(oldRange.startContainer, oldRange.startOffset);
      range.setEnd(oldRange.startContainer, oldRange.startOffset);
      this[RENDER_TO_DOM](range); //let selection = window.getSelection();

      oldRange.setStart(range.endContainer, range.endOffset); //selection.addRange(oldRange);

      oldRange.deleteContents();
    }
  }]);

  return Component;
}();

function createElement(type, attributes) {
  var e;

  if (typeof type === 'string') {
    e = new ElementWrapper(type);
  } else {
    e = new type();
  }

  for (var p in attributes) {
    e.setAttribute(p, attributes[p]);
  }

  var insertChildren = function insertChildren(children) {
    var _iterator = _createForOfIteratorHelper(children),
        _step;

    try {
      for (_iterator.s(); !(_step = _iterator.n()).done;) {
        var child = _step.value;
        if (child === null || JSON.stringify(child) === '{}') continue;

        if (_typeof(child) === 'object') {
          if (child instanceof Array) {
            insertChildren(child);
            continue;
          }
        } else {
          child = new TextWrapper(String(child));
        } //console.log(child,children);


        e.appendChild(child);
      }
    } catch (err) {
      _iterator.e(err);
    } finally {
      _iterator.f();
    }
  };

  for (var _len = arguments.length, children = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
    children[_key - 2] = arguments[_key];
  }

  insertChildren(children);
  return e;
}

function render(component, parentElement) {
  var range = document.createRange();
  range.setStart(parentElement, 0);
  range.setEnd(parentElement, parentElement.childNodes.length);
  range.deleteContents();
  component[RENDER_TO_DOM](range);
}

var React = function React() {
  _classCallCheck(this, React);
};

_defineProperty(React, "render", render);

_defineProperty(React, "createElement", createElement);

_defineProperty(React, "Component", Component);



/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/*!*****************!*\
  !*** ./main.js ***!
  \*****************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _toy_react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./toy-react */ "./toy-react.js");
function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]; if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }



var Square = /*#__PURE__*/function (_React$Component) {
  _inherits(Square, _React$Component);

  var _super = _createSuper(Square);

  function Square() {
    _classCallCheck(this, Square);

    return _super.apply(this, arguments);
  }

  _createClass(Square, [{
    key: "render",
    value: function render() {
      return /*#__PURE__*/_toy_react__WEBPACK_IMPORTED_MODULE_0__.default.createElement("button", {
        className: "square",
        onClick: this.props.onClick
      }, this.props.value);
    }
  }]);

  return Square;
}(_toy_react__WEBPACK_IMPORTED_MODULE_0__.default.Component);

var Board = /*#__PURE__*/function (_React$Component2) {
  _inherits(Board, _React$Component2);

  var _super2 = _createSuper(Board);

  function Board() {
    _classCallCheck(this, Board);

    return _super2.apply(this, arguments);
  }

  _createClass(Board, [{
    key: "renderSquare",
    value: function renderSquare(i) {
      var _this = this;

      return /*#__PURE__*/_toy_react__WEBPACK_IMPORTED_MODULE_0__.default.createElement(Square, {
        value: this.props.squares[i],
        onClick: function onClick() {
          return _this.props.onClick(i);
        }
      });
    }
  }, {
    key: "render",
    value: function render() {
      return /*#__PURE__*/_toy_react__WEBPACK_IMPORTED_MODULE_0__.default.createElement("div", null, /*#__PURE__*/_toy_react__WEBPACK_IMPORTED_MODULE_0__.default.createElement("div", {
        className: "board-row"
      }, this.renderSquare(0), this.renderSquare(1), this.renderSquare(2)), /*#__PURE__*/_toy_react__WEBPACK_IMPORTED_MODULE_0__.default.createElement("div", {
        className: "board-row"
      }, this.renderSquare(3), this.renderSquare(4), this.renderSquare(5)), /*#__PURE__*/_toy_react__WEBPACK_IMPORTED_MODULE_0__.default.createElement("div", {
        className: "board-row"
      }, this.renderSquare(6), this.renderSquare(7), this.renderSquare(8)));
    }
  }]);

  return Board;
}(_toy_react__WEBPACK_IMPORTED_MODULE_0__.default.Component);

var Game = /*#__PURE__*/function (_React$Component3) {
  _inherits(Game, _React$Component3);

  var _super3 = _createSuper(Game);

  function Game(props) {
    var _this2;

    _classCallCheck(this, Game);

    _this2 = _super3.call(this, props);
    _this2.state = {
      history: [{
        squares: Array(9).fill(null)
      }],
      stepNumber: 0,
      xIsNext: true
    };
    return _this2;
  }

  _createClass(Game, [{
    key: "handleClick",
    value: function handleClick(i) {
      var history = this.state.history.slice(0, this.state.stepNumber + 1);
      var current = history[history.length - 1];
      var squares = current.squares.slice();

      if (calculateWinner(squares) || squares[i]) {
        return;
      }

      squares[i] = this.state.xIsNext ? "X" : "O";
      this.setState({
        history: history.concat([{
          squares: squares
        }]),
        stepNumber: history.length,
        xIsNext: !this.state.xIsNext
      });
    }
  }, {
    key: "jumpTo",
    value: function jumpTo(step) {
      this.setState({
        stepNumber: step,
        xIsNext: step % 2 === 0
      });
    }
  }, {
    key: "render",
    value: function render() {
      var _this3 = this;

      var history = this.state.history;
      var current = history[this.state.stepNumber];
      var winner = calculateWinner(current.squares);
      var moves = history.map(function (step, move) {
        var desc = move ? 'Go to move #' + move : 'Go to game start';
        return /*#__PURE__*/_toy_react__WEBPACK_IMPORTED_MODULE_0__.default.createElement("li", {
          key: move
        }, /*#__PURE__*/_toy_react__WEBPACK_IMPORTED_MODULE_0__.default.createElement("button", {
          onClick: function onClick() {
            return _this3.jumpTo(move);
          }
        }, desc));
      });
      var status;

      if (winner) {
        status = "Winner: " + winner;
      } else {
        status = "Next player: " + (this.state.xIsNext ? "X" : "O");
      }

      return /*#__PURE__*/_toy_react__WEBPACK_IMPORTED_MODULE_0__.default.createElement("div", {
        className: "game"
      }, /*#__PURE__*/_toy_react__WEBPACK_IMPORTED_MODULE_0__.default.createElement("div", {
        className: "game-board"
      }, /*#__PURE__*/_toy_react__WEBPACK_IMPORTED_MODULE_0__.default.createElement(Board, {
        squares: current.squares,
        onClick: function onClick(i) {
          return _this3.handleClick(i);
        }
      })), /*#__PURE__*/_toy_react__WEBPACK_IMPORTED_MODULE_0__.default.createElement("div", {
        className: "game-info"
      }, /*#__PURE__*/_toy_react__WEBPACK_IMPORTED_MODULE_0__.default.createElement("div", null, status), /*#__PURE__*/_toy_react__WEBPACK_IMPORTED_MODULE_0__.default.createElement("ol", null, moves)));
    }
  }]);

  return Game;
}(_toy_react__WEBPACK_IMPORTED_MODULE_0__.default.Component); // ========================================


_toy_react__WEBPACK_IMPORTED_MODULE_0__.default.render( /*#__PURE__*/_toy_react__WEBPACK_IMPORTED_MODULE_0__.default.createElement(Game, null), document.getElementById("root"));

function calculateWinner(squares) {
  var lines = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]];

  for (var i = 0; i < lines.length; i++) {
    var _lines$i = _slicedToArray(lines[i], 3),
        a = _lines$i[0],
        b = _lines$i[1],
        c = _lines$i[2];

    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }

  return null;
}
})();

/******/ })()
;
//# sourceMappingURL=main.js.map