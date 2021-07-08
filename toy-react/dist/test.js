/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "../Animation/index.js":
/*!*****************************!*\
  !*** ../Animation/index.js ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Timeline = /*#__PURE__*/function () {
  function Timeline() {
    var _this = this;

    _classCallCheck(this, Timeline);

    this.animations = new Set();
    this.finishedAnimaions = new Set();
    this.addTimes = new Map();
    this.requestID = null;
    this.state = "inited";

    this.tick = function () {
      var t = Date.now() - _this.startTime;

      var _iterator = _createForOfIteratorHelper(_this.animations),
          _step;

      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var animation = _step.value;
          var object = animation.object,
              property = animation.property,
              template = animation.template,
              start = animation.start,
              end = animation.end,
              duration = animation.duration,
              timingFunction = animation.timingFunction,
              delay = animation.delay;

          var addTime = _this.addTimes.get(animation);

          if (t < delay + addTime) continue;
          var progression = timingFunction((t - delay - addTime) / duration); //0-1之间的数值

          if (t > duration + delay + addTime) {
            progression = 1;

            _this.animations["delete"](animation);

            _this.finishedAnimaions.add(animation);
          }

          var value = animation.valueFromProgression(progression);
          console.log(object, property);
          object[property] = template(value);
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }

      if (_this.animations.size) _this.requestID = requestAnimationFrame(_this.tick);else _this.requestID = null;
    };
  }

  _createClass(Timeline, [{
    key: "pause",
    value: function pause() {
      if (this.state !== "playing") return;
      this.state = "paused";
      this.pauseTime = Date.now();

      if (this.requestID !== null) {
        cancelAnimationFrame(this.requestID);
        this.requestID = null;
      }
    }
  }, {
    key: "resume",
    value: function resume() {
      if (this.state !== "paused") return;
      this.state = "playing";
      this.startTime += Date.now() - this.pauseTime;
      this.tick();
    }
  }, {
    key: "start",
    value: function start() {
      if (this.state !== "inited") return;
      this.state = "playing";
      this.startTime = Date.now();
      this.tick();
    }
  }, {
    key: "reset",
    value: function reset() {
      if (this.state === "playing") this.pause();
      this.animations = new Set();
      this.finishedAnimaions = new Set();
      this.addTimes = new Map();
      this.requestID = null;
      this.startTime = Date.now();
      this.pauseTime = null;
      this.state = "inited";
    }
  }, {
    key: "restart",
    value: function restart() {
      if (this.state === "playing") this.pause();

      var _iterator2 = _createForOfIteratorHelper(this.finishedAnimaions),
          _step2;

      try {
        for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
          var animation = _step2.value;
          this.animations.add(animation);
        }
      } catch (err) {
        _iterator2.e(err);
      } finally {
        _iterator2.f();
      }

      this.finishedAnimaions = new Set();
      this.requestID = null;
      this.state = "playing";
      this.startTime = Date.now();
      this.pauseTime = null;
      this.tick();
    }
  }, {
    key: "add",
    value: function add(animation, addTime) {
      this.animations.add(animation);
      if (this.state === "playing" && this.requestID === null) this.tick();
      if (this.state === "playing") this.addTimes.set(animation, addTime !== void 0 ? addTime : Date.now() - this.startTime);else this.addTimes.set(animation, addTime !== void 0 ? addTime : 0);
    }
  }]);

  return Timeline;
}();

var Animation = /*#__PURE__*/function () {
  function Animation(object, property, start, end, duration, delay, timingFunction, template) {
    _classCallCheck(this, Animation);

    this.object = object;
    this.template = template;
    this.property = property;
    this.start = start;
    this.end = end;
    this.duration = duration;
    this.delay = delay;
    this.timingFunction = timingFunction; //ease linear easeln easeOut
  }

  _createClass(Animation, [{
    key: "valueFromProgression",
    value: function valueFromProgression(progression) {
      return this.start + progression * (this.end - this.start);
    }
  }]);

  return Animation;
}();

