(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";
// 时间选择器核心代码

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

Object.defineProperty(exports, "__esModule", { value: true });
var utils_1 = require("./utils");
var touch_1 = require("./touch");

var BasePicker = function (_utils_1$default) {
    _inherits(BasePicker, _utils_1$default);

    function BasePicker(options) {
        _classCallCheck(this, BasePicker);

        var _this2 = _possibleConstructorReturn(this, (BasePicker.__proto__ || Object.getPrototypeOf(BasePicker)).call(this));

        _this2._opt = {}; //全局配置
        _this2._params = {}; //初始化配置
        _this2._key = 1; //唯一key
        _this2.monthStr = ''; //月份字符串
        _this2.dayStr = ''; //天数字符串
        _this2.currentPicker = null; //保存当前显示的选择器
        _this2.currentIndexs = []; //保存当前选择的格子索引
        _this2.currentValue = []; //保存当前选择的值 
        _this2.mask = null; //保存唯一的遮罩
        _this2.defaultInfo = {}; //
        // 辅助类变量
        _this2._height = 0; //选择器格子的高度
        _this2.opt = _this2.assign({
            onchange: function onchange() {},
            success: function success() {}
        }, options);
        return _this2;
    }

    _createClass(BasePicker, [{
        key: "picker",
        value: function picker(params) {
            /**
             * 初始化方法，不建议在循环中或者事件中重复调用
             */
            this.params = this.assign({
                startYear: '1990',
                endYear: '2030',
                defaultDate: this.getToday('-'),
                key: this.key,
                outFormat: '-',
                onchange: function onchange() {},
                success: function success() {},
                type: 'range'
            }, params);
            this.render();
        }
        // abstract render() :void;

    }, {
        key: "render",
        value: function render() {
            // 渲染函数，一般要在子类重写
            this.createMask();
            this.createPicker();
        }
    }, {
        key: "createMask",
        value: function createMask() {
            // 创建蒙版
            var maskName = "picker-mask";
            var $mask = this.select("." + maskName);
            var _this = this;
            if (!$mask) {
                $mask = this.createElm(document.body, 'div', maskName);
                this.setCss($mask, {
                    'transition': '0.3s all linear',
                    'opacity': '0',
                    'display': 'none'
                });
            }
            this.mask = $mask;
        }
    }, {
        key: "createPicker",
        value: function createPicker() {
            // 创建选择器
            var pickerName = "picker-key-" + this.params.key;
            var $picker = this.select("." + pickerName);
            var $pickerWrapper = this.select("." + pickerName + " .picker-wrapper");
            var _this = this;
            if (!$picker) {
                this.monthStr = this.createMonthStr();
                this.dayStr = this.createDayStr();
                var pickerHtml = this.renderHtml();
                $picker = this.createElm(document.body, 'div', pickerName);
                $picker.innerHTML = pickerHtml;
                $pickerWrapper = this.select("." + pickerName + " .picker-wrapper");
                this.setCss($pickerWrapper, {
                    'transition': '0.3s all linear',
                    'transform': 'translateY(100%)'
                });
                if (!_this._height) {
                    _this._height = _this.select('.date-unit', $picker).clientHeight;
                }
                this.currentPicker = $picker || {}; //保存当前的选择器
                this.currentPicker.years = this.getYearArray();
                this.setDefaultView(this.params.defaultDate); //设置默认日期的视图
                this.bindEvents();
                this.pickerOperation();
            }
            // 添加显示状态
            $picker.classList.add('__picker-type-show');
            this.currentPicker = $picker || {}; //保存当前的选择器
            this.currentPicker.years = this.getYearArray();
        }
    }, {
        key: "getYearArray",
        value: function getYearArray() {
            var years = [];
            var startYear = this.params.startYear;
            var endYear = this.params.endYear;
            for (var i = startYear - 0; i <= endYear - 0; i++) {
                years.push(i);
            }
            return years;
        }
    }, {
        key: "createYearStr",
        value: function createYearStr() {
            // 创建年
            var years = [];
            var startYear = this.params.startYear;
            var endYear = this.params.endYear;
            for (var i = startYear - 0; i <= endYear - 0; i++) {
                years.push(i);
            }
            var html = '';
            years.forEach(function (item, i) {
                html += "<p class=\"date-unit\" data-year=\"" + item + "\">" + item + "\u5E74</p>";
            });
            // console.log('year',html);
            return html;
        }
    }, {
        key: "createMonthStr",
        value: function createMonthStr() {
            // 创建月
            var months = [];
            for (var i = 1; i <= 12; i++) {
                months.push(i);
            }
            var html = '';
            months.forEach(function (item, i) {
                var month = item >= 10 ? item : '0' + item;
                html += "<p class=\"date-unit\" data-month=\"" + item + "\">" + month + "\u6708</p>";
            });
            // console.log('month',html);
            return html;
        }
    }, {
        key: "createDayStr",
        value: function createDayStr() {
            // 创建day
            var days = [];
            for (var i = 1; i <= 31; i++) {
                days.push(i);
            }
            var html = '';
            days.forEach(function (item, i) {
                var day = item >= 10 ? item : '0' + item;
                html += "<p class=\"date-unit\" data-day=\"" + item + "\">" + day + "\u65E5</p>";
            });
            // console.log('day',html);
            return html;
        }
    }, {
        key: "setDefaultView",
        value: function setDefaultView(defaultDate) {
            if (!defaultDate) {
                console.error('Error: 默认日期(defaultDate)不能为空');
                return;
            }
            var dateArray = defaultDate.split('-');
            if (!dateArray || dateArray.length < 3) {
                console.error('Error:默认日期(defaultDate)的格式有误,默认格式:2019-01-01 or 2019-1-1');
                return;
            }
            var $picker = this.currentPicker;
            var $dateUtils = this.selectAll('.date-item', $picker);
            // year
            var yearIndex = this.currentToIndex(parseInt(dateArray[0]) - parseInt(this.params.startYear));
            this.setCss($dateUtils[0], {
                'transform': "translateY(" + yearIndex * this._height + "px)"
            });
            // month
            var monthIndex = this.currentToIndex(parseInt(dateArray[1]) - 1);
            this.setCss($dateUtils[1], {
                'transform': "translateY(" + monthIndex * this._height + "px)"
            });
            // month
            var dayIndex = this.currentToIndex(parseInt(dateArray[2]) - 1);
            this.setCss($dateUtils[2], {
                'transform': "translateY(" + dayIndex * this._height + "px)"
            });
            this.defaultInfo = {
                dateArray: dateArray,
                heightArray: [yearIndex * this._height, monthIndex * this._height, dayIndex * this._height]
            };
        }
    }, {
        key: "bindEvents",
        value: function bindEvents() {
            var _this3 = this;

            if (!this.currentPicker) {
                console.error('Error: 选择器还没有渲染');
                return;
            }
            var $dateGroups = this.selectAll('.date-group', this.currentPicker);
            var _this = this;
            Array.prototype.slice.call($dateGroups).forEach(function (dateGroup, i) {
                var $dateUtils = _this.select('.date-item', dateGroup);
                _this.setCss($dateUtils, {
                    'transition': '0.1s all linear'
                });
                // 注意：EndY的值不应该为0，而是调用默认视图函数后的距离
                var EndY = _this3.defaultInfo.heightArray[i];
                var touchs = new touch_1.default(dateGroup);
                touchs.init({
                    startCb: function startCb(e, range) {
                        _this.touchStart(e, $dateUtils);
                    },
                    moveCb: function moveCb(e, range) {
                        _this.touchMove(e, range, EndY, $dateUtils);
                    },
                    endCb: function endCb(e, endY) {
                        EndY = _this.touchEnd(e, endY, EndY, $dateUtils, i);
                        // console.log('touchEnd',EndY) 
                    }
                });
            });
            this.mask.addEventListener('click', this.hide.bind(_this));
        }
    }, {
        key: "touchStart",
        value: function touchStart(e, target) {
            // console.log('start');
            this.setCss(target, {
                'transition': '.3s all linear'
            });
        }
    }, {
        key: "touchMove",
        value: function touchMove(e, range, EndY, target) {
            this.setCss(target, {
                'transform': "translateY(" + (EndY + range * 1) + "px)"
            });
        }
    }, {
        key: "touchEnd",
        value: function touchEnd(e, endY, EndY, target, Index) {
            EndY = EndY + endY;
            var min = EndY > 0 ? Math.floor(EndY / this._height) : Math.ceil(EndY / this._height);
            var max = EndY > 0 ? min + 1 : min - 1;
            var middle = (max + min) / 2 * this._height;
            var current = 0;
            this.currentValue = this.defaultInfo.dateArray;
            // console.log('min',min);
            // console.log('middle',middle);
            // console.log('EndY', EndY);
            if (Math.abs(EndY) >= Math.abs(middle)) {
                EndY = max * this._height;
                current = max;
            } else {
                EndY = min * this._height;
                current = min;
            }
            // 关于格子的数量
            // 只有年和日是变化的，月份都是固定的(12)
            var counts = 0;
            switch (Index) {
                case 0:
                    //年
                    counts = this.currentPicker.years.length;
                    break;
                case 1:
                    //月
                    counts = 12;
                    break;
                case 2:
                    //日
                    // Todo
                    counts = this.getDay();
                    break;
                case 3:
                    //小时
                    counts = 24;
                    break;
                case 4:
                    //分钟
                    counts = 60;
                    break;
                default:
                    break;
            }
            // 逻辑：
            // 根据页面个结构，每个选择器只显示3个格子，所以中心的是2
            // 那么头部不能超过的距离是 1*height
            // 底部不能超过的距离是-(格子数量-2)*height
            if (EndY > 1 * this._height) {
                EndY = 1 * this._height;
                current = 1;
            } else if (Math.abs(EndY) > Math.abs(-(counts - 2) * this._height)) {
                EndY = -(counts - 2) * this._height;
                current = -(counts - 2);
            }
            this.currentIndexs[Index] = current; //保存当前的格子索引
            var arrayIndex = this.currentToIndex(current); //把格子索引转成数组索引
            if (Index == 0) {
                // 只有年需要从数组中读取值
                this.currentValue[Index] = this.currentPicker.years[arrayIndex];
            } else if (Index == 1 || Index == 2) {
                this.currentValue[Index] = arrayIndex + 1 >= 10 ? arrayIndex + 1 : '0' + (arrayIndex + 1);
            } else {
                this.currentValue[Index] = arrayIndex >= 10 ? arrayIndex : '0' + arrayIndex;
            }
            this.setCss(target, {
                'transition': '.3s all linear',
                'transform': "translateY(" + EndY + "px)"
            });
            // 调用onchange回调
            this.opt.onchange(this.currentValue);
            this.params.onchange(this.currentValue);
            var currentValue = this.currentValue.join(this.params.outFormat);
            this.$emit("onchange_" + this.params.key, currentValue);
            return EndY;
        }
    }, {
        key: "getDay",
        value: function getDay() {
            // 获取当月的天数
            var _this = this;
            var days = new Date(this.currentValue[0], this.currentValue[1], 0).getDate();
            // console.log('days',days);
            var $untis = this.selectAll('[data-day]', this.currentPicker);
            var fade = function fade(index, opacity) {
                for (var i = 30; i >= index; i--) {
                    _this.setCss($untis[i], {
                        'opacity': opacity
                    });
                }
            };
            switch (days) {
                case 30:
                    fade(30, '0');
                    break;
                case 28:
                    fade(28, '0');
                    break;
                case 31:
                    fade(28, '1');
                    break;
                default:
                    break;
            }
            return days;
        }
    }, {
        key: "currentToIndex",
        value: function currentToIndex(current) {
            // 逻辑：
            // 根据页面布局，得来第一个格子是正数，其他的距离都是负数
            // 所以可以通过(1-current)来获取当前格子数组的索引
            return 1 - current;
        }
    }, {
        key: "hide",
        value: function hide() {
            var _this = this;
            // 关闭遮罩
            this.setCss(this.mask, {
                'opacity': '0'
            });
            this.sleep(function () {
                _this.setCss(_this.mask, {
                    'display': 'none'
                });
            }, 300);
            // 关闭选择器
            var $pickerWrapper = this.select(".picker-wrapper", this.currentPicker);
            this.setCss($pickerWrapper, {
                'transform': 'translateY(100%)'
            });
            this.currentPicker.classList.remove('__picker-type-show');
            this.currentPicker.classList.add('__picker-type-hide');
        }
    }, {
        key: "show",
        value: function show() {
            this.setCss(this.mask, {
                'opacity': '1',
                'display': 'block'
            });
            var $picker = this.currentPicker;
            if (!$picker) {
                var tip = "\n            \u6CA1\u6709\u8BE5key(" + this.params.key + ")\u503C\u7684\u9009\u62E9\u5668\n            \u8BF7\u68C0\u67E5\u662F\u5426\u5199\u9519!\n            ";
                console.error(tip);
                this.errorTip(tip);
                return;
            }
            var $pickerWrapper = this.select(".picker-wrapper", $picker);
            this.setCss($pickerWrapper, {
                'transform': 'translateY(0px)'
            });
            $picker.classList.remove('__picker-type-hide');
            $picker.classList.remove('__picker-type-show');
        }
    }, {
        key: "opt",
        get: function get() {
            return this._opt;
        },
        set: function set(val) {
            this._opt = val;
        }
    }, {
        key: "params",
        get: function get() {
            return this._params;
        },
        set: function set(val) {
            this._params = val;
        }
    }, {
        key: "key",
        get: function get() {
            return this._key;
        },
        set: function set(val) {
            this._key = val;
        }
    }]);

    return BasePicker;
}(utils_1.default);

exports.default = BasePicker;

},{"./touch":9,"./utils":10}],2:[function(require,module,exports){
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

Object.defineProperty(exports, "__esModule", { value: true });
// import "babel-polyfill";
var polyfill_1 = require("./polyfill");
polyfill_1.default();
var utils_1 = require("./utils");
// import BasePicker from './basePicker';
var rangePicker_1 = require("./rangePicker");
var singlePicker_1 = require("./singlePicker");
var minutePicker_1 = require("./minutePicker");

var DatePicker = function (_utils_1$default) {
    _inherits(DatePicker, _utils_1$default);

    function DatePicker() {
        _classCallCheck(this, DatePicker);

        var _this = _possibleConstructorReturn(this, (DatePicker.__proto__ || Object.getPrototypeOf(DatePicker)).call(this));

        _this._opt = {};
        _this._params = {}; //初始化配置
        _this._key = 1; //唯一key
        _this._keyList = []; //key列表
        _this._pickerList = []; //保存创建的picker对象
        // 辅助变量
        _this._maxKeyCount = 10; //可创建选择器的最大数量
        return _this;
    }

    _createClass(DatePicker, [{
        key: "globalOptions",
        value: function globalOptions(opt) {
            this.opt = this.assign({
                maxKeyCount: this._maxKeyCount,
                onchange: function onchange() {},
                success: function success() {}
            }, opt);
            this.opt.maxKeyCount = this.opt.maxKeyCount > 0 && this.opt.maxKeyCount <= 20 ? this.opt.maxKeyCount : this._maxKeyCount;
        }
    }, {
        key: "picker",
        value: function picker(params) {
            var _this2 = this;

            var defaultDate = params.type == 'minute' ? this.getToday('-') + ' 00:00' : this.getToday('-');
            this.params = this.assign({
                startYear: '1990',
                endYear: '2030',
                defaultDate: defaultDate,
                key: this.key,
                outFormat: '-',
                onchange: function onchange() {},
                success: function success() {},
                type: 'range'
            }, params);
            // 保存key值，如果列表的key值过多，禁止创建
            if (!this.keyList.includes(this.params.key)) {
                this.keyList.push(this.params.key);
                this.key += 1;
                var _picker = this.render();
                _picker.picker(this.params); //初始化
                this.pickerList.push({
                    key: this.params.key,
                    picker: _picker
                });
            }
            if (this.keyList.length > this.opt.maxKeyCount) {
                var tip = "\n            Error:\u68C0\u6D4B\u5230\u9875\u9762\u4E0A\u521B\u5EFA\u7684\u9009\u62E9\u5668\u8FC7\u591A!\n            \u8BF7\u68C0\u67E5\u4EE3\u7801\u662F\u5426\u6709\u95EE\u9898\n            \u8BF7\u4E0D\u8981\u5728\u5FAA\u73AF\u6216\u8005\u4E8B\u4EF6\u4E2D\u91CD\u590D\u8C03\u7528.picker()\u65B9\u6CD5\n            \u82E5\u975E\u8981\u5982\u6B64\u8C03\u7528\uFF0C\u4E00\u5B9A\u8981\u52A0\u4E0Akey\u5C5E\u6027\n            \u5EFA\u8BAE\u5728\u5916\u9762\u8C03\u7528.picker()\u65B9\u6CD5\uFF0C\u5728\u91CC\u9762\u8C03\u7528.show()\u65B9\u6CD5\u663E\u793A\n            ";
                console.error(tip);
                this.errorTip(tip);
                return;
            }
            var picker = this.pickerList.find(function (item) {
                return item.key == _this2.params.key;
            });
            if (!picker) {
                var _tip = "\n            Error:\u627E\u4E0D\u5230\u8BE5key(" + this.params.key + ")\u7684\u9009\u62E9\u5668,\n            \u8BF7\u68C0\u67E5\u4EE3\u7801\u662F\u5426\u6709\u95EE\u9898\n            ";
                console.error(_tip);
                this.errorTip(_tip);
                return;
            }
            return picker.picker;
        }
    }, {
        key: "render",
        value: function render() {
            var picker = null;
            switch (this.params.type) {
                case 'range':
                    picker = new rangePicker_1.default(this.opt);
                    break;
                case 'single':
                    picker = new singlePicker_1.default(this.opt);
                    break;
                case 'minute':
                    picker = new minutePicker_1.default(this.opt);
                    break;
                default:
                    break;
            }
            return picker;
        }
    }, {
        key: "opt",
        get: function get() {
            return this._opt;
        },
        set: function set(val) {
            this._opt = val;
        }
    }, {
        key: "params",
        get: function get() {
            return this._params;
        },
        set: function set(val) {
            this._params = val;
        }
    }, {
        key: "key",
        get: function get() {
            return this._key;
        },
        set: function set(val) {
            this._key = val;
        }
    }, {
        key: "keyList",
        get: function get() {
            return this._keyList;
        },
        set: function set(val) {
            this._keyList = val;
        }
    }, {
        key: "pickerList",
        get: function get() {
            return this._pickerList;
        },
        set: function set(val) {
            this._pickerList = val;
        }
    }]);

    return DatePicker;
}(utils_1.default);

var datePicker = new DatePicker();
exports.default = datePicker;

},{"./minutePicker":4,"./polyfill":5,"./rangePicker":6,"./singlePicker":7,"./utils":10}],3:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var datePicker_1 = require("./datePicker");
// import { module } from 'browserify/lib/builtins';
window.datePicker = datePicker_1.default;
// console.log(datePicker);
// module.exports = datePicker;

},{"./datePicker":2}],4:[function(require,module,exports){
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

Object.defineProperty(exports, "__esModule", { value: true });
// 时分选择器核心代码
var temp = require("./template");
var basePicker_1 = require("./basePicker");

var SinglePicker = function (_basePicker_1$default) {
    _inherits(SinglePicker, _basePicker_1$default);

    function SinglePicker(options) {
        _classCallCheck(this, SinglePicker);

        var _this2 = _possibleConstructorReturn(this, (SinglePicker.__proto__ || Object.getPrototypeOf(SinglePicker)).call(this));

        _this2.currentIndex = 0;
        _this2.opt = _this2.assign({
            onchange: function onchange() {},
            success: function success() {}
        }, options);
        return _this2;
    }

    _createClass(SinglePicker, [{
        key: "renderHtml",
        value: function renderHtml() {
            // 获取html样式的函数，注意，该函数一般要在子类重写
            var yearStr = this.createYearStr();
            var hourStr = this.createHourStr();
            var minuteStr = this.createMinuteStr();
            return temp.minutePicker.replace('$1', yearStr).replace('$2', this.monthStr).replace('$3', this.dayStr).replace('$4', hourStr).replace('$5', minuteStr);
        }
    }, {
        key: "createHourStr",
        value: function createHourStr() {
            // 创建小时
            var hours = [];
            for (var i = 0; i <= 23; i++) {
                hours.push(i);
            }
            var html = '';
            hours.forEach(function (item, i) {
                var hour = item >= 10 ? item : '0' + item;
                html += "<p class=\"date-unit\" data-hour=\"" + item + "\">" + hour + "</p>";
            });
            return html;
        }
    }, {
        key: "createMinuteStr",
        value: function createMinuteStr() {
            // 创建分钟
            var minutes = [];
            for (var i = 0; i <= 59; i++) {
                minutes.push(i);
            }
            var html = '';
            minutes.forEach(function (item, i) {
                var minute = item >= 10 ? item : '0' + item;
                html += "<p class=\"date-unit\" data-minute=\"" + item + "\">" + minute + "</p>";
            });
            return html;
        }
    }, {
        key: "resolvingString",
        value: function resolvingString(str) {
            // 解析日期字符串
            var array = str.split(' ');
            return [].concat(array[0].split(this.params.outFormat), array[1].split(':'));
        }
    }, {
        key: "setDefaultView",
        value: function setDefaultView(defaultDate) {
            if (!defaultDate) {
                console.error('Error: 默认日期(defaultDate)不能为空');
                return;
            }
            var dateArray = this.resolvingString(defaultDate);
            if (!dateArray || dateArray.length < 5) {
                console.error('Error:默认日期(defaultDate)的格式有误,默认格式:2019-01-01 00:00');
                return;
            }
            var $picker = this.currentPicker;
            var $dateUtils = this.selectAll('.date-item', $picker);
            // year
            var yearIndex = this.currentToIndex(parseInt(dateArray[0]) - parseInt(this.params.startYear));
            this.setCss($dateUtils[0], {
                'transform': "translateY(" + yearIndex * this._height + "px)"
            });
            // month
            var monthIndex = this.currentToIndex(parseInt(dateArray[1]) - 1);
            this.setCss($dateUtils[1], {
                'transform': "translateY(" + monthIndex * this._height + "px)"
            });
            // day
            var dayIndex = this.currentToIndex(parseInt(dateArray[2]) - 1);
            this.setCss($dateUtils[2], {
                'transform': "translateY(" + dayIndex * this._height + "px)"
            });
            // 小时
            var hourIndex = this.currentToIndex(parseInt(dateArray[3]));
            this.setCss($dateUtils[3], {
                'transform': "translateY(" + hourIndex * this._height + "px)"
            });
            // 分钟
            var minuteIndex = this.currentToIndex(parseInt(dateArray[4]));
            this.setCss($dateUtils[4], {
                'transform': "translateY(" + hourIndex * this._height + "px)"
            });
            this.defaultInfo = {
                dateArray: dateArray,
                heightArray: [yearIndex * this._height, monthIndex * this._height, dayIndex * this._height, hourIndex * this._height, minuteIndex * this._height]
            };
        }
    }, {
        key: "pickerOperation",
        value: function pickerOperation() {
            var _this3 = this;

            // 时间区间选择器的逻辑事件
            var $picker = this.currentPicker;
            var _this = this;
            // 订阅事件，监听选择器的变化
            var selectTime = '';
            this.$on("onchange_" + this.params.key, function (data) {
                // 格式不对，手动转换一下
                var strArray = data.split(_this3.params.outFormat);
                var str1 = strArray.slice(0, 3).join(_this3.params.outFormat);
                var str2 = strArray.slice(3).join(':');
                selectTime = str1 + ' ' + str2;
            });
            // 确定按钮
            var $sure = this.select('.picker-btn__sure', this.currentPicker);
            if (!$sure) {
                var tip = "\n            \u6CA1\u627E\u5230\u786E\u5B9A\u6309\u94AE,\n            \u8BF7\u786E\u4FDDclass='.picker-btn__sure'\u7684\u6309\u94AE\u6CA1\u6709\u88AB\u53BB\u6389\n            ";
                console.error(tip);
                this.errorTip(tip);
                return;
            }
            $sure.addEventListener('click', function (e) {
                var result = selectTime;
                _this.opt.success(result);
                _this.params.success(result);
                _this.hide();
            });
            // 取消按钮
            var $cancel = this.select('.picker-btn__cancel', this.currentPicker);
            if (!$cancel) {
                var _tip = "\n            \u6CA1\u627E\u5230\u53D6\u6D88\u6309\u94AE,\n            \u8BF7\u786E\u4FDDclass='.picker-btn__cancel'\u7684\u6309\u94AE\u6CA1\u6709\u88AB\u53BB\u6389\n            ";
                console.error(_tip);
                this.errorTip(_tip);
                return;
            }
            $cancel.addEventListener('click', function (e) {
                _this.hide();
            });
            // 点击显示时分选择器
            var $minuteBtn = this.select('.picker-minute-btn', this.currentPicker);
            var $minute = this.select('.date-content-minute');
            if (!$minuteBtn) {
                var _tip2 = "\n            \u6CA1\u627E\u5230\u5207\u6362\u65F6\u5206\u9009\u62E9\u5668\u6309\u94AE,\n            \u8BF7\u786E\u4FDDclass='.picker-minute-btn'\u7684\u6309\u94AE\u6CA1\u6709\u88AB\u53BB\u6389\n            ";
                console.error(_tip2);
                this.errorTip(_tip2);
                return;
            }
            $minuteBtn.addEventListener('click', function (e) {
                if (e.target.classList.contains('picker-minute-btn-act')) {
                    // 关闭
                    e.target.classList.remove('picker-minute-btn-act');
                    _this.setCss($minute, {
                        'transform': 'translateX(100%)'
                    });
                } else {
                    // 打开
                    e.target.classList.add('picker-minute-btn-act');
                    _this.setCss($minute, {
                        'transform': 'translateX(0)'
                    });
                }
            });
        }
    }, {
        key: "reView",
        value: function reView(date) {
            // 重置选择器距离，date=[开始时间，结束时间]
            var bool = true;
            var _this = this;
            var strArray = this.resolvingString(date);
            bool = strArray.length < 5 ? false : true;
            if (!bool) {
                console.error('Error: reView方法传入的参数数组格式不对(格式:2019-01-01 00:00)');
                return;
            }
            this.setDefaultView(date);
            this.$emit("onchange_" + this.params.key, date);
        }
    }]);

    return SinglePicker;
}(basePicker_1.default);

exports.default = SinglePicker;

},{"./basePicker":1,"./template":8}],5:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
// es6补丁
var polyfill = function polyfill() {
  // includes
  if (!Array.prototype.includes) {
    Object.defineProperty(Array.prototype, 'includes', {
      value: function value(searchElement, fromIndex) {
        if (this == null) {
          throw new TypeError('"this" is null or not defined');
        }
        var o = Object(this);
        var len = o.length >>> 0;
        if (len === 0) {
          return false;
        }
        var n = fromIndex | 0;
        var k = Math.max(n >= 0 ? n : len - Math.abs(n), 0);
        while (k < len) {
          if (o[k] === searchElement) {
            return true;
          }
          k++;
        }
        return false;
      }
    });
  }

  if (!Array.prototype.find) {
    Object.defineProperty(Array.prototype, 'find', {
      value: function value(predicate) {
        // 1. Let O be ? ToObject(this value).
        if (this == null) {
          throw new TypeError('"this" is null or not defined');
        }

        var o = Object(this);

        // 2. Let len be ? ToLength(? Get(O, "length")).
        var len = o.length >>> 0;

        // 3. If IsCallable(predicate) is false, throw a TypeError exception.
        if (typeof predicate !== 'function') {
          throw new TypeError('predicate must be a function');
        }

        // 4. If thisArg was supplied, let T be thisArg; else let T be undefined.
        var thisArg = arguments[1];

        // 5. Let k be 0.
        var k = 0;

        // 6. Repeat, while k < len
        while (k < len) {
          // a. Let Pk be ! ToString(k).
          // b. Let kValue be ? Get(O, Pk).
          // c. Let testResult be ToBoolean(? Call(predicate, T, « kValue, k, O »)).
          // d. If testResult is true, return kValue.
          var kValue = o[k];
          if (predicate.call(thisArg, kValue, k, o)) {
            return kValue;
          }
          // e. Increase k by 1.
          k++;
        }

        // 7. Return undefined.
        return undefined;
      }
    });
  }
};
exports.default = polyfill;

},{}],6:[function(require,module,exports){
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

Object.defineProperty(exports, "__esModule", { value: true });
// 范围选择器核心代码
var temp = require("./template");
var basePicker_1 = require("./basePicker");

var RangePicker = function (_basePicker_1$default) {
    _inherits(RangePicker, _basePicker_1$default);

    function RangePicker(options) {
        _classCallCheck(this, RangePicker);

        var _this2 = _possibleConstructorReturn(this, (RangePicker.__proto__ || Object.getPrototypeOf(RangePicker)).call(this));

        _this2.currentIndex = 0;
        _this2.opt = _this2.assign({
            onchange: function onchange() {},
            success: function success() {}
        }, options);
        return _this2;
    }

    _createClass(RangePicker, [{
        key: "renderHtml",
        value: function renderHtml() {
            // 获取html样式的函数，注意，该函数一般要在子类重写
            var yearStr = this.createYearStr();
            return temp.rangePicker.replace('$1', yearStr).replace('$2', this.monthStr).replace('$3', this.dayStr);
        }
    }, {
        key: "pickerOperation",
        value: function pickerOperation() {
            var _this3 = this;

            // 时间区间选择器的逻辑事件
            var $picker = this.currentPicker;
            var $rangeChilds = this.selectAll('.range-child', $picker);
            var _this = this;
            Array.prototype.slice.call($rangeChilds).forEach(function (rangeChild, i) {
                // console.log('rangeChild',rangeChild);
                rangeChild.addEventListener('click', function (e) {
                    // console.log(e)
                    if (e.target.classList.contains('range-act')) return;
                    Array.prototype.slice.call($rangeChilds).forEach(function (item) {
                        item.classList.remove('range-act');
                    });
                    e.target.classList.add('range-act');
                    _this.currentIndex = i;
                });
            });
            // 订阅事件，监听选择器的变化，修改开始和结束的时间显示
            var startTime = '',
                endTime = '';
            // 当设置了默认日期，会执行这个
            startTime = $rangeChilds[_this.currentIndex].innerHTML = this.defaultInfo.dateArray.join(this.params.outFormat);
            this.$on("onchange_" + this.params.key, function (data) {
                if (typeof data === 'string') {
                    $rangeChilds[_this.currentIndex].innerHTML = data;
                    if (_this.currentIndex == 0) {
                        // 开始日期
                        startTime = data;
                    } else {
                        endTime = data;
                    }
                } else {
                    $rangeChilds[0].innerHTML = data[0];
                    $rangeChilds[1].innerHTML = data[1];
                    startTime = data[0];
                    endTime = data[1];
                }
            });
            // 确定按钮
            var $sure = this.select('.picker-btn__sure', this.currentPicker);
            if (!$sure) {
                var tip = "\n            \u6CA1\u627E\u5230\u786E\u5B9A\u6309\u94AE,\n            \u8BF7\u786E\u4FDDclass='.picker-btn__sure'\u7684\u6309\u94AE\u6CA1\u6709\u88AB\u53BB\u6389\n            ";
                console.error(tip);
                this.errorTip(tip);
                return;
            }
            $sure.addEventListener('click', function (e) {
                if (new Date(endTime).getTime() < new Date(startTime).getTime()) {
                    var _tip = "\u5F00\u59CB\u65E5\u671F\u4E0D\u80FD\u5927\u4E8E\u7ED3\u675F\u65E5\u671F";
                    _this3.errorTip(_tip);
                    return;
                }
                var result = {
                    startTime: startTime,
                    endTime: endTime
                };
                _this.opt.success(result);
                _this.params.success(result);
                _this.hide();
            });
            // 取消按钮
            var $cancel = this.select('.picker-btn__cancel', this.currentPicker);
            if (!$cancel) {
                var _tip2 = "\n            \u6CA1\u627E\u5230\u53D6\u6D88\u6309\u94AE,\n            \u8BF7\u786E\u4FDDclass='.picker-btn__cancel'\u7684\u6309\u94AE\u6CA1\u6709\u88AB\u53BB\u6389\n            ";
                console.error(_tip2);
                this.errorTip(_tip2);
                return;
            }
            $cancel.addEventListener('click', function (e) {
                _this.hide();
            });
        }
    }, {
        key: "reView",
        value: function reView(date) {
            // 重置选择器距离，date=[开始时间，结束时间]
            var bool = true;
            var _this = this;
            date.forEach(function (item, i) {
                var strArray = item.split(_this.params.outFormat);
                bool = strArray.length < 3 ? false : true;
            });
            if (!bool) {
                console.error('Error: reView方法传入的参数数组格式不对');
                return;
            }
            this.setDefaultView(date[this.currentIndex]);
            this.$emit("onchange_" + this.params.key, date);
        }
    }]);

    return RangePicker;
}(basePicker_1.default);

exports.default = RangePicker;

},{"./basePicker":1,"./template":8}],7:[function(require,module,exports){
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

Object.defineProperty(exports, "__esModule", { value: true });
// 单个选择器核心代码
var temp = require("./template");
var basePicker_1 = require("./basePicker");

var SinglePicker = function (_basePicker_1$default) {
    _inherits(SinglePicker, _basePicker_1$default);

    function SinglePicker(options) {
        _classCallCheck(this, SinglePicker);

        var _this2 = _possibleConstructorReturn(this, (SinglePicker.__proto__ || Object.getPrototypeOf(SinglePicker)).call(this));

        _this2.currentIndex = 0;
        _this2.opt = _this2.assign({
            onchange: function onchange() {},
            success: function success() {}
        }, options);
        return _this2;
    }

    _createClass(SinglePicker, [{
        key: "renderHtml",
        value: function renderHtml() {
            // 获取html样式的函数，注意，该函数一般要在子类重写
            var yearStr = this.createYearStr();
            return temp.singlePicker.replace('$1', yearStr).replace('$2', this.monthStr).replace('$3', this.dayStr);
        }
    }, {
        key: "pickerOperation",
        value: function pickerOperation() {
            // 时间区间选择器的逻辑事件
            var $picker = this.currentPicker;
            var _this = this;
            // 订阅事件，监听选择器的变化
            var selectTime = '';
            this.$on("onchange_" + this.params.key, function (data) {
                selectTime = data;
            });
            // 确定按钮
            var $sure = this.select('.picker-btn__sure', this.currentPicker);
            if (!$sure) {
                var tip = "\n            \u6CA1\u627E\u5230\u786E\u5B9A\u6309\u94AE,\n            \u8BF7\u786E\u4FDDclass='.picker-btn__sure'\u7684\u6309\u94AE\u6CA1\u6709\u88AB\u53BB\u6389\n            ";
                console.error(tip);
                this.errorTip(tip);
                return;
            }
            $sure.addEventListener('click', function (e) {
                var result = selectTime;
                _this.opt.success(result);
                _this.params.success(result);
                _this.hide();
            });
            // 取消按钮
            var $cancel = this.select('.picker-btn__cancel', this.currentPicker);
            if (!$cancel) {
                var _tip = "\n            \u6CA1\u627E\u5230\u53D6\u6D88\u6309\u94AE,\n            \u8BF7\u786E\u4FDDclass='.picker-btn__cancel'\u7684\u6309\u94AE\u6CA1\u6709\u88AB\u53BB\u6389\n            ";
                console.error(_tip);
                this.errorTip(_tip);
                return;
            }
            $cancel.addEventListener('click', function (e) {
                _this.hide();
            });
        }
    }, {
        key: "reView",
        value: function reView(date) {
            // 重置选择器距离，date=[开始时间，结束时间]
            var bool = true;
            var _this = this;
            var strArray = date.split(_this.params.outFormat);
            bool = strArray.length < 3 ? false : true;
            if (!bool) {
                console.error('Error: reView方法传入的参数字符格式不对');
                return;
            }
            this.setDefaultView(date[this.currentIndex]);
            this.$emit("onchange_" + this.params.key, date);
        }
    }]);

    return SinglePicker;
}(basePicker_1.default);

exports.default = SinglePicker;

},{"./basePicker":1,"./template":8}],8:[function(require,module,exports){
"use strict";
// 模板字符串

Object.defineProperty(exports, "__esModule", { value: true });
exports.mask = "\n<div class=\"picker-mask\"></div>\n";
exports.range = "\n<div class=\"picker-range\">\n    <p class=\"range-child start-time range-act\">\u5F00\u59CB\u65E5\u671F</p>\n    <span>\u81F3</span>\n    <p class=\"range-child end-time\">\u7ED3\u675F\u65E5\u671F</p>\n</div>\n";
exports.rangePicker = "\n<div class=\"picker-wrapper picker-type__range\">\n    <div class=\"picker-head flex space-between\">\n        <span class=\"cancel picker-btn__cancel\">\u53D6\u6D88</span>\n        <span class=\"sure picker-btn__sure\">\u786E\u5B9A</span>\n    </div>\n    <div class=\"picker-body\">\n        " + exports.range + "\n\n        <div class=\"date-content flex\">\n\n            <div class=\"date-group flex-item\">\n                    <div class=\"content-mask mask-top\"></div>\n                    <div class=\"content-mask mask-bottom\"></div>\n                    <div class=\"date-item \">\n                        $1\n                    </div>\n            </div>\n            <div class=\"date-group flex-item\">\n                <div class=\"content-mask mask-top\"></div>\n                <div class=\"content-mask mask-bottom\"></div>\n                <div class=\"date-item\">\n                    $2\n                </div>\n            </div>\n            <div class=\"date-group flex-item\">\n                <div class=\"content-mask mask-top\"></div>\n                <div class=\"content-mask mask-bottom\"></div>\n                <div class=\"date-item\">\n                    $3\n                </div>\n            </div>\n        </div>\n\n    </div>\n</div>\n";
exports.singlePicker = "\n<div class=\"picker-wrapper picker-type__single\">\n    <div class=\"picker-head flex space-between\">\n        <span class=\"cancel picker-btn__cancel\">\u53D6\u6D88</span>\n        <span class=\"sure picker-btn__sure\">\u786E\u5B9A</span>\n    </div>\n    <div class=\"picker-body\">\n        <div class=\"date-content flex\">\n\n            <div class=\"date-group flex-item\">\n                    <div class=\"content-mask mask-top\"></div>\n                    <div class=\"content-mask mask-bottom\"></div>\n                    <div class=\"date-item \">\n                        $1\n                    </div>\n            </div>\n            <div class=\"date-group flex-item\">\n                <div class=\"content-mask mask-top\"></div>\n                <div class=\"content-mask mask-bottom\"></div>\n                <div class=\"date-item\">\n                    $2\n                </div>\n            </div>\n            <div class=\"date-group flex-item\">\n                <div class=\"content-mask mask-top\"></div>\n                <div class=\"content-mask mask-bottom\"></div>\n                <div class=\"date-item\">\n                    $3\n                </div>\n            </div>\n        </div>\n\n    </div>\n</div>\n";
exports.minutePicker = "\n<div class=\"picker-wrapper picker-type__minute\">\n    <div class=\"picker-head flex space-between\">\n        <span class=\"cancel picker-btn__cancel\">\u53D6\u6D88</span>\n        <span class=\"sure picker-btn__sure\">\u786E\u5B9A</span>\n    </div>\n    <div class=\"picker-body\">\n        <div class=\"date-content flex\">\n\n            <div class=\"date-group flex-item\">\n                    <div class=\"content-mask mask-top\"></div>\n                    <div class=\"content-mask mask-bottom\"></div>\n                    <div class=\"date-item \">\n                        $1\n                    </div>\n            </div>\n            <div class=\"date-group flex-item\">\n                <div class=\"content-mask mask-top\"></div>\n                <div class=\"content-mask mask-bottom\"></div>\n                <div class=\"date-item\">\n                    $2\n                </div>\n            </div>\n            <div class=\"date-group flex-item\">\n                <div class=\"content-mask mask-top\"></div>\n                <div class=\"content-mask mask-bottom\"></div>\n                <div class=\"date-item\">\n                    $3\n                </div>\n            </div>\n        </div>\n\n        <span class=\"picker-minute-btn\"></span>\n        <div class=\"date-content date-content-minute flex\">\n            \n            <div class=\"date-group flex-item\">\n                    <div class=\"content-mask mask-top\"></div>\n                    <div class=\"content-mask mask-bottom\"></div>\n                    <div class=\"date-item \">\n                        $4\n                    </div>\n            </div>\n            <div class=\"date-group flex-item\">\n                <div class=\"content-mask mask-top\"></div>\n                <div class=\"content-mask mask-bottom\"></div>\n                <div class=\"date-item\">\n                    $5\n                </div>\n            </div>\n        </div>\n\n    </div>\n</div>\n";

},{}],9:[function(require,module,exports){
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

Object.defineProperty(exports, "__esModule", { value: true });
// import { resolve } from "any-promise";
var utils_1 = require("./utils");

var Touchs = function (_utils_1$default) {
    _inherits(Touchs, _utils_1$default);

    function Touchs(target) {
        _classCallCheck(this, Touchs);

        // 辅助类参数
        var _this2 = _possibleConstructorReturn(this, (Touchs.__proto__ || Object.getPrototypeOf(Touchs)).call(this));

        _this2.bool = true;
        _this2.limit = 0; //限流
        _this2._startTime = 0;
        _this2._endTime = 0;
        _this2._supportTouch = "ontouchend" in document; //判断浏览器是否支持touch
        _this2._touchName = {};
        _this2._startCb = null;
        _this2._moveCb = null;
        _this2._endCb = null;
        _this2._touchStartHander = null;
        _this2._touchMoveHander = null;
        _this2._touchEndHander = null;
        // console.log('init')
        _this2._target = target;
        _this2.touchName = {
            start: _this2._supportTouch ? 'touchstart' : 'mousedown',
            move: _this2._supportTouch ? 'touchmove' : 'mousemove',
            end: _this2._supportTouch ? 'touchend' : 'mouseup'
        };
        return _this2;
    }

    _createClass(Touchs, [{
        key: "init",
        value: function init(params) {
            this._startCb = params.startCb;
            this._moveCb = params.moveCb;
            this._endCb = params.endCb;
            this.touchStart();
        }
    }, {
        key: "binds",
        value: function binds(obj, fn) {
            var _arguments = arguments;

            return function (e) {
                // console.log('arg',e); 
                _arguments[0] = e;
                fn.apply(obj, _arguments);
            };
        }
    }, {
        key: "touchStart",
        value: function touchStart() {
            // touchstart:
            // 1. 给target绑定touch事件
            // console.log(this.target)  
            var _this = this;
            this._touchStartHander = this.binds(this, this.touchStartHander);
            this._touchMoveHander = this.binds(this, this.touchMoveHander);
            this._touchEndHander = this.binds(this, this.touchEndHander);
            _this.target.addEventListener(this.touchName.start, this._touchStartHander, false);
        }
    }, {
        key: "touchStartHander",
        value: function touchStartHander() {
            var e = arguments[0];
            this.startY = this._supportTouch ? e.touches[0].pageY : e.pageY;
            this._startTime = new Date().getTime();
            this._startCb(e);
            this.target.addEventListener(this.touchName.move, this._touchMoveHander, false);
            this.target.addEventListener(this.touchName.end, this._touchEndHander, false);
            this.target.addEventListener('touchcancel', this._touchEndHander, false);
        }
    }, {
        key: "touchMoveHander",
        value: function touchMoveHander() {
            var e = arguments[0];
            e.stopPropagation();
            e.preventDefault();
            // 限流-start
            this.limit++;
            if (this.limit >= 5) {
                this.limit = 0;
                this.bool = true;
            }
            if (!this.bool) return;
            this.bool = false;
            // 限流-end
            var pageY = this._supportTouch ? e.touches[0].pageY : e.pageY;
            this.range = pageY - this._startY;
            this._moveCb(e, this.range);
        }
    }, {
        key: "touchEndHander",
        value: function touchEndHander() {
            var e = arguments[0];
            var _this = this;
            // this.target.removeEventListener(this.touchName.start,_this._touchStartHander,false);
            this.target.removeEventListener(this.touchName.move, this._touchMoveHander, false);
            this.target.removeEventListener(this.touchName.end, this._touchEndHander, false);
            this.target.removeEventListener('touchcancel', this._touchEndHander, false);
            this.endY = this.range || 0;
            // 随流效果
            this._endTime = new Date().getTime();
            var rangeTime = (this._endTime - this._startTime) / 1000; //单位: 秒
            if (this.endY !== 0) {
                var space = Math.floor(Math.abs(this.endY) / (rangeTime * 3));
                this.endY = this.endY > 0 ? this.endY + space : this.endY - space;
            }
            this._endCb(e, this.endY);
        }
    }, {
        key: "target",
        get: function get() {
            if (this._target) {
                return this._target;
            } else {
                console.error('Error: 没有找到target对象');
                return null;
            }
        }
    }, {
        key: "startY",
        get: function get() {
            return this._startY;
        },
        set: function set(val) {
            this._startY = val;
        }
    }, {
        key: "endY",
        get: function get() {
            return this._endY;
        },
        set: function set(val) {
            this._endY = val;
        }
    }, {
        key: "range",
        get: function get() {
            return this._range;
        },
        set: function set(val) {
            this._range = val;
        }
    }, {
        key: "touchName",
        get: function get() {
            return this._touchName;
        },
        set: function set(val) {
            this._touchName = val;
        }
    }]);

    return Touchs;
}(utils_1.default);

exports.default = Touchs;

},{"./utils":10}],10:[function(require,module,exports){
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

Object.defineProperty(exports, "__esModule", { value: true });
// 工具类

var Utils = function () {
    function Utils() {
        _classCallCheck(this, Utils);

        this._eventLists = {};
    }

    _createClass(Utils, [{
        key: "select",
        value: function select(elm, target) {
            if (target) {
                return target.querySelector(elm);
            }
            return document.querySelector(elm);
        }
    }, {
        key: "selectAll",
        value: function selectAll(elm, target) {
            if (target) {
                return target.querySelectorAll(elm);
            }
            return document.querySelectorAll(elm);
        }
    }, {
        key: "createElm",
        value: function createElm(target, label, className) {
            // 创建元素
            var $elm = document.createElement(label);
            $elm.classList.add(className);
            target.appendChild($elm);
            return $elm;
        }
    }, {
        key: "setCss",
        value: function setCss(target, css) {
            // 设置css样式
            for (var attr in css) {
                target.style[attr] = css[attr];
            }
        }
    }, {
        key: "sleep",
        value: function sleep(cb, timeout) {
            // 延迟
            setTimeout(cb, timeout);
        }
    }, {
        key: "getToday",
        value: function getToday(format) {
            // 获取今天的日期: 2019-01-01
            var date = new Date();
            var year = date.getFullYear();
            var month = date.getMonth() + 1;
            var day = date.getDate();
            month = month >= 10 ? month : '0' + month;
            day = day >= 10 ? day : '0' + day;
            return [year, month, day].join(format);
        }
    }, {
        key: "$on",
        value: function $on(eventName, fn) {
            // 订阅事件
            if (this._eventLists[eventName]) {
                this._eventLists[eventName].push(fn);
            } else {
                this._eventLists[eventName] = [fn];
                // console.log('eventLists',this._eventLists[eventName]);
            }
        }
    }, {
        key: "$emit",
        value: function $emit(eventName) {
            for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
                args[_key - 1] = arguments[_key];
            }

            // 触发事件
            if (this._eventLists[eventName]) {
                this._eventLists[eventName].forEach(function (fn, i) {
                    fn.apply(undefined, args);
                });
            }
        }
    }, {
        key: "assign",
        value: function assign(extended, options) {
            for (var property in options) {
                try {
                    if (options[property].constructor == Object) {
                        extended[property] = this.assign(extended[property], options[property]);
                    } else {
                        extended[property] = options[property];
                    }
                } catch (ex) {
                    extended[property] = options[property];
                }
            }
            return extended;
        }
        // 自定义提示

    }, {
        key: "Tip",
        value: function Tip(tipName, msg, timeout) {
            var $tip = this.select(tipName);
            var _this = this;
            if (!$tip) {
                $tip = this.createElm(document.body, 'div', tipName);
            }
            $tip.innerHTML = msg;
            this.setCss($tip, {
                'display': 'block',
                'opacity': '1'
            });
            this.sleep(function () {
                _this.setCss($tip, {
                    'opacity': '0'
                });
            }, timeout || 2000);
            this.sleep(function () {
                _this.setCss($tip, {
                    'display': 'none'
                });
            }, (timeout || 1000) + 300);
        }
    }, {
        key: "errorTip",
        value: function errorTip(msg, timeout) {
            var tipName = 'datePicker-errorTip';
            this.Tip(tipName, msg, timeout);
        }
    }, {
        key: "successTip",
        value: function successTip(msg, timeout) {
            var tipName = 'datePicker-successTip';
            this.Tip(tipName, msg, timeout);
        }
    }]);

    return Utils;
}();

exports.default = Utils;

},{}]},{},[3])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvdHMvYmFzZVBpY2tlci50cyIsInNyYy90cy9kYXRlUGlja2VyLnRzIiwic3JjL3RzL2luZGV4LnRzIiwic3JjL3RzL21pbnV0ZVBpY2tlci50cyIsInNyYy90cy9wb2x5ZmlsbC5qcyIsInNyYy90cy9yYW5nZVBpY2tlci50cyIsInNyYy90cy9zaW5nbGVQaWNrZXIudHMiLCJzcmMvdHMvdGVtcGxhdGUudHMiLCJzcmMvdHMvdG91Y2gudHMiLCJzcmMvdHMvdXRpbHMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7O0FDQUE7Ozs7Ozs7Ozs7O0FBRUEsSUFBQSxVQUFBLFFBQUEsU0FBQSxDQUFBO0FBR0EsSUFBQSxVQUFBLFFBQUEsU0FBQSxDQUFBOztJQWU4QixVOzs7QUFnRDFCLHdCQUFZLE9BQVosRUFBNEI7QUFBQTs7QUFBQTs7QUEvQ3BCLGVBQUEsSUFBQSxHQUFlLEVBQWYsQ0ErQ29CLENBL0NEO0FBQ25CLGVBQUEsT0FBQSxHQUFrQixFQUFsQixDQThDb0IsQ0E5Q0U7QUFDdEIsZUFBQSxJQUFBLEdBQWUsQ0FBZixDQTZDb0IsQ0E3Q0Y7QUFFaEIsZUFBQSxRQUFBLEdBQW1CLEVBQW5CLENBMkNrQixDQTNDSztBQUN2QixlQUFBLE1BQUEsR0FBaUIsRUFBakIsQ0EwQ2tCLENBMUNHO0FBRXJCLGVBQUEsYUFBQSxHQUFxQixJQUFyQixDQXdDa0IsQ0F4Q1M7QUFFM0IsZUFBQSxhQUFBLEdBQStCLEVBQS9CLENBc0NrQixDQXRDZ0I7QUFFbEMsZUFBQSxZQUFBLEdBQTJCLEVBQTNCLENBb0NrQixDQXBDYTtBQUUvQixlQUFBLElBQUEsR0FBWSxJQUFaLENBa0NrQixDQWxDQTtBQUVsQixlQUFBLFdBQUEsR0FBbUIsRUFBbkIsQ0FnQ2tCLENBaENLO0FBNEJqQztBQUNVLGVBQUEsT0FBQSxHQUFrQixDQUFsQixDQUdrQixDQUhHO0FBSzNCLGVBQUssR0FBTCxH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dGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbigpe2Z1bmN0aW9uIHIoZSxuLHQpe2Z1bmN0aW9uIG8oaSxmKXtpZighbltpXSl7aWYoIWVbaV0pe3ZhciBjPVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmU7aWYoIWYmJmMpcmV0dXJuIGMoaSwhMCk7aWYodSlyZXR1cm4gdShpLCEwKTt2YXIgYT1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK2krXCInXCIpO3Rocm93IGEuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixhfXZhciBwPW5baV09e2V4cG9ydHM6e319O2VbaV1bMF0uY2FsbChwLmV4cG9ydHMsZnVuY3Rpb24ocil7dmFyIG49ZVtpXVsxXVtyXTtyZXR1cm4gbyhufHxyKX0scCxwLmV4cG9ydHMscixlLG4sdCl9cmV0dXJuIG5baV0uZXhwb3J0c31mb3IodmFyIHU9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZSxpPTA7aTx0Lmxlbmd0aDtpKyspbyh0W2ldKTtyZXR1cm4gb31yZXR1cm4gcn0pKCkiLCIvLyDml7bpl7TpgInmi6nlmajmoLjlv4Pku6PnoIFcclxuXHJcbmltcG9ydCBVdGlscyBmcm9tICcuL3V0aWxzJztcclxuXHJcbmltcG9ydCAqIGFzIHRlbXAgZnJvbSAnLi90ZW1wbGF0ZSc7XHJcbmltcG9ydCBUb3VjaHMgZnJvbSAnLi90b3VjaCc7XHJcblxyXG4vLyBwaWNrZXLlj4LmlbDmjqXlj6NcclxuaW50ZXJmYWNlIHBpY2tlcnMge1xyXG4gICAgICAgIHN0YXJ0WWVhcj86IHN0cmluZztcclxuICAgICAgICBlbmRZZWFyPzogc3RyaW5nO1xyXG4gICAgICAgIGRlZmF1bHREYXRlPzogc3RyaW5nO1xyXG4gICAgICAgIGtleT86IG51bWJlcjtcclxuICAgICAgICBvdXRGb3JtYXQgPzogc3RyaW5nO1xyXG4gICAgICAgIG9uY2hhbmdlPzogRnVuY3Rpb247IFxyXG4gICAgICAgIHN1Y2Nlc3M/OiBGdW5jdGlvbjtcclxuICAgICAgICB0eXBlPzogc3RyaW5nOyAvL+mAieaLqeWZqOexu+Wei++8mnNpbmdsZSwgcmFuZ2UsIG1pbnV0ZVxyXG5cclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgYWJzdHJhY3QgY2xhc3MgQmFzZVBpY2tlciBleHRlbmRzIFV0aWxzIHtcclxuICAgIHByaXZhdGUgX29wdDogb2JqZWN0ID0ge307IC8v5YWo5bGA6YWN572uXHJcbiAgICBwcml2YXRlIF9wYXJhbXM6IG9iamVjdCA9IHt9OyAvL+WIneWni+WMlumFjee9rlxyXG4gICAgcHJpdmF0ZSBfa2V5OiBudW1iZXIgPSAxOyAvL+WUr+S4gGtleVxyXG5cclxuICAgIHByb3RlY3RlZCBtb250aFN0cjogc3RyaW5nID0gJyc7IC8v5pyI5Lu95a2X56ym5LiyXHJcbiAgICBwcm90ZWN0ZWQgZGF5U3RyOiBzdHJpbmcgPSAnJzsgLy/lpKnmlbDlrZfnrKbkuLJcclxuXHJcbiAgICBwcm90ZWN0ZWQgY3VycmVudFBpY2tlcjogYW55ID0gbnVsbDsgLy/kv53lrZjlvZPliY3mmL7npLrnmoTpgInmi6nlmahcclxuXHJcbiAgICBwcm90ZWN0ZWQgY3VycmVudEluZGV4czogQXJyYXk8bnVtYmVyPiA9IFtdOy8v5L+d5a2Y5b2T5YmN6YCJ5oup55qE5qC85a2Q57Si5byVXHJcblxyXG4gICAgcHJvdGVjdGVkIGN1cnJlbnRWYWx1ZTogQXJyYXk8YW55PiA9IFtdOyAvL+S/neWtmOW9k+WJjemAieaLqeeahOWAvCBcclxuXHJcbiAgICBwcm90ZWN0ZWQgbWFzazogYW55ID0gbnVsbDsgLy/kv53lrZjllK/kuIDnmoTpga7nvalcclxuXHJcbiAgICBwcm90ZWN0ZWQgZGVmYXVsdEluZm86IGFueSA9IHt9OyAvL1xyXG5cclxuICAgIGdldCBvcHQoKTogYW55e1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9vcHQ7XHJcbiAgICB9XHJcblxyXG4gICAgc2V0IG9wdCh2YWw6IGFueSl7XHJcbiAgICAgICAgdGhpcy5fb3B0ID0gdmFsO1xyXG4gICAgfVxyXG5cclxuICAgIGdldCBwYXJhbXMoKTogcGlja2Vyc3tcclxuICAgICAgICByZXR1cm4gdGhpcy5fcGFyYW1zO1xyXG4gICAgfVxyXG5cclxuICAgIHNldCBwYXJhbXModmFsOiBwaWNrZXJzKXtcclxuICAgICAgICB0aGlzLl9wYXJhbXMgPSB2YWw7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0IGtleSgpOiBudW1iZXJ7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2tleTtcclxuICAgIH1cclxuXHJcbiAgICBzZXQga2V5KHZhbDogbnVtYmVyKXtcclxuICAgICAgICB0aGlzLl9rZXkgPSB2YWw7XHJcbiAgICB9XHJcblxyXG4gICAgXHJcblxyXG4gICAgLy8g6L6F5Yqp57G75Y+Y6YePXHJcbiAgICBwcm90ZWN0ZWQgX2hlaWdodCA6bnVtYmVyID0gMDsgLy/pgInmi6nlmajmoLzlrZDnmoTpq5jluqZcclxuICAgIFxyXG5cclxuICAgIGNvbnN0cnVjdG9yKG9wdGlvbnM/OiBvYmplY3QpeyAgXHJcbiAgICAgICAgc3VwZXIoKTsgIFxyXG4gICAgICAgIHRoaXMub3B0ID0gdGhpcy5hc3NpZ24oe1xyXG4gICAgICAgICAgICBvbmNoYW5nZTogKCk9Pnt9LFxyXG4gICAgICAgICAgICBzdWNjZXNzOiAoKT0+e31cclxuICAgICAgICB9LG9wdGlvbnMpO1xyXG4gICAgICAgIFxyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBwaWNrZXIocGFyYW1zPzogcGlja2Vycyl7XHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICog5Yid5aeL5YyW5pa55rOV77yM5LiN5bu66K6u5Zyo5b6q546v5Lit5oiW6ICF5LqL5Lu25Lit6YeN5aSN6LCD55SoXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgdGhpcy5wYXJhbXMgPSB0aGlzLmFzc2lnbih7IFxyXG4gICAgICAgICAgICBzdGFydFllYXI6ICcxOTkwJyxcclxuICAgICAgICAgICAgZW5kWWVhcjogJzIwMzAnLFxyXG4gICAgICAgICAgICBkZWZhdWx0RGF0ZTogdGhpcy5nZXRUb2RheSgnLScpLFxyXG4gICAgICAgICAgICBrZXk6IHRoaXMua2V5LFxyXG4gICAgICAgICAgICBvdXRGb3JtYXQ6ICctJyxcclxuICAgICAgICAgICAgb25jaGFuZ2U6ICgpPT57fSxcclxuICAgICAgICAgICAgc3VjY2VzczogKCk9Pnt9LFxyXG4gICAgICAgICAgICB0eXBlOiAncmFuZ2UnXHJcbiAgICAgICAgfSxwYXJhbXMpO1xyXG5cclxuICAgICAgICBcclxuICAgICAgICB0aGlzLnJlbmRlcigpO1xyXG5cclxuICAgIH1cclxuXHJcbiAgICAvLyBhYnN0cmFjdCByZW5kZXIoKSA6dm9pZDtcclxuXHJcbiAgICBwdWJsaWMgcmVuZGVyKCl7IFxyXG4gICAgICAgIC8vIOa4suafk+WHveaVsO+8jOS4gOiIrOimgeWcqOWtkOexu+mHjeWGmVxyXG4gICAgICAgIHRoaXMuY3JlYXRlTWFzaygpO1xyXG4gICAgICAgIHRoaXMuY3JlYXRlUGlja2VyKCk7XHJcbiAgICAgICAgXHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGNyZWF0ZU1hc2soKXtcclxuICAgICAgICAvLyDliJvlu7rokpnniYhcclxuICAgICAgICBsZXQgbWFza05hbWUgPSBgcGlja2VyLW1hc2tgO1xyXG4gICAgICAgIGxldCAkbWFzayA9IHRoaXMuc2VsZWN0KGAuJHttYXNrTmFtZX1gKTtcclxuICAgICAgICBsZXQgX3RoaXMgPSB0aGlzO1xyXG4gICAgICAgIGlmKCEkbWFzayl7XHJcbiAgICAgICAgICAgICRtYXNrID0gdGhpcy5jcmVhdGVFbG0oZG9jdW1lbnQuYm9keSwnZGl2JyxtYXNrTmFtZSk7XHJcbiAgICAgICAgICAgIHRoaXMuc2V0Q3NzKCRtYXNrLHtcclxuICAgICAgICAgICAgICAgICd0cmFuc2l0aW9uJzogJzAuM3MgYWxsIGxpbmVhcicsXHJcbiAgICAgICAgICAgICAgICAnb3BhY2l0eSc6ICcwJyxcclxuICAgICAgICAgICAgICAgICdkaXNwbGF5JzogJ25vbmUnXHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMubWFzayA9ICRtYXNrO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBjcmVhdGVQaWNrZXIoKXsgXHJcbiAgICAgICAgLy8g5Yib5bu66YCJ5oup5ZmoXHJcblxyXG4gICAgICAgIGxldCBwaWNrZXJOYW1lID0gYHBpY2tlci1rZXktJHt0aGlzLnBhcmFtcy5rZXl9YDtcclxuICAgICAgICBsZXQgJHBpY2tlciA9IHRoaXMuc2VsZWN0KGAuJHtwaWNrZXJOYW1lfWApO1xyXG4gICAgICAgIGxldCAkcGlja2VyV3JhcHBlciA9IHRoaXMuc2VsZWN0KGAuJHtwaWNrZXJOYW1lfSAucGlja2VyLXdyYXBwZXJgKTtcclxuICAgICAgICBsZXQgX3RoaXMgPSB0aGlzO1xyXG4gICAgICAgIFxyXG4gICAgICAgIGlmKCEkcGlja2VyKXtcclxuICAgICAgICAgICAgdGhpcy5tb250aFN0ciA9IHRoaXMuY3JlYXRlTW9udGhTdHIoKTtcclxuICAgICAgICAgICAgdGhpcy5kYXlTdHIgPSB0aGlzLmNyZWF0ZURheVN0cigpO1xyXG4gICAgICAgICAgICBsZXQgcGlja2VySHRtbCA9IHRoaXMucmVuZGVySHRtbCgpO1xyXG5cclxuICAgICAgICAgICAgJHBpY2tlciA9IHRoaXMuY3JlYXRlRWxtKGRvY3VtZW50LmJvZHksJ2RpdicscGlja2VyTmFtZSk7XHJcbiAgICAgICAgICAgICRwaWNrZXIuaW5uZXJIVE1MID0gcGlja2VySHRtbDtcclxuICAgICAgICAgICAgJHBpY2tlcldyYXBwZXIgPSB0aGlzLnNlbGVjdChgLiR7cGlja2VyTmFtZX0gLnBpY2tlci13cmFwcGVyYCk7XHJcbiAgICAgICAgICAgIHRoaXMuc2V0Q3NzKCRwaWNrZXJXcmFwcGVyLHtcclxuICAgICAgICAgICAgICAgICd0cmFuc2l0aW9uJzogJzAuM3MgYWxsIGxpbmVhcicsXHJcbiAgICAgICAgICAgICAgICAndHJhbnNmb3JtJzogJ3RyYW5zbGF0ZVkoMTAwJSknXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICBpZighX3RoaXMuX2hlaWdodCl7XHJcbiAgICAgICAgICAgICAgICBfdGhpcy5faGVpZ2h0ID0gX3RoaXMuc2VsZWN0KCcuZGF0ZS11bml0JywkcGlja2VyKS5jbGllbnRIZWlnaHQ7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdGhpcy5jdXJyZW50UGlja2VyID0gJHBpY2tlciB8fCB7fTsgLy/kv53lrZjlvZPliY3nmoTpgInmi6nlmahcclxuICAgICAgICAgICAgdGhpcy5jdXJyZW50UGlja2VyLnllYXJzID0gdGhpcy5nZXRZZWFyQXJyYXkoKTtcclxuICAgICAgICAgICAgdGhpcy5zZXREZWZhdWx0Vmlldyh0aGlzLnBhcmFtcy5kZWZhdWx0RGF0ZSk7IC8v6K6+572u6buY6K6k5pel5pyf55qE6KeG5Zu+XHJcbiAgICAgICAgICAgIHRoaXMuYmluZEV2ZW50cygpO1xyXG4gICAgICAgICAgICB0aGlzLnBpY2tlck9wZXJhdGlvbigpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8g5re75Yqg5pi+56S654q25oCBXHJcbiAgICAgICAgJHBpY2tlci5jbGFzc0xpc3QuYWRkKCdfX3BpY2tlci10eXBlLXNob3cnKTtcclxuICAgICAgICB0aGlzLmN1cnJlbnRQaWNrZXIgPSAkcGlja2VyIHx8IHt9OyAvL+S/neWtmOW9k+WJjeeahOmAieaLqeWZqFxyXG4gICAgICAgIHRoaXMuY3VycmVudFBpY2tlci55ZWFycyA9IHRoaXMuZ2V0WWVhckFycmF5KCk7XHJcbiAgICB9XHJcblxyXG4gICAgYWJzdHJhY3QgcmVuZGVySHRtbCgpOiBzdHJpbmdcclxuXHJcbiAgICBcclxuXHJcbiAgICBwdWJsaWMgZ2V0WWVhckFycmF5KCk6IEFycmF5PG51bWJlcj57XHJcbiAgICAgICAgbGV0IHllYXJzID0gW107XHJcbiAgICAgICAgbGV0IHN0YXJ0WWVhcjogYW55ID0gIHRoaXMucGFyYW1zLnN0YXJ0WWVhcjtcclxuICAgICAgICBsZXQgZW5kWWVhcjogYW55ID0gdGhpcy5wYXJhbXMuZW5kWWVhcjtcclxuICAgICAgICBmb3IobGV0IGk9c3RhcnRZZWFyLTA7aTw9ZW5kWWVhci0wO2krKyl7XHJcbiAgICAgICAgICAgIHllYXJzLnB1c2goaSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB5ZWFycztcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgY3JlYXRlWWVhclN0cigpOiBzdHJpbmd7XHJcbiAgICAgICAgLy8g5Yib5bu65bm0XHJcbiAgICAgICAgbGV0IHllYXJzID0gW107XHJcbiAgICAgICAgbGV0IHN0YXJ0WWVhcjogYW55ID0gIHRoaXMucGFyYW1zLnN0YXJ0WWVhcjtcclxuICAgICAgICBsZXQgZW5kWWVhcjogYW55ID0gdGhpcy5wYXJhbXMuZW5kWWVhcjtcclxuICAgICAgICBmb3IobGV0IGk9c3RhcnRZZWFyLTA7aTw9ZW5kWWVhci0wO2krKyl7XHJcbiAgICAgICAgICAgIHllYXJzLnB1c2goaSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGxldCBodG1sID0gJyc7XHJcbiAgICAgICAgeWVhcnMuZm9yRWFjaCgoaXRlbSxpKT0+e1xyXG4gICAgICAgICAgICBodG1sKz0gYDxwIGNsYXNzPVwiZGF0ZS11bml0XCIgZGF0YS15ZWFyPVwiJHtpdGVtfVwiPiR7aXRlbX3lubQ8L3A+YDtcclxuICAgICAgICB9KTtcclxuICAgICAgICAvLyBjb25zb2xlLmxvZygneWVhcicsaHRtbCk7XHJcbiAgICAgICAgcmV0dXJuIGh0bWw7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGNyZWF0ZU1vbnRoU3RyKCk6IHN0cmluZyB7XHJcbiAgICAgICAgLy8g5Yib5bu65pyIXHJcbiAgICAgICAgbGV0IG1vbnRocyA9IFtdO1xyXG4gICAgICAgIGZvcihsZXQgaT0xO2k8PTEyO2krKyl7XHJcbiAgICAgICAgICAgIG1vbnRocy5wdXNoKGkpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBsZXQgaHRtbCA9ICcnO1xyXG4gICAgICAgIG1vbnRocy5mb3JFYWNoKChpdGVtLGkpPT57XHJcbiAgICAgICAgICAgIGxldCBtb250aCA9IGl0ZW0+PTEwPyBpdGVtOiAnMCcraXRlbTtcclxuICAgICAgICAgICAgaHRtbCs9IGA8cCBjbGFzcz1cImRhdGUtdW5pdFwiIGRhdGEtbW9udGg9XCIke2l0ZW19XCI+JHttb250aH3mnIg8L3A+YDtcclxuICAgICAgICB9KTtcclxuICAgICAgICAvLyBjb25zb2xlLmxvZygnbW9udGgnLGh0bWwpO1xyXG4gICAgICAgIHJldHVybiBodG1sOyAgXHJcbiAgICB9ICBcclxuIFxyXG4gICAgcHVibGljIGNyZWF0ZURheVN0cigpOiBzdHJpbmcge1xyXG4gICAgICAgIC8vIOWIm+W7umRheVxyXG4gICAgICAgIGxldCBkYXlzID0gW107XHJcbiAgICAgICAgZm9yKGxldCBpPTE7aTw9MzE7aSsrKXtcclxuICAgICAgICAgICAgZGF5cy5wdXNoKGkpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBsZXQgaHRtbCA9ICcnO1xyXG4gICAgICAgIGRheXMuZm9yRWFjaCgoaXRlbSxpKT0+e1xyXG4gICAgICAgICAgICBsZXQgZGF5ID0gaXRlbT49MTA/IGl0ZW06ICcwJytpdGVtO1xyXG4gICAgICAgICAgICBodG1sKz0gYDxwIGNsYXNzPVwiZGF0ZS11bml0XCIgZGF0YS1kYXk9XCIke2l0ZW19XCI+JHtkYXl95pelPC9wPmA7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgLy8gY29uc29sZS5sb2coJ2RheScsaHRtbCk7XHJcbiAgICAgICAgcmV0dXJuIGh0bWw7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHNldERlZmF1bHRWaWV3KGRlZmF1bHREYXRlOiBzdHJpbmcpe1xyXG4gICAgICAgIGlmKCFkZWZhdWx0RGF0ZSl7XHJcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoJ0Vycm9yOiDpu5jorqTml6XmnJ8oZGVmYXVsdERhdGUp5LiN6IO95Li656m6Jyk7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgbGV0IGRhdGVBcnJheSA9IGRlZmF1bHREYXRlLnNwbGl0KCctJyk7XHJcbiAgICAgICAgaWYoIWRhdGVBcnJheSB8fCBkYXRlQXJyYXkubGVuZ3RoPDMpe1xyXG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKCdFcnJvcjrpu5jorqTml6XmnJ8oZGVmYXVsdERhdGUp55qE5qC85byP5pyJ6K+vLOm7mOiupOagvOW8jzoyMDE5LTAxLTAxIG9yIDIwMTktMS0xJyk7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgXHJcbiAgICAgICAgbGV0ICRwaWNrZXIgPSB0aGlzLmN1cnJlbnRQaWNrZXI7XHJcbiAgICAgICAgbGV0ICRkYXRlVXRpbHMgPSB0aGlzLnNlbGVjdEFsbCgnLmRhdGUtaXRlbScsJHBpY2tlcik7XHJcbiAgICAgICAgLy8geWVhclxyXG4gICAgICAgIGxldCB5ZWFySW5kZXggPSB0aGlzLmN1cnJlbnRUb0luZGV4KHBhcnNlSW50KGRhdGVBcnJheVswXSktcGFyc2VJbnQodGhpcy5wYXJhbXMuc3RhcnRZZWFyKSk7XHJcbiAgICAgICAgdGhpcy5zZXRDc3MoJGRhdGVVdGlsc1swXSx7XHJcbiAgICAgICAgICAgICd0cmFuc2Zvcm0nOmB0cmFuc2xhdGVZKCR7eWVhckluZGV4KnRoaXMuX2hlaWdodH1weClgXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgLy8gbW9udGhcclxuICAgICAgICBsZXQgbW9udGhJbmRleCA9IHRoaXMuY3VycmVudFRvSW5kZXgocGFyc2VJbnQoZGF0ZUFycmF5WzFdKS0xKTtcclxuXHJcbiAgICAgICAgdGhpcy5zZXRDc3MoJGRhdGVVdGlsc1sxXSx7XHJcbiAgICAgICAgICAgICd0cmFuc2Zvcm0nOmB0cmFuc2xhdGVZKCR7bW9udGhJbmRleCp0aGlzLl9oZWlnaHR9cHgpYFxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICAvLyBtb250aFxyXG4gICAgICAgIGxldCBkYXlJbmRleCA9IHRoaXMuY3VycmVudFRvSW5kZXgocGFyc2VJbnQoZGF0ZUFycmF5WzJdKS0xKTtcclxuICAgICAgICB0aGlzLnNldENzcygkZGF0ZVV0aWxzWzJdLHtcclxuICAgICAgICAgICAgJ3RyYW5zZm9ybSc6YHRyYW5zbGF0ZVkoJHtkYXlJbmRleCp0aGlzLl9oZWlnaHR9cHgpYFxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHRoaXMuZGVmYXVsdEluZm8gPSB7XHJcbiAgICAgICAgICAgIGRhdGVBcnJheTogZGF0ZUFycmF5LFxyXG4gICAgICAgICAgICBoZWlnaHRBcnJheTogW3llYXJJbmRleCp0aGlzLl9oZWlnaHQsbW9udGhJbmRleCp0aGlzLl9oZWlnaHQsZGF5SW5kZXgqdGhpcy5faGVpZ2h0XVxyXG4gICAgICAgIH0gO1xyXG5cclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgYmluZEV2ZW50cygpe1xyXG4gICAgICAgIGlmKCF0aGlzLmN1cnJlbnRQaWNrZXIpe1xyXG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKCdFcnJvcjog6YCJ5oup5Zmo6L+Y5rKh5pyJ5riy5p+TJyk7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG5cclxuXHJcbiAgICAgICAgbGV0ICRkYXRlR3JvdXBzID0gdGhpcy5zZWxlY3RBbGwoJy5kYXRlLWdyb3VwJyx0aGlzLmN1cnJlbnRQaWNrZXIpO1xyXG4gICAgICAgIGxldCBfdGhpcyA9IHRoaXM7XHJcbiAgICAgICAgQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoJGRhdGVHcm91cHMpLmZvckVhY2goKGRhdGVHcm91cCxpKT0+e1xyXG4gICAgICAgICAgICBsZXQgJGRhdGVVdGlscyA9IF90aGlzLnNlbGVjdCgnLmRhdGUtaXRlbScsZGF0ZUdyb3VwKTtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIF90aGlzLnNldENzcygkZGF0ZVV0aWxzLHtcclxuICAgICAgICAgICAgICAgICd0cmFuc2l0aW9uJzonMC4xcyBhbGwgbGluZWFyJyBcclxuICAgICAgICAgICAgfSk7ICAgXHJcbiAgICAgICAgICAgIC8vIOazqOaEj++8mkVuZFnnmoTlgLzkuI3lupTor6XkuLow77yM6ICM5piv6LCD55So6buY6K6k6KeG5Zu+5Ye95pWw5ZCO55qE6Led56a7XHJcbiAgICAgICAgICAgIGxldCBFbmRZOiBudW1iZXIgPSB0aGlzLmRlZmF1bHRJbmZvLmhlaWdodEFycmF5W2ldO1xyXG5cclxuICAgICAgICAgICAgbGV0IHRvdWNocyA9IG5ldyBUb3VjaHMoZGF0ZUdyb3VwKTtcclxuICAgICAgICAgICAgdG91Y2hzLmluaXQoe1xyXG4gICAgICAgICAgICAgICAgc3RhcnRDYjogKGU6IGFueSwgcmFuZ2U6IG51bWJlcik9PntcclxuICAgICAgICAgICAgICAgICAgICBfdGhpcy50b3VjaFN0YXJ0KGUsJGRhdGVVdGlscyk7XHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgbW92ZUNiOiAoZTogYW55LCByYW5nZTogbnVtYmVyKT0+e1xyXG4gICAgICAgICAgICAgICAgICAgIF90aGlzLnRvdWNoTW92ZShlLHJhbmdlLEVuZFksJGRhdGVVdGlscyk7IFxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIGVuZENiOiAoZTphbnksIGVuZFk6IG51bWJlcik9PntcclxuICAgICAgICAgICAgICAgICAgICBFbmRZID0gX3RoaXMudG91Y2hFbmQoZSxlbmRZLEVuZFksICRkYXRlVXRpbHMsaSk7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coJ3RvdWNoRW5kJyxFbmRZKSBcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSlcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgdGhpcy5tYXNrLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJyx0aGlzLmhpZGUuYmluZChfdGhpcykpO1xyXG5cclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHRvdWNoU3RhcnQoZTogYW55LCB0YXJnZXQ6IGFueSl7XHJcbiAgICAgICAgLy8gY29uc29sZS5sb2coJ3N0YXJ0Jyk7XHJcbiAgICAgICAgdGhpcy5zZXRDc3ModGFyZ2V0LHtcclxuICAgICAgICAgICAgJ3RyYW5zaXRpb24nOicuM3MgYWxsIGxpbmVhcicsXHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSB0b3VjaE1vdmUoZTogYW55LCByYW5nZTogbnVtYmVyLCBFbmRZOiBudW1iZXIsIHRhcmdldDogYW55KXtcclxuICAgICAgICB0aGlzLnNldENzcyh0YXJnZXQse1xyXG4gICAgICAgICAgICAndHJhbnNmb3JtJzogYHRyYW5zbGF0ZVkoJHtFbmRZK3JhbmdlKjF9cHgpYFxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgdG91Y2hFbmQoZTogYW55LCBlbmRZOiBudW1iZXIsIEVuZFk6IG51bWJlciwgdGFyZ2V0OiBhbnksIEluZGV4OiBudW1iZXIpe1xyXG4gICAgICAgIEVuZFkgPSBFbmRZK2VuZFk7XHJcbiAgICAgICAgbGV0IG1pbiA9IEVuZFkgPjA/TWF0aC5mbG9vcihFbmRZIC8gdGhpcy5faGVpZ2h0KTogTWF0aC5jZWlsKEVuZFkgLyB0aGlzLl9oZWlnaHQpO1xyXG4gICAgICAgIGxldCBtYXggPSBFbmRZID4wPyBtaW4rMTogbWluLTE7XHJcbiAgICAgICAgbGV0IG1pZGRsZSA9IChtYXgrbWluKS8yKnRoaXMuX2hlaWdodDtcclxuICAgICAgICBsZXQgY3VycmVudCA9IDA7XHJcbiAgICAgICAgdGhpcy5jdXJyZW50VmFsdWUgPSB0aGlzLmRlZmF1bHRJbmZvLmRhdGVBcnJheTtcclxuICAgICAgICAvLyBjb25zb2xlLmxvZygnbWluJyxtaW4pO1xyXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKCdtaWRkbGUnLG1pZGRsZSk7XHJcbiAgICAgICAgLy8gY29uc29sZS5sb2coJ0VuZFknLCBFbmRZKTtcclxuICAgICAgICBpZihNYXRoLmFicyhFbmRZKT49TWF0aC5hYnMobWlkZGxlKSl7XHJcbiAgICAgICAgICAgIEVuZFkgPSBtYXgqdGhpcy5faGVpZ2h0O1xyXG4gICAgICAgICAgICBjdXJyZW50ID0gbWF4O1xyXG4gICAgICAgIH1lbHNle1xyXG4gICAgICAgICAgICBFbmRZID0gbWluKnRoaXMuX2hlaWdodDtcclxuICAgICAgICAgICAgY3VycmVudCA9IG1pbjtcclxuICAgICAgICB9XHJcbiAgICAgICAgLy8g5YWz5LqO5qC85a2Q55qE5pWw6YePXHJcbiAgICAgICAgLy8g5Y+q5pyJ5bm05ZKM5pel5piv5Y+Y5YyW55qE77yM5pyI5Lu96YO95piv5Zu65a6a55qEKDEyKVxyXG4gICAgICAgIHZhciBjb3VudHMgPSAwO1xyXG4gICAgICAgIHN3aXRjaCAoSW5kZXgpIHtcclxuICAgICAgICAgICAgY2FzZSAwOiAvL+W5tFxyXG4gICAgICAgICAgICAgICAgY291bnRzID0gdGhpcy5jdXJyZW50UGlja2VyLnllYXJzLmxlbmd0aDtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIDE6IC8v5pyIXHJcbiAgICAgICAgICAgICAgICBjb3VudHMgPSAxMjtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIDI6IC8v5pelXHJcbiAgICAgICAgICAgICAgICAvLyBUb2RvXHJcbiAgICAgICAgICAgICAgICBjb3VudHMgPSB0aGlzLmdldERheSgpO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgMzogLy/lsI/ml7ZcclxuICAgICAgICAgICAgICAgIGNvdW50cyA9IDI0O1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgNDogLy/liIbpkp9cclxuICAgICAgICAgICAgICAgIGNvdW50cyA9IDYwO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgXHJcbiAgICAgICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICB9XHJcbiAgICAgICAgLy8g6YC76L6R77yaXHJcbiAgICAgICAgLy8g5qC55o2u6aG16Z2i5Liq57uT5p6E77yM5q+P5Liq6YCJ5oup5Zmo5Y+q5pi+56S6M+S4quagvOWtkO+8jOaJgOS7peS4reW/g+eahOaYrzJcclxuICAgICAgICAvLyDpgqPkuYjlpLTpg6jkuI3og73otoXov4fnmoTot53nprvmmK8gMSpoZWlnaHRcclxuICAgICAgICAvLyDlupXpg6jkuI3og73otoXov4fnmoTot53nprvmmK8tKOagvOWtkOaVsOmHjy0yKSpoZWlnaHRcclxuICAgICAgICBpZihFbmRZPjEqdGhpcy5faGVpZ2h0KXtcclxuICAgICAgICAgICAgRW5kWSA9IDEqdGhpcy5faGVpZ2h0O1xyXG4gICAgICAgICAgICBjdXJyZW50ID0gMTtcclxuICAgICAgICB9ZWxzZSBpZihNYXRoLmFicyhFbmRZKT5NYXRoLmFicygtKGNvdW50cy0yKSp0aGlzLl9oZWlnaHQpKXtcclxuICAgICAgICAgICAgRW5kWSA9IC0oY291bnRzLTIpKnRoaXMuX2hlaWdodDtcclxuICAgICAgICAgICAgY3VycmVudCA9IC0oY291bnRzLTIpO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLmN1cnJlbnRJbmRleHNbSW5kZXhdID0gY3VycmVudDsgLy/kv53lrZjlvZPliY3nmoTmoLzlrZDntKLlvJVcclxuICAgICAgICBsZXQgYXJyYXlJbmRleCA9IHRoaXMuY3VycmVudFRvSW5kZXgoY3VycmVudCk7IC8v5oqK5qC85a2Q57Si5byV6L2s5oiQ5pWw57uE57Si5byVXHJcbiAgICAgICAgaWYoSW5kZXg9PTApe1xyXG4gICAgICAgICAgICAvLyDlj6rmnInlubTpnIDopoHku47mlbDnu4TkuK3or7vlj5blgLxcclxuICAgICAgICAgICAgdGhpcy5jdXJyZW50VmFsdWVbSW5kZXhdID0gdGhpcy5jdXJyZW50UGlja2VyLnllYXJzW2FycmF5SW5kZXhdO1xyXG4gICAgICAgIH1lbHNlIGlmKEluZGV4PT0xIHx8IEluZGV4PT0yKXtcclxuICAgICAgICAgICAgdGhpcy5jdXJyZW50VmFsdWVbSW5kZXhdID0gYXJyYXlJbmRleCsxPj0xMD9hcnJheUluZGV4KzE6JzAnKyhhcnJheUluZGV4KzEpO1xyXG4gICAgICAgIH1lbHNle1xyXG4gICAgICAgICAgICB0aGlzLmN1cnJlbnRWYWx1ZVtJbmRleF0gPSBhcnJheUluZGV4Pj0xMD9hcnJheUluZGV4OicwJythcnJheUluZGV4O1xyXG5cclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5zZXRDc3ModGFyZ2V0LHtcclxuICAgICAgICAgICAgJ3RyYW5zaXRpb24nOicuM3MgYWxsIGxpbmVhcicsXHJcbiAgICAgICAgICAgICd0cmFuc2Zvcm0nOiBgdHJhbnNsYXRlWSgke0VuZFl9cHgpYFxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICAvLyDosIPnlKhvbmNoYW5nZeWbnuiwg1xyXG4gICAgICAgIHRoaXMub3B0Lm9uY2hhbmdlKHRoaXMuY3VycmVudFZhbHVlKTtcclxuICAgICAgICB0aGlzLnBhcmFtcy5vbmNoYW5nZSh0aGlzLmN1cnJlbnRWYWx1ZSk7XHJcbiAgICAgICAgbGV0IGN1cnJlbnRWYWx1ZSA9IHRoaXMuY3VycmVudFZhbHVlLmpvaW4odGhpcy5wYXJhbXMub3V0Rm9ybWF0KTtcclxuXHJcbiAgICAgICAgdGhpcy4kZW1pdChgb25jaGFuZ2VfJHt0aGlzLnBhcmFtcy5rZXl9YCxjdXJyZW50VmFsdWUpO1xyXG4gICAgICAgIHJldHVybiBFbmRZO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBnZXREYXkoKXtcclxuICAgICAgICAvLyDojrflj5blvZPmnIjnmoTlpKnmlbBcclxuICAgICAgICBsZXQgX3RoaXMgPSB0aGlzO1xyXG4gICAgICAgIGxldCBkYXlzID0gbmV3IERhdGUodGhpcy5jdXJyZW50VmFsdWVbMF0sdGhpcy5jdXJyZW50VmFsdWVbMV0sMCkuZ2V0RGF0ZSgpO1xyXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKCdkYXlzJyxkYXlzKTtcclxuICAgICAgICBsZXQgJHVudGlzID0gdGhpcy5zZWxlY3RBbGwoJ1tkYXRhLWRheV0nLHRoaXMuY3VycmVudFBpY2tlcik7XHJcbiAgICAgICAgY29uc3QgZmFkZSA9IChpbmRleCxvcGFjaXR5KT0+e1xyXG4gICAgICAgICAgICBmb3IodmFyIGkgPSAzMDsgaT49aW5kZXg7aS0tKXtcclxuICAgICAgICAgICAgICAgIF90aGlzLnNldENzcygkdW50aXNbaV0se1xyXG4gICAgICAgICAgICAgICAgICAgICdvcGFjaXR5Jzogb3BhY2l0eVxyXG4gICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBzd2l0Y2ggKGRheXMpIHtcclxuICAgICAgICAgICAgY2FzZSAzMDpcclxuICAgICAgICAgICAgICAgIGZhZGUoMzAsJzAnKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG5cclxuICAgICAgICAgICAgY2FzZSAyODpcclxuICAgICAgICAgICAgICAgIGZhZGUoMjgsJzAnKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG5cclxuICAgICAgICAgICAgY2FzZSAzMTpcclxuICAgICAgICAgICAgICAgIGZhZGUoMjgsJzEnKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIFxyXG4gICAgICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBkYXlzO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBjdXJyZW50VG9JbmRleChjdXJyZW50OiBudW1iZXIpe1xyXG4gICAgICAgIC8vIOmAu+i+ke+8mlxyXG4gICAgICAgIC8vIOagueaNrumhtemdouW4g+WxgO+8jOW+l+adpeesrOS4gOS4quagvOWtkOaYr+ato+aVsO+8jOWFtuS7lueahOi3neemu+mDveaYr+i0n+aVsFxyXG4gICAgICAgIC8vIOaJgOS7peWPr+S7pemAmui/hygxLWN1cnJlbnQp5p2l6I635Y+W5b2T5YmN5qC85a2Q5pWw57uE55qE57Si5byVXHJcbiAgICAgICAgcmV0dXJuIDEtY3VycmVudDtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgaGlkZSgpe1xyXG4gICAgICAgIGxldCBfdGhpcyA9IHRoaXM7XHJcbiAgICAgICAgLy8g5YWz6Zet6YGu572pXHJcbiAgICAgICAgdGhpcy5zZXRDc3ModGhpcy5tYXNrLHtcclxuICAgICAgICAgICAgJ29wYWNpdHknOicwJ1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHRoaXMuc2xlZXAoKCk9PntcclxuICAgICAgICAgICAgX3RoaXMuc2V0Q3NzKF90aGlzLm1hc2sse1xyXG4gICAgICAgICAgICAgICAgJ2Rpc3BsYXknOidub25lJ1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9LDMwMCk7XHJcbiAgICAgICAgLy8g5YWz6Zet6YCJ5oup5ZmoXHJcbiAgICAgICAgbGV0ICRwaWNrZXJXcmFwcGVyID0gdGhpcy5zZWxlY3QoYC5waWNrZXItd3JhcHBlcmAsdGhpcy5jdXJyZW50UGlja2VyKTtcclxuICAgICAgICB0aGlzLnNldENzcygkcGlja2VyV3JhcHBlcix7XHJcbiAgICAgICAgICAgICd0cmFuc2Zvcm0nOid0cmFuc2xhdGVZKDEwMCUpJ1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHRoaXMuY3VycmVudFBpY2tlci5jbGFzc0xpc3QucmVtb3ZlKCdfX3BpY2tlci10eXBlLXNob3cnKTtcclxuICAgICAgICB0aGlzLmN1cnJlbnRQaWNrZXIuY2xhc3NMaXN0LmFkZCgnX19waWNrZXItdHlwZS1oaWRlJyk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHNob3coKXtcclxuXHJcbiAgICAgICAgdGhpcy5zZXRDc3ModGhpcy5tYXNrLHtcclxuICAgICAgICAgICAgJ29wYWNpdHknOiAnMScsXHJcbiAgICAgICAgICAgICdkaXNwbGF5JzogJ2Jsb2NrJ1xyXG4gICAgICAgIH0pXHJcblxyXG4gICAgICAgIGxldCAkcGlja2VyID0gdGhpcy5jdXJyZW50UGlja2VyO1xyXG4gICAgICAgIFxyXG4gICAgICAgIGlmKCEkcGlja2VyKXtcclxuICAgICAgICAgICAgbGV0IHRpcCA9IGBcclxuICAgICAgICAgICAg5rKh5pyJ6K+la2V5KCR7dGhpcy5wYXJhbXMua2V5fSnlgLznmoTpgInmi6nlmahcclxuICAgICAgICAgICAg6K+35qOA5p+l5piv5ZCm5YaZ6ZSZIVxyXG4gICAgICAgICAgICBgO1xyXG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKHRpcCk7XHJcbiAgICAgICAgICAgIHRoaXMuZXJyb3JUaXAodGlwKTtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICBsZXQgJHBpY2tlcldyYXBwZXIgPSB0aGlzLnNlbGVjdChgLnBpY2tlci13cmFwcGVyYCwkcGlja2VyKTtcclxuICAgICAgICB0aGlzLnNldENzcygkcGlja2VyV3JhcHBlcix7XHJcbiAgICAgICAgICAgICd0cmFuc2Zvcm0nOid0cmFuc2xhdGVZKDBweCknXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICRwaWNrZXIuY2xhc3NMaXN0LnJlbW92ZSgnX19waWNrZXItdHlwZS1oaWRlJyk7XHJcbiAgICAgICAgJHBpY2tlci5jbGFzc0xpc3QucmVtb3ZlKCdfX3BpY2tlci10eXBlLXNob3cnKTtcclxuXHJcbiAgICB9XHJcblxyXG4gICAgYWJzdHJhY3QgcmVWaWV3KGRhdGE6IGFueSkgOnZvaWQ7XHJcblxyXG4gICAgYWJzdHJhY3QgcGlja2VyT3BlcmF0aW9uKCk6IHZvaWQ7XHJcblxyXG59IiwiLy8gaW1wb3J0IFwiYmFiZWwtcG9seWZpbGxcIjtcclxuaW1wb3J0IHBvbHlmaWxsIGZyb20gICcuL3BvbHlmaWxsJzsgXHJcbnBvbHlmaWxsKCk7ICBcclxuaW1wb3J0IFV0aWxzIGZyb20gJy4vdXRpbHMnO1xyXG4vLyBpbXBvcnQgQmFzZVBpY2tlciBmcm9tICcuL2Jhc2VQaWNrZXInO1xyXG5pbXBvcnQgUmFuZ2VQaWNrZXIgZnJvbSAnLi9yYW5nZVBpY2tlcic7XHJcbmltcG9ydCBTaW5nbGVQaWNrZXIgZnJvbSAnLi9zaW5nbGVQaWNrZXInO1xyXG5pbXBvcnQgTWludXRlUGlja2VyIGZyb20gJy4vbWludXRlUGlja2VyJztcclxuXHJcblxyXG5pbnRlcmZhY2UgZ2xvYmFsT3B0IHtcclxuICAgIG1heEtleUNvdW50PzogbnVtYmVyLFxyXG4gICAgb25jaGFuZ2U/OiBGdW5jdGlvbixcclxuICAgIHN1Y2Nlc3M/OiBGdW5jdGlvblxyXG59XHJcbiBcclxuLy8gcGlja2Vy5Y+C5pWw5o6l5Y+jXHJcbmludGVyZmFjZSBwaWNrZXJzIHsgXHJcbiAgICBzdGFydFllYXI/OiBzdHJpbmc7XHJcbiAgICBlbmRZZWFyPzogc3RyaW5nO1xyXG4gICAgZGVmYXVsdERhdGU/OiBzdHJpbmc7XHJcbiAgICBrZXk/OiBudW1iZXI7XHJcbiAgICBvdXRGb3JtYXQgPzogc3RyaW5nO1xyXG4gICAgb25jaGFuZ2U/OiBGdW5jdGlvbjtcclxuICAgIHN1Y2Nlc3M/OiBGdW5jdGlvbjtcclxuICAgIHR5cGU/OiBzdHJpbmc7IC8v6YCJ5oup5Zmo57G75Z6L77yac2luZ2xlLCByYW5nZSwgXHJcblxyXG59XHJcblxyXG5jbGFzcyBEYXRlUGlja2VyIGV4dGVuZHMgVXRpbHN7XHJcbiAgICBjb25zdHJ1Y3Rvcigpe3N1cGVyKCl9XHJcbiAgICBwcml2YXRlIF9vcHQ6IGdsb2JhbE9wdCA9IHt9O1xyXG4gICAgcHJpdmF0ZSBfcGFyYW1zOiBvYmplY3QgPSB7fTsgLy/liJ3lp4vljJbphY3nva5cclxuICAgIHByaXZhdGUgX2tleTogbnVtYmVyID0gMTsgLy/llK/kuIBrZXlcclxuICAgIHByaXZhdGUgX2tleUxpc3Q6IEFycmF5PG51bWJlcj4gPSBbXTsgLy9rZXnliJfooahcclxuICAgIHByaXZhdGUgX3BpY2tlckxpc3Q6IEFycmF5PGFueT4gPSBbXTsgLy/kv53lrZjliJvlu7rnmoRwaWNrZXLlr7nosaFcclxuXHJcbiAgICBnZXQgb3B0KCk6IGdsb2JhbE9wdCB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX29wdDtcclxuICAgIH1cclxuXHJcbiAgICBzZXQgb3B0KHZhbDogZ2xvYmFsT3B0KSB7XHJcbiAgICAgICAgdGhpcy5fb3B0ID0gdmFsO1xyXG4gICAgfVxyXG5cclxuICAgIGdldCBwYXJhbXMoKTogcGlja2Vyc3tcclxuICAgICAgICByZXR1cm4gdGhpcy5fcGFyYW1zO1xyXG4gICAgfVxyXG5cclxuICAgIHNldCBwYXJhbXModmFsOiBwaWNrZXJzKXtcclxuICAgICAgICB0aGlzLl9wYXJhbXMgPSB2YWw7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0IGtleSgpOiBudW1iZXJ7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2tleTtcclxuICAgIH1cclxuXHJcbiAgICBzZXQga2V5KHZhbDogbnVtYmVyKXtcclxuICAgICAgICB0aGlzLl9rZXkgPSB2YWw7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0IGtleUxpc3QoKTogYW55e1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9rZXlMaXN0O1xyXG4gICAgfVxyXG5cclxuICAgIHNldCBrZXlMaXN0KHZhbDogYW55KXtcclxuICAgICAgICB0aGlzLl9rZXlMaXN0ID0gdmFsO1xyXG4gICAgfVxyXG5cclxuICAgIGdldCBwaWNrZXJMaXN0KCk6IGFueXtcclxuICAgICAgICByZXR1cm4gdGhpcy5fcGlja2VyTGlzdDtcclxuICAgIH1cclxuXHJcbiAgICBzZXQgcGlja2VyTGlzdCh2YWw6IGFueSl7XHJcbiAgICAgICAgdGhpcy5fcGlja2VyTGlzdCA9IHZhbDtcclxuICAgIH0gXHJcblxyXG5cclxuICAgIC8vIOi+heWKqeWPmOmHj1xyXG4gICAgcHJpdmF0ZSBfbWF4S2V5Q291bnQgOm51bWJlciA9IDEwOyAvL+WPr+WIm+W7uumAieaLqeWZqOeahOacgOWkp+aVsOmHj1xyXG5cclxuICAgIHB1YmxpYyBnbG9iYWxPcHRpb25zKG9wdD86IGdsb2JhbE9wdCl7XHJcbiAgICAgICAgdGhpcy5vcHQgPSB0aGlzLmFzc2lnbih7XHJcbiAgICAgICAgICAgIG1heEtleUNvdW50OiB0aGlzLl9tYXhLZXlDb3VudCxcclxuICAgICAgICAgICAgb25jaGFuZ2U6ICgpPT57fSxcclxuICAgICAgICAgICAgc3VjY2VzczogKCk9Pnt9XHJcbiAgICAgICAgfSxvcHQpO1xyXG5cclxuICAgICAgICB0aGlzLm9wdC5tYXhLZXlDb3VudCA9IHRoaXMub3B0Lm1heEtleUNvdW50ID4gMCAmJiB0aGlzLm9wdC5tYXhLZXlDb3VudDw9MjBcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA/IHRoaXMub3B0Lm1heEtleUNvdW50XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOiB0aGlzLl9tYXhLZXlDb3VudDtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgcGlja2VyKHBhcmFtcz86IHBpY2tlcnMpe1xyXG5cclxuICAgICAgICBsZXQgZGVmYXVsdERhdGUgPSBwYXJhbXMudHlwZSA9PSAnbWludXRlJz8gdGhpcy5nZXRUb2RheSgnLScpKycgMDA6MDAnOiB0aGlzLmdldFRvZGF5KCctJyk7XHJcblxyXG4gICAgICAgIHRoaXMucGFyYW1zID0gdGhpcy5hc3NpZ24oeyBcclxuICAgICAgICAgICAgc3RhcnRZZWFyOiAnMTk5MCcsXHJcbiAgICAgICAgICAgIGVuZFllYXI6ICcyMDMwJyxcclxuICAgICAgICAgICAgZGVmYXVsdERhdGU6IGRlZmF1bHREYXRlLFxyXG4gICAgICAgICAgICBrZXk6IHRoaXMua2V5LFxyXG4gICAgICAgICAgICBvdXRGb3JtYXQ6ICctJyxcclxuICAgICAgICAgICAgb25jaGFuZ2U6ICgpPT57fSxcclxuICAgICAgICAgICAgc3VjY2VzczogKCk9Pnt9LFxyXG4gICAgICAgICAgICB0eXBlOiAncmFuZ2UnXHJcbiAgICAgICAgfSxwYXJhbXMpO1xyXG5cclxuICAgICAgICAvLyDkv53lrZhrZXnlgLzvvIzlpoLmnpzliJfooajnmoRrZXnlgLzov4flpJrvvIznpoHmraLliJvlu7pcclxuICAgICAgICBpZighdGhpcy5rZXlMaXN0LmluY2x1ZGVzKHRoaXMucGFyYW1zLmtleSkpe1xyXG5cclxuICAgICAgICAgICAgdGhpcy5rZXlMaXN0LnB1c2godGhpcy5wYXJhbXMua2V5KTtcclxuICAgICAgICAgICAgdGhpcy5rZXkrPTE7XHJcbiAgICAgICAgICAgXHJcbiAgICAgICAgICAgIGxldCBwaWNrZXIgPSB0aGlzLnJlbmRlcigpOyBcclxuICAgICAgICAgICAgcGlja2VyLnBpY2tlcih0aGlzLnBhcmFtcyk7Ly/liJ3lp4vljJZcclxuICAgICAgICAgICAgdGhpcy5waWNrZXJMaXN0LnB1c2goe1xyXG4gICAgICAgICAgICAgICAga2V5OiB0aGlzLnBhcmFtcy5rZXksXHJcbiAgICAgICAgICAgICAgICBwaWNrZXI6IHBpY2tlclxyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmKHRoaXMua2V5TGlzdC5sZW5ndGg+dGhpcy5vcHQubWF4S2V5Q291bnQpe1xyXG4gICAgICAgICAgICBsZXQgdGlwID0gYFxyXG4gICAgICAgICAgICBFcnJvcjrmo4DmtYvliLDpobXpnaLkuIrliJvlu7rnmoTpgInmi6nlmajov4flpJohXHJcbiAgICAgICAgICAgIOivt+ajgOafpeS7o+eggeaYr+WQpuaciemXrumimFxyXG4gICAgICAgICAgICDor7fkuI3opoHlnKjlvqrnjq/miJbogIXkuovku7bkuK3ph43lpI3osIPnlKgucGlja2VyKCnmlrnms5VcclxuICAgICAgICAgICAg6Iul6Z2e6KaB5aaC5q2k6LCD55So77yM5LiA5a6a6KaB5Yqg5LiKa2V55bGe5oCnXHJcbiAgICAgICAgICAgIOW7uuiuruWcqOWklumdouiwg+eUqC5waWNrZXIoKeaWueazle+8jOWcqOmHjOmdouiwg+eUqC5zaG93KCnmlrnms5XmmL7npLpcclxuICAgICAgICAgICAgYDtcclxuICAgICAgICAgICAgY29uc29sZS5lcnJvcih0aXApO1xyXG4gICAgICAgICAgICB0aGlzLmVycm9yVGlwKHRpcCk7IFxyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBsZXQgcGlja2VyID0gdGhpcy5waWNrZXJMaXN0LmZpbmQoaXRlbT0+aXRlbS5rZXk9PXRoaXMucGFyYW1zLmtleSk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgaWYoIXBpY2tlcil7XHJcbiAgICAgICAgICAgIGxldCB0aXAgPSBgXHJcbiAgICAgICAgICAgIEVycm9yOuaJvuS4jeWIsOivpWtleSgke3RoaXMucGFyYW1zLmtleX0p55qE6YCJ5oup5ZmoLFxyXG4gICAgICAgICAgICDor7fmo4Dmn6Xku6PnoIHmmK/lkKbmnInpl67pophcclxuICAgICAgICAgICAgYDtcclxuICAgICAgICAgICAgY29uc29sZS5lcnJvcih0aXApO1xyXG4gICAgICAgICAgICB0aGlzLmVycm9yVGlwKHRpcCk7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBwaWNrZXIucGlja2VyOyBcclxuXHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSByZW5kZXIoKXtcclxuICAgICAgICBsZXQgcGlja2VyID0gbnVsbDtcclxuICAgICAgICBzd2l0Y2ggKHRoaXMucGFyYW1zLnR5cGUpIHtcclxuICAgICAgICAgICAgY2FzZSAncmFuZ2UnOlxyXG4gICAgICAgICAgICAgICAgcGlja2VyID0gbmV3IFJhbmdlUGlja2VyKHRoaXMub3B0KTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgY2FzZSAnc2luZ2xlJzpcclxuICAgICAgICAgICAgICAgIHBpY2tlciA9IG5ldyBTaW5nbGVQaWNrZXIodGhpcy5vcHQpO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgJ21pbnV0ZSc6XHJcbiAgICAgICAgICAgICAgICBwaWNrZXIgPSBuZXcgTWludXRlUGlja2VyKHRoaXMub3B0KTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIFxyXG4gICAgICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBwaWNrZXI7XHJcbiAgICB9XHJcblxyXG59XHJcblxyXG5jb25zdCBkYXRlUGlja2VyID0gbmV3IERhdGVQaWNrZXIoKTsgXHJcblxyXG5leHBvcnQgZGVmYXVsdCBkYXRlUGlja2VyOyAiLCJpbXBvcnQgZGF0ZVBpY2tlciBmcm9tICcuL2RhdGVQaWNrZXInOyBcclxuLy8gaW1wb3J0IHsgbW9kdWxlIH0gZnJvbSAnYnJvd3NlcmlmeS9saWIvYnVpbHRpbnMnO1xyXG4od2luZG93IGFzIGFueSkuZGF0ZVBpY2tlciA9IGRhdGVQaWNrZXI7XHJcbi8vIGNvbnNvbGUubG9nKGRhdGVQaWNrZXIpO1xyXG4vLyBtb2R1bGUuZXhwb3J0cyA9IGRhdGVQaWNrZXI7IFxyXG4iLCIvLyDml7bliIbpgInmi6nlmajmoLjlv4Pku6PnoIFcclxuaW1wb3J0ICogYXMgdGVtcCBmcm9tICcuL3RlbXBsYXRlJztcclxuaW1wb3J0IEJhc2VQaWNrZXIgZnJvbSAnLi9iYXNlUGlja2VyJztcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFNpbmdsZVBpY2tlciBleHRlbmRzIEJhc2VQaWNrZXIge1xyXG4gICAgcHJpdmF0ZSBjdXJyZW50SW5kZXggOm51bWJlciA9IDA7XHJcbiAgICBjb25zdHJ1Y3RvcihvcHRpb25zPzogb2JqZWN0KXsgIFxyXG4gICAgICAgIHN1cGVyKCk7ICBcclxuICAgICAgICB0aGlzLm9wdCA9IHRoaXMuYXNzaWduKHtcclxuICAgICAgICAgICAgb25jaGFuZ2U6ICgpPT57fSxcclxuICAgICAgICAgICAgc3VjY2VzczogKCk9Pnt9XHJcbiAgICAgICAgfSxvcHRpb25zKTtcclxuICAgICAgICBcclxuICAgIH1cclxuXHJcblxyXG4gICAgcHVibGljIHJlbmRlckh0bWwoKTogc3RyaW5ne1xyXG4gICAgICAgIC8vIOiOt+WPlmh0bWzmoLflvI/nmoTlh73mlbDvvIzms6jmhI/vvIzor6Xlh73mlbDkuIDoiKzopoHlnKjlrZDnsbvph43lhplcclxuICAgICAgICBsZXQgeWVhclN0ciA9IHRoaXMuY3JlYXRlWWVhclN0cigpO1xyXG4gICAgICAgIGxldCBob3VyU3RyID0gdGhpcy5jcmVhdGVIb3VyU3RyKCk7XHJcbiAgICAgICAgbGV0IG1pbnV0ZVN0ciA9IHRoaXMuY3JlYXRlTWludXRlU3RyKCk7XHJcbiAgICAgICAgcmV0dXJuIHRlbXAubWludXRlUGlja2VyLnJlcGxhY2UoJyQxJyx5ZWFyU3RyKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5yZXBsYWNlKCckMicsdGhpcy5tb250aFN0cilcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAucmVwbGFjZSgnJDMnLHRoaXMuZGF5U3RyKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5yZXBsYWNlKCckNCcsaG91clN0cilcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAucmVwbGFjZSgnJDUnLG1pbnV0ZVN0cik7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGNyZWF0ZUhvdXJTdHIoKTogc3RyaW5nIHtcclxuICAgICAgICAvLyDliJvlu7rlsI/ml7ZcclxuICAgICAgICBsZXQgaG91cnMgPSBbXTtcclxuICAgICAgICBmb3IobGV0IGk9MDtpPD0yMztpKyspe1xyXG4gICAgICAgICAgICBob3Vycy5wdXNoKGkpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBsZXQgaHRtbCA9ICcnO1xyXG4gICAgICAgIGhvdXJzLmZvckVhY2goKGl0ZW0saSk9PntcclxuICAgICAgICAgICAgbGV0IGhvdXIgPSBpdGVtPj0xMD8gaXRlbTogJzAnK2l0ZW07XHJcbiAgICAgICAgICAgIGh0bWwrPSBgPHAgY2xhc3M9XCJkYXRlLXVuaXRcIiBkYXRhLWhvdXI9XCIke2l0ZW19XCI+JHtob3VyfTwvcD5gO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHJldHVybiBodG1sO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBjcmVhdGVNaW51dGVTdHIoKTogc3RyaW5nIHtcclxuICAgICAgICAvLyDliJvlu7rliIbpkp9cclxuICAgICAgICBsZXQgbWludXRlcyA9IFtdO1xyXG4gICAgICAgIGZvcihsZXQgaT0wO2k8PTU5O2krKyl7XHJcbiAgICAgICAgICAgIG1pbnV0ZXMucHVzaChpKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgbGV0IGh0bWwgPSAnJztcclxuICAgICAgICBtaW51dGVzLmZvckVhY2goKGl0ZW0saSk9PntcclxuICAgICAgICAgICAgbGV0IG1pbnV0ZSA9IGl0ZW0+PTEwPyBpdGVtOiAnMCcraXRlbTtcclxuICAgICAgICAgICAgaHRtbCs9IGA8cCBjbGFzcz1cImRhdGUtdW5pdFwiIGRhdGEtbWludXRlPVwiJHtpdGVtfVwiPiR7bWludXRlfTwvcD5gO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHJldHVybiBodG1sO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgcmVzb2x2aW5nU3RyaW5nKHN0cjogc3RyaW5nKTogQXJyYXk8YW55PntcclxuICAgICAgICAvLyDop6PmnpDml6XmnJ/lrZfnrKbkuLJcclxuICAgICAgICBsZXQgYXJyYXkgPSBzdHIuc3BsaXQoJyAnKTtcclxuICAgICAgICByZXR1cm4gW10uY29uY2F0KGFycmF5WzBdLnNwbGl0KHRoaXMucGFyYW1zLm91dEZvcm1hdCksYXJyYXlbMV0uc3BsaXQoJzonKSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHNldERlZmF1bHRWaWV3KGRlZmF1bHREYXRlOiBzdHJpbmcpe1xyXG4gICAgICAgIGlmKCFkZWZhdWx0RGF0ZSl7XHJcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoJ0Vycm9yOiDpu5jorqTml6XmnJ8oZGVmYXVsdERhdGUp5LiN6IO95Li656m6Jyk7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgbGV0IGRhdGVBcnJheSA9IHRoaXMucmVzb2x2aW5nU3RyaW5nKGRlZmF1bHREYXRlKVxyXG4gICAgICAgIGlmKCFkYXRlQXJyYXkgfHwgZGF0ZUFycmF5Lmxlbmd0aDw1KXtcclxuICAgICAgICAgICAgY29uc29sZS5lcnJvcignRXJyb3I66buY6K6k5pel5pyfKGRlZmF1bHREYXRlKeeahOagvOW8j+acieivryzpu5jorqTmoLzlvI86MjAxOS0wMS0wMSAwMDowMCcpO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIFxyXG4gICAgICAgIGxldCAkcGlja2VyID0gdGhpcy5jdXJyZW50UGlja2VyO1xyXG4gICAgICAgIGxldCAkZGF0ZVV0aWxzID0gdGhpcy5zZWxlY3RBbGwoJy5kYXRlLWl0ZW0nLCRwaWNrZXIpO1xyXG4gICAgICAgIC8vIHllYXJcclxuICAgICAgICBsZXQgeWVhckluZGV4ID0gdGhpcy5jdXJyZW50VG9JbmRleChwYXJzZUludChkYXRlQXJyYXlbMF0pLXBhcnNlSW50KHRoaXMucGFyYW1zLnN0YXJ0WWVhcikpO1xyXG4gICAgICAgIHRoaXMuc2V0Q3NzKCRkYXRlVXRpbHNbMF0se1xyXG4gICAgICAgICAgICAndHJhbnNmb3JtJzpgdHJhbnNsYXRlWSgke3llYXJJbmRleCp0aGlzLl9oZWlnaHR9cHgpYFxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIC8vIG1vbnRoXHJcbiAgICAgICAgbGV0IG1vbnRoSW5kZXggPSB0aGlzLmN1cnJlbnRUb0luZGV4KHBhcnNlSW50KGRhdGVBcnJheVsxXSktMSk7XHJcblxyXG4gICAgICAgIHRoaXMuc2V0Q3NzKCRkYXRlVXRpbHNbMV0se1xyXG4gICAgICAgICAgICAndHJhbnNmb3JtJzpgdHJhbnNsYXRlWSgke21vbnRoSW5kZXgqdGhpcy5faGVpZ2h0fXB4KWBcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgLy8gZGF5XHJcbiAgICAgICAgbGV0IGRheUluZGV4ID0gdGhpcy5jdXJyZW50VG9JbmRleChwYXJzZUludChkYXRlQXJyYXlbMl0pLTEpO1xyXG4gICAgICAgIHRoaXMuc2V0Q3NzKCRkYXRlVXRpbHNbMl0se1xyXG4gICAgICAgICAgICAndHJhbnNmb3JtJzpgdHJhbnNsYXRlWSgke2RheUluZGV4KnRoaXMuX2hlaWdodH1weClgXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIC8vIOWwj+aXtlxyXG4gICAgICAgIGxldCBob3VySW5kZXggPSB0aGlzLmN1cnJlbnRUb0luZGV4KHBhcnNlSW50KGRhdGVBcnJheVszXSkpO1xyXG4gICAgICAgIHRoaXMuc2V0Q3NzKCRkYXRlVXRpbHNbM10se1xyXG4gICAgICAgICAgICAndHJhbnNmb3JtJzpgdHJhbnNsYXRlWSgke2hvdXJJbmRleCp0aGlzLl9oZWlnaHR9cHgpYFxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICAvLyDliIbpkp9cclxuICAgICAgICBsZXQgbWludXRlSW5kZXggPSB0aGlzLmN1cnJlbnRUb0luZGV4KHBhcnNlSW50KGRhdGVBcnJheVs0XSkpO1xyXG4gICAgICAgIHRoaXMuc2V0Q3NzKCRkYXRlVXRpbHNbNF0se1xyXG4gICAgICAgICAgICAndHJhbnNmb3JtJzpgdHJhbnNsYXRlWSgke2hvdXJJbmRleCp0aGlzLl9oZWlnaHR9cHgpYFxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHRoaXMuZGVmYXVsdEluZm8gPSB7XHJcbiAgICAgICAgICAgIGRhdGVBcnJheTogZGF0ZUFycmF5LFxyXG4gICAgICAgICAgICBoZWlnaHRBcnJheTogW1xyXG4gICAgICAgICAgICAgICAgeWVhckluZGV4KnRoaXMuX2hlaWdodCxcclxuICAgICAgICAgICAgICAgIG1vbnRoSW5kZXgqdGhpcy5faGVpZ2h0LFxyXG4gICAgICAgICAgICAgICAgZGF5SW5kZXgqdGhpcy5faGVpZ2h0LFxyXG4gICAgICAgICAgICAgICAgaG91ckluZGV4KnRoaXMuX2hlaWdodCxcclxuICAgICAgICAgICAgICAgIG1pbnV0ZUluZGV4KnRoaXMuX2hlaWdodCxcclxuICAgICAgICAgICAgXVxyXG4gICAgICAgIH0gO1xyXG5cclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgcGlja2VyT3BlcmF0aW9uKCl7XHJcbiAgICAgICAgLy8g5pe26Ze05Yy66Ze06YCJ5oup5Zmo55qE6YC76L6R5LqL5Lu2XHJcbiAgICAgICAgbGV0ICRwaWNrZXIgPSB0aGlzLmN1cnJlbnRQaWNrZXI7XHJcbiAgICAgICAgbGV0IF90aGlzID0gdGhpcztcclxuICAgICAgICAvLyDorqLpmIXkuovku7bvvIznm5HlkKzpgInmi6nlmajnmoTlj5jljJZcclxuICAgICAgICBsZXQgc2VsZWN0VGltZSA9Jyc7XHJcbiAgICAgICAgdGhpcy4kb24oYG9uY2hhbmdlXyR7dGhpcy5wYXJhbXMua2V5fWAsKGRhdGEpPT57XHJcbiAgICAgICAgICAgIC8vIOagvOW8j+S4jeWvue+8jOaJi+WKqOi9rOaNouS4gOS4i1xyXG4gICAgICAgICAgICBsZXQgc3RyQXJyYXkgPSBkYXRhLnNwbGl0KHRoaXMucGFyYW1zLm91dEZvcm1hdCk7XHJcbiAgICAgICAgICAgIGxldCBzdHIxID0gc3RyQXJyYXkuc2xpY2UoMCwzKS5qb2luKHRoaXMucGFyYW1zLm91dEZvcm1hdCk7XHJcbiAgICAgICAgICAgIGxldCBzdHIyID0gc3RyQXJyYXkuc2xpY2UoMykuam9pbignOicpO1xyXG4gICAgICAgICAgICBzZWxlY3RUaW1lID0gc3RyMSsnICcrc3RyMjtcclxuXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgLy8g56Gu5a6a5oyJ6ZKuXHJcbiAgICAgICAgbGV0ICRzdXJlID0gdGhpcy5zZWxlY3QoJy5waWNrZXItYnRuX19zdXJlJyx0aGlzLmN1cnJlbnRQaWNrZXIpO1xyXG4gICAgICAgIGlmKCEkc3VyZSl7XHJcbiAgICAgICAgICAgIGxldCB0aXAgPSBgXHJcbiAgICAgICAgICAgIOayoeaJvuWIsOehruWumuaMiemSrixcclxuICAgICAgICAgICAg6K+356Gu5L+dY2xhc3M9Jy5waWNrZXItYnRuX19zdXJlJ+eahOaMiemSruayoeacieiiq+WOu+aOiVxyXG4gICAgICAgICAgICBgO1xyXG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKHRpcCk7XHJcbiAgICAgICAgICAgIHRoaXMuZXJyb3JUaXAodGlwKTtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICAkc3VyZS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsKGUpPT57XHJcbiAgICAgICAgICAgIGxldCByZXN1bHQgPSBzZWxlY3RUaW1lO1xyXG4gICAgICAgICAgICBfdGhpcy5vcHQuc3VjY2VzcyhyZXN1bHQpO1xyXG4gICAgICAgICAgICBfdGhpcy5wYXJhbXMuc3VjY2VzcyhyZXN1bHQpO1xyXG5cclxuICAgICAgICAgICAgX3RoaXMuaGlkZSgpO1xyXG5cclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgLy8g5Y+W5raI5oyJ6ZKuXHJcbiAgICAgICAgbGV0ICRjYW5jZWwgPSB0aGlzLnNlbGVjdCgnLnBpY2tlci1idG5fX2NhbmNlbCcsdGhpcy5jdXJyZW50UGlja2VyKTtcclxuICAgICAgICBpZighJGNhbmNlbCl7XHJcbiAgICAgICAgICAgIGxldCB0aXAgPSBgXHJcbiAgICAgICAgICAgIOayoeaJvuWIsOWPlua2iOaMiemSrixcclxuICAgICAgICAgICAg6K+356Gu5L+dY2xhc3M9Jy5waWNrZXItYnRuX19jYW5jZWwn55qE5oyJ6ZKu5rKh5pyJ6KKr5Y675o6JXHJcbiAgICAgICAgICAgIGA7XHJcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IodGlwKTtcclxuICAgICAgICAgICAgdGhpcy5lcnJvclRpcCh0aXApO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAkY2FuY2VsLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywoZSk9PntcclxuICAgICAgICAgICAgX3RoaXMuaGlkZSgpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICAvLyDngrnlh7vmmL7npLrml7bliIbpgInmi6nlmahcclxuICAgICAgICBsZXQgJG1pbnV0ZUJ0biA9IHRoaXMuc2VsZWN0KCcucGlja2VyLW1pbnV0ZS1idG4nLHRoaXMuY3VycmVudFBpY2tlcik7XHJcbiAgICAgICAgbGV0ICRtaW51dGUgPSB0aGlzLnNlbGVjdCgnLmRhdGUtY29udGVudC1taW51dGUnKTtcclxuXHJcbiAgICAgICAgaWYoISRtaW51dGVCdG4pe1xyXG4gICAgICAgICAgICBsZXQgdGlwID0gYFxyXG4gICAgICAgICAgICDmsqHmib7liLDliIfmjaLml7bliIbpgInmi6nlmajmjInpkq4sXHJcbiAgICAgICAgICAgIOivt+ehruS/nWNsYXNzPScucGlja2VyLW1pbnV0ZS1idG4n55qE5oyJ6ZKu5rKh5pyJ6KKr5Y675o6JXHJcbiAgICAgICAgICAgIGA7XHJcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IodGlwKTtcclxuICAgICAgICAgICAgdGhpcy5lcnJvclRpcCh0aXApO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAkbWludXRlQnRuLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywoZSk9PntcclxuICAgICAgICAgICAgaWYoZS50YXJnZXQuY2xhc3NMaXN0LmNvbnRhaW5zKCdwaWNrZXItbWludXRlLWJ0bi1hY3QnKSl7XHJcbiAgICAgICAgICAgICAgICAvLyDlhbPpl61cclxuICAgICAgICAgICAgICAgIGUudGFyZ2V0LmNsYXNzTGlzdC5yZW1vdmUoJ3BpY2tlci1taW51dGUtYnRuLWFjdCcpO1xyXG4gICAgICAgICAgICAgICAgX3RoaXMuc2V0Q3NzKCRtaW51dGUse1xyXG4gICAgICAgICAgICAgICAgICAgICd0cmFuc2Zvcm0nOid0cmFuc2xhdGVYKDEwMCUpJ1xyXG4gICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgfWVsc2V7XHJcbiAgICAgICAgICAgICAgICAvLyDmiZPlvIBcclxuICAgICAgICAgICAgICAgIGUudGFyZ2V0LmNsYXNzTGlzdC5hZGQoJ3BpY2tlci1taW51dGUtYnRuLWFjdCcpO1xyXG4gICAgICAgICAgICAgICAgX3RoaXMuc2V0Q3NzKCRtaW51dGUse1xyXG4gICAgICAgICAgICAgICAgICAgICd0cmFuc2Zvcm0nOid0cmFuc2xhdGVYKDApJ1xyXG4gICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pXHJcblxyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyByZVZpZXcoZGF0ZTogc3RyaW5nKXtcclxuICAgICAgICAvLyDph43nva7pgInmi6nlmajot53nprvvvIxkYXRlPVvlvIDlp4vml7bpl7TvvIznu5PmnZ/ml7bpl7RdXHJcbiAgICAgICAgbGV0IGJvb2wgPSB0cnVlO1xyXG4gICAgICAgIGxldCBfdGhpcyA9IHRoaXM7XHJcbiAgICAgICAgbGV0IHN0ckFycmF5ID0gdGhpcy5yZXNvbHZpbmdTdHJpbmcoZGF0ZSk7XHJcbiAgICAgICAgYm9vbCA9IHN0ckFycmF5Lmxlbmd0aDw1PyBmYWxzZTogdHJ1ZTtcclxuICAgICAgICBpZighYm9vbCl7XHJcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoJ0Vycm9yOiByZVZpZXfmlrnms5XkvKDlhaXnmoTlj4LmlbDmlbDnu4TmoLzlvI/kuI3lr7ko5qC85byPOjIwMTktMDEtMDEgMDA6MDApJyk7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5zZXREZWZhdWx0VmlldyhkYXRlKTtcclxuICAgICAgICB0aGlzLiRlbWl0KGBvbmNoYW5nZV8ke3RoaXMucGFyYW1zLmtleX1gLGRhdGUpO1xyXG4gICAgfSBcclxufSAiLCIvLyBlczbooaXkuIFcclxuY29uc3QgcG9seWZpbGwgPSAoKSA9PntcclxuICAgIC8vIGluY2x1ZGVzXHJcbiAgICBpZiAoIUFycmF5LnByb3RvdHlwZS5pbmNsdWRlcykge1xyXG4gICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShBcnJheS5wcm90b3R5cGUsICdpbmNsdWRlcycsIHtcclxuICAgICAgICAgIHZhbHVlOiBmdW5jdGlvbihzZWFyY2hFbGVtZW50LCBmcm9tSW5kZXgpIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMgPT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ1widGhpc1wiIGlzIG51bGwgb3Igbm90IGRlZmluZWQnKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB2YXIgbyA9IE9iamVjdCh0aGlzKTtcclxuICAgICAgICAgICAgdmFyIGxlbiA9IG8ubGVuZ3RoID4+PiAwO1xyXG4gICAgICAgICAgICBpZiAobGVuID09PSAwKSB7XHJcbiAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHZhciBuID0gZnJvbUluZGV4IHwgMDtcclxuICAgICAgICAgICAgdmFyIGsgPSBNYXRoLm1heChuID49IDAgPyBuIDogbGVuIC0gTWF0aC5hYnMobiksIDApO1xyXG4gICAgICAgICAgICB3aGlsZSAoayA8IGxlbikge1xyXG4gICAgICAgICAgICAgIGlmIChvW2tdID09PSBzZWFyY2hFbGVtZW50KSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgaysrO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgICAgfVxyXG5cclxuICAgICAgaWYgKCFBcnJheS5wcm90b3R5cGUuZmluZCkge1xyXG4gICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShBcnJheS5wcm90b3R5cGUsICdmaW5kJywge1xyXG4gICAgICAgICAgdmFsdWU6IGZ1bmN0aW9uKHByZWRpY2F0ZSkge1xyXG4gICAgICAgICAgIC8vIDEuIExldCBPIGJlID8gVG9PYmplY3QodGhpcyB2YWx1ZSkuXHJcbiAgICAgICAgICAgIGlmICh0aGlzID09IG51bGwpIHtcclxuICAgICAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdcInRoaXNcIiBpcyBudWxsIG9yIG5vdCBkZWZpbmVkJyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgXHJcbiAgICAgICAgICAgIHZhciBvID0gT2JqZWN0KHRoaXMpO1xyXG4gICAgICBcclxuICAgICAgICAgICAgLy8gMi4gTGV0IGxlbiBiZSA/IFRvTGVuZ3RoKD8gR2V0KE8sIFwibGVuZ3RoXCIpKS5cclxuICAgICAgICAgICAgdmFyIGxlbiA9IG8ubGVuZ3RoID4+PiAwO1xyXG4gICAgICBcclxuICAgICAgICAgICAgLy8gMy4gSWYgSXNDYWxsYWJsZShwcmVkaWNhdGUpIGlzIGZhbHNlLCB0aHJvdyBhIFR5cGVFcnJvciBleGNlcHRpb24uXHJcbiAgICAgICAgICAgIGlmICh0eXBlb2YgcHJlZGljYXRlICE9PSAnZnVuY3Rpb24nKSB7XHJcbiAgICAgICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcigncHJlZGljYXRlIG11c3QgYmUgYSBmdW5jdGlvbicpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgIFxyXG4gICAgICAgICAgICAvLyA0LiBJZiB0aGlzQXJnIHdhcyBzdXBwbGllZCwgbGV0IFQgYmUgdGhpc0FyZzsgZWxzZSBsZXQgVCBiZSB1bmRlZmluZWQuXHJcbiAgICAgICAgICAgIHZhciB0aGlzQXJnID0gYXJndW1lbnRzWzFdO1xyXG4gICAgICBcclxuICAgICAgICAgICAgLy8gNS4gTGV0IGsgYmUgMC5cclxuICAgICAgICAgICAgdmFyIGsgPSAwO1xyXG4gICAgICBcclxuICAgICAgICAgICAgLy8gNi4gUmVwZWF0LCB3aGlsZSBrIDwgbGVuXHJcbiAgICAgICAgICAgIHdoaWxlIChrIDwgbGVuKSB7XHJcbiAgICAgICAgICAgICAgLy8gYS4gTGV0IFBrIGJlICEgVG9TdHJpbmcoaykuXHJcbiAgICAgICAgICAgICAgLy8gYi4gTGV0IGtWYWx1ZSBiZSA/IEdldChPLCBQaykuXHJcbiAgICAgICAgICAgICAgLy8gYy4gTGV0IHRlc3RSZXN1bHQgYmUgVG9Cb29sZWFuKD8gQ2FsbChwcmVkaWNhdGUsIFQsIMKrIGtWYWx1ZSwgaywgTyDCuykpLlxyXG4gICAgICAgICAgICAgIC8vIGQuIElmIHRlc3RSZXN1bHQgaXMgdHJ1ZSwgcmV0dXJuIGtWYWx1ZS5cclxuICAgICAgICAgICAgICB2YXIga1ZhbHVlID0gb1trXTtcclxuICAgICAgICAgICAgICBpZiAocHJlZGljYXRlLmNhbGwodGhpc0FyZywga1ZhbHVlLCBrLCBvKSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGtWYWx1ZTtcclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgLy8gZS4gSW5jcmVhc2UgayBieSAxLlxyXG4gICAgICAgICAgICAgIGsrKztcclxuICAgICAgICAgICAgfVxyXG4gICAgICBcclxuICAgICAgICAgICAgLy8gNy4gUmV0dXJuIHVuZGVmaW5lZC5cclxuICAgICAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgICAgfVxyXG59XHJcbmV4cG9ydCBkZWZhdWx0IHBvbHlmaWxsOyIsIi8vIOiMg+WbtOmAieaLqeWZqOaguOW/g+S7o+eggVxyXG5pbXBvcnQgKiBhcyB0ZW1wIGZyb20gJy4vdGVtcGxhdGUnO1xyXG5pbXBvcnQgQmFzZVBpY2tlciBmcm9tICcuL2Jhc2VQaWNrZXInO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgUmFuZ2VQaWNrZXIgZXh0ZW5kcyBCYXNlUGlja2VyIHtcclxuICAgIHByaXZhdGUgY3VycmVudEluZGV4IDpudW1iZXIgPSAwO1xyXG4gICAgY29uc3RydWN0b3Iob3B0aW9ucz86IG9iamVjdCl7ICBcclxuICAgICAgICBzdXBlcigpOyAgXHJcbiAgICAgICAgdGhpcy5vcHQgPSB0aGlzLmFzc2lnbih7XHJcbiAgICAgICAgICAgIG9uY2hhbmdlOiAoKT0+e30sXHJcbiAgICAgICAgICAgIHN1Y2Nlc3M6ICgpPT57fVxyXG4gICAgICAgIH0sb3B0aW9ucyk7XHJcbiAgICAgICAgXHJcbiAgICB9XHJcblxyXG5cclxuICAgIHB1YmxpYyByZW5kZXJIdG1sKCk6IHN0cmluZ3tcclxuICAgICAgICAvLyDojrflj5ZodG1s5qC35byP55qE5Ye95pWw77yM5rOo5oSP77yM6K+l5Ye95pWw5LiA6Iis6KaB5Zyo5a2Q57G76YeN5YaZXHJcbiAgICAgICAgbGV0IHllYXJTdHIgPSB0aGlzLmNyZWF0ZVllYXJTdHIoKTtcclxuICAgICAgICByZXR1cm4gdGVtcC5yYW5nZVBpY2tlci5yZXBsYWNlKCckMScseWVhclN0cilcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5yZXBsYWNlKCckMicsdGhpcy5tb250aFN0cilcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5yZXBsYWNlKCckMycsdGhpcy5kYXlTdHIpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBwaWNrZXJPcGVyYXRpb24oKXtcclxuICAgICAgICAvLyDml7bpl7TljLrpl7TpgInmi6nlmajnmoTpgLvovpHkuovku7ZcclxuICAgICAgICBsZXQgJHBpY2tlciA9IHRoaXMuY3VycmVudFBpY2tlcjtcclxuICAgICAgICBsZXQgJHJhbmdlQ2hpbGRzID0gdGhpcy5zZWxlY3RBbGwoJy5yYW5nZS1jaGlsZCcsJHBpY2tlcik7XHJcbiAgICAgICAgbGV0IF90aGlzID0gdGhpcztcclxuICAgICAgICBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbCgkcmFuZ2VDaGlsZHMpLmZvckVhY2goKHJhbmdlQ2hpbGQsaSk9PntcclxuICAgICAgICAgICAgLy8gY29uc29sZS5sb2coJ3JhbmdlQ2hpbGQnLHJhbmdlQ2hpbGQpO1xyXG4gICAgICAgICAgICByYW5nZUNoaWxkLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywoZSk9PntcclxuICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKGUpXHJcbiAgICAgICAgICAgICAgICBpZihlLnRhcmdldC5jbGFzc0xpc3QuY29udGFpbnMoJ3JhbmdlLWFjdCcpKXJldHVybjtcclxuICAgICAgICAgICAgICAgIEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKCRyYW5nZUNoaWxkcykuZm9yRWFjaChpdGVtID0+IHtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgaXRlbS5jbGFzc0xpc3QucmVtb3ZlKCdyYW5nZS1hY3QnKVxyXG4gICAgICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICAgICAgZS50YXJnZXQuY2xhc3NMaXN0LmFkZCgncmFuZ2UtYWN0Jyk7XHJcbiAgICAgICAgICAgICAgICBfdGhpcy5jdXJyZW50SW5kZXggPSBpO1xyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBcclxuICAgICAgICAvLyDorqLpmIXkuovku7bvvIznm5HlkKzpgInmi6nlmajnmoTlj5jljJbvvIzkv67mlLnlvIDlp4vlkoznu5PmnZ/nmoTml7bpl7TmmL7npLpcclxuICAgICAgICBsZXQgc3RhcnRUaW1lID0nJywgZW5kVGltZSA9ICcnO1xyXG5cclxuICAgICAgICAvLyDlvZPorr7nva7kuobpu5jorqTml6XmnJ/vvIzkvJrmiafooYzov5nkuKpcclxuICAgICAgICBzdGFydFRpbWUgPSAkcmFuZ2VDaGlsZHNbX3RoaXMuY3VycmVudEluZGV4XS5pbm5lckhUTUwgPSB0aGlzLmRlZmF1bHRJbmZvLmRhdGVBcnJheS5qb2luKHRoaXMucGFyYW1zLm91dEZvcm1hdCk7XHJcbiBcclxuXHJcbiAgICAgICAgdGhpcy4kb24oYG9uY2hhbmdlXyR7dGhpcy5wYXJhbXMua2V5fWAsKGRhdGEpPT57XHJcbiAgICAgICAgICAgIGlmKHR5cGVvZiBkYXRhID09PSAnc3RyaW5nJyl7XHJcblxyXG4gICAgICAgICAgICAgICAgJHJhbmdlQ2hpbGRzW190aGlzLmN1cnJlbnRJbmRleF0uaW5uZXJIVE1MID0gZGF0YTtcclxuICAgICAgICAgICAgICAgIGlmKF90aGlzLmN1cnJlbnRJbmRleD09MCl7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8g5byA5aeL5pel5pyfXHJcbiAgICAgICAgICAgICAgICAgICAgc3RhcnRUaW1lID0gZGF0YTsgXHJcbiAgICAgICAgICAgICAgICB9ZWxzZXtcclxuICAgICAgICAgICAgICAgICAgICBlbmRUaW1lID0gZGF0YTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfWVsc2Uge1xyXG4gICAgICAgICAgICAgICAgJHJhbmdlQ2hpbGRzWzBdLmlubmVySFRNTCA9IGRhdGFbMF07XHJcbiAgICAgICAgICAgICAgICAkcmFuZ2VDaGlsZHNbMV0uaW5uZXJIVE1MID0gZGF0YVsxXTtcclxuICAgICAgICAgICAgICAgIHN0YXJ0VGltZSA9IGRhdGFbMF07XHJcbiAgICAgICAgICAgICAgICBlbmRUaW1lID0gZGF0YVsxXTsgXHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIC8vIOehruWumuaMiemSrlxyXG4gICAgICAgIGxldCAkc3VyZSA9IHRoaXMuc2VsZWN0KCcucGlja2VyLWJ0bl9fc3VyZScsdGhpcy5jdXJyZW50UGlja2VyKTtcclxuICAgICAgICBpZighJHN1cmUpe1xyXG4gICAgICAgICAgICBsZXQgdGlwID0gYFxyXG4gICAgICAgICAgICDmsqHmib7liLDnoa7lrprmjInpkq4sXHJcbiAgICAgICAgICAgIOivt+ehruS/nWNsYXNzPScucGlja2VyLWJ0bl9fc3VyZSfnmoTmjInpkq7msqHmnInooqvljrvmjolcclxuICAgICAgICAgICAgYDtcclxuICAgICAgICAgICAgY29uc29sZS5lcnJvcih0aXApO1xyXG4gICAgICAgICAgICB0aGlzLmVycm9yVGlwKHRpcCk7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgJHN1cmUuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLChlKT0+e1xyXG4gICAgICAgICAgICBpZihuZXcgRGF0ZShlbmRUaW1lKS5nZXRUaW1lKCk8bmV3IERhdGUoc3RhcnRUaW1lKS5nZXRUaW1lKCkpe1xyXG4gICAgICAgICAgICAgICAgbGV0IHRpcCA9IGDlvIDlp4vml6XmnJ/kuI3og73lpKfkuo7nu5PmnZ/ml6XmnJ9gO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5lcnJvclRpcCh0aXApO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGxldCByZXN1bHQgPSB7IFxyXG4gICAgICAgICAgICAgICAgc3RhcnRUaW1lLFxyXG4gICAgICAgICAgICAgICAgZW5kVGltZVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIF90aGlzLm9wdC5zdWNjZXNzKHJlc3VsdCk7XHJcbiAgICAgICAgICAgIF90aGlzLnBhcmFtcy5zdWNjZXNzKHJlc3VsdCk7XHJcblxyXG4gICAgICAgICAgICBfdGhpcy5oaWRlKCk7XHJcblxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICAvLyDlj5bmtojmjInpkq5cclxuICAgICAgICBsZXQgJGNhbmNlbCA9IHRoaXMuc2VsZWN0KCcucGlja2VyLWJ0bl9fY2FuY2VsJyx0aGlzLmN1cnJlbnRQaWNrZXIpO1xyXG4gICAgICAgIGlmKCEkY2FuY2VsKXtcclxuICAgICAgICAgICAgbGV0IHRpcCA9IGBcclxuICAgICAgICAgICAg5rKh5om+5Yiw5Y+W5raI5oyJ6ZKuLFxyXG4gICAgICAgICAgICDor7fnoa7kv51jbGFzcz0nLnBpY2tlci1idG5fX2NhbmNlbCfnmoTmjInpkq7msqHmnInooqvljrvmjolcclxuICAgICAgICAgICAgYDtcclxuICAgICAgICAgICAgY29uc29sZS5lcnJvcih0aXApO1xyXG4gICAgICAgICAgICB0aGlzLmVycm9yVGlwKHRpcCk7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgICRjYW5jZWwuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLChlKT0+e1xyXG4gICAgICAgICAgICBfdGhpcy5oaWRlKCk7XHJcbiAgICAgICAgfSlcclxuXHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHJlVmlldyhkYXRlOiBBcnJheTxzdHJpbmc+KXtcclxuICAgICAgICAvLyDph43nva7pgInmi6nlmajot53nprvvvIxkYXRlPVvlvIDlp4vml7bpl7TvvIznu5PmnZ/ml7bpl7RdXHJcbiAgICAgICAgbGV0IGJvb2wgPSB0cnVlO1xyXG4gICAgICAgIGxldCBfdGhpcyA9IHRoaXM7XHJcbiAgICAgICAgZGF0ZS5mb3JFYWNoKChpdGVtLGkpPT57XHJcbiAgICAgICAgICAgIGxldCBzdHJBcnJheSA9IGl0ZW0uc3BsaXQoX3RoaXMucGFyYW1zLm91dEZvcm1hdCk7XHJcbiAgICAgICAgICAgIGJvb2wgPSBzdHJBcnJheS5sZW5ndGg8Mz8gZmFsc2U6IHRydWU7XHJcbiAgICAgICAgfSlcclxuICAgICAgICBpZighYm9vbCl7XHJcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoJ0Vycm9yOiByZVZpZXfmlrnms5XkvKDlhaXnmoTlj4LmlbDmlbDnu4TmoLzlvI/kuI3lr7knKTtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLnNldERlZmF1bHRWaWV3KGRhdGVbdGhpcy5jdXJyZW50SW5kZXhdKTtcclxuICAgICAgICB0aGlzLiRlbWl0KGBvbmNoYW5nZV8ke3RoaXMucGFyYW1zLmtleX1gLGRhdGUpO1xyXG4gICAgfSBcclxufSIsIi8vIOWNleS4qumAieaLqeWZqOaguOW/g+S7o+eggVxyXG5pbXBvcnQgKiBhcyB0ZW1wIGZyb20gJy4vdGVtcGxhdGUnO1xyXG5pbXBvcnQgQmFzZVBpY2tlciBmcm9tICcuL2Jhc2VQaWNrZXInO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgU2luZ2xlUGlja2VyIGV4dGVuZHMgQmFzZVBpY2tlciB7XHJcbiAgICBwcml2YXRlIGN1cnJlbnRJbmRleCA6bnVtYmVyID0gMDtcclxuICAgIGNvbnN0cnVjdG9yKG9wdGlvbnM/OiBvYmplY3QpeyAgXHJcbiAgICAgICAgc3VwZXIoKTsgIFxyXG4gICAgICAgIHRoaXMub3B0ID0gdGhpcy5hc3NpZ24oe1xyXG4gICAgICAgICAgICBvbmNoYW5nZTogKCk9Pnt9LFxyXG4gICAgICAgICAgICBzdWNjZXNzOiAoKT0+e31cclxuICAgICAgICB9LG9wdGlvbnMpO1xyXG4gICAgICAgIFxyXG4gICAgfVxyXG5cclxuXHJcbiAgICBwdWJsaWMgcmVuZGVySHRtbCgpOiBzdHJpbmd7XHJcbiAgICAgICAgLy8g6I635Y+WaHRtbOagt+W8j+eahOWHveaVsO+8jOazqOaEj++8jOivpeWHveaVsOS4gOiIrOimgeWcqOWtkOexu+mHjeWGmVxyXG4gICAgICAgIGxldCB5ZWFyU3RyID0gdGhpcy5jcmVhdGVZZWFyU3RyKCk7XHJcbiAgICAgICAgcmV0dXJuIHRlbXAuc2luZ2xlUGlja2VyLnJlcGxhY2UoJyQxJyx5ZWFyU3RyKSBcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5yZXBsYWNlKCckMicsdGhpcy5tb250aFN0cilcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5yZXBsYWNlKCckMycsdGhpcy5kYXlTdHIpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBwaWNrZXJPcGVyYXRpb24oKXtcclxuICAgICAgICAvLyDml7bpl7TljLrpl7TpgInmi6nlmajnmoTpgLvovpHkuovku7ZcclxuICAgICAgICBsZXQgJHBpY2tlciA9IHRoaXMuY3VycmVudFBpY2tlcjtcclxuICAgICAgICBsZXQgX3RoaXMgPSB0aGlzO1xyXG4gICAgICAgIC8vIOiuoumYheS6i+S7tu+8jOebkeWQrOmAieaLqeWZqOeahOWPmOWMllxyXG4gICAgICAgIGxldCBzZWxlY3RUaW1lID0nJztcclxuICAgICAgICB0aGlzLiRvbihgb25jaGFuZ2VfJHt0aGlzLnBhcmFtcy5rZXl9YCwoZGF0YSk9PntcclxuICAgICAgICAgICAgc2VsZWN0VGltZSA9IGRhdGE7XHJcblxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICAvLyDnoa7lrprmjInpkq5cclxuICAgICAgICBsZXQgJHN1cmUgPSB0aGlzLnNlbGVjdCgnLnBpY2tlci1idG5fX3N1cmUnLHRoaXMuY3VycmVudFBpY2tlcik7XHJcbiAgICAgICAgaWYoISRzdXJlKXtcclxuICAgICAgICAgICAgbGV0IHRpcCA9IGBcclxuICAgICAgICAgICAg5rKh5om+5Yiw56Gu5a6a5oyJ6ZKuLFxyXG4gICAgICAgICAgICDor7fnoa7kv51jbGFzcz0nLnBpY2tlci1idG5fX3N1cmUn55qE5oyJ6ZKu5rKh5pyJ6KKr5Y675o6JXHJcbiAgICAgICAgICAgIGA7XHJcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IodGlwKTtcclxuICAgICAgICAgICAgdGhpcy5lcnJvclRpcCh0aXApO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgICRzdXJlLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywoZSk9PntcclxuICAgICAgICAgICAgbGV0IHJlc3VsdCA9IHNlbGVjdFRpbWU7XHJcbiAgICAgICAgICAgIF90aGlzLm9wdC5zdWNjZXNzKHJlc3VsdCk7XHJcbiAgICAgICAgICAgIF90aGlzLnBhcmFtcy5zdWNjZXNzKHJlc3VsdCk7XHJcblxyXG4gICAgICAgICAgICBfdGhpcy5oaWRlKCk7XHJcblxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICAvLyDlj5bmtojmjInpkq5cclxuICAgICAgICBsZXQgJGNhbmNlbCA9IHRoaXMuc2VsZWN0KCcucGlja2VyLWJ0bl9fY2FuY2VsJyx0aGlzLmN1cnJlbnRQaWNrZXIpO1xyXG4gICAgICAgIGlmKCEkY2FuY2VsKXtcclxuICAgICAgICAgICAgbGV0IHRpcCA9IGBcclxuICAgICAgICAgICAg5rKh5om+5Yiw5Y+W5raI5oyJ6ZKuLFxyXG4gICAgICAgICAgICDor7fnoa7kv51jbGFzcz0nLnBpY2tlci1idG5fX2NhbmNlbCfnmoTmjInpkq7msqHmnInooqvljrvmjolcclxuICAgICAgICAgICAgYDtcclxuICAgICAgICAgICAgY29uc29sZS5lcnJvcih0aXApO1xyXG4gICAgICAgICAgICB0aGlzLmVycm9yVGlwKHRpcCk7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgICRjYW5jZWwuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLChlKT0+e1xyXG4gICAgICAgICAgICBfdGhpcy5oaWRlKCk7XHJcbiAgICAgICAgfSlcclxuXHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHJlVmlldyhkYXRlOiBzdHJpbmcpe1xyXG4gICAgICAgIC8vIOmHjee9rumAieaLqeWZqOi3neemu++8jGRhdGU9W+W8gOWni+aXtumXtO+8jOe7k+adn+aXtumXtF1cclxuICAgICAgICBsZXQgYm9vbCA9IHRydWU7XHJcbiAgICAgICAgbGV0IF90aGlzID0gdGhpcztcclxuICAgICAgICBsZXQgc3RyQXJyYXkgPSBkYXRlLnNwbGl0KF90aGlzLnBhcmFtcy5vdXRGb3JtYXQpO1xyXG4gICAgICAgIGJvb2wgPSBzdHJBcnJheS5sZW5ndGg8Mz8gZmFsc2U6IHRydWU7XHJcbiAgICAgICAgaWYoIWJvb2wpe1xyXG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKCdFcnJvcjogcmVWaWV35pa55rOV5Lyg5YWl55qE5Y+C5pWw5a2X56ym5qC85byP5LiN5a+5Jyk7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5zZXREZWZhdWx0VmlldyhkYXRlW3RoaXMuY3VycmVudEluZGV4XSk7XHJcbiAgICAgICAgdGhpcy4kZW1pdChgb25jaGFuZ2VfJHt0aGlzLnBhcmFtcy5rZXl9YCxkYXRlKTtcclxuICAgIH0gXHJcbn0iLCIvLyDmqKHmnb/lrZfnrKbkuLJcclxuXHJcbmV4cG9ydCBjb25zdCBtYXNrID0gYFxyXG48ZGl2IGNsYXNzPVwicGlja2VyLW1hc2tcIj48L2Rpdj5cclxuYDtcclxuXHJcbmV4cG9ydCBjb25zdCByYW5nZSA9IGBcclxuPGRpdiBjbGFzcz1cInBpY2tlci1yYW5nZVwiPlxyXG4gICAgPHAgY2xhc3M9XCJyYW5nZS1jaGlsZCBzdGFydC10aW1lIHJhbmdlLWFjdFwiPuW8gOWni+aXpeacnzwvcD5cclxuICAgIDxzcGFuPuiHszwvc3Bhbj5cclxuICAgIDxwIGNsYXNzPVwicmFuZ2UtY2hpbGQgZW5kLXRpbWVcIj7nu5PmnZ/ml6XmnJ88L3A+XHJcbjwvZGl2PlxyXG5gO1xyXG5cclxuXHJcbmV4cG9ydCBjb25zdCByYW5nZVBpY2tlciA9IGBcclxuPGRpdiBjbGFzcz1cInBpY2tlci13cmFwcGVyIHBpY2tlci10eXBlX19yYW5nZVwiPlxyXG4gICAgPGRpdiBjbGFzcz1cInBpY2tlci1oZWFkIGZsZXggc3BhY2UtYmV0d2VlblwiPlxyXG4gICAgICAgIDxzcGFuIGNsYXNzPVwiY2FuY2VsIHBpY2tlci1idG5fX2NhbmNlbFwiPuWPlua2iDwvc3Bhbj5cclxuICAgICAgICA8c3BhbiBjbGFzcz1cInN1cmUgcGlja2VyLWJ0bl9fc3VyZVwiPuehruWumjwvc3Bhbj5cclxuICAgIDwvZGl2PlxyXG4gICAgPGRpdiBjbGFzcz1cInBpY2tlci1ib2R5XCI+XHJcbiAgICAgICAgJHtyYW5nZX1cclxuXHJcbiAgICAgICAgPGRpdiBjbGFzcz1cImRhdGUtY29udGVudCBmbGV4XCI+XHJcblxyXG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwiZGF0ZS1ncm91cCBmbGV4LWl0ZW1cIj5cclxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiY29udGVudC1tYXNrIG1hc2stdG9wXCI+PC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImNvbnRlbnQtbWFzayBtYXNrLWJvdHRvbVwiPjwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJkYXRlLWl0ZW0gXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICQxXHJcbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwiZGF0ZS1ncm91cCBmbGV4LWl0ZW1cIj5cclxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJjb250ZW50LW1hc2sgbWFzay10b3BcIj48L2Rpdj5cclxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJjb250ZW50LW1hc2sgbWFzay1ib3R0b21cIj48L2Rpdj5cclxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJkYXRlLWl0ZW1cIj5cclxuICAgICAgICAgICAgICAgICAgICAkMlxyXG4gICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwiZGF0ZS1ncm91cCBmbGV4LWl0ZW1cIj5cclxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJjb250ZW50LW1hc2sgbWFzay10b3BcIj48L2Rpdj5cclxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJjb250ZW50LW1hc2sgbWFzay1ib3R0b21cIj48L2Rpdj5cclxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJkYXRlLWl0ZW1cIj5cclxuICAgICAgICAgICAgICAgICAgICAkM1xyXG4gICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgIDwvZGl2PlxyXG5cclxuICAgIDwvZGl2PlxyXG48L2Rpdj5cclxuYDtcclxuXHJcbmV4cG9ydCBjb25zdCBzaW5nbGVQaWNrZXIgPSBgXHJcbjxkaXYgY2xhc3M9XCJwaWNrZXItd3JhcHBlciBwaWNrZXItdHlwZV9fc2luZ2xlXCI+XHJcbiAgICA8ZGl2IGNsYXNzPVwicGlja2VyLWhlYWQgZmxleCBzcGFjZS1iZXR3ZWVuXCI+XHJcbiAgICAgICAgPHNwYW4gY2xhc3M9XCJjYW5jZWwgcGlja2VyLWJ0bl9fY2FuY2VsXCI+5Y+W5raIPC9zcGFuPlxyXG4gICAgICAgIDxzcGFuIGNsYXNzPVwic3VyZSBwaWNrZXItYnRuX19zdXJlXCI+56Gu5a6aPC9zcGFuPlxyXG4gICAgPC9kaXY+XHJcbiAgICA8ZGl2IGNsYXNzPVwicGlja2VyLWJvZHlcIj5cclxuICAgICAgICA8ZGl2IGNsYXNzPVwiZGF0ZS1jb250ZW50IGZsZXhcIj5cclxuXHJcbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJkYXRlLWdyb3VwIGZsZXgtaXRlbVwiPlxyXG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJjb250ZW50LW1hc2sgbWFzay10b3BcIj48L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiY29udGVudC1tYXNrIG1hc2stYm90dG9tXCI+PC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImRhdGUtaXRlbSBcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgJDFcclxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJkYXRlLWdyb3VwIGZsZXgtaXRlbVwiPlxyXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImNvbnRlbnQtbWFzayBtYXNrLXRvcFwiPjwvZGl2PlxyXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImNvbnRlbnQtbWFzayBtYXNrLWJvdHRvbVwiPjwvZGl2PlxyXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImRhdGUtaXRlbVwiPlxyXG4gICAgICAgICAgICAgICAgICAgICQyXHJcbiAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJkYXRlLWdyb3VwIGZsZXgtaXRlbVwiPlxyXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImNvbnRlbnQtbWFzayBtYXNrLXRvcFwiPjwvZGl2PlxyXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImNvbnRlbnQtbWFzayBtYXNrLWJvdHRvbVwiPjwvZGl2PlxyXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImRhdGUtaXRlbVwiPlxyXG4gICAgICAgICAgICAgICAgICAgICQzXHJcbiAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgPC9kaXY+XHJcblxyXG4gICAgPC9kaXY+XHJcbjwvZGl2PlxyXG5gO1xyXG5cclxuZXhwb3J0IGNvbnN0IG1pbnV0ZVBpY2tlciA9IGBcclxuPGRpdiBjbGFzcz1cInBpY2tlci13cmFwcGVyIHBpY2tlci10eXBlX19taW51dGVcIj5cclxuICAgIDxkaXYgY2xhc3M9XCJwaWNrZXItaGVhZCBmbGV4IHNwYWNlLWJldHdlZW5cIj5cclxuICAgICAgICA8c3BhbiBjbGFzcz1cImNhbmNlbCBwaWNrZXItYnRuX19jYW5jZWxcIj7lj5bmtog8L3NwYW4+XHJcbiAgICAgICAgPHNwYW4gY2xhc3M9XCJzdXJlIHBpY2tlci1idG5fX3N1cmVcIj7noa7lrpo8L3NwYW4+XHJcbiAgICA8L2Rpdj5cclxuICAgIDxkaXYgY2xhc3M9XCJwaWNrZXItYm9keVwiPlxyXG4gICAgICAgIDxkaXYgY2xhc3M9XCJkYXRlLWNvbnRlbnQgZmxleFwiPlxyXG5cclxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cImRhdGUtZ3JvdXAgZmxleC1pdGVtXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImNvbnRlbnQtbWFzayBtYXNrLXRvcFwiPjwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJjb250ZW50LW1hc2sgbWFzay1ib3R0b21cIj48L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiZGF0ZS1pdGVtIFwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAkMVxyXG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cImRhdGUtZ3JvdXAgZmxleC1pdGVtXCI+XHJcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiY29udGVudC1tYXNrIG1hc2stdG9wXCI+PC9kaXY+XHJcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiY29udGVudC1tYXNrIG1hc2stYm90dG9tXCI+PC9kaXY+XHJcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiZGF0ZS1pdGVtXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgJDJcclxuICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cImRhdGUtZ3JvdXAgZmxleC1pdGVtXCI+XHJcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiY29udGVudC1tYXNrIG1hc2stdG9wXCI+PC9kaXY+XHJcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiY29udGVudC1tYXNrIG1hc2stYm90dG9tXCI+PC9kaXY+XHJcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiZGF0ZS1pdGVtXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgJDNcclxuICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICA8L2Rpdj5cclxuXHJcbiAgICAgICAgPHNwYW4gY2xhc3M9XCJwaWNrZXItbWludXRlLWJ0blwiPjwvc3Bhbj5cclxuICAgICAgICA8ZGl2IGNsYXNzPVwiZGF0ZS1jb250ZW50IGRhdGUtY29udGVudC1taW51dGUgZmxleFwiPlxyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cImRhdGUtZ3JvdXAgZmxleC1pdGVtXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImNvbnRlbnQtbWFzayBtYXNrLXRvcFwiPjwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJjb250ZW50LW1hc2sgbWFzay1ib3R0b21cIj48L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiZGF0ZS1pdGVtIFwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAkNFxyXG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cImRhdGUtZ3JvdXAgZmxleC1pdGVtXCI+XHJcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiY29udGVudC1tYXNrIG1hc2stdG9wXCI+PC9kaXY+XHJcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiY29udGVudC1tYXNrIG1hc2stYm90dG9tXCI+PC9kaXY+XHJcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiZGF0ZS1pdGVtXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgJDVcclxuICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICA8L2Rpdj5cclxuXHJcbiAgICA8L2Rpdj5cclxuPC9kaXY+XHJcbmBcclxuXHJcbiIsIi8vIGltcG9ydCB7IHJlc29sdmUgfSBmcm9tIFwiYW55LXByb21pc2VcIjtcclxuaW1wb3J0IFV0aWxzIGZyb20gJy4vdXRpbHMnO1xyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBUb3VjaHMgZXh0ZW5kcyBVdGlscyB7XHJcbiAgICBwcml2YXRlIF90YXJnZXQ6IGFueTtcclxuICAgIHByaXZhdGUgX3N0YXJ0WTogbnVtYmVyO1xyXG4gICAgcHJpdmF0ZSBfZW5kWTogbnVtYmVyO1xyXG4gICAgcHJpdmF0ZSBfcmFuZ2U6IG51bWJlcjtcclxuXHJcbiAgICAvLyDovoXliqnnsbvlj4LmlbBcclxuICAgIHByaXZhdGUgYm9vbDogYm9vbGVhbiA9IHRydWU7XHJcbiAgICBwcml2YXRlIGxpbWl0OiBudW1iZXIgPSAwOyAvL+mZkOa1gVxyXG4gICAgcHJpdmF0ZSBfc3RhcnRUaW1lOiBudW1iZXIgPSAwO1xyXG4gICAgcHJpdmF0ZSBfZW5kVGltZTogbnVtYmVyID0wO1xyXG4gICAgcHJpdmF0ZSBfc3VwcG9ydFRvdWNoOiBib29sZWFuID0gXCJvbnRvdWNoZW5kXCIgaW4gZG9jdW1lbnQ7IC8v5Yik5pat5rWP6KeI5Zmo5piv5ZCm5pSv5oyBdG91Y2hcclxuICAgIHByaXZhdGUgX3RvdWNoTmFtZTogYW55ID0ge307XHJcbiAgICBwcml2YXRlIF9zdGFydENiOiBGdW5jdGlvbiA9IG51bGw7XHJcbiAgICBwcml2YXRlIF9tb3ZlQ2I6IEZ1bmN0aW9uID0gbnVsbDtcclxuICAgIHByaXZhdGUgX2VuZENiOiBGdW5jdGlvbiA9IG51bGw7XHJcbiAgICBwcml2YXRlIF90b3VjaFN0YXJ0SGFuZGVyOiBhbnkgPSBudWxsO1xyXG4gICAgcHJpdmF0ZSBfdG91Y2hNb3ZlSGFuZGVyOiBhbnkgPSBudWxsO1xyXG4gICAgcHJpdmF0ZSBfdG91Y2hFbmRIYW5kZXI6IGFueSA9IG51bGw7XHJcblxyXG4gICAgY29uc3RydWN0b3IodGFyZ2V0OiBhbnkpe1xyXG4gICAgICAgIHN1cGVyKCk7XHJcbiAgICAgICAgLy8gY29uc29sZS5sb2coJ2luaXQnKVxyXG4gICAgICAgIHRoaXMuX3RhcmdldCA9IHRhcmdldDtcclxuICAgICAgICB0aGlzLnRvdWNoTmFtZSA9IHtcclxuICAgICAgICAgICAgc3RhcnQ6IHRoaXMuX3N1cHBvcnRUb3VjaD8gJ3RvdWNoc3RhcnQnOidtb3VzZWRvd24nLFxyXG4gICAgICAgICAgICBtb3ZlOiB0aGlzLl9zdXBwb3J0VG91Y2g/ICd0b3VjaG1vdmUnOidtb3VzZW1vdmUnLFxyXG4gICAgICAgICAgICBlbmQ6IHRoaXMuX3N1cHBvcnRUb3VjaD8gJ3RvdWNoZW5kJzonbW91c2V1cCcsXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGdldCB0YXJnZXQoKTogYW55e1xyXG4gICAgICAgIGlmKHRoaXMuX3RhcmdldCl7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl90YXJnZXRcclxuICAgICAgICB9ZWxzZXtcclxuICAgICAgICAgICAgY29uc29sZS5lcnJvcignRXJyb3I6IOayoeacieaJvuWIsHRhcmdldOWvueixoScpO1xyXG4gICAgICAgICAgICByZXR1cm4gbnVsbFxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBnZXQgc3RhcnRZKCk6IG51bWJlcntcclxuICAgICAgICByZXR1cm4gdGhpcy5fc3RhcnRZO1xyXG4gICAgfVxyXG5cclxuICAgIHNldCBzdGFydFkodmFsOiBudW1iZXIpe1xyXG4gICAgICAgIHRoaXMuX3N0YXJ0WSA9IHZhbDtcclxuICAgIH1cclxuXHJcbiAgICBcclxuICAgIGdldCBlbmRZKCk6IG51bWJlcntcclxuICAgICAgICByZXR1cm4gdGhpcy5fZW5kWTsgXHJcbiAgICB9XHJcbiAgICBcclxuICAgIHNldCBlbmRZKHZhbDogbnVtYmVyKSB7XHJcbiAgICAgICAgdGhpcy5fZW5kWSA9IHZhbDtcclxuICAgIH1cclxuXHJcbiAgICBnZXQgcmFuZ2UoKTogbnVtYmVyIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fcmFuZ2U7XHJcbiAgICB9XHJcblxyXG4gICAgc2V0IHJhbmdlKHZhbDogbnVtYmVyKXtcclxuICAgICAgICB0aGlzLl9yYW5nZSA9IHZhbDtcclxuICAgIH1cclxuXHJcbiAgICBnZXQgdG91Y2hOYW1lKCk6IGFueSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX3RvdWNoTmFtZTtcclxuICAgIH1cclxuXHJcbiAgICBzZXQgdG91Y2hOYW1lKHZhbDogYW55KXtcclxuICAgICAgICB0aGlzLl90b3VjaE5hbWUgPSB2YWw7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGluaXQocGFyYW1zPzogYW55KXtcclxuICAgICAgICB0aGlzLl9zdGFydENiID0gcGFyYW1zLnN0YXJ0Q2I7XHJcbiAgICAgICAgdGhpcy5fbW92ZUNiID0gcGFyYW1zLm1vdmVDYjtcclxuICAgICAgICB0aGlzLl9lbmRDYiA9IHBhcmFtcy5lbmRDYjtcclxuXHJcbiAgICAgICAgdGhpcy50b3VjaFN0YXJ0KCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBiaW5kcyhvYmosZm4pe1xyXG4gICAgICAgIHJldHVybiAoZSk9PntcclxuICAgICAgICAgICAgLy8gY29uc29sZS5sb2coJ2FyZycsZSk7IFxyXG4gICAgICAgICAgICBhcmd1bWVudHNbMF0gPSBlO1xyXG4gICAgICAgICAgICBmbi5hcHBseShvYmosIGFyZ3VtZW50cyk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgdG91Y2hTdGFydCgpe1xyXG4gICAgICAgIC8vIHRvdWNoc3RhcnQ6XHJcbiAgICAgICAgLy8gMS4g57uZdGFyZ2V057uR5a6adG91Y2jkuovku7ZcclxuICAgICAgICAvLyBjb25zb2xlLmxvZyh0aGlzLnRhcmdldCkgIFxyXG4gICAgICAgIGxldCBfdGhpcyA9IHRoaXM7XHJcbiAgICAgICAgdGhpcy5fdG91Y2hTdGFydEhhbmRlciA9IHRoaXMuYmluZHModGhpcyx0aGlzLnRvdWNoU3RhcnRIYW5kZXIpO1xyXG4gICAgICAgIHRoaXMuX3RvdWNoTW92ZUhhbmRlciA9IHRoaXMuYmluZHModGhpcyx0aGlzLnRvdWNoTW92ZUhhbmRlcik7XHJcbiAgICAgICAgdGhpcy5fdG91Y2hFbmRIYW5kZXIgPSB0aGlzLmJpbmRzKHRoaXMsdGhpcy50b3VjaEVuZEhhbmRlcik7XHJcbiAgICAgICAgX3RoaXMudGFyZ2V0LmFkZEV2ZW50TGlzdGVuZXIodGhpcy50b3VjaE5hbWUuc3RhcnQsdGhpcy5fdG91Y2hTdGFydEhhbmRlcixmYWxzZSk7XHJcbiAgICAgICAgXHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSB0b3VjaFN0YXJ0SGFuZGVyKCl7XHJcbiAgICAgICAgbGV0IGUgPSBhcmd1bWVudHNbMF1cclxuICAgICAgICB0aGlzLnN0YXJ0WSA9IHRoaXMuX3N1cHBvcnRUb3VjaD9lLnRvdWNoZXNbMF0ucGFnZVk6IGUucGFnZVk7XHJcbiAgICAgICAgdGhpcy5fc3RhcnRUaW1lID0gbmV3IERhdGUoKS5nZXRUaW1lKCk7XHJcbiAgICAgICAgdGhpcy5fc3RhcnRDYihlKTtcclxuICAgICAgICB0aGlzLnRhcmdldC5hZGRFdmVudExpc3RlbmVyKHRoaXMudG91Y2hOYW1lLm1vdmUsdGhpcy5fdG91Y2hNb3ZlSGFuZGVyLGZhbHNlKTtcclxuICAgICAgICB0aGlzLnRhcmdldC5hZGRFdmVudExpc3RlbmVyKHRoaXMudG91Y2hOYW1lLmVuZCx0aGlzLl90b3VjaEVuZEhhbmRlcixmYWxzZSk7XHJcbiAgICAgICAgdGhpcy50YXJnZXQuYWRkRXZlbnRMaXN0ZW5lcigndG91Y2hjYW5jZWwnLHRoaXMuX3RvdWNoRW5kSGFuZGVyLGZhbHNlKTtcclxuICAgIH1cclxuIFxyXG5cclxuICAgIHByaXZhdGUgdG91Y2hNb3ZlSGFuZGVyKCl7XHJcbiAgICAgICAgbGV0IGUgPSBhcmd1bWVudHNbMF07XHJcbiAgICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcclxuICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgLy8g6ZmQ5rWBLXN0YXJ0XHJcbiAgICAgICAgdGhpcy5saW1pdCsrO1xyXG4gICAgICAgIGlmKHRoaXMubGltaXQ+PTUpe1xyXG4gICAgICAgICAgICB0aGlzLmxpbWl0ID0gMDtcclxuICAgICAgICAgICAgdGhpcy5ib29sID0gdHJ1ZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYoIXRoaXMuYm9vbClyZXR1cm47XHJcbiAgICAgICAgdGhpcy5ib29sID0gZmFsc2U7XHJcbiAgICAgICAgLy8g6ZmQ5rWBLWVuZFxyXG4gICAgICAgIGxldCBwYWdlWSA9IHRoaXMuX3N1cHBvcnRUb3VjaD9lLnRvdWNoZXNbMF0ucGFnZVk6IGUucGFnZVk7XHJcbiAgICAgICAgdGhpcy5yYW5nZSA9IHBhZ2VZIC0gdGhpcy5fc3RhcnRZO1xyXG4gICAgICAgIHRoaXMuX21vdmVDYihlLHRoaXMucmFuZ2UpO1xyXG4gICAgfVxyXG5cclxuXHJcbiAgICBwcml2YXRlIHRvdWNoRW5kSGFuZGVyKCl7IFxyXG4gICAgICAgIGxldCBlID0gYXJndW1lbnRzWzBdO1xyXG4gICAgICAgIGxldCBfdGhpcyA9IHRoaXM7XHJcbiAgICAgICAgLy8gdGhpcy50YXJnZXQucmVtb3ZlRXZlbnRMaXN0ZW5lcih0aGlzLnRvdWNoTmFtZS5zdGFydCxfdGhpcy5fdG91Y2hTdGFydEhhbmRlcixmYWxzZSk7XHJcbiAgICAgICAgdGhpcy50YXJnZXQucmVtb3ZlRXZlbnRMaXN0ZW5lcih0aGlzLnRvdWNoTmFtZS5tb3ZlLHRoaXMuX3RvdWNoTW92ZUhhbmRlcixmYWxzZSk7XHJcbiAgICAgICAgdGhpcy50YXJnZXQucmVtb3ZlRXZlbnRMaXN0ZW5lcih0aGlzLnRvdWNoTmFtZS5lbmQsdGhpcy5fdG91Y2hFbmRIYW5kZXIsZmFsc2UpO1xyXG4gICAgICAgIHRoaXMudGFyZ2V0LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3RvdWNoY2FuY2VsJyx0aGlzLl90b3VjaEVuZEhhbmRlcixmYWxzZSk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgdGhpcy5lbmRZID0gdGhpcy5yYW5nZSB8fCAwOyBcclxuICAgICAgICAvLyDpmo/mtYHmlYjmnpxcclxuICAgICAgICB0aGlzLl9lbmRUaW1lID0gbmV3IERhdGUoKS5nZXRUaW1lKCk7XHJcbiAgICAgICAgbGV0IHJhbmdlVGltZSA9ICh0aGlzLl9lbmRUaW1lIC0gdGhpcy5fc3RhcnRUaW1lKS8xMDAwOy8v5Y2V5L2NOiDnp5JcclxuICAgICAgICBpZih0aGlzLmVuZFkhPT0wKXtcclxuXHJcbiAgICAgICAgICAgIGxldCBzcGFjZSA9IE1hdGguZmxvb3IoTWF0aC5hYnModGhpcy5lbmRZKS8ocmFuZ2VUaW1lKjMpKTtcclxuICAgICAgICAgICAgdGhpcy5lbmRZID0gdGhpcy5lbmRZPjA/IHRoaXMuZW5kWStzcGFjZTogdGhpcy5lbmRZLXNwYWNlO1xyXG5cclxuICAgICAgICB9XHJcbiAgICAgICAgXHJcbiAgICAgICAgdGhpcy5fZW5kQ2IoZSwgdGhpcy5lbmRZKTtcclxuICAgIH1cclxufSIsIi8vIOW3peWFt+exu1xyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBVdGlscyB7XHJcbiAgICBwcml2YXRlIF9ldmVudExpc3RzOiBvYmplY3QgPSB7fTtcclxuICAgIGNvbnN0cnVjdG9yKCl7fVxyXG5cclxuICAgIHB1YmxpYyBzZWxlY3QoZWxtOiBzdHJpbmcsIHRhcmdldD86IGFueSl7XHJcbiAgICAgICAgaWYodGFyZ2V0KXtcclxuICAgICAgICAgICAgcmV0dXJuIHRhcmdldC5xdWVyeVNlbGVjdG9yKGVsbSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGVsbSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHNlbGVjdEFsbChlbG06IHN0cmluZywgdGFyZ2V0PzogYW55KXtcclxuICAgICAgICBpZih0YXJnZXQpe1xyXG4gICAgICAgICAgICByZXR1cm4gdGFyZ2V0LnF1ZXJ5U2VsZWN0b3JBbGwoZWxtKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoZWxtKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgY3JlYXRlRWxtKHRhcmdldDogYW55LCBsYWJlbDogc3RyaW5nLCBjbGFzc05hbWU/OiBzdHJpbmcpe1xyXG4gICAgICAgIC8vIOWIm+W7uuWFg+e0oFxyXG4gICAgICAgIGNvbnN0ICRlbG0gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KGxhYmVsKTtcclxuICAgICAgICAkZWxtLmNsYXNzTGlzdC5hZGQoY2xhc3NOYW1lKTtcclxuICAgICAgICB0YXJnZXQuYXBwZW5kQ2hpbGQoJGVsbSk7XHJcbiAgICAgICAgcmV0dXJuICRlbG07XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHNldENzcyh0YXJnZXQ6IGFueSwgY3NzOiBvYmplY3Qpe1xyXG4gICAgICAgIC8vIOiuvue9rmNzc+agt+W8j1xyXG4gICAgICAgIGZvcihsZXQgYXR0ciBpbiBjc3Mpe1xyXG4gICAgICAgICAgICB0YXJnZXQuc3R5bGVbYXR0cl0gPSBjc3NbYXR0cl07XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzbGVlcChjYjogRnVuY3Rpb24sIHRpbWVvdXQ6IG51bWJlcil7XHJcbiAgICAgICAgLy8g5bu26L+fXHJcbiAgICAgICAgc2V0VGltZW91dChjYiwgdGltZW91dCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGdldFRvZGF5KGZvcm1hdDogc3RyaW5nKTogc3RyaW5ne1xyXG4gICAgICAgIC8vIOiOt+WPluS7iuWkqeeahOaXpeacnzogMjAxOS0wMS0wMVxyXG4gICAgICAgIGxldCBkYXRlID0gbmV3IERhdGUoKTtcclxuICAgICAgICBsZXQgeWVhciA9IGRhdGUuZ2V0RnVsbFllYXIoKTtcclxuICAgICAgICBsZXQgbW9udGg6IGFueSA9IGRhdGUuZ2V0TW9udGgoKSsxO1xyXG4gICAgICAgIGxldCBkYXk6IGFueSA9IGRhdGUuZ2V0RGF0ZSgpO1xyXG4gICAgICAgIG1vbnRoID0gbW9udGg+PTEwPyBtb250aDogJzAnK21vbnRoO1xyXG4gICAgICAgIGRheSA9IGRheT49MTA/IGRheTogJzAnK2RheTtcclxuICAgICAgICByZXR1cm4gW3llYXIsbW9udGgsZGF5XS5qb2luKGZvcm1hdCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljICRvbihldmVudE5hbWU6IHN0cmluZywgZm46IEZ1bmN0aW9uKXtcclxuICAgICAgICAvLyDorqLpmIXkuovku7ZcclxuICAgICAgICBpZih0aGlzLl9ldmVudExpc3RzW2V2ZW50TmFtZV0pe1xyXG4gICAgICAgICAgICB0aGlzLl9ldmVudExpc3RzW2V2ZW50TmFtZV0ucHVzaChmbik7XHJcbiAgICAgICAgfWVsc2V7XHJcbiAgICAgICAgICAgIHRoaXMuX2V2ZW50TGlzdHNbZXZlbnROYW1lXSA9IFtmbl07XHJcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKCdldmVudExpc3RzJyx0aGlzLl9ldmVudExpc3RzW2V2ZW50TmFtZV0pO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgJGVtaXQoZXZlbnROYW1lOiBzdHJpbmcsIC4uLmFyZ3Mpe1xyXG4gICAgICAgIC8vIOinpuWPkeS6i+S7tlxyXG4gICAgICAgIGlmKHRoaXMuX2V2ZW50TGlzdHNbZXZlbnROYW1lXSl7XHJcbiAgICAgICAgICAgIHRoaXMuX2V2ZW50TGlzdHNbZXZlbnROYW1lXS5mb3JFYWNoKChmbixpKT0+e1xyXG4gICAgICAgICAgICAgICAgZm4oLi4uYXJncyk7XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBhc3NpZ24oZXh0ZW5kZWQsb3B0aW9ucyl7XHJcbiAgICAgICAgZm9yIChsZXQgcHJvcGVydHkgaW4gb3B0aW9ucykge1xyXG4gICAgICAgICAgICB0cnkgeyBcclxuICAgICAgICAgICAgICBpZiAob3B0aW9uc1twcm9wZXJ0eV0uY29uc3RydWN0b3IgPT0gT2JqZWN0KSB7XHJcbiAgICAgICAgICAgICAgICBleHRlbmRlZFtwcm9wZXJ0eV0gPSB0aGlzLmFzc2lnbihleHRlbmRlZFtwcm9wZXJ0eV0sIG9wdGlvbnNbcHJvcGVydHldKTtcclxuICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgZXh0ZW5kZWRbcHJvcGVydHldID0gb3B0aW9uc1twcm9wZXJ0eV07XHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9IGNhdGNoIChleCkge1xyXG4gICAgICAgICAgICAgIGV4dGVuZGVkW3Byb3BlcnR5XSA9IG9wdGlvbnNbcHJvcGVydHldO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgXHJcbiAgICAgICAgICByZXR1cm4gZXh0ZW5kZWQ7XHJcbiAgICB9XHJcblxyXG4gICAgLy8g6Ieq5a6a5LmJ5o+Q56S6XHJcbiAgICBwdWJsaWMgVGlwKHRpcE5hbWU6IHN0cmluZywgbXNnOiBzdHJpbmcsIHRpbWVvdXQ/OiBudW1iZXIpe1xyXG4gICAgICAgIGxldCAkdGlwID0gdGhpcy5zZWxlY3QodGlwTmFtZSk7XHJcbiAgICAgICAgbGV0IF90aGlzID0gdGhpcztcclxuICAgICAgICBpZighJHRpcCl7XHJcbiAgICAgICAgICAgICR0aXAgPSB0aGlzLmNyZWF0ZUVsbShkb2N1bWVudC5ib2R5LCdkaXYnLHRpcE5hbWUpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgJHRpcC5pbm5lckhUTUwgPSBtc2c7XHJcblxyXG4gICAgICAgIHRoaXMuc2V0Q3NzKCR0aXAse1xyXG4gICAgICAgICAgICAnZGlzcGxheSc6J2Jsb2NrJyxcclxuICAgICAgICAgICAgJ29wYWNpdHknOiAnMSdcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgdGhpcy5zbGVlcCgoKT0+e1xyXG4gICAgICAgICAgICBfdGhpcy5zZXRDc3MoJHRpcCx7XHJcbiAgICAgICAgICAgICAgICAnb3BhY2l0eSc6ICcwJ1xyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgIH0sdGltZW91dHx8IDIwMDApXHJcblxyXG4gICAgICAgIHRoaXMuc2xlZXAoKCk9PntcclxuICAgICAgICAgICAgX3RoaXMuc2V0Q3NzKCR0aXAse1xyXG4gICAgICAgICAgICAgICAgJ2Rpc3BsYXknOiAnbm9uZSdcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICB9LCh0aW1lb3V0fHwgMTAwMCkrMzAwKVxyXG4gICAgfVxyXG5cclxuICAgIFxyXG4gICAgcHVibGljIGVycm9yVGlwKG1zZzogc3RyaW5nLCB0aW1lb3V0PzogbnVtYmVyKXtcclxuICAgICAgICBsZXQgdGlwTmFtZSA9ICdkYXRlUGlja2VyLWVycm9yVGlwJztcclxuICAgICAgICB0aGlzLlRpcCh0aXBOYW1lLCBtc2csIHRpbWVvdXQpO1xyXG5cclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc3VjY2Vzc1RpcChtc2c6IHN0cmluZywgdGltZW91dD86IG51bWJlcil7XHJcbiAgICAgICAgbGV0IHRpcE5hbWUgPSAnZGF0ZVBpY2tlci1zdWNjZXNzVGlwJztcclxuICAgICAgICB0aGlzLlRpcCh0aXBOYW1lLCBtc2csIHRpbWVvdXQpO1xyXG5cclxuICAgIH1cclxuXHJcblxyXG59XHJcblxyXG4iXX0=

//# sourceMappingURL=datePicker.js.map