var ColorAnimation = /*#__PURE__*/function () {
  function ColorAnimation(object, property, start, end, duration, delay, timingFunction, template) {
    _classCallCheck(this, ColorAnimation);

    this.object = object;

    this.template = template || function (v) {
      return "rgba(".concat(v.r, ", ").concat(v.g, ", ").concat(v.b, ", ").concat(v.a, ")");
    };

    this.property = property;
    this.start = start;
    this.end = end;
    this.duration = duration;
    this.delay = delay;
    this.timingFunction = timingFunction;
  }

  _createClass(ColorAnimation, [{
    key: "valueFromProgression",
    value: function valueFromProgression(progression) {
      return {
        r: thisstart.r + progression * (this.endr - this.start.r),
        g: thisstart.g + progression * (this.end.g - this.start.g),
        b: this.start.b + progression * (this.end.b - this.start.b),
        a: this.start.a + progression * (this.end.a - this.start.a)
      };
    }
  }]);

  return ColorAnimation;
}();

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  Timeline: Timeline,
  Animation: Animation,
  ColorAnimation: ColorAnimation
});

/***/ }),

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
  !*** ./test.js ***!
  \*****************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _toy_react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./toy-react */ "./toy-react.js");
/* harmony import */ var _Animation_index_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../Animation/index.js */ "../Animation/index.js");
function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

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

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }




var MyComponent = /*#__PURE__*/function (_React$Component) {
  _inherits(MyComponent, _React$Component);

  var _super = _createSuper(MyComponent);

  function MyComponent(props) {
    var _this;

    _classCallCheck(this, MyComponent);

    _this = _super.call(this, props);

    _defineProperty(_assertThisInitialized(_this), "state", {
      a: 1,
      b: 2
    });

    setTimeout(function () {
      var timeLine = new _Animation_index_js__WEBPACK_IMPORTED_MODULE_1__.default.Timeline();
      var elem = document.getElementById("aniNo1");
      var ani1 = new _Animation_index_js__WEBPACK_IMPORTED_MODULE_1__.default.Animation(elem.style, "transform", 0, 200, 3000, 0, function (v) {
        return v;
      }, function (v) {
        return "translateX(".concat(v, "px)");
      });
      timeLine.add(ani1);
      timeLine.start();
    });
    return _this;
  }

  _createClass(MyComponent, [{
    key: "addNumber",
    value: function addNumber(e) {
      console.log(e);
      this.setState({
        a: this.state.a + 1
      });
    }
  }, {
    key: "render",
    value: function render() {
      var _this$state = this.state,
          a = _this$state.a,
          b = _this$state.b;
      return /*#__PURE__*/_toy_react__WEBPACK_IMPORTED_MODULE_0__.default.createElement("div", {
        className: "wrapper"
      }, /*#__PURE__*/_toy_react__WEBPACK_IMPORTED_MODULE_0__.default.createElement("h1", null, "my component"), /*#__PURE__*/_toy_react__WEBPACK_IMPORTED_MODULE_0__.default.createElement("button", {
        onclick: this.addNumber.bind(this)
      }, "add"), /*#__PURE__*/_toy_react__WEBPACK_IMPORTED_MODULE_0__.default.createElement("div", null, /*#__PURE__*/_toy_react__WEBPACK_IMPORTED_MODULE_0__.default.createElement("div", null, a), /*#__PURE__*/_toy_react__WEBPACK_IMPORTED_MODULE_0__.default.createElement("div", null, b)), this.props.children);
    }
  }]);

  return MyComponent;
}(_toy_react__WEBPACK_IMPORTED_MODULE_0__.default.Component);

_toy_react__WEBPACK_IMPORTED_MODULE_0__.default.render( /*#__PURE__*/_toy_react__WEBPACK_IMPORTED_MODULE_0__.default.createElement(MyComponent, null, /*#__PURE__*/_toy_react__WEBPACK_IMPORTED_MODULE_0__.default.createElement("div", {
  id: "aniNo1"
}), /*#__PURE__*/_toy_react__WEBPACK_IMPORTED_MODULE_0__.default.createElement("div", {
  id: "aniNo2"
})), document.getElementById("test"));
})();

/******/ })()
;
//# sourceMappingURL=test.js.map