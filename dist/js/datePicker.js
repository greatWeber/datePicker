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
            e.preventDefault();
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
            // e.stopPropagation();
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvdHMvYmFzZVBpY2tlci50cyIsInNyYy90cy9kYXRlUGlja2VyLnRzIiwic3JjL3RzL2luZGV4LnRzIiwic3JjL3RzL21pbnV0ZVBpY2tlci50cyIsInNyYy90cy9wb2x5ZmlsbC5qcyIsInNyYy90cy9yYW5nZVBpY2tlci50cyIsInNyYy90cy9zaW5nbGVQaWNrZXIudHMiLCJzcmMvdHMvdGVtcGxhdGUudHMiLCJzcmMvdHMvdG91Y2gudHMiLCJzcmMvdHMvdXRpbHMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7O0FDQUE7Ozs7Ozs7Ozs7O0FBRUEsSUFBQSxVQUFBLFFBQUEsU0FBQSxDQUFBO0FBR0EsSUFBQSxVQUFBLFFBQUEsU0FBQSxDQUFBOztJQWU4QixVOzs7QUFnRDFCLHdCQUFZLE9BQVosRUFBNEI7QUFBQTs7QUFBQTs7QUEvQ3BCLGVBQUEsSUFBQSxHQUFlLEVBQWYsQ0ErQ29CLENBL0NEO0FBQ25CLGVBQUEsT0FBQSxHQUFrQixFQUFsQixDQThDb0IsQ0E5Q0U7QUFDdEIsZUFBQSxJQUFBLEdBQWUsQ0FBZixDQTZDb0IsQ0E3Q0Y7QUFFaEIsZUFBQSxRQUFBLEdBQW1CLEVBQW5CLENBMkNrQixDQTNDSztBQUN2QixlQUFBLE1BQUEsR0FBaUIsRUFBakIsQ0EwQ2tCLENBMUNHO0FBRXJCLGVBQUEsYUFBQSxHQUFxQixJQUFyQixDQXdDa0IsQ0F4Q1M7QUFFM0IsZUFBQSxhQUFBLEdBQStCLEVBQS9CLENBc0NrQixDQXRDZ0I7QUFFbEMsZUFBQSxZQUFBLEdBQTJCLEVBQTNCLENBb0NrQixDQXBDYTtBQUUvQixlQUFBLElBQUEsR0FBWSxJQUFaLENBa0NrQixDQWxDQTtBQUVsQixlQUFBLFdBQUEsR0FBbUIsRUFBbkIsQ0FnQ2tCLENBaENLO0FBNEJqQztBQUNVLGVBQUEsT0FBQSxHQUFrQixDQUFsQixDQUdrQixDQUhHO0FBSzNCLGVBQUssR0FBTCxH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ZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uKCl7ZnVuY3Rpb24gcihlLG4sdCl7ZnVuY3Rpb24gbyhpLGYpe2lmKCFuW2ldKXtpZighZVtpXSl7dmFyIGM9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZTtpZighZiYmYylyZXR1cm4gYyhpLCEwKTtpZih1KXJldHVybiB1KGksITApO3ZhciBhPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIraStcIidcIik7dGhyb3cgYS5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGF9dmFyIHA9bltpXT17ZXhwb3J0czp7fX07ZVtpXVswXS5jYWxsKHAuZXhwb3J0cyxmdW5jdGlvbihyKXt2YXIgbj1lW2ldWzFdW3JdO3JldHVybiBvKG58fHIpfSxwLHAuZXhwb3J0cyxyLGUsbix0KX1yZXR1cm4gbltpXS5leHBvcnRzfWZvcih2YXIgdT1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlLGk9MDtpPHQubGVuZ3RoO2krKylvKHRbaV0pO3JldHVybiBvfXJldHVybiByfSkoKSIsIi8vIOaXtumXtOmAieaLqeWZqOaguOW/g+S7o+eggVxyXG5cclxuaW1wb3J0IFV0aWxzIGZyb20gJy4vdXRpbHMnO1xyXG5cclxuaW1wb3J0ICogYXMgdGVtcCBmcm9tICcuL3RlbXBsYXRlJztcclxuaW1wb3J0IFRvdWNocyBmcm9tICcuL3RvdWNoJztcclxuXHJcbi8vIHBpY2tlcuWPguaVsOaOpeWPo1xyXG5pbnRlcmZhY2UgcGlja2VycyB7XHJcbiAgICAgICAgc3RhcnRZZWFyPzogc3RyaW5nO1xyXG4gICAgICAgIGVuZFllYXI/OiBzdHJpbmc7XHJcbiAgICAgICAgZGVmYXVsdERhdGU/OiBzdHJpbmc7XHJcbiAgICAgICAga2V5PzogbnVtYmVyO1xyXG4gICAgICAgIG91dEZvcm1hdCA/OiBzdHJpbmc7XHJcbiAgICAgICAgb25jaGFuZ2U/OiBGdW5jdGlvbjsgXHJcbiAgICAgICAgc3VjY2Vzcz86IEZ1bmN0aW9uO1xyXG4gICAgICAgIHR5cGU/OiBzdHJpbmc7IC8v6YCJ5oup5Zmo57G75Z6L77yac2luZ2xlLCByYW5nZSwgbWludXRlXHJcblxyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBhYnN0cmFjdCBjbGFzcyBCYXNlUGlja2VyIGV4dGVuZHMgVXRpbHMge1xyXG4gICAgcHJpdmF0ZSBfb3B0OiBvYmplY3QgPSB7fTsgLy/lhajlsYDphY3nva5cclxuICAgIHByaXZhdGUgX3BhcmFtczogb2JqZWN0ID0ge307IC8v5Yid5aeL5YyW6YWN572uXHJcbiAgICBwcml2YXRlIF9rZXk6IG51bWJlciA9IDE7IC8v5ZSv5LiAa2V5XHJcblxyXG4gICAgcHJvdGVjdGVkIG1vbnRoU3RyOiBzdHJpbmcgPSAnJzsgLy/mnIjku73lrZfnrKbkuLJcclxuICAgIHByb3RlY3RlZCBkYXlTdHI6IHN0cmluZyA9ICcnOyAvL+WkqeaVsOWtl+espuS4slxyXG5cclxuICAgIHByb3RlY3RlZCBjdXJyZW50UGlja2VyOiBhbnkgPSBudWxsOyAvL+S/neWtmOW9k+WJjeaYvuekuueahOmAieaLqeWZqFxyXG5cclxuICAgIHByb3RlY3RlZCBjdXJyZW50SW5kZXhzOiBBcnJheTxudW1iZXI+ID0gW107Ly/kv53lrZjlvZPliY3pgInmi6nnmoTmoLzlrZDntKLlvJVcclxuXHJcbiAgICBwcm90ZWN0ZWQgY3VycmVudFZhbHVlOiBBcnJheTxhbnk+ID0gW107IC8v5L+d5a2Y5b2T5YmN6YCJ5oup55qE5YC8IFxyXG5cclxuICAgIHByb3RlY3RlZCBtYXNrOiBhbnkgPSBudWxsOyAvL+S/neWtmOWUr+S4gOeahOmBrue9qVxyXG5cclxuICAgIHByb3RlY3RlZCBkZWZhdWx0SW5mbzogYW55ID0ge307IC8vXHJcblxyXG4gICAgZ2V0IG9wdCgpOiBhbnl7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX29wdDtcclxuICAgIH1cclxuXHJcbiAgICBzZXQgb3B0KHZhbDogYW55KXtcclxuICAgICAgICB0aGlzLl9vcHQgPSB2YWw7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0IHBhcmFtcygpOiBwaWNrZXJze1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9wYXJhbXM7XHJcbiAgICB9XHJcblxyXG4gICAgc2V0IHBhcmFtcyh2YWw6IHBpY2tlcnMpe1xyXG4gICAgICAgIHRoaXMuX3BhcmFtcyA9IHZhbDtcclxuICAgIH1cclxuXHJcbiAgICBnZXQga2V5KCk6IG51bWJlcntcclxuICAgICAgICByZXR1cm4gdGhpcy5fa2V5O1xyXG4gICAgfVxyXG5cclxuICAgIHNldCBrZXkodmFsOiBudW1iZXIpe1xyXG4gICAgICAgIHRoaXMuX2tleSA9IHZhbDtcclxuICAgIH1cclxuXHJcbiAgICBcclxuXHJcbiAgICAvLyDovoXliqnnsbvlj5jph49cclxuICAgIHByb3RlY3RlZCBfaGVpZ2h0IDpudW1iZXIgPSAwOyAvL+mAieaLqeWZqOagvOWtkOeahOmrmOW6plxyXG4gICAgXHJcblxyXG4gICAgY29uc3RydWN0b3Iob3B0aW9ucz86IG9iamVjdCl7ICBcclxuICAgICAgICBzdXBlcigpOyAgXHJcbiAgICAgICAgdGhpcy5vcHQgPSB0aGlzLmFzc2lnbih7XHJcbiAgICAgICAgICAgIG9uY2hhbmdlOiAoKT0+e30sXHJcbiAgICAgICAgICAgIHN1Y2Nlc3M6ICgpPT57fVxyXG4gICAgICAgIH0sb3B0aW9ucyk7XHJcbiAgICAgICAgXHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHBpY2tlcihwYXJhbXM/OiBwaWNrZXJzKXtcclxuICAgICAgICAvKipcclxuICAgICAgICAgKiDliJ3lp4vljJbmlrnms5XvvIzkuI3lu7rorq7lnKjlvqrnjq/kuK3miJbogIXkuovku7bkuK3ph43lpI3osIPnlKhcclxuICAgICAgICAgKi9cclxuICAgICAgICB0aGlzLnBhcmFtcyA9IHRoaXMuYXNzaWduKHsgXHJcbiAgICAgICAgICAgIHN0YXJ0WWVhcjogJzE5OTAnLFxyXG4gICAgICAgICAgICBlbmRZZWFyOiAnMjAzMCcsXHJcbiAgICAgICAgICAgIGRlZmF1bHREYXRlOiB0aGlzLmdldFRvZGF5KCctJyksXHJcbiAgICAgICAgICAgIGtleTogdGhpcy5rZXksXHJcbiAgICAgICAgICAgIG91dEZvcm1hdDogJy0nLFxyXG4gICAgICAgICAgICBvbmNoYW5nZTogKCk9Pnt9LFxyXG4gICAgICAgICAgICBzdWNjZXNzOiAoKT0+e30sXHJcbiAgICAgICAgICAgIHR5cGU6ICdyYW5nZSdcclxuICAgICAgICB9LHBhcmFtcyk7XHJcblxyXG4gICAgICAgIFxyXG4gICAgICAgIHRoaXMucmVuZGVyKCk7XHJcblxyXG4gICAgfVxyXG5cclxuICAgIC8vIGFic3RyYWN0IHJlbmRlcigpIDp2b2lkO1xyXG5cclxuICAgIHB1YmxpYyByZW5kZXIoKXsgXHJcbiAgICAgICAgLy8g5riy5p+T5Ye95pWw77yM5LiA6Iis6KaB5Zyo5a2Q57G76YeN5YaZXHJcbiAgICAgICAgdGhpcy5jcmVhdGVNYXNrKCk7XHJcbiAgICAgICAgdGhpcy5jcmVhdGVQaWNrZXIoKTtcclxuICAgICAgICBcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgY3JlYXRlTWFzaygpe1xyXG4gICAgICAgIC8vIOWIm+W7uuiSmeeJiFxyXG4gICAgICAgIGxldCBtYXNrTmFtZSA9IGBwaWNrZXItbWFza2A7XHJcbiAgICAgICAgbGV0ICRtYXNrID0gdGhpcy5zZWxlY3QoYC4ke21hc2tOYW1lfWApO1xyXG4gICAgICAgIGxldCBfdGhpcyA9IHRoaXM7XHJcbiAgICAgICAgaWYoISRtYXNrKXtcclxuICAgICAgICAgICAgJG1hc2sgPSB0aGlzLmNyZWF0ZUVsbShkb2N1bWVudC5ib2R5LCdkaXYnLG1hc2tOYW1lKTtcclxuICAgICAgICAgICAgdGhpcy5zZXRDc3MoJG1hc2sse1xyXG4gICAgICAgICAgICAgICAgJ3RyYW5zaXRpb24nOiAnMC4zcyBhbGwgbGluZWFyJyxcclxuICAgICAgICAgICAgICAgICdvcGFjaXR5JzogJzAnLFxyXG4gICAgICAgICAgICAgICAgJ2Rpc3BsYXknOiAnbm9uZSdcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5tYXNrID0gJG1hc2s7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGNyZWF0ZVBpY2tlcigpeyBcclxuICAgICAgICAvLyDliJvlu7rpgInmi6nlmahcclxuXHJcbiAgICAgICAgbGV0IHBpY2tlck5hbWUgPSBgcGlja2VyLWtleS0ke3RoaXMucGFyYW1zLmtleX1gO1xyXG4gICAgICAgIGxldCAkcGlja2VyID0gdGhpcy5zZWxlY3QoYC4ke3BpY2tlck5hbWV9YCk7XHJcbiAgICAgICAgbGV0ICRwaWNrZXJXcmFwcGVyID0gdGhpcy5zZWxlY3QoYC4ke3BpY2tlck5hbWV9IC5waWNrZXItd3JhcHBlcmApO1xyXG4gICAgICAgIGxldCBfdGhpcyA9IHRoaXM7XHJcbiAgICAgICAgXHJcbiAgICAgICAgaWYoISRwaWNrZXIpe1xyXG4gICAgICAgICAgICB0aGlzLm1vbnRoU3RyID0gdGhpcy5jcmVhdGVNb250aFN0cigpO1xyXG4gICAgICAgICAgICB0aGlzLmRheVN0ciA9IHRoaXMuY3JlYXRlRGF5U3RyKCk7XHJcbiAgICAgICAgICAgIGxldCBwaWNrZXJIdG1sID0gdGhpcy5yZW5kZXJIdG1sKCk7XHJcblxyXG4gICAgICAgICAgICAkcGlja2VyID0gdGhpcy5jcmVhdGVFbG0oZG9jdW1lbnQuYm9keSwnZGl2JyxwaWNrZXJOYW1lKTtcclxuICAgICAgICAgICAgJHBpY2tlci5pbm5lckhUTUwgPSBwaWNrZXJIdG1sO1xyXG4gICAgICAgICAgICAkcGlja2VyV3JhcHBlciA9IHRoaXMuc2VsZWN0KGAuJHtwaWNrZXJOYW1lfSAucGlja2VyLXdyYXBwZXJgKTtcclxuICAgICAgICAgICAgdGhpcy5zZXRDc3MoJHBpY2tlcldyYXBwZXIse1xyXG4gICAgICAgICAgICAgICAgJ3RyYW5zaXRpb24nOiAnMC4zcyBhbGwgbGluZWFyJyxcclxuICAgICAgICAgICAgICAgICd0cmFuc2Zvcm0nOiAndHJhbnNsYXRlWSgxMDAlKSdcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIGlmKCFfdGhpcy5faGVpZ2h0KXtcclxuICAgICAgICAgICAgICAgIF90aGlzLl9oZWlnaHQgPSBfdGhpcy5zZWxlY3QoJy5kYXRlLXVuaXQnLCRwaWNrZXIpLmNsaWVudEhlaWdodDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0aGlzLmN1cnJlbnRQaWNrZXIgPSAkcGlja2VyIHx8IHt9OyAvL+S/neWtmOW9k+WJjeeahOmAieaLqeWZqFxyXG4gICAgICAgICAgICB0aGlzLmN1cnJlbnRQaWNrZXIueWVhcnMgPSB0aGlzLmdldFllYXJBcnJheSgpO1xyXG4gICAgICAgICAgICB0aGlzLnNldERlZmF1bHRWaWV3KHRoaXMucGFyYW1zLmRlZmF1bHREYXRlKTsgLy/orr7nva7pu5jorqTml6XmnJ/nmoTop4blm75cclxuICAgICAgICAgICAgdGhpcy5iaW5kRXZlbnRzKCk7XHJcbiAgICAgICAgICAgIHRoaXMucGlja2VyT3BlcmF0aW9uKCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyDmt7vliqDmmL7npLrnirbmgIFcclxuICAgICAgICAkcGlja2VyLmNsYXNzTGlzdC5hZGQoJ19fcGlja2VyLXR5cGUtc2hvdycpO1xyXG4gICAgICAgIHRoaXMuY3VycmVudFBpY2tlciA9ICRwaWNrZXIgfHwge307IC8v5L+d5a2Y5b2T5YmN55qE6YCJ5oup5ZmoXHJcbiAgICAgICAgdGhpcy5jdXJyZW50UGlja2VyLnllYXJzID0gdGhpcy5nZXRZZWFyQXJyYXkoKTtcclxuICAgIH1cclxuXHJcbiAgICBhYnN0cmFjdCByZW5kZXJIdG1sKCk6IHN0cmluZ1xyXG5cclxuICAgIFxyXG5cclxuICAgIHB1YmxpYyBnZXRZZWFyQXJyYXkoKTogQXJyYXk8bnVtYmVyPntcclxuICAgICAgICBsZXQgeWVhcnMgPSBbXTtcclxuICAgICAgICBsZXQgc3RhcnRZZWFyOiBhbnkgPSAgdGhpcy5wYXJhbXMuc3RhcnRZZWFyO1xyXG4gICAgICAgIGxldCBlbmRZZWFyOiBhbnkgPSB0aGlzLnBhcmFtcy5lbmRZZWFyO1xyXG4gICAgICAgIGZvcihsZXQgaT1zdGFydFllYXItMDtpPD1lbmRZZWFyLTA7aSsrKXtcclxuICAgICAgICAgICAgeWVhcnMucHVzaChpKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHllYXJzO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBjcmVhdGVZZWFyU3RyKCk6IHN0cmluZ3tcclxuICAgICAgICAvLyDliJvlu7rlubRcclxuICAgICAgICBsZXQgeWVhcnMgPSBbXTtcclxuICAgICAgICBsZXQgc3RhcnRZZWFyOiBhbnkgPSAgdGhpcy5wYXJhbXMuc3RhcnRZZWFyO1xyXG4gICAgICAgIGxldCBlbmRZZWFyOiBhbnkgPSB0aGlzLnBhcmFtcy5lbmRZZWFyO1xyXG4gICAgICAgIGZvcihsZXQgaT1zdGFydFllYXItMDtpPD1lbmRZZWFyLTA7aSsrKXtcclxuICAgICAgICAgICAgeWVhcnMucHVzaChpKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgbGV0IGh0bWwgPSAnJztcclxuICAgICAgICB5ZWFycy5mb3JFYWNoKChpdGVtLGkpPT57XHJcbiAgICAgICAgICAgIGh0bWwrPSBgPHAgY2xhc3M9XCJkYXRlLXVuaXRcIiBkYXRhLXllYXI9XCIke2l0ZW19XCI+JHtpdGVtfeW5tDwvcD5gO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKCd5ZWFyJyxodG1sKTtcclxuICAgICAgICByZXR1cm4gaHRtbDtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgY3JlYXRlTW9udGhTdHIoKTogc3RyaW5nIHtcclxuICAgICAgICAvLyDliJvlu7rmnIhcclxuICAgICAgICBsZXQgbW9udGhzID0gW107XHJcbiAgICAgICAgZm9yKGxldCBpPTE7aTw9MTI7aSsrKXtcclxuICAgICAgICAgICAgbW9udGhzLnB1c2goaSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGxldCBodG1sID0gJyc7XHJcbiAgICAgICAgbW9udGhzLmZvckVhY2goKGl0ZW0saSk9PntcclxuICAgICAgICAgICAgbGV0IG1vbnRoID0gaXRlbT49MTA/IGl0ZW06ICcwJytpdGVtO1xyXG4gICAgICAgICAgICBodG1sKz0gYDxwIGNsYXNzPVwiZGF0ZS11bml0XCIgZGF0YS1tb250aD1cIiR7aXRlbX1cIj4ke21vbnRofeaciDwvcD5gO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKCdtb250aCcsaHRtbCk7XHJcbiAgICAgICAgcmV0dXJuIGh0bWw7ICBcclxuICAgIH0gIFxyXG4gXHJcbiAgICBwdWJsaWMgY3JlYXRlRGF5U3RyKCk6IHN0cmluZyB7XHJcbiAgICAgICAgLy8g5Yib5bu6ZGF5XHJcbiAgICAgICAgbGV0IGRheXMgPSBbXTtcclxuICAgICAgICBmb3IobGV0IGk9MTtpPD0zMTtpKyspe1xyXG4gICAgICAgICAgICBkYXlzLnB1c2goaSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGxldCBodG1sID0gJyc7XHJcbiAgICAgICAgZGF5cy5mb3JFYWNoKChpdGVtLGkpPT57XHJcbiAgICAgICAgICAgIGxldCBkYXkgPSBpdGVtPj0xMD8gaXRlbTogJzAnK2l0ZW07XHJcbiAgICAgICAgICAgIGh0bWwrPSBgPHAgY2xhc3M9XCJkYXRlLXVuaXRcIiBkYXRhLWRheT1cIiR7aXRlbX1cIj4ke2RheX3ml6U8L3A+YDtcclxuICAgICAgICB9KTtcclxuICAgICAgICAvLyBjb25zb2xlLmxvZygnZGF5JyxodG1sKTtcclxuICAgICAgICByZXR1cm4gaHRtbDtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc2V0RGVmYXVsdFZpZXcoZGVmYXVsdERhdGU6IHN0cmluZyl7XHJcbiAgICAgICAgaWYoIWRlZmF1bHREYXRlKXtcclxuICAgICAgICAgICAgY29uc29sZS5lcnJvcignRXJyb3I6IOm7mOiupOaXpeacnyhkZWZhdWx0RGF0ZSnkuI3og73kuLrnqbonKTtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICBsZXQgZGF0ZUFycmF5ID0gZGVmYXVsdERhdGUuc3BsaXQoJy0nKTtcclxuICAgICAgICBpZighZGF0ZUFycmF5IHx8IGRhdGVBcnJheS5sZW5ndGg8Myl7XHJcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoJ0Vycm9yOum7mOiupOaXpeacnyhkZWZhdWx0RGF0ZSnnmoTmoLzlvI/mnInor68s6buY6K6k5qC85byPOjIwMTktMDEtMDEgb3IgMjAxOS0xLTEnKTtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICBcclxuICAgICAgICBsZXQgJHBpY2tlciA9IHRoaXMuY3VycmVudFBpY2tlcjtcclxuICAgICAgICBsZXQgJGRhdGVVdGlscyA9IHRoaXMuc2VsZWN0QWxsKCcuZGF0ZS1pdGVtJywkcGlja2VyKTtcclxuICAgICAgICAvLyB5ZWFyXHJcbiAgICAgICAgbGV0IHllYXJJbmRleCA9IHRoaXMuY3VycmVudFRvSW5kZXgocGFyc2VJbnQoZGF0ZUFycmF5WzBdKS1wYXJzZUludCh0aGlzLnBhcmFtcy5zdGFydFllYXIpKTtcclxuICAgICAgICB0aGlzLnNldENzcygkZGF0ZVV0aWxzWzBdLHtcclxuICAgICAgICAgICAgJ3RyYW5zZm9ybSc6YHRyYW5zbGF0ZVkoJHt5ZWFySW5kZXgqdGhpcy5faGVpZ2h0fXB4KWBcclxuICAgICAgICB9KTtcclxuICAgICAgICAvLyBtb250aFxyXG4gICAgICAgIGxldCBtb250aEluZGV4ID0gdGhpcy5jdXJyZW50VG9JbmRleChwYXJzZUludChkYXRlQXJyYXlbMV0pLTEpO1xyXG5cclxuICAgICAgICB0aGlzLnNldENzcygkZGF0ZVV0aWxzWzFdLHtcclxuICAgICAgICAgICAgJ3RyYW5zZm9ybSc6YHRyYW5zbGF0ZVkoJHttb250aEluZGV4KnRoaXMuX2hlaWdodH1weClgXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIC8vIG1vbnRoXHJcbiAgICAgICAgbGV0IGRheUluZGV4ID0gdGhpcy5jdXJyZW50VG9JbmRleChwYXJzZUludChkYXRlQXJyYXlbMl0pLTEpO1xyXG4gICAgICAgIHRoaXMuc2V0Q3NzKCRkYXRlVXRpbHNbMl0se1xyXG4gICAgICAgICAgICAndHJhbnNmb3JtJzpgdHJhbnNsYXRlWSgke2RheUluZGV4KnRoaXMuX2hlaWdodH1weClgXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgdGhpcy5kZWZhdWx0SW5mbyA9IHtcclxuICAgICAgICAgICAgZGF0ZUFycmF5OiBkYXRlQXJyYXksXHJcbiAgICAgICAgICAgIGhlaWdodEFycmF5OiBbeWVhckluZGV4KnRoaXMuX2hlaWdodCxtb250aEluZGV4KnRoaXMuX2hlaWdodCxkYXlJbmRleCp0aGlzLl9oZWlnaHRdXHJcbiAgICAgICAgfSA7XHJcblxyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBiaW5kRXZlbnRzKCl7XHJcbiAgICAgICAgaWYoIXRoaXMuY3VycmVudFBpY2tlcil7XHJcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoJ0Vycm9yOiDpgInmi6nlmajov5jmsqHmnInmuLLmn5MnKTtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcblxyXG5cclxuICAgICAgICBsZXQgJGRhdGVHcm91cHMgPSB0aGlzLnNlbGVjdEFsbCgnLmRhdGUtZ3JvdXAnLHRoaXMuY3VycmVudFBpY2tlcik7XHJcbiAgICAgICAgbGV0IF90aGlzID0gdGhpcztcclxuICAgICAgICBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbCgkZGF0ZUdyb3VwcykuZm9yRWFjaCgoZGF0ZUdyb3VwLGkpPT57XHJcbiAgICAgICAgICAgIGxldCAkZGF0ZVV0aWxzID0gX3RoaXMuc2VsZWN0KCcuZGF0ZS1pdGVtJyxkYXRlR3JvdXApO1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgX3RoaXMuc2V0Q3NzKCRkYXRlVXRpbHMse1xyXG4gICAgICAgICAgICAgICAgJ3RyYW5zaXRpb24nOicwLjFzIGFsbCBsaW5lYXInIFxyXG4gICAgICAgICAgICB9KTsgICBcclxuICAgICAgICAgICAgLy8g5rOo5oSP77yaRW5kWeeahOWAvOS4jeW6lOivpeS4ujDvvIzogIzmmK/osIPnlKjpu5jorqTop4blm77lh73mlbDlkI7nmoTot53nprtcclxuICAgICAgICAgICAgbGV0IEVuZFk6IG51bWJlciA9IHRoaXMuZGVmYXVsdEluZm8uaGVpZ2h0QXJyYXlbaV07XHJcblxyXG4gICAgICAgICAgICBsZXQgdG91Y2hzID0gbmV3IFRvdWNocyhkYXRlR3JvdXApO1xyXG4gICAgICAgICAgICB0b3VjaHMuaW5pdCh7XHJcbiAgICAgICAgICAgICAgICBzdGFydENiOiAoZTogYW55LCByYW5nZTogbnVtYmVyKT0+e1xyXG4gICAgICAgICAgICAgICAgICAgIF90aGlzLnRvdWNoU3RhcnQoZSwkZGF0ZVV0aWxzKTtcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBtb3ZlQ2I6IChlOiBhbnksIHJhbmdlOiBudW1iZXIpPT57XHJcbiAgICAgICAgICAgICAgICAgICAgX3RoaXMudG91Y2hNb3ZlKGUscmFuZ2UsRW5kWSwkZGF0ZVV0aWxzKTsgXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgZW5kQ2I6IChlOmFueSwgZW5kWTogbnVtYmVyKT0+e1xyXG4gICAgICAgICAgICAgICAgICAgIEVuZFkgPSBfdGhpcy50b3VjaEVuZChlLGVuZFksRW5kWSwgJGRhdGVVdGlscyxpKTtcclxuICAgICAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZygndG91Y2hFbmQnLEVuZFkpIFxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICB0aGlzLm1hc2suYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLHRoaXMuaGlkZS5iaW5kKF90aGlzKSk7XHJcblxyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgdG91Y2hTdGFydChlOiBhbnksIHRhcmdldDogYW55KXtcclxuICAgICAgICAvLyBjb25zb2xlLmxvZygnc3RhcnQnKTtcclxuICAgICAgICB0aGlzLnNldENzcyh0YXJnZXQse1xyXG4gICAgICAgICAgICAndHJhbnNpdGlvbic6Jy4zcyBhbGwgbGluZWFyJyxcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHRvdWNoTW92ZShlOiBhbnksIHJhbmdlOiBudW1iZXIsIEVuZFk6IG51bWJlciwgdGFyZ2V0OiBhbnkpe1xyXG4gICAgICAgIHRoaXMuc2V0Q3NzKHRhcmdldCx7XHJcbiAgICAgICAgICAgICd0cmFuc2Zvcm0nOiBgdHJhbnNsYXRlWSgke0VuZFkrcmFuZ2UqMX1weClgXHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSB0b3VjaEVuZChlOiBhbnksIGVuZFk6IG51bWJlciwgRW5kWTogbnVtYmVyLCB0YXJnZXQ6IGFueSwgSW5kZXg6IG51bWJlcil7XHJcbiAgICAgICAgRW5kWSA9IEVuZFkrZW5kWTtcclxuICAgICAgICBsZXQgbWluID0gRW5kWSA+MD9NYXRoLmZsb29yKEVuZFkgLyB0aGlzLl9oZWlnaHQpOiBNYXRoLmNlaWwoRW5kWSAvIHRoaXMuX2hlaWdodCk7XHJcbiAgICAgICAgbGV0IG1heCA9IEVuZFkgPjA/IG1pbisxOiBtaW4tMTtcclxuICAgICAgICBsZXQgbWlkZGxlID0gKG1heCttaW4pLzIqdGhpcy5faGVpZ2h0O1xyXG4gICAgICAgIGxldCBjdXJyZW50ID0gMDtcclxuICAgICAgICB0aGlzLmN1cnJlbnRWYWx1ZSA9IHRoaXMuZGVmYXVsdEluZm8uZGF0ZUFycmF5O1xyXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKCdtaW4nLG1pbik7XHJcbiAgICAgICAgLy8gY29uc29sZS5sb2coJ21pZGRsZScsbWlkZGxlKTtcclxuICAgICAgICAvLyBjb25zb2xlLmxvZygnRW5kWScsIEVuZFkpO1xyXG4gICAgICAgIGlmKE1hdGguYWJzKEVuZFkpPj1NYXRoLmFicyhtaWRkbGUpKXtcclxuICAgICAgICAgICAgRW5kWSA9IG1heCp0aGlzLl9oZWlnaHQ7XHJcbiAgICAgICAgICAgIGN1cnJlbnQgPSBtYXg7XHJcbiAgICAgICAgfWVsc2V7XHJcbiAgICAgICAgICAgIEVuZFkgPSBtaW4qdGhpcy5faGVpZ2h0O1xyXG4gICAgICAgICAgICBjdXJyZW50ID0gbWluO1xyXG4gICAgICAgIH1cclxuICAgICAgICAvLyDlhbPkuo7moLzlrZDnmoTmlbDph49cclxuICAgICAgICAvLyDlj6rmnInlubTlkozml6XmmK/lj5jljJbnmoTvvIzmnIjku73pg73mmK/lm7rlrprnmoQoMTIpXHJcbiAgICAgICAgdmFyIGNvdW50cyA9IDA7XHJcbiAgICAgICAgc3dpdGNoIChJbmRleCkge1xyXG4gICAgICAgICAgICBjYXNlIDA6IC8v5bm0XHJcbiAgICAgICAgICAgICAgICBjb3VudHMgPSB0aGlzLmN1cnJlbnRQaWNrZXIueWVhcnMubGVuZ3RoO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgMTogLy/mnIhcclxuICAgICAgICAgICAgICAgIGNvdW50cyA9IDEyO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgMjogLy/ml6VcclxuICAgICAgICAgICAgICAgIC8vIFRvZG9cclxuICAgICAgICAgICAgICAgIGNvdW50cyA9IHRoaXMuZ2V0RGF5KCk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSAzOiAvL+Wwj+aXtlxyXG4gICAgICAgICAgICAgICAgY291bnRzID0gMjQ7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSA0OiAvL+WIhumSn1xyXG4gICAgICAgICAgICAgICAgY291bnRzID0gNjA7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICBcclxuICAgICAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIH1cclxuICAgICAgICAvLyDpgLvovpHvvJpcclxuICAgICAgICAvLyDmoLnmja7pobXpnaLkuKrnu5PmnoTvvIzmr4/kuKrpgInmi6nlmajlj6rmmL7npLoz5Liq5qC85a2Q77yM5omA5Lul5Lit5b+D55qE5pivMlxyXG4gICAgICAgIC8vIOmCo+S5iOWktOmDqOS4jeiDvei2hei/h+eahOi3neemu+aYryAxKmhlaWdodFxyXG4gICAgICAgIC8vIOW6lemDqOS4jeiDvei2hei/h+eahOi3neemu+aYry0o5qC85a2Q5pWw6YePLTIpKmhlaWdodFxyXG4gICAgICAgIGlmKEVuZFk+MSp0aGlzLl9oZWlnaHQpe1xyXG4gICAgICAgICAgICBFbmRZID0gMSp0aGlzLl9oZWlnaHQ7XHJcbiAgICAgICAgICAgIGN1cnJlbnQgPSAxO1xyXG4gICAgICAgIH1lbHNlIGlmKE1hdGguYWJzKEVuZFkpPk1hdGguYWJzKC0oY291bnRzLTIpKnRoaXMuX2hlaWdodCkpe1xyXG4gICAgICAgICAgICBFbmRZID0gLShjb3VudHMtMikqdGhpcy5faGVpZ2h0O1xyXG4gICAgICAgICAgICBjdXJyZW50ID0gLShjb3VudHMtMik7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuY3VycmVudEluZGV4c1tJbmRleF0gPSBjdXJyZW50OyAvL+S/neWtmOW9k+WJjeeahOagvOWtkOe0ouW8lVxyXG4gICAgICAgIGxldCBhcnJheUluZGV4ID0gdGhpcy5jdXJyZW50VG9JbmRleChjdXJyZW50KTsgLy/miormoLzlrZDntKLlvJXovazmiJDmlbDnu4TntKLlvJVcclxuICAgICAgICBpZihJbmRleD09MCl7XHJcbiAgICAgICAgICAgIC8vIOWPquacieW5tOmcgOimgeS7juaVsOe7hOS4reivu+WPluWAvFxyXG4gICAgICAgICAgICB0aGlzLmN1cnJlbnRWYWx1ZVtJbmRleF0gPSB0aGlzLmN1cnJlbnRQaWNrZXIueWVhcnNbYXJyYXlJbmRleF07XHJcbiAgICAgICAgfWVsc2UgaWYoSW5kZXg9PTEgfHwgSW5kZXg9PTIpe1xyXG4gICAgICAgICAgICB0aGlzLmN1cnJlbnRWYWx1ZVtJbmRleF0gPSBhcnJheUluZGV4KzE+PTEwP2FycmF5SW5kZXgrMTonMCcrKGFycmF5SW5kZXgrMSk7XHJcbiAgICAgICAgfWVsc2V7XHJcbiAgICAgICAgICAgIHRoaXMuY3VycmVudFZhbHVlW0luZGV4XSA9IGFycmF5SW5kZXg+PTEwP2FycmF5SW5kZXg6JzAnK2FycmF5SW5kZXg7XHJcblxyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLnNldENzcyh0YXJnZXQse1xyXG4gICAgICAgICAgICAndHJhbnNpdGlvbic6Jy4zcyBhbGwgbGluZWFyJyxcclxuICAgICAgICAgICAgJ3RyYW5zZm9ybSc6IGB0cmFuc2xhdGVZKCR7RW5kWX1weClgXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIC8vIOiwg+eUqG9uY2hhbmdl5Zue6LCDXHJcbiAgICAgICAgdGhpcy5vcHQub25jaGFuZ2UodGhpcy5jdXJyZW50VmFsdWUpO1xyXG4gICAgICAgIHRoaXMucGFyYW1zLm9uY2hhbmdlKHRoaXMuY3VycmVudFZhbHVlKTtcclxuICAgICAgICBsZXQgY3VycmVudFZhbHVlID0gdGhpcy5jdXJyZW50VmFsdWUuam9pbih0aGlzLnBhcmFtcy5vdXRGb3JtYXQpO1xyXG5cclxuICAgICAgICB0aGlzLiRlbWl0KGBvbmNoYW5nZV8ke3RoaXMucGFyYW1zLmtleX1gLGN1cnJlbnRWYWx1ZSk7XHJcbiAgICAgICAgcmV0dXJuIEVuZFk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGdldERheSgpe1xyXG4gICAgICAgIC8vIOiOt+WPluW9k+aciOeahOWkqeaVsFxyXG4gICAgICAgIGxldCBfdGhpcyA9IHRoaXM7XHJcbiAgICAgICAgbGV0IGRheXMgPSBuZXcgRGF0ZSh0aGlzLmN1cnJlbnRWYWx1ZVswXSx0aGlzLmN1cnJlbnRWYWx1ZVsxXSwwKS5nZXREYXRlKCk7XHJcbiAgICAgICAgLy8gY29uc29sZS5sb2coJ2RheXMnLGRheXMpO1xyXG4gICAgICAgIGxldCAkdW50aXMgPSB0aGlzLnNlbGVjdEFsbCgnW2RhdGEtZGF5XScsdGhpcy5jdXJyZW50UGlja2VyKTtcclxuICAgICAgICBjb25zdCBmYWRlID0gKGluZGV4LG9wYWNpdHkpPT57XHJcbiAgICAgICAgICAgIGZvcih2YXIgaSA9IDMwOyBpPj1pbmRleDtpLS0pe1xyXG4gICAgICAgICAgICAgICAgX3RoaXMuc2V0Q3NzKCR1bnRpc1tpXSx7XHJcbiAgICAgICAgICAgICAgICAgICAgJ29wYWNpdHknOiBvcGFjaXR5XHJcbiAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHN3aXRjaCAoZGF5cykge1xyXG4gICAgICAgICAgICBjYXNlIDMwOlxyXG4gICAgICAgICAgICAgICAgZmFkZSgzMCwnMCcpO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcblxyXG4gICAgICAgICAgICBjYXNlIDI4OlxyXG4gICAgICAgICAgICAgICAgZmFkZSgyOCwnMCcpO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcblxyXG4gICAgICAgICAgICBjYXNlIDMxOlxyXG4gICAgICAgICAgICAgICAgZmFkZSgyOCwnMScpO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgXHJcbiAgICAgICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGRheXM7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGN1cnJlbnRUb0luZGV4KGN1cnJlbnQ6IG51bWJlcil7XHJcbiAgICAgICAgLy8g6YC76L6R77yaXHJcbiAgICAgICAgLy8g5qC55o2u6aG16Z2i5biD5bGA77yM5b6X5p2l56ys5LiA5Liq5qC85a2Q5piv5q2j5pWw77yM5YW25LuW55qE6Led56a76YO95piv6LSf5pWwXHJcbiAgICAgICAgLy8g5omA5Lul5Y+v5Lul6YCa6L+HKDEtY3VycmVudCnmnaXojrflj5blvZPliY3moLzlrZDmlbDnu4TnmoTntKLlvJVcclxuICAgICAgICByZXR1cm4gMS1jdXJyZW50O1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBoaWRlKCl7XHJcbiAgICAgICAgbGV0IF90aGlzID0gdGhpcztcclxuICAgICAgICAvLyDlhbPpl63pga7nvalcclxuICAgICAgICB0aGlzLnNldENzcyh0aGlzLm1hc2sse1xyXG4gICAgICAgICAgICAnb3BhY2l0eSc6JzAnXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgdGhpcy5zbGVlcCgoKT0+e1xyXG4gICAgICAgICAgICBfdGhpcy5zZXRDc3MoX3RoaXMubWFzayx7XHJcbiAgICAgICAgICAgICAgICAnZGlzcGxheSc6J25vbmUnXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0sMzAwKTtcclxuICAgICAgICAvLyDlhbPpl63pgInmi6nlmahcclxuICAgICAgICBsZXQgJHBpY2tlcldyYXBwZXIgPSB0aGlzLnNlbGVjdChgLnBpY2tlci13cmFwcGVyYCx0aGlzLmN1cnJlbnRQaWNrZXIpO1xyXG4gICAgICAgIHRoaXMuc2V0Q3NzKCRwaWNrZXJXcmFwcGVyLHtcclxuICAgICAgICAgICAgJ3RyYW5zZm9ybSc6J3RyYW5zbGF0ZVkoMTAwJSknXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgdGhpcy5jdXJyZW50UGlja2VyLmNsYXNzTGlzdC5yZW1vdmUoJ19fcGlja2VyLXR5cGUtc2hvdycpO1xyXG4gICAgICAgIHRoaXMuY3VycmVudFBpY2tlci5jbGFzc0xpc3QuYWRkKCdfX3BpY2tlci10eXBlLWhpZGUnKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc2hvdygpe1xyXG5cclxuICAgICAgICB0aGlzLnNldENzcyh0aGlzLm1hc2sse1xyXG4gICAgICAgICAgICAnb3BhY2l0eSc6ICcxJyxcclxuICAgICAgICAgICAgJ2Rpc3BsYXknOiAnYmxvY2snXHJcbiAgICAgICAgfSlcclxuXHJcbiAgICAgICAgbGV0ICRwaWNrZXIgPSB0aGlzLmN1cnJlbnRQaWNrZXI7XHJcbiAgICAgICAgXHJcbiAgICAgICAgaWYoISRwaWNrZXIpe1xyXG4gICAgICAgICAgICBsZXQgdGlwID0gYFxyXG4gICAgICAgICAgICDmsqHmnInor6VrZXkoJHt0aGlzLnBhcmFtcy5rZXl9KeWAvOeahOmAieaLqeWZqFxyXG4gICAgICAgICAgICDor7fmo4Dmn6XmmK/lkKblhpnplJkhXHJcbiAgICAgICAgICAgIGA7XHJcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IodGlwKTtcclxuICAgICAgICAgICAgdGhpcy5lcnJvclRpcCh0aXApO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGxldCAkcGlja2VyV3JhcHBlciA9IHRoaXMuc2VsZWN0KGAucGlja2VyLXdyYXBwZXJgLCRwaWNrZXIpO1xyXG4gICAgICAgIHRoaXMuc2V0Q3NzKCRwaWNrZXJXcmFwcGVyLHtcclxuICAgICAgICAgICAgJ3RyYW5zZm9ybSc6J3RyYW5zbGF0ZVkoMHB4KSdcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgJHBpY2tlci5jbGFzc0xpc3QucmVtb3ZlKCdfX3BpY2tlci10eXBlLWhpZGUnKTtcclxuICAgICAgICAkcGlja2VyLmNsYXNzTGlzdC5yZW1vdmUoJ19fcGlja2VyLXR5cGUtc2hvdycpO1xyXG5cclxuICAgIH1cclxuXHJcbiAgICBhYnN0cmFjdCByZVZpZXcoZGF0YTogYW55KSA6dm9pZDtcclxuXHJcbiAgICBhYnN0cmFjdCBwaWNrZXJPcGVyYXRpb24oKTogdm9pZDtcclxuXHJcbn0iLCIvLyBpbXBvcnQgXCJiYWJlbC1wb2x5ZmlsbFwiO1xyXG5pbXBvcnQgcG9seWZpbGwgZnJvbSAgJy4vcG9seWZpbGwnOyBcclxucG9seWZpbGwoKTsgIFxyXG5pbXBvcnQgVXRpbHMgZnJvbSAnLi91dGlscyc7XHJcbi8vIGltcG9ydCBCYXNlUGlja2VyIGZyb20gJy4vYmFzZVBpY2tlcic7XHJcbmltcG9ydCBSYW5nZVBpY2tlciBmcm9tICcuL3JhbmdlUGlja2VyJztcclxuaW1wb3J0IFNpbmdsZVBpY2tlciBmcm9tICcuL3NpbmdsZVBpY2tlcic7XHJcbmltcG9ydCBNaW51dGVQaWNrZXIgZnJvbSAnLi9taW51dGVQaWNrZXInO1xyXG5cclxuXHJcbmludGVyZmFjZSBnbG9iYWxPcHQge1xyXG4gICAgbWF4S2V5Q291bnQ/OiBudW1iZXIsXHJcbiAgICBvbmNoYW5nZT86IEZ1bmN0aW9uLFxyXG4gICAgc3VjY2Vzcz86IEZ1bmN0aW9uXHJcbn1cclxuIFxyXG4vLyBwaWNrZXLlj4LmlbDmjqXlj6NcclxuaW50ZXJmYWNlIHBpY2tlcnMgeyBcclxuICAgIHN0YXJ0WWVhcj86IHN0cmluZztcclxuICAgIGVuZFllYXI/OiBzdHJpbmc7XHJcbiAgICBkZWZhdWx0RGF0ZT86IHN0cmluZztcclxuICAgIGtleT86IG51bWJlcjtcclxuICAgIG91dEZvcm1hdCA/OiBzdHJpbmc7XHJcbiAgICBvbmNoYW5nZT86IEZ1bmN0aW9uO1xyXG4gICAgc3VjY2Vzcz86IEZ1bmN0aW9uO1xyXG4gICAgdHlwZT86IHN0cmluZzsgLy/pgInmi6nlmajnsbvlnovvvJpzaW5nbGUsIHJhbmdlLCBcclxuXHJcbn1cclxuXHJcbmNsYXNzIERhdGVQaWNrZXIgZXh0ZW5kcyBVdGlsc3tcclxuICAgIGNvbnN0cnVjdG9yKCl7c3VwZXIoKX1cclxuICAgIHByaXZhdGUgX29wdDogZ2xvYmFsT3B0ID0ge307XHJcbiAgICBwcml2YXRlIF9wYXJhbXM6IG9iamVjdCA9IHt9OyAvL+WIneWni+WMlumFjee9rlxyXG4gICAgcHJpdmF0ZSBfa2V5OiBudW1iZXIgPSAxOyAvL+WUr+S4gGtleVxyXG4gICAgcHJpdmF0ZSBfa2V5TGlzdDogQXJyYXk8bnVtYmVyPiA9IFtdOyAvL2tleeWIl+ihqFxyXG4gICAgcHJpdmF0ZSBfcGlja2VyTGlzdDogQXJyYXk8YW55PiA9IFtdOyAvL+S/neWtmOWIm+W7uueahHBpY2tlcuWvueixoVxyXG5cclxuICAgIGdldCBvcHQoKTogZ2xvYmFsT3B0IHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fb3B0O1xyXG4gICAgfVxyXG5cclxuICAgIHNldCBvcHQodmFsOiBnbG9iYWxPcHQpIHtcclxuICAgICAgICB0aGlzLl9vcHQgPSB2YWw7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0IHBhcmFtcygpOiBwaWNrZXJze1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9wYXJhbXM7XHJcbiAgICB9XHJcblxyXG4gICAgc2V0IHBhcmFtcyh2YWw6IHBpY2tlcnMpe1xyXG4gICAgICAgIHRoaXMuX3BhcmFtcyA9IHZhbDtcclxuICAgIH1cclxuXHJcbiAgICBnZXQga2V5KCk6IG51bWJlcntcclxuICAgICAgICByZXR1cm4gdGhpcy5fa2V5O1xyXG4gICAgfVxyXG5cclxuICAgIHNldCBrZXkodmFsOiBudW1iZXIpe1xyXG4gICAgICAgIHRoaXMuX2tleSA9IHZhbDtcclxuICAgIH1cclxuXHJcbiAgICBnZXQga2V5TGlzdCgpOiBhbnl7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2tleUxpc3Q7XHJcbiAgICB9XHJcblxyXG4gICAgc2V0IGtleUxpc3QodmFsOiBhbnkpe1xyXG4gICAgICAgIHRoaXMuX2tleUxpc3QgPSB2YWw7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0IHBpY2tlckxpc3QoKTogYW55e1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9waWNrZXJMaXN0O1xyXG4gICAgfVxyXG5cclxuICAgIHNldCBwaWNrZXJMaXN0KHZhbDogYW55KXtcclxuICAgICAgICB0aGlzLl9waWNrZXJMaXN0ID0gdmFsO1xyXG4gICAgfSBcclxuXHJcblxyXG4gICAgLy8g6L6F5Yqp5Y+Y6YePXHJcbiAgICBwcml2YXRlIF9tYXhLZXlDb3VudCA6bnVtYmVyID0gMTA7IC8v5Y+v5Yib5bu66YCJ5oup5Zmo55qE5pyA5aSn5pWw6YePXHJcblxyXG4gICAgcHVibGljIGdsb2JhbE9wdGlvbnMob3B0PzogZ2xvYmFsT3B0KXtcclxuICAgICAgICB0aGlzLm9wdCA9IHRoaXMuYXNzaWduKHtcclxuICAgICAgICAgICAgbWF4S2V5Q291bnQ6IHRoaXMuX21heEtleUNvdW50LFxyXG4gICAgICAgICAgICBvbmNoYW5nZTogKCk9Pnt9LFxyXG4gICAgICAgICAgICBzdWNjZXNzOiAoKT0+e31cclxuICAgICAgICB9LG9wdCk7XHJcblxyXG4gICAgICAgIHRoaXMub3B0Lm1heEtleUNvdW50ID0gdGhpcy5vcHQubWF4S2V5Q291bnQgPiAwICYmIHRoaXMub3B0Lm1heEtleUNvdW50PD0yMFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgID8gdGhpcy5vcHQubWF4S2V5Q291bnRcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6IHRoaXMuX21heEtleUNvdW50O1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBwaWNrZXIocGFyYW1zPzogcGlja2Vycyl7XHJcblxyXG4gICAgICAgIGxldCBkZWZhdWx0RGF0ZSA9IHBhcmFtcy50eXBlID09ICdtaW51dGUnPyB0aGlzLmdldFRvZGF5KCctJykrJyAwMDowMCc6IHRoaXMuZ2V0VG9kYXkoJy0nKTtcclxuXHJcbiAgICAgICAgdGhpcy5wYXJhbXMgPSB0aGlzLmFzc2lnbih7IFxyXG4gICAgICAgICAgICBzdGFydFllYXI6ICcxOTkwJyxcclxuICAgICAgICAgICAgZW5kWWVhcjogJzIwMzAnLFxyXG4gICAgICAgICAgICBkZWZhdWx0RGF0ZTogZGVmYXVsdERhdGUsXHJcbiAgICAgICAgICAgIGtleTogdGhpcy5rZXksXHJcbiAgICAgICAgICAgIG91dEZvcm1hdDogJy0nLFxyXG4gICAgICAgICAgICBvbmNoYW5nZTogKCk9Pnt9LFxyXG4gICAgICAgICAgICBzdWNjZXNzOiAoKT0+e30sXHJcbiAgICAgICAgICAgIHR5cGU6ICdyYW5nZSdcclxuICAgICAgICB9LHBhcmFtcyk7XHJcblxyXG4gICAgICAgIC8vIOS/neWtmGtleeWAvO+8jOWmguaenOWIl+ihqOeahGtleeWAvOi/h+Wkmu+8jOemgeatouWIm+W7ulxyXG4gICAgICAgIGlmKCF0aGlzLmtleUxpc3QuaW5jbHVkZXModGhpcy5wYXJhbXMua2V5KSl7XHJcblxyXG4gICAgICAgICAgICB0aGlzLmtleUxpc3QucHVzaCh0aGlzLnBhcmFtcy5rZXkpO1xyXG4gICAgICAgICAgICB0aGlzLmtleSs9MTtcclxuICAgICAgICAgICBcclxuICAgICAgICAgICAgbGV0IHBpY2tlciA9IHRoaXMucmVuZGVyKCk7IFxyXG4gICAgICAgICAgICBwaWNrZXIucGlja2VyKHRoaXMucGFyYW1zKTsvL+WIneWni+WMllxyXG4gICAgICAgICAgICB0aGlzLnBpY2tlckxpc3QucHVzaCh7XHJcbiAgICAgICAgICAgICAgICBrZXk6IHRoaXMucGFyYW1zLmtleSxcclxuICAgICAgICAgICAgICAgIHBpY2tlcjogcGlja2VyXHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICB9XHJcbiAgICAgICAgaWYodGhpcy5rZXlMaXN0Lmxlbmd0aD50aGlzLm9wdC5tYXhLZXlDb3VudCl7XHJcbiAgICAgICAgICAgIGxldCB0aXAgPSBgXHJcbiAgICAgICAgICAgIEVycm9yOuajgOa1i+WIsOmhtemdouS4iuWIm+W7uueahOmAieaLqeWZqOi/h+WkmiFcclxuICAgICAgICAgICAg6K+35qOA5p+l5Luj56CB5piv5ZCm5pyJ6Zeu6aKYXHJcbiAgICAgICAgICAgIOivt+S4jeimgeWcqOW+queOr+aIluiAheS6i+S7tuS4remHjeWkjeiwg+eUqC5waWNrZXIoKeaWueazlVxyXG4gICAgICAgICAgICDoi6XpnZ7opoHlpoLmraTosIPnlKjvvIzkuIDlrpropoHliqDkuIprZXnlsZ7mgKdcclxuICAgICAgICAgICAg5bu66K6u5Zyo5aSW6Z2i6LCD55SoLnBpY2tlcigp5pa55rOV77yM5Zyo6YeM6Z2i6LCD55SoLnNob3coKeaWueazleaYvuekulxyXG4gICAgICAgICAgICBgO1xyXG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKHRpcCk7XHJcbiAgICAgICAgICAgIHRoaXMuZXJyb3JUaXAodGlwKTsgXHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGxldCBwaWNrZXIgPSB0aGlzLnBpY2tlckxpc3QuZmluZChpdGVtPT5pdGVtLmtleT09dGhpcy5wYXJhbXMua2V5KTtcclxuICAgICAgICBcclxuICAgICAgICBpZighcGlja2VyKXtcclxuICAgICAgICAgICAgbGV0IHRpcCA9IGBcclxuICAgICAgICAgICAgRXJyb3I65om+5LiN5Yiw6K+la2V5KCR7dGhpcy5wYXJhbXMua2V5fSnnmoTpgInmi6nlmagsXHJcbiAgICAgICAgICAgIOivt+ajgOafpeS7o+eggeaYr+WQpuaciemXrumimFxyXG4gICAgICAgICAgICBgO1xyXG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKHRpcCk7XHJcbiAgICAgICAgICAgIHRoaXMuZXJyb3JUaXAodGlwKTtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIHBpY2tlci5waWNrZXI7IFxyXG5cclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHJlbmRlcigpe1xyXG4gICAgICAgIGxldCBwaWNrZXIgPSBudWxsO1xyXG4gICAgICAgIHN3aXRjaCAodGhpcy5wYXJhbXMudHlwZSkge1xyXG4gICAgICAgICAgICBjYXNlICdyYW5nZSc6XHJcbiAgICAgICAgICAgICAgICBwaWNrZXIgPSBuZXcgUmFuZ2VQaWNrZXIodGhpcy5vcHQpO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICBjYXNlICdzaW5nbGUnOlxyXG4gICAgICAgICAgICAgICAgcGlja2VyID0gbmV3IFNpbmdsZVBpY2tlcih0aGlzLm9wdCk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSAnbWludXRlJzpcclxuICAgICAgICAgICAgICAgIHBpY2tlciA9IG5ldyBNaW51dGVQaWNrZXIodGhpcy5vcHQpO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgXHJcbiAgICAgICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHBpY2tlcjtcclxuICAgIH1cclxuXHJcbn1cclxuXHJcbmNvbnN0IGRhdGVQaWNrZXIgPSBuZXcgRGF0ZVBpY2tlcigpOyBcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGRhdGVQaWNrZXI7ICIsImltcG9ydCBkYXRlUGlja2VyIGZyb20gJy4vZGF0ZVBpY2tlcic7IFxyXG4vLyBpbXBvcnQgeyBtb2R1bGUgfSBmcm9tICdicm93c2VyaWZ5L2xpYi9idWlsdGlucyc7XHJcbih3aW5kb3cgYXMgYW55KS5kYXRlUGlja2VyID0gZGF0ZVBpY2tlcjtcclxuLy8gY29uc29sZS5sb2coZGF0ZVBpY2tlcik7XHJcbi8vIG1vZHVsZS5leHBvcnRzID0gZGF0ZVBpY2tlcjsgXHJcbiIsIi8vIOaXtuWIhumAieaLqeWZqOaguOW/g+S7o+eggVxyXG5pbXBvcnQgKiBhcyB0ZW1wIGZyb20gJy4vdGVtcGxhdGUnO1xyXG5pbXBvcnQgQmFzZVBpY2tlciBmcm9tICcuL2Jhc2VQaWNrZXInO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgU2luZ2xlUGlja2VyIGV4dGVuZHMgQmFzZVBpY2tlciB7XHJcbiAgICBwcml2YXRlIGN1cnJlbnRJbmRleCA6bnVtYmVyID0gMDtcclxuICAgIGNvbnN0cnVjdG9yKG9wdGlvbnM/OiBvYmplY3QpeyAgXHJcbiAgICAgICAgc3VwZXIoKTsgIFxyXG4gICAgICAgIHRoaXMub3B0ID0gdGhpcy5hc3NpZ24oe1xyXG4gICAgICAgICAgICBvbmNoYW5nZTogKCk9Pnt9LFxyXG4gICAgICAgICAgICBzdWNjZXNzOiAoKT0+e31cclxuICAgICAgICB9LG9wdGlvbnMpO1xyXG4gICAgICAgIFxyXG4gICAgfVxyXG5cclxuXHJcbiAgICBwdWJsaWMgcmVuZGVySHRtbCgpOiBzdHJpbmd7XHJcbiAgICAgICAgLy8g6I635Y+WaHRtbOagt+W8j+eahOWHveaVsO+8jOazqOaEj++8jOivpeWHveaVsOS4gOiIrOimgeWcqOWtkOexu+mHjeWGmVxyXG4gICAgICAgIGxldCB5ZWFyU3RyID0gdGhpcy5jcmVhdGVZZWFyU3RyKCk7XHJcbiAgICAgICAgbGV0IGhvdXJTdHIgPSB0aGlzLmNyZWF0ZUhvdXJTdHIoKTtcclxuICAgICAgICBsZXQgbWludXRlU3RyID0gdGhpcy5jcmVhdGVNaW51dGVTdHIoKTtcclxuICAgICAgICByZXR1cm4gdGVtcC5taW51dGVQaWNrZXIucmVwbGFjZSgnJDEnLHllYXJTdHIpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLnJlcGxhY2UoJyQyJyx0aGlzLm1vbnRoU3RyKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5yZXBsYWNlKCckMycsdGhpcy5kYXlTdHIpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLnJlcGxhY2UoJyQ0Jyxob3VyU3RyKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5yZXBsYWNlKCckNScsbWludXRlU3RyKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgY3JlYXRlSG91clN0cigpOiBzdHJpbmcge1xyXG4gICAgICAgIC8vIOWIm+W7uuWwj+aXtlxyXG4gICAgICAgIGxldCBob3VycyA9IFtdO1xyXG4gICAgICAgIGZvcihsZXQgaT0wO2k8PTIzO2krKyl7XHJcbiAgICAgICAgICAgIGhvdXJzLnB1c2goaSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGxldCBodG1sID0gJyc7XHJcbiAgICAgICAgaG91cnMuZm9yRWFjaCgoaXRlbSxpKT0+e1xyXG4gICAgICAgICAgICBsZXQgaG91ciA9IGl0ZW0+PTEwPyBpdGVtOiAnMCcraXRlbTtcclxuICAgICAgICAgICAgaHRtbCs9IGA8cCBjbGFzcz1cImRhdGUtdW5pdFwiIGRhdGEtaG91cj1cIiR7aXRlbX1cIj4ke2hvdXJ9PC9wPmA7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgcmV0dXJuIGh0bWw7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGNyZWF0ZU1pbnV0ZVN0cigpOiBzdHJpbmcge1xyXG4gICAgICAgIC8vIOWIm+W7uuWIhumSn1xyXG4gICAgICAgIGxldCBtaW51dGVzID0gW107XHJcbiAgICAgICAgZm9yKGxldCBpPTA7aTw9NTk7aSsrKXtcclxuICAgICAgICAgICAgbWludXRlcy5wdXNoKGkpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBsZXQgaHRtbCA9ICcnO1xyXG4gICAgICAgIG1pbnV0ZXMuZm9yRWFjaCgoaXRlbSxpKT0+e1xyXG4gICAgICAgICAgICBsZXQgbWludXRlID0gaXRlbT49MTA/IGl0ZW06ICcwJytpdGVtO1xyXG4gICAgICAgICAgICBodG1sKz0gYDxwIGNsYXNzPVwiZGF0ZS11bml0XCIgZGF0YS1taW51dGU9XCIke2l0ZW19XCI+JHttaW51dGV9PC9wPmA7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgcmV0dXJuIGh0bWw7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSByZXNvbHZpbmdTdHJpbmcoc3RyOiBzdHJpbmcpOiBBcnJheTxhbnk+e1xyXG4gICAgICAgIC8vIOino+aekOaXpeacn+Wtl+espuS4slxyXG4gICAgICAgIGxldCBhcnJheSA9IHN0ci5zcGxpdCgnICcpO1xyXG4gICAgICAgIHJldHVybiBbXS5jb25jYXQoYXJyYXlbMF0uc3BsaXQodGhpcy5wYXJhbXMub3V0Rm9ybWF0KSxhcnJheVsxXS5zcGxpdCgnOicpKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc2V0RGVmYXVsdFZpZXcoZGVmYXVsdERhdGU6IHN0cmluZyl7XHJcbiAgICAgICAgaWYoIWRlZmF1bHREYXRlKXtcclxuICAgICAgICAgICAgY29uc29sZS5lcnJvcignRXJyb3I6IOm7mOiupOaXpeacnyhkZWZhdWx0RGF0ZSnkuI3og73kuLrnqbonKTtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICBsZXQgZGF0ZUFycmF5ID0gdGhpcy5yZXNvbHZpbmdTdHJpbmcoZGVmYXVsdERhdGUpXHJcbiAgICAgICAgaWYoIWRhdGVBcnJheSB8fCBkYXRlQXJyYXkubGVuZ3RoPDUpe1xyXG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKCdFcnJvcjrpu5jorqTml6XmnJ8oZGVmYXVsdERhdGUp55qE5qC85byP5pyJ6K+vLOm7mOiupOagvOW8jzoyMDE5LTAxLTAxIDAwOjAwJyk7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgXHJcbiAgICAgICAgbGV0ICRwaWNrZXIgPSB0aGlzLmN1cnJlbnRQaWNrZXI7XHJcbiAgICAgICAgbGV0ICRkYXRlVXRpbHMgPSB0aGlzLnNlbGVjdEFsbCgnLmRhdGUtaXRlbScsJHBpY2tlcik7XHJcbiAgICAgICAgLy8geWVhclxyXG4gICAgICAgIGxldCB5ZWFySW5kZXggPSB0aGlzLmN1cnJlbnRUb0luZGV4KHBhcnNlSW50KGRhdGVBcnJheVswXSktcGFyc2VJbnQodGhpcy5wYXJhbXMuc3RhcnRZZWFyKSk7XHJcbiAgICAgICAgdGhpcy5zZXRDc3MoJGRhdGVVdGlsc1swXSx7XHJcbiAgICAgICAgICAgICd0cmFuc2Zvcm0nOmB0cmFuc2xhdGVZKCR7eWVhckluZGV4KnRoaXMuX2hlaWdodH1weClgXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgLy8gbW9udGhcclxuICAgICAgICBsZXQgbW9udGhJbmRleCA9IHRoaXMuY3VycmVudFRvSW5kZXgocGFyc2VJbnQoZGF0ZUFycmF5WzFdKS0xKTtcclxuXHJcbiAgICAgICAgdGhpcy5zZXRDc3MoJGRhdGVVdGlsc1sxXSx7XHJcbiAgICAgICAgICAgICd0cmFuc2Zvcm0nOmB0cmFuc2xhdGVZKCR7bW9udGhJbmRleCp0aGlzLl9oZWlnaHR9cHgpYFxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICAvLyBkYXlcclxuICAgICAgICBsZXQgZGF5SW5kZXggPSB0aGlzLmN1cnJlbnRUb0luZGV4KHBhcnNlSW50KGRhdGVBcnJheVsyXSktMSk7XHJcbiAgICAgICAgdGhpcy5zZXRDc3MoJGRhdGVVdGlsc1syXSx7XHJcbiAgICAgICAgICAgICd0cmFuc2Zvcm0nOmB0cmFuc2xhdGVZKCR7ZGF5SW5kZXgqdGhpcy5faGVpZ2h0fXB4KWBcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgLy8g5bCP5pe2XHJcbiAgICAgICAgbGV0IGhvdXJJbmRleCA9IHRoaXMuY3VycmVudFRvSW5kZXgocGFyc2VJbnQoZGF0ZUFycmF5WzNdKSk7XHJcbiAgICAgICAgdGhpcy5zZXRDc3MoJGRhdGVVdGlsc1szXSx7XHJcbiAgICAgICAgICAgICd0cmFuc2Zvcm0nOmB0cmFuc2xhdGVZKCR7aG91ckluZGV4KnRoaXMuX2hlaWdodH1weClgXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIC8vIOWIhumSn1xyXG4gICAgICAgIGxldCBtaW51dGVJbmRleCA9IHRoaXMuY3VycmVudFRvSW5kZXgocGFyc2VJbnQoZGF0ZUFycmF5WzRdKSk7XHJcbiAgICAgICAgdGhpcy5zZXRDc3MoJGRhdGVVdGlsc1s0XSx7XHJcbiAgICAgICAgICAgICd0cmFuc2Zvcm0nOmB0cmFuc2xhdGVZKCR7aG91ckluZGV4KnRoaXMuX2hlaWdodH1weClgXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgdGhpcy5kZWZhdWx0SW5mbyA9IHtcclxuICAgICAgICAgICAgZGF0ZUFycmF5OiBkYXRlQXJyYXksXHJcbiAgICAgICAgICAgIGhlaWdodEFycmF5OiBbXHJcbiAgICAgICAgICAgICAgICB5ZWFySW5kZXgqdGhpcy5faGVpZ2h0LFxyXG4gICAgICAgICAgICAgICAgbW9udGhJbmRleCp0aGlzLl9oZWlnaHQsXHJcbiAgICAgICAgICAgICAgICBkYXlJbmRleCp0aGlzLl9oZWlnaHQsXHJcbiAgICAgICAgICAgICAgICBob3VySW5kZXgqdGhpcy5faGVpZ2h0LFxyXG4gICAgICAgICAgICAgICAgbWludXRlSW5kZXgqdGhpcy5faGVpZ2h0LFxyXG4gICAgICAgICAgICBdXHJcbiAgICAgICAgfSA7XHJcblxyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBwaWNrZXJPcGVyYXRpb24oKXtcclxuICAgICAgICAvLyDml7bpl7TljLrpl7TpgInmi6nlmajnmoTpgLvovpHkuovku7ZcclxuICAgICAgICBsZXQgJHBpY2tlciA9IHRoaXMuY3VycmVudFBpY2tlcjtcclxuICAgICAgICBsZXQgX3RoaXMgPSB0aGlzO1xyXG4gICAgICAgIC8vIOiuoumYheS6i+S7tu+8jOebkeWQrOmAieaLqeWZqOeahOWPmOWMllxyXG4gICAgICAgIGxldCBzZWxlY3RUaW1lID0nJztcclxuICAgICAgICB0aGlzLiRvbihgb25jaGFuZ2VfJHt0aGlzLnBhcmFtcy5rZXl9YCwoZGF0YSk9PntcclxuICAgICAgICAgICAgLy8g5qC85byP5LiN5a+577yM5omL5Yqo6L2s5o2i5LiA5LiLXHJcbiAgICAgICAgICAgIGxldCBzdHJBcnJheSA9IGRhdGEuc3BsaXQodGhpcy5wYXJhbXMub3V0Rm9ybWF0KTtcclxuICAgICAgICAgICAgbGV0IHN0cjEgPSBzdHJBcnJheS5zbGljZSgwLDMpLmpvaW4odGhpcy5wYXJhbXMub3V0Rm9ybWF0KTtcclxuICAgICAgICAgICAgbGV0IHN0cjIgPSBzdHJBcnJheS5zbGljZSgzKS5qb2luKCc6Jyk7XHJcbiAgICAgICAgICAgIHNlbGVjdFRpbWUgPSBzdHIxKycgJytzdHIyO1xyXG5cclxuICAgICAgICB9KTtcclxuICAgICAgICAvLyDnoa7lrprmjInpkq5cclxuICAgICAgICBsZXQgJHN1cmUgPSB0aGlzLnNlbGVjdCgnLnBpY2tlci1idG5fX3N1cmUnLHRoaXMuY3VycmVudFBpY2tlcik7XHJcbiAgICAgICAgaWYoISRzdXJlKXtcclxuICAgICAgICAgICAgbGV0IHRpcCA9IGBcclxuICAgICAgICAgICAg5rKh5om+5Yiw56Gu5a6a5oyJ6ZKuLFxyXG4gICAgICAgICAgICDor7fnoa7kv51jbGFzcz0nLnBpY2tlci1idG5fX3N1cmUn55qE5oyJ6ZKu5rKh5pyJ6KKr5Y675o6JXHJcbiAgICAgICAgICAgIGA7XHJcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IodGlwKTtcclxuICAgICAgICAgICAgdGhpcy5lcnJvclRpcCh0aXApO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgICRzdXJlLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywoZSk9PntcclxuICAgICAgICAgICAgbGV0IHJlc3VsdCA9IHNlbGVjdFRpbWU7XHJcbiAgICAgICAgICAgIF90aGlzLm9wdC5zdWNjZXNzKHJlc3VsdCk7XHJcbiAgICAgICAgICAgIF90aGlzLnBhcmFtcy5zdWNjZXNzKHJlc3VsdCk7XHJcblxyXG4gICAgICAgICAgICBfdGhpcy5oaWRlKCk7XHJcblxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICAvLyDlj5bmtojmjInpkq5cclxuICAgICAgICBsZXQgJGNhbmNlbCA9IHRoaXMuc2VsZWN0KCcucGlja2VyLWJ0bl9fY2FuY2VsJyx0aGlzLmN1cnJlbnRQaWNrZXIpO1xyXG4gICAgICAgIGlmKCEkY2FuY2VsKXtcclxuICAgICAgICAgICAgbGV0IHRpcCA9IGBcclxuICAgICAgICAgICAg5rKh5om+5Yiw5Y+W5raI5oyJ6ZKuLFxyXG4gICAgICAgICAgICDor7fnoa7kv51jbGFzcz0nLnBpY2tlci1idG5fX2NhbmNlbCfnmoTmjInpkq7msqHmnInooqvljrvmjolcclxuICAgICAgICAgICAgYDtcclxuICAgICAgICAgICAgY29uc29sZS5lcnJvcih0aXApO1xyXG4gICAgICAgICAgICB0aGlzLmVycm9yVGlwKHRpcCk7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgICRjYW5jZWwuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLChlKT0+e1xyXG4gICAgICAgICAgICBfdGhpcy5oaWRlKCk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIC8vIOeCueWHu+aYvuekuuaXtuWIhumAieaLqeWZqFxyXG4gICAgICAgIGxldCAkbWludXRlQnRuID0gdGhpcy5zZWxlY3QoJy5waWNrZXItbWludXRlLWJ0bicsdGhpcy5jdXJyZW50UGlja2VyKTtcclxuICAgICAgICBsZXQgJG1pbnV0ZSA9IHRoaXMuc2VsZWN0KCcuZGF0ZS1jb250ZW50LW1pbnV0ZScpO1xyXG5cclxuICAgICAgICBpZighJG1pbnV0ZUJ0bil7XHJcbiAgICAgICAgICAgIGxldCB0aXAgPSBgXHJcbiAgICAgICAgICAgIOayoeaJvuWIsOWIh+aNouaXtuWIhumAieaLqeWZqOaMiemSrixcclxuICAgICAgICAgICAg6K+356Gu5L+dY2xhc3M9Jy5waWNrZXItbWludXRlLWJ0bifnmoTmjInpkq7msqHmnInooqvljrvmjolcclxuICAgICAgICAgICAgYDtcclxuICAgICAgICAgICAgY29uc29sZS5lcnJvcih0aXApO1xyXG4gICAgICAgICAgICB0aGlzLmVycm9yVGlwKHRpcCk7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgICRtaW51dGVCdG4uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLChlKT0+e1xyXG4gICAgICAgICAgICBpZihlLnRhcmdldC5jbGFzc0xpc3QuY29udGFpbnMoJ3BpY2tlci1taW51dGUtYnRuLWFjdCcpKXtcclxuICAgICAgICAgICAgICAgIC8vIOWFs+mXrVxyXG4gICAgICAgICAgICAgICAgZS50YXJnZXQuY2xhc3NMaXN0LnJlbW92ZSgncGlja2VyLW1pbnV0ZS1idG4tYWN0Jyk7XHJcbiAgICAgICAgICAgICAgICBfdGhpcy5zZXRDc3MoJG1pbnV0ZSx7XHJcbiAgICAgICAgICAgICAgICAgICAgJ3RyYW5zZm9ybSc6J3RyYW5zbGF0ZVgoMTAwJSknXHJcbiAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICB9ZWxzZXtcclxuICAgICAgICAgICAgICAgIC8vIOaJk+W8gFxyXG4gICAgICAgICAgICAgICAgZS50YXJnZXQuY2xhc3NMaXN0LmFkZCgncGlja2VyLW1pbnV0ZS1idG4tYWN0Jyk7XHJcbiAgICAgICAgICAgICAgICBfdGhpcy5zZXRDc3MoJG1pbnV0ZSx7XHJcbiAgICAgICAgICAgICAgICAgICAgJ3RyYW5zZm9ybSc6J3RyYW5zbGF0ZVgoMCknXHJcbiAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSlcclxuXHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHJlVmlldyhkYXRlOiBzdHJpbmcpe1xyXG4gICAgICAgIC8vIOmHjee9rumAieaLqeWZqOi3neemu++8jGRhdGU9W+W8gOWni+aXtumXtO+8jOe7k+adn+aXtumXtF1cclxuICAgICAgICBsZXQgYm9vbCA9IHRydWU7XHJcbiAgICAgICAgbGV0IF90aGlzID0gdGhpcztcclxuICAgICAgICBsZXQgc3RyQXJyYXkgPSB0aGlzLnJlc29sdmluZ1N0cmluZyhkYXRlKTtcclxuICAgICAgICBib29sID0gc3RyQXJyYXkubGVuZ3RoPDU/IGZhbHNlOiB0cnVlO1xyXG4gICAgICAgIGlmKCFib29sKXtcclxuICAgICAgICAgICAgY29uc29sZS5lcnJvcignRXJyb3I6IHJlVmlld+aWueazleS8oOWFpeeahOWPguaVsOaVsOe7hOagvOW8j+S4jeWvuSjmoLzlvI86MjAxOS0wMS0wMSAwMDowMCknKTtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLnNldERlZmF1bHRWaWV3KGRhdGUpO1xyXG4gICAgICAgIHRoaXMuJGVtaXQoYG9uY2hhbmdlXyR7dGhpcy5wYXJhbXMua2V5fWAsZGF0ZSk7XHJcbiAgICB9IFxyXG59ICIsIi8vIGVzNuihpeS4gVxyXG5jb25zdCBwb2x5ZmlsbCA9ICgpID0+e1xyXG4gICAgLy8gaW5jbHVkZXNcclxuICAgIGlmICghQXJyYXkucHJvdG90eXBlLmluY2x1ZGVzKSB7XHJcbiAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KEFycmF5LnByb3RvdHlwZSwgJ2luY2x1ZGVzJywge1xyXG4gICAgICAgICAgdmFsdWU6IGZ1bmN0aW9uKHNlYXJjaEVsZW1lbnQsIGZyb21JbmRleCkge1xyXG4gICAgICAgICAgICBpZiAodGhpcyA9PSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignXCJ0aGlzXCIgaXMgbnVsbCBvciBub3QgZGVmaW5lZCcpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHZhciBvID0gT2JqZWN0KHRoaXMpO1xyXG4gICAgICAgICAgICB2YXIgbGVuID0gby5sZW5ndGggPj4+IDA7XHJcbiAgICAgICAgICAgIGlmIChsZW4gPT09IDApIHtcclxuICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdmFyIG4gPSBmcm9tSW5kZXggfCAwO1xyXG4gICAgICAgICAgICB2YXIgayA9IE1hdGgubWF4KG4gPj0gMCA/IG4gOiBsZW4gLSBNYXRoLmFicyhuKSwgMCk7XHJcbiAgICAgICAgICAgIHdoaWxlIChrIDwgbGVuKSB7XHJcbiAgICAgICAgICAgICAgaWYgKG9ba10gPT09IHNlYXJjaEVsZW1lbnQpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICBrKys7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiAoIUFycmF5LnByb3RvdHlwZS5maW5kKSB7XHJcbiAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KEFycmF5LnByb3RvdHlwZSwgJ2ZpbmQnLCB7XHJcbiAgICAgICAgICB2YWx1ZTogZnVuY3Rpb24ocHJlZGljYXRlKSB7XHJcbiAgICAgICAgICAgLy8gMS4gTGV0IE8gYmUgPyBUb09iamVjdCh0aGlzIHZhbHVlKS5cclxuICAgICAgICAgICAgaWYgKHRoaXMgPT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ1widGhpc1wiIGlzIG51bGwgb3Igbm90IGRlZmluZWQnKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICBcclxuICAgICAgICAgICAgdmFyIG8gPSBPYmplY3QodGhpcyk7XHJcbiAgICAgIFxyXG4gICAgICAgICAgICAvLyAyLiBMZXQgbGVuIGJlID8gVG9MZW5ndGgoPyBHZXQoTywgXCJsZW5ndGhcIikpLlxyXG4gICAgICAgICAgICB2YXIgbGVuID0gby5sZW5ndGggPj4+IDA7XHJcbiAgICAgIFxyXG4gICAgICAgICAgICAvLyAzLiBJZiBJc0NhbGxhYmxlKHByZWRpY2F0ZSkgaXMgZmFsc2UsIHRocm93IGEgVHlwZUVycm9yIGV4Y2VwdGlvbi5cclxuICAgICAgICAgICAgaWYgKHR5cGVvZiBwcmVkaWNhdGUgIT09ICdmdW5jdGlvbicpIHtcclxuICAgICAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdwcmVkaWNhdGUgbXVzdCBiZSBhIGZ1bmN0aW9uJyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgXHJcbiAgICAgICAgICAgIC8vIDQuIElmIHRoaXNBcmcgd2FzIHN1cHBsaWVkLCBsZXQgVCBiZSB0aGlzQXJnOyBlbHNlIGxldCBUIGJlIHVuZGVmaW5lZC5cclxuICAgICAgICAgICAgdmFyIHRoaXNBcmcgPSBhcmd1bWVudHNbMV07XHJcbiAgICAgIFxyXG4gICAgICAgICAgICAvLyA1LiBMZXQgayBiZSAwLlxyXG4gICAgICAgICAgICB2YXIgayA9IDA7XHJcbiAgICAgIFxyXG4gICAgICAgICAgICAvLyA2LiBSZXBlYXQsIHdoaWxlIGsgPCBsZW5cclxuICAgICAgICAgICAgd2hpbGUgKGsgPCBsZW4pIHtcclxuICAgICAgICAgICAgICAvLyBhLiBMZXQgUGsgYmUgISBUb1N0cmluZyhrKS5cclxuICAgICAgICAgICAgICAvLyBiLiBMZXQga1ZhbHVlIGJlID8gR2V0KE8sIFBrKS5cclxuICAgICAgICAgICAgICAvLyBjLiBMZXQgdGVzdFJlc3VsdCBiZSBUb0Jvb2xlYW4oPyBDYWxsKHByZWRpY2F0ZSwgVCwgwqsga1ZhbHVlLCBrLCBPIMK7KSkuXHJcbiAgICAgICAgICAgICAgLy8gZC4gSWYgdGVzdFJlc3VsdCBpcyB0cnVlLCByZXR1cm4ga1ZhbHVlLlxyXG4gICAgICAgICAgICAgIHZhciBrVmFsdWUgPSBvW2tdO1xyXG4gICAgICAgICAgICAgIGlmIChwcmVkaWNhdGUuY2FsbCh0aGlzQXJnLCBrVmFsdWUsIGssIG8pKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4ga1ZhbHVlO1xyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAvLyBlLiBJbmNyZWFzZSBrIGJ5IDEuXHJcbiAgICAgICAgICAgICAgaysrO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgIFxyXG4gICAgICAgICAgICAvLyA3LiBSZXR1cm4gdW5kZWZpbmVkLlxyXG4gICAgICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgICB9XHJcbn1cclxuZXhwb3J0IGRlZmF1bHQgcG9seWZpbGw7IiwiLy8g6IyD5Zu06YCJ5oup5Zmo5qC45b+D5Luj56CBXHJcbmltcG9ydCAqIGFzIHRlbXAgZnJvbSAnLi90ZW1wbGF0ZSc7XHJcbmltcG9ydCBCYXNlUGlja2VyIGZyb20gJy4vYmFzZVBpY2tlcic7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBSYW5nZVBpY2tlciBleHRlbmRzIEJhc2VQaWNrZXIge1xyXG4gICAgcHJpdmF0ZSBjdXJyZW50SW5kZXggOm51bWJlciA9IDA7XHJcbiAgICBjb25zdHJ1Y3RvcihvcHRpb25zPzogb2JqZWN0KXsgIFxyXG4gICAgICAgIHN1cGVyKCk7ICBcclxuICAgICAgICB0aGlzLm9wdCA9IHRoaXMuYXNzaWduKHtcclxuICAgICAgICAgICAgb25jaGFuZ2U6ICgpPT57fSxcclxuICAgICAgICAgICAgc3VjY2VzczogKCk9Pnt9XHJcbiAgICAgICAgfSxvcHRpb25zKTtcclxuICAgICAgICBcclxuICAgIH1cclxuXHJcblxyXG4gICAgcHVibGljIHJlbmRlckh0bWwoKTogc3RyaW5ne1xyXG4gICAgICAgIC8vIOiOt+WPlmh0bWzmoLflvI/nmoTlh73mlbDvvIzms6jmhI/vvIzor6Xlh73mlbDkuIDoiKzopoHlnKjlrZDnsbvph43lhplcclxuICAgICAgICBsZXQgeWVhclN0ciA9IHRoaXMuY3JlYXRlWWVhclN0cigpO1xyXG4gICAgICAgIHJldHVybiB0ZW1wLnJhbmdlUGlja2VyLnJlcGxhY2UoJyQxJyx5ZWFyU3RyKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLnJlcGxhY2UoJyQyJyx0aGlzLm1vbnRoU3RyKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLnJlcGxhY2UoJyQzJyx0aGlzLmRheVN0cik7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHBpY2tlck9wZXJhdGlvbigpe1xyXG4gICAgICAgIC8vIOaXtumXtOWMuumXtOmAieaLqeWZqOeahOmAu+i+keS6i+S7tlxyXG4gICAgICAgIGxldCAkcGlja2VyID0gdGhpcy5jdXJyZW50UGlja2VyO1xyXG4gICAgICAgIGxldCAkcmFuZ2VDaGlsZHMgPSB0aGlzLnNlbGVjdEFsbCgnLnJhbmdlLWNoaWxkJywkcGlja2VyKTtcclxuICAgICAgICBsZXQgX3RoaXMgPSB0aGlzO1xyXG4gICAgICAgIEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKCRyYW5nZUNoaWxkcykuZm9yRWFjaCgocmFuZ2VDaGlsZCxpKT0+e1xyXG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZygncmFuZ2VDaGlsZCcscmFuZ2VDaGlsZCk7XHJcbiAgICAgICAgICAgIHJhbmdlQ2hpbGQuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLChlKT0+e1xyXG4gICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coZSlcclxuICAgICAgICAgICAgICAgIGlmKGUudGFyZ2V0LmNsYXNzTGlzdC5jb250YWlucygncmFuZ2UtYWN0JykpcmV0dXJuO1xyXG4gICAgICAgICAgICAgICAgQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoJHJhbmdlQ2hpbGRzKS5mb3JFYWNoKGl0ZW0gPT4ge1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBpdGVtLmNsYXNzTGlzdC5yZW1vdmUoJ3JhbmdlLWFjdCcpXHJcbiAgICAgICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgICAgICBlLnRhcmdldC5jbGFzc0xpc3QuYWRkKCdyYW5nZS1hY3QnKTtcclxuICAgICAgICAgICAgICAgIF90aGlzLmN1cnJlbnRJbmRleCA9IGk7XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIFxyXG4gICAgICAgIC8vIOiuoumYheS6i+S7tu+8jOebkeWQrOmAieaLqeWZqOeahOWPmOWMlu+8jOS/ruaUueW8gOWni+WSjOe7k+adn+eahOaXtumXtOaYvuekulxyXG4gICAgICAgIGxldCBzdGFydFRpbWUgPScnLCBlbmRUaW1lID0gJyc7XHJcblxyXG4gICAgICAgIC8vIOW9k+iuvue9ruS6hum7mOiupOaXpeacn++8jOS8muaJp+ihjOi/meS4qlxyXG4gICAgICAgIHN0YXJ0VGltZSA9ICRyYW5nZUNoaWxkc1tfdGhpcy5jdXJyZW50SW5kZXhdLmlubmVySFRNTCA9IHRoaXMuZGVmYXVsdEluZm8uZGF0ZUFycmF5LmpvaW4odGhpcy5wYXJhbXMub3V0Rm9ybWF0KTtcclxuIFxyXG5cclxuICAgICAgICB0aGlzLiRvbihgb25jaGFuZ2VfJHt0aGlzLnBhcmFtcy5rZXl9YCwoZGF0YSk9PntcclxuICAgICAgICAgICAgaWYodHlwZW9mIGRhdGEgPT09ICdzdHJpbmcnKXtcclxuXHJcbiAgICAgICAgICAgICAgICAkcmFuZ2VDaGlsZHNbX3RoaXMuY3VycmVudEluZGV4XS5pbm5lckhUTUwgPSBkYXRhO1xyXG4gICAgICAgICAgICAgICAgaWYoX3RoaXMuY3VycmVudEluZGV4PT0wKXtcclxuICAgICAgICAgICAgICAgICAgICAvLyDlvIDlp4vml6XmnJ9cclxuICAgICAgICAgICAgICAgICAgICBzdGFydFRpbWUgPSBkYXRhOyBcclxuICAgICAgICAgICAgICAgIH1lbHNle1xyXG4gICAgICAgICAgICAgICAgICAgIGVuZFRpbWUgPSBkYXRhO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9ZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAkcmFuZ2VDaGlsZHNbMF0uaW5uZXJIVE1MID0gZGF0YVswXTtcclxuICAgICAgICAgICAgICAgICRyYW5nZUNoaWxkc1sxXS5pbm5lckhUTUwgPSBkYXRhWzFdO1xyXG4gICAgICAgICAgICAgICAgc3RhcnRUaW1lID0gZGF0YVswXTtcclxuICAgICAgICAgICAgICAgIGVuZFRpbWUgPSBkYXRhWzFdOyBcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgLy8g56Gu5a6a5oyJ6ZKuXHJcbiAgICAgICAgbGV0ICRzdXJlID0gdGhpcy5zZWxlY3QoJy5waWNrZXItYnRuX19zdXJlJyx0aGlzLmN1cnJlbnRQaWNrZXIpO1xyXG4gICAgICAgIGlmKCEkc3VyZSl7XHJcbiAgICAgICAgICAgIGxldCB0aXAgPSBgXHJcbiAgICAgICAgICAgIOayoeaJvuWIsOehruWumuaMiemSrixcclxuICAgICAgICAgICAg6K+356Gu5L+dY2xhc3M9Jy5waWNrZXItYnRuX19zdXJlJ+eahOaMiemSruayoeacieiiq+WOu+aOiVxyXG4gICAgICAgICAgICBgO1xyXG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKHRpcCk7XHJcbiAgICAgICAgICAgIHRoaXMuZXJyb3JUaXAodGlwKTtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICAkc3VyZS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsKGUpPT57XHJcbiAgICAgICAgICAgIGlmKG5ldyBEYXRlKGVuZFRpbWUpLmdldFRpbWUoKTxuZXcgRGF0ZShzdGFydFRpbWUpLmdldFRpbWUoKSl7XHJcbiAgICAgICAgICAgICAgICBsZXQgdGlwID0gYOW8gOWni+aXpeacn+S4jeiDveWkp+S6jue7k+adn+aXpeacn2A7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmVycm9yVGlwKHRpcCk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgbGV0IHJlc3VsdCA9IHsgXHJcbiAgICAgICAgICAgICAgICBzdGFydFRpbWUsXHJcbiAgICAgICAgICAgICAgICBlbmRUaW1lXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgX3RoaXMub3B0LnN1Y2Nlc3MocmVzdWx0KTtcclxuICAgICAgICAgICAgX3RoaXMucGFyYW1zLnN1Y2Nlc3MocmVzdWx0KTtcclxuXHJcbiAgICAgICAgICAgIF90aGlzLmhpZGUoKTtcclxuXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIC8vIOWPlua2iOaMiemSrlxyXG4gICAgICAgIGxldCAkY2FuY2VsID0gdGhpcy5zZWxlY3QoJy5waWNrZXItYnRuX19jYW5jZWwnLHRoaXMuY3VycmVudFBpY2tlcik7XHJcbiAgICAgICAgaWYoISRjYW5jZWwpe1xyXG4gICAgICAgICAgICBsZXQgdGlwID0gYFxyXG4gICAgICAgICAgICDmsqHmib7liLDlj5bmtojmjInpkq4sXHJcbiAgICAgICAgICAgIOivt+ehruS/nWNsYXNzPScucGlja2VyLWJ0bl9fY2FuY2VsJ+eahOaMiemSruayoeacieiiq+WOu+aOiVxyXG4gICAgICAgICAgICBgO1xyXG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKHRpcCk7XHJcbiAgICAgICAgICAgIHRoaXMuZXJyb3JUaXAodGlwKTtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgJGNhbmNlbC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsKGUpPT57XHJcbiAgICAgICAgICAgIF90aGlzLmhpZGUoKTtcclxuICAgICAgICB9KVxyXG5cclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgcmVWaWV3KGRhdGU6IEFycmF5PHN0cmluZz4pe1xyXG4gICAgICAgIC8vIOmHjee9rumAieaLqeWZqOi3neemu++8jGRhdGU9W+W8gOWni+aXtumXtO+8jOe7k+adn+aXtumXtF1cclxuICAgICAgICBsZXQgYm9vbCA9IHRydWU7XHJcbiAgICAgICAgbGV0IF90aGlzID0gdGhpcztcclxuICAgICAgICBkYXRlLmZvckVhY2goKGl0ZW0saSk9PntcclxuICAgICAgICAgICAgbGV0IHN0ckFycmF5ID0gaXRlbS5zcGxpdChfdGhpcy5wYXJhbXMub3V0Rm9ybWF0KTtcclxuICAgICAgICAgICAgYm9vbCA9IHN0ckFycmF5Lmxlbmd0aDwzPyBmYWxzZTogdHJ1ZTtcclxuICAgICAgICB9KVxyXG4gICAgICAgIGlmKCFib29sKXtcclxuICAgICAgICAgICAgY29uc29sZS5lcnJvcignRXJyb3I6IHJlVmlld+aWueazleS8oOWFpeeahOWPguaVsOaVsOe7hOagvOW8j+S4jeWvuScpO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuc2V0RGVmYXVsdFZpZXcoZGF0ZVt0aGlzLmN1cnJlbnRJbmRleF0pO1xyXG4gICAgICAgIHRoaXMuJGVtaXQoYG9uY2hhbmdlXyR7dGhpcy5wYXJhbXMua2V5fWAsZGF0ZSk7XHJcbiAgICB9IFxyXG59IiwiLy8g5Y2V5Liq6YCJ5oup5Zmo5qC45b+D5Luj56CBXHJcbmltcG9ydCAqIGFzIHRlbXAgZnJvbSAnLi90ZW1wbGF0ZSc7XHJcbmltcG9ydCBCYXNlUGlja2VyIGZyb20gJy4vYmFzZVBpY2tlcic7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBTaW5nbGVQaWNrZXIgZXh0ZW5kcyBCYXNlUGlja2VyIHtcclxuICAgIHByaXZhdGUgY3VycmVudEluZGV4IDpudW1iZXIgPSAwO1xyXG4gICAgY29uc3RydWN0b3Iob3B0aW9ucz86IG9iamVjdCl7ICBcclxuICAgICAgICBzdXBlcigpOyAgXHJcbiAgICAgICAgdGhpcy5vcHQgPSB0aGlzLmFzc2lnbih7XHJcbiAgICAgICAgICAgIG9uY2hhbmdlOiAoKT0+e30sXHJcbiAgICAgICAgICAgIHN1Y2Nlc3M6ICgpPT57fVxyXG4gICAgICAgIH0sb3B0aW9ucyk7XHJcbiAgICAgICAgXHJcbiAgICB9XHJcblxyXG5cclxuICAgIHB1YmxpYyByZW5kZXJIdG1sKCk6IHN0cmluZ3tcclxuICAgICAgICAvLyDojrflj5ZodG1s5qC35byP55qE5Ye95pWw77yM5rOo5oSP77yM6K+l5Ye95pWw5LiA6Iis6KaB5Zyo5a2Q57G76YeN5YaZXHJcbiAgICAgICAgbGV0IHllYXJTdHIgPSB0aGlzLmNyZWF0ZVllYXJTdHIoKTtcclxuICAgICAgICByZXR1cm4gdGVtcC5zaW5nbGVQaWNrZXIucmVwbGFjZSgnJDEnLHllYXJTdHIpIFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLnJlcGxhY2UoJyQyJyx0aGlzLm1vbnRoU3RyKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLnJlcGxhY2UoJyQzJyx0aGlzLmRheVN0cik7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHBpY2tlck9wZXJhdGlvbigpe1xyXG4gICAgICAgIC8vIOaXtumXtOWMuumXtOmAieaLqeWZqOeahOmAu+i+keS6i+S7tlxyXG4gICAgICAgIGxldCAkcGlja2VyID0gdGhpcy5jdXJyZW50UGlja2VyO1xyXG4gICAgICAgIGxldCBfdGhpcyA9IHRoaXM7XHJcbiAgICAgICAgLy8g6K6i6ZiF5LqL5Lu277yM55uR5ZCs6YCJ5oup5Zmo55qE5Y+Y5YyWXHJcbiAgICAgICAgbGV0IHNlbGVjdFRpbWUgPScnO1xyXG4gICAgICAgIHRoaXMuJG9uKGBvbmNoYW5nZV8ke3RoaXMucGFyYW1zLmtleX1gLChkYXRhKT0+e1xyXG4gICAgICAgICAgICBzZWxlY3RUaW1lID0gZGF0YTtcclxuXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIC8vIOehruWumuaMiemSrlxyXG4gICAgICAgIGxldCAkc3VyZSA9IHRoaXMuc2VsZWN0KCcucGlja2VyLWJ0bl9fc3VyZScsdGhpcy5jdXJyZW50UGlja2VyKTtcclxuICAgICAgICBpZighJHN1cmUpe1xyXG4gICAgICAgICAgICBsZXQgdGlwID0gYFxyXG4gICAgICAgICAgICDmsqHmib7liLDnoa7lrprmjInpkq4sXHJcbiAgICAgICAgICAgIOivt+ehruS/nWNsYXNzPScucGlja2VyLWJ0bl9fc3VyZSfnmoTmjInpkq7msqHmnInooqvljrvmjolcclxuICAgICAgICAgICAgYDtcclxuICAgICAgICAgICAgY29uc29sZS5lcnJvcih0aXApO1xyXG4gICAgICAgICAgICB0aGlzLmVycm9yVGlwKHRpcCk7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgJHN1cmUuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLChlKT0+e1xyXG4gICAgICAgICAgICBsZXQgcmVzdWx0ID0gc2VsZWN0VGltZTtcclxuICAgICAgICAgICAgX3RoaXMub3B0LnN1Y2Nlc3MocmVzdWx0KTtcclxuICAgICAgICAgICAgX3RoaXMucGFyYW1zLnN1Y2Nlc3MocmVzdWx0KTtcclxuXHJcbiAgICAgICAgICAgIF90aGlzLmhpZGUoKTtcclxuXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIC8vIOWPlua2iOaMiemSrlxyXG4gICAgICAgIGxldCAkY2FuY2VsID0gdGhpcy5zZWxlY3QoJy5waWNrZXItYnRuX19jYW5jZWwnLHRoaXMuY3VycmVudFBpY2tlcik7XHJcbiAgICAgICAgaWYoISRjYW5jZWwpe1xyXG4gICAgICAgICAgICBsZXQgdGlwID0gYFxyXG4gICAgICAgICAgICDmsqHmib7liLDlj5bmtojmjInpkq4sXHJcbiAgICAgICAgICAgIOivt+ehruS/nWNsYXNzPScucGlja2VyLWJ0bl9fY2FuY2VsJ+eahOaMiemSruayoeacieiiq+WOu+aOiVxyXG4gICAgICAgICAgICBgO1xyXG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKHRpcCk7XHJcbiAgICAgICAgICAgIHRoaXMuZXJyb3JUaXAodGlwKTtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgJGNhbmNlbC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsKGUpPT57XHJcbiAgICAgICAgICAgIF90aGlzLmhpZGUoKTtcclxuICAgICAgICB9KVxyXG5cclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgcmVWaWV3KGRhdGU6IHN0cmluZyl7XHJcbiAgICAgICAgLy8g6YeN572u6YCJ5oup5Zmo6Led56a777yMZGF0ZT1b5byA5aeL5pe26Ze077yM57uT5p2f5pe26Ze0XVxyXG4gICAgICAgIGxldCBib29sID0gdHJ1ZTtcclxuICAgICAgICBsZXQgX3RoaXMgPSB0aGlzO1xyXG4gICAgICAgIGxldCBzdHJBcnJheSA9IGRhdGUuc3BsaXQoX3RoaXMucGFyYW1zLm91dEZvcm1hdCk7XHJcbiAgICAgICAgYm9vbCA9IHN0ckFycmF5Lmxlbmd0aDwzPyBmYWxzZTogdHJ1ZTtcclxuICAgICAgICBpZighYm9vbCl7XHJcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoJ0Vycm9yOiByZVZpZXfmlrnms5XkvKDlhaXnmoTlj4LmlbDlrZfnrKbmoLzlvI/kuI3lr7knKTtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLnNldERlZmF1bHRWaWV3KGRhdGVbdGhpcy5jdXJyZW50SW5kZXhdKTtcclxuICAgICAgICB0aGlzLiRlbWl0KGBvbmNoYW5nZV8ke3RoaXMucGFyYW1zLmtleX1gLGRhdGUpO1xyXG4gICAgfSBcclxufSIsIi8vIOaooeadv+Wtl+espuS4slxyXG5cclxuZXhwb3J0IGNvbnN0IG1hc2sgPSBgXHJcbjxkaXYgY2xhc3M9XCJwaWNrZXItbWFza1wiPjwvZGl2PlxyXG5gO1xyXG5cclxuZXhwb3J0IGNvbnN0IHJhbmdlID0gYFxyXG48ZGl2IGNsYXNzPVwicGlja2VyLXJhbmdlXCI+XHJcbiAgICA8cCBjbGFzcz1cInJhbmdlLWNoaWxkIHN0YXJ0LXRpbWUgcmFuZ2UtYWN0XCI+5byA5aeL5pel5pyfPC9wPlxyXG4gICAgPHNwYW4+6IezPC9zcGFuPlxyXG4gICAgPHAgY2xhc3M9XCJyYW5nZS1jaGlsZCBlbmQtdGltZVwiPue7k+adn+aXpeacnzwvcD5cclxuPC9kaXY+XHJcbmA7XHJcblxyXG5cclxuZXhwb3J0IGNvbnN0IHJhbmdlUGlja2VyID0gYFxyXG48ZGl2IGNsYXNzPVwicGlja2VyLXdyYXBwZXIgcGlja2VyLXR5cGVfX3JhbmdlXCI+XHJcbiAgICA8ZGl2IGNsYXNzPVwicGlja2VyLWhlYWQgZmxleCBzcGFjZS1iZXR3ZWVuXCI+XHJcbiAgICAgICAgPHNwYW4gY2xhc3M9XCJjYW5jZWwgcGlja2VyLWJ0bl9fY2FuY2VsXCI+5Y+W5raIPC9zcGFuPlxyXG4gICAgICAgIDxzcGFuIGNsYXNzPVwic3VyZSBwaWNrZXItYnRuX19zdXJlXCI+56Gu5a6aPC9zcGFuPlxyXG4gICAgPC9kaXY+XHJcbiAgICA8ZGl2IGNsYXNzPVwicGlja2VyLWJvZHlcIj5cclxuICAgICAgICAke3JhbmdlfVxyXG5cclxuICAgICAgICA8ZGl2IGNsYXNzPVwiZGF0ZS1jb250ZW50IGZsZXhcIj5cclxuXHJcbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJkYXRlLWdyb3VwIGZsZXgtaXRlbVwiPlxyXG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJjb250ZW50LW1hc2sgbWFzay10b3BcIj48L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiY29udGVudC1tYXNrIG1hc2stYm90dG9tXCI+PC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImRhdGUtaXRlbSBcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgJDFcclxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJkYXRlLWdyb3VwIGZsZXgtaXRlbVwiPlxyXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImNvbnRlbnQtbWFzayBtYXNrLXRvcFwiPjwvZGl2PlxyXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImNvbnRlbnQtbWFzayBtYXNrLWJvdHRvbVwiPjwvZGl2PlxyXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImRhdGUtaXRlbVwiPlxyXG4gICAgICAgICAgICAgICAgICAgICQyXHJcbiAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJkYXRlLWdyb3VwIGZsZXgtaXRlbVwiPlxyXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImNvbnRlbnQtbWFzayBtYXNrLXRvcFwiPjwvZGl2PlxyXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImNvbnRlbnQtbWFzayBtYXNrLWJvdHRvbVwiPjwvZGl2PlxyXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImRhdGUtaXRlbVwiPlxyXG4gICAgICAgICAgICAgICAgICAgICQzXHJcbiAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgPC9kaXY+XHJcblxyXG4gICAgPC9kaXY+XHJcbjwvZGl2PlxyXG5gO1xyXG5cclxuZXhwb3J0IGNvbnN0IHNpbmdsZVBpY2tlciA9IGBcclxuPGRpdiBjbGFzcz1cInBpY2tlci13cmFwcGVyIHBpY2tlci10eXBlX19zaW5nbGVcIj5cclxuICAgIDxkaXYgY2xhc3M9XCJwaWNrZXItaGVhZCBmbGV4IHNwYWNlLWJldHdlZW5cIj5cclxuICAgICAgICA8c3BhbiBjbGFzcz1cImNhbmNlbCBwaWNrZXItYnRuX19jYW5jZWxcIj7lj5bmtog8L3NwYW4+XHJcbiAgICAgICAgPHNwYW4gY2xhc3M9XCJzdXJlIHBpY2tlci1idG5fX3N1cmVcIj7noa7lrpo8L3NwYW4+XHJcbiAgICA8L2Rpdj5cclxuICAgIDxkaXYgY2xhc3M9XCJwaWNrZXItYm9keVwiPlxyXG4gICAgICAgIDxkaXYgY2xhc3M9XCJkYXRlLWNvbnRlbnQgZmxleFwiPlxyXG5cclxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cImRhdGUtZ3JvdXAgZmxleC1pdGVtXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImNvbnRlbnQtbWFzayBtYXNrLXRvcFwiPjwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJjb250ZW50LW1hc2sgbWFzay1ib3R0b21cIj48L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiZGF0ZS1pdGVtIFwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAkMVxyXG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cImRhdGUtZ3JvdXAgZmxleC1pdGVtXCI+XHJcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiY29udGVudC1tYXNrIG1hc2stdG9wXCI+PC9kaXY+XHJcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiY29udGVudC1tYXNrIG1hc2stYm90dG9tXCI+PC9kaXY+XHJcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiZGF0ZS1pdGVtXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgJDJcclxuICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cImRhdGUtZ3JvdXAgZmxleC1pdGVtXCI+XHJcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiY29udGVudC1tYXNrIG1hc2stdG9wXCI+PC9kaXY+XHJcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiY29udGVudC1tYXNrIG1hc2stYm90dG9tXCI+PC9kaXY+XHJcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiZGF0ZS1pdGVtXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgJDNcclxuICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICA8L2Rpdj5cclxuXHJcbiAgICA8L2Rpdj5cclxuPC9kaXY+XHJcbmA7XHJcblxyXG5leHBvcnQgY29uc3QgbWludXRlUGlja2VyID0gYFxyXG48ZGl2IGNsYXNzPVwicGlja2VyLXdyYXBwZXIgcGlja2VyLXR5cGVfX21pbnV0ZVwiPlxyXG4gICAgPGRpdiBjbGFzcz1cInBpY2tlci1oZWFkIGZsZXggc3BhY2UtYmV0d2VlblwiPlxyXG4gICAgICAgIDxzcGFuIGNsYXNzPVwiY2FuY2VsIHBpY2tlci1idG5fX2NhbmNlbFwiPuWPlua2iDwvc3Bhbj5cclxuICAgICAgICA8c3BhbiBjbGFzcz1cInN1cmUgcGlja2VyLWJ0bl9fc3VyZVwiPuehruWumjwvc3Bhbj5cclxuICAgIDwvZGl2PlxyXG4gICAgPGRpdiBjbGFzcz1cInBpY2tlci1ib2R5XCI+XHJcbiAgICAgICAgPGRpdiBjbGFzcz1cImRhdGUtY29udGVudCBmbGV4XCI+XHJcblxyXG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwiZGF0ZS1ncm91cCBmbGV4LWl0ZW1cIj5cclxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiY29udGVudC1tYXNrIG1hc2stdG9wXCI+PC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImNvbnRlbnQtbWFzayBtYXNrLWJvdHRvbVwiPjwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJkYXRlLWl0ZW0gXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICQxXHJcbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwiZGF0ZS1ncm91cCBmbGV4LWl0ZW1cIj5cclxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJjb250ZW50LW1hc2sgbWFzay10b3BcIj48L2Rpdj5cclxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJjb250ZW50LW1hc2sgbWFzay1ib3R0b21cIj48L2Rpdj5cclxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJkYXRlLWl0ZW1cIj5cclxuICAgICAgICAgICAgICAgICAgICAkMlxyXG4gICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwiZGF0ZS1ncm91cCBmbGV4LWl0ZW1cIj5cclxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJjb250ZW50LW1hc2sgbWFzay10b3BcIj48L2Rpdj5cclxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJjb250ZW50LW1hc2sgbWFzay1ib3R0b21cIj48L2Rpdj5cclxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJkYXRlLWl0ZW1cIj5cclxuICAgICAgICAgICAgICAgICAgICAkM1xyXG4gICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgIDwvZGl2PlxyXG5cclxuICAgICAgICA8c3BhbiBjbGFzcz1cInBpY2tlci1taW51dGUtYnRuXCI+PC9zcGFuPlxyXG4gICAgICAgIDxkaXYgY2xhc3M9XCJkYXRlLWNvbnRlbnQgZGF0ZS1jb250ZW50LW1pbnV0ZSBmbGV4XCI+XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwiZGF0ZS1ncm91cCBmbGV4LWl0ZW1cIj5cclxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiY29udGVudC1tYXNrIG1hc2stdG9wXCI+PC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImNvbnRlbnQtbWFzayBtYXNrLWJvdHRvbVwiPjwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJkYXRlLWl0ZW0gXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICQ0XHJcbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwiZGF0ZS1ncm91cCBmbGV4LWl0ZW1cIj5cclxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJjb250ZW50LW1hc2sgbWFzay10b3BcIj48L2Rpdj5cclxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJjb250ZW50LW1hc2sgbWFzay1ib3R0b21cIj48L2Rpdj5cclxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJkYXRlLWl0ZW1cIj5cclxuICAgICAgICAgICAgICAgICAgICAkNVxyXG4gICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgIDwvZGl2PlxyXG5cclxuICAgIDwvZGl2PlxyXG48L2Rpdj5cclxuYFxyXG5cclxuIiwiLy8gaW1wb3J0IHsgcmVzb2x2ZSB9IGZyb20gXCJhbnktcHJvbWlzZVwiO1xyXG5pbXBvcnQgVXRpbHMgZnJvbSAnLi91dGlscyc7XHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFRvdWNocyBleHRlbmRzIFV0aWxzIHtcclxuICAgIHByaXZhdGUgX3RhcmdldDogYW55O1xyXG4gICAgcHJpdmF0ZSBfc3RhcnRZOiBudW1iZXI7XHJcbiAgICBwcml2YXRlIF9lbmRZOiBudW1iZXI7XHJcbiAgICBwcml2YXRlIF9yYW5nZTogbnVtYmVyO1xyXG5cclxuICAgIC8vIOi+heWKqeexu+WPguaVsFxyXG4gICAgcHJpdmF0ZSBib29sOiBib29sZWFuID0gdHJ1ZTtcclxuICAgIHByaXZhdGUgbGltaXQ6IG51bWJlciA9IDA7IC8v6ZmQ5rWBXHJcbiAgICBwcml2YXRlIF9zdGFydFRpbWU6IG51bWJlciA9IDA7XHJcbiAgICBwcml2YXRlIF9lbmRUaW1lOiBudW1iZXIgPTA7XHJcbiAgICBwcml2YXRlIF9zdXBwb3J0VG91Y2g6IGJvb2xlYW4gPSBcIm9udG91Y2hlbmRcIiBpbiBkb2N1bWVudDsgLy/liKTmlq3mtY/op4jlmajmmK/lkKbmlK/mjIF0b3VjaFxyXG4gICAgcHJpdmF0ZSBfdG91Y2hOYW1lOiBhbnkgPSB7fTtcclxuICAgIHByaXZhdGUgX3N0YXJ0Q2I6IEZ1bmN0aW9uID0gbnVsbDtcclxuICAgIHByaXZhdGUgX21vdmVDYjogRnVuY3Rpb24gPSBudWxsO1xyXG4gICAgcHJpdmF0ZSBfZW5kQ2I6IEZ1bmN0aW9uID0gbnVsbDtcclxuICAgIHByaXZhdGUgX3RvdWNoU3RhcnRIYW5kZXI6IGFueSA9IG51bGw7XHJcbiAgICBwcml2YXRlIF90b3VjaE1vdmVIYW5kZXI6IGFueSA9IG51bGw7XHJcbiAgICBwcml2YXRlIF90b3VjaEVuZEhhbmRlcjogYW55ID0gbnVsbDtcclxuXHJcbiAgICBjb25zdHJ1Y3Rvcih0YXJnZXQ6IGFueSl7XHJcbiAgICAgICAgc3VwZXIoKTtcclxuICAgICAgICAvLyBjb25zb2xlLmxvZygnaW5pdCcpXHJcbiAgICAgICAgdGhpcy5fdGFyZ2V0ID0gdGFyZ2V0O1xyXG4gICAgICAgIHRoaXMudG91Y2hOYW1lID0ge1xyXG4gICAgICAgICAgICBzdGFydDogdGhpcy5fc3VwcG9ydFRvdWNoPyAndG91Y2hzdGFydCc6J21vdXNlZG93bicsXHJcbiAgICAgICAgICAgIG1vdmU6IHRoaXMuX3N1cHBvcnRUb3VjaD8gJ3RvdWNobW92ZSc6J21vdXNlbW92ZScsXHJcbiAgICAgICAgICAgIGVuZDogdGhpcy5fc3VwcG9ydFRvdWNoPyAndG91Y2hlbmQnOidtb3VzZXVwJyxcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0IHRhcmdldCgpOiBhbnl7XHJcbiAgICAgICAgaWYodGhpcy5fdGFyZ2V0KXtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3RhcmdldFxyXG4gICAgICAgIH1lbHNle1xyXG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKCdFcnJvcjog5rKh5pyJ5om+5YiwdGFyZ2V05a+56LGhJyk7XHJcbiAgICAgICAgICAgIHJldHVybiBudWxsXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGdldCBzdGFydFkoKTogbnVtYmVye1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9zdGFydFk7XHJcbiAgICB9XHJcblxyXG4gICAgc2V0IHN0YXJ0WSh2YWw6IG51bWJlcil7XHJcbiAgICAgICAgdGhpcy5fc3RhcnRZID0gdmFsO1xyXG4gICAgfVxyXG5cclxuICAgIFxyXG4gICAgZ2V0IGVuZFkoKTogbnVtYmVye1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9lbmRZOyBcclxuICAgIH1cclxuICAgIFxyXG4gICAgc2V0IGVuZFkodmFsOiBudW1iZXIpIHtcclxuICAgICAgICB0aGlzLl9lbmRZID0gdmFsO1xyXG4gICAgfVxyXG5cclxuICAgIGdldCByYW5nZSgpOiBudW1iZXIge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9yYW5nZTtcclxuICAgIH1cclxuXHJcbiAgICBzZXQgcmFuZ2UodmFsOiBudW1iZXIpe1xyXG4gICAgICAgIHRoaXMuX3JhbmdlID0gdmFsO1xyXG4gICAgfVxyXG5cclxuICAgIGdldCB0b3VjaE5hbWUoKTogYW55IHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fdG91Y2hOYW1lO1xyXG4gICAgfVxyXG5cclxuICAgIHNldCB0b3VjaE5hbWUodmFsOiBhbnkpe1xyXG4gICAgICAgIHRoaXMuX3RvdWNoTmFtZSA9IHZhbDtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgaW5pdChwYXJhbXM/OiBhbnkpe1xyXG4gICAgICAgIHRoaXMuX3N0YXJ0Q2IgPSBwYXJhbXMuc3RhcnRDYjtcclxuICAgICAgICB0aGlzLl9tb3ZlQ2IgPSBwYXJhbXMubW92ZUNiO1xyXG4gICAgICAgIHRoaXMuX2VuZENiID0gcGFyYW1zLmVuZENiO1xyXG5cclxuICAgICAgICB0aGlzLnRvdWNoU3RhcnQoKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGJpbmRzKG9iaixmbil7XHJcbiAgICAgICAgcmV0dXJuIChlKT0+e1xyXG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZygnYXJnJyxlKTsgXHJcbiAgICAgICAgICAgIGFyZ3VtZW50c1swXSA9IGU7XHJcbiAgICAgICAgICAgIGZuLmFwcGx5KG9iaiwgYXJndW1lbnRzKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSB0b3VjaFN0YXJ0KCl7XHJcbiAgICAgICAgLy8gdG91Y2hzdGFydDpcclxuICAgICAgICAvLyAxLiDnu5l0YXJnZXTnu5Hlrpp0b3VjaOS6i+S7tlxyXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKHRoaXMudGFyZ2V0KSAgXHJcbiAgICAgICAgbGV0IF90aGlzID0gdGhpcztcclxuICAgICAgICB0aGlzLl90b3VjaFN0YXJ0SGFuZGVyID0gdGhpcy5iaW5kcyh0aGlzLHRoaXMudG91Y2hTdGFydEhhbmRlcik7XHJcbiAgICAgICAgdGhpcy5fdG91Y2hNb3ZlSGFuZGVyID0gdGhpcy5iaW5kcyh0aGlzLHRoaXMudG91Y2hNb3ZlSGFuZGVyKTtcclxuICAgICAgICB0aGlzLl90b3VjaEVuZEhhbmRlciA9IHRoaXMuYmluZHModGhpcyx0aGlzLnRvdWNoRW5kSGFuZGVyKTtcclxuICAgICAgICBfdGhpcy50YXJnZXQuYWRkRXZlbnRMaXN0ZW5lcih0aGlzLnRvdWNoTmFtZS5zdGFydCx0aGlzLl90b3VjaFN0YXJ0SGFuZGVyLGZhbHNlKTtcclxuICAgICAgICBcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHRvdWNoU3RhcnRIYW5kZXIoKXtcclxuICAgICAgICBsZXQgZSA9IGFyZ3VtZW50c1swXTtcclxuICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgdGhpcy5zdGFydFkgPSB0aGlzLl9zdXBwb3J0VG91Y2g/ZS50b3VjaGVzWzBdLnBhZ2VZOiBlLnBhZ2VZO1xyXG4gICAgICAgIHRoaXMuX3N0YXJ0VGltZSA9IG5ldyBEYXRlKCkuZ2V0VGltZSgpO1xyXG4gICAgICAgIHRoaXMuX3N0YXJ0Q2IoZSk7XHJcbiAgICAgICAgdGhpcy50YXJnZXQuYWRkRXZlbnRMaXN0ZW5lcih0aGlzLnRvdWNoTmFtZS5tb3ZlLHRoaXMuX3RvdWNoTW92ZUhhbmRlcixmYWxzZSk7XHJcbiAgICAgICAgdGhpcy50YXJnZXQuYWRkRXZlbnRMaXN0ZW5lcih0aGlzLnRvdWNoTmFtZS5lbmQsdGhpcy5fdG91Y2hFbmRIYW5kZXIsZmFsc2UpO1xyXG4gICAgICAgIHRoaXMudGFyZ2V0LmFkZEV2ZW50TGlzdGVuZXIoJ3RvdWNoY2FuY2VsJyx0aGlzLl90b3VjaEVuZEhhbmRlcixmYWxzZSk7XHJcbiAgICB9XHJcbiAgXHJcblxyXG4gICAgcHJpdmF0ZSB0b3VjaE1vdmVIYW5kZXIoKXtcclxuICAgICAgICBsZXQgZSA9IGFyZ3VtZW50c1swXTtcclxuICAgICAgICAvLyBlLnN0b3BQcm9wYWdhdGlvbigpO1xyXG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICAvLyDpmZDmtYEtc3RhcnRcclxuICAgICAgICB0aGlzLmxpbWl0Kys7XHJcbiAgICAgICAgaWYodGhpcy5saW1pdD49NSl7XHJcbiAgICAgICAgICAgIHRoaXMubGltaXQgPSAwO1xyXG4gICAgICAgICAgICB0aGlzLmJvb2wgPSB0cnVlO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZighdGhpcy5ib29sKXJldHVybjtcclxuICAgICAgICB0aGlzLmJvb2wgPSBmYWxzZTtcclxuICAgICAgICAvLyDpmZDmtYEtZW5kXHJcbiAgICAgICAgbGV0IHBhZ2VZID0gdGhpcy5fc3VwcG9ydFRvdWNoP2UudG91Y2hlc1swXS5wYWdlWTogZS5wYWdlWTtcclxuICAgICAgICB0aGlzLnJhbmdlID0gcGFnZVkgLSB0aGlzLl9zdGFydFk7XHJcbiAgICAgICAgdGhpcy5fbW92ZUNiKGUsdGhpcy5yYW5nZSk7XHJcbiAgICB9XHJcblxyXG5cclxuICAgIHByaXZhdGUgdG91Y2hFbmRIYW5kZXIoKXsgXHJcbiAgICAgICAgbGV0IGUgPSBhcmd1bWVudHNbMF07XHJcbiAgICAgICAgbGV0IF90aGlzID0gdGhpcztcclxuICAgICAgICAvLyB0aGlzLnRhcmdldC5yZW1vdmVFdmVudExpc3RlbmVyKHRoaXMudG91Y2hOYW1lLnN0YXJ0LF90aGlzLl90b3VjaFN0YXJ0SGFuZGVyLGZhbHNlKTtcclxuICAgICAgICB0aGlzLnRhcmdldC5yZW1vdmVFdmVudExpc3RlbmVyKHRoaXMudG91Y2hOYW1lLm1vdmUsdGhpcy5fdG91Y2hNb3ZlSGFuZGVyLGZhbHNlKTtcclxuICAgICAgICB0aGlzLnRhcmdldC5yZW1vdmVFdmVudExpc3RlbmVyKHRoaXMudG91Y2hOYW1lLmVuZCx0aGlzLl90b3VjaEVuZEhhbmRlcixmYWxzZSk7XHJcbiAgICAgICAgdGhpcy50YXJnZXQucmVtb3ZlRXZlbnRMaXN0ZW5lcigndG91Y2hjYW5jZWwnLHRoaXMuX3RvdWNoRW5kSGFuZGVyLGZhbHNlKTtcclxuICAgICAgICBcclxuICAgICAgICB0aGlzLmVuZFkgPSB0aGlzLnJhbmdlIHx8IDA7IFxyXG4gICAgICAgIC8vIOmaj+a1geaViOaenFxyXG4gICAgICAgIHRoaXMuX2VuZFRpbWUgPSBuZXcgRGF0ZSgpLmdldFRpbWUoKTtcclxuICAgICAgICBsZXQgcmFuZ2VUaW1lID0gKHRoaXMuX2VuZFRpbWUgLSB0aGlzLl9zdGFydFRpbWUpLzEwMDA7Ly/ljZXkvY06IOenklxyXG4gICAgICAgIGlmKHRoaXMuZW5kWSE9PTApe1xyXG5cclxuICAgICAgICAgICAgbGV0IHNwYWNlID0gTWF0aC5mbG9vcihNYXRoLmFicyh0aGlzLmVuZFkpLyhyYW5nZVRpbWUqMykpO1xyXG4gICAgICAgICAgICB0aGlzLmVuZFkgPSB0aGlzLmVuZFk+MD8gdGhpcy5lbmRZK3NwYWNlOiB0aGlzLmVuZFktc3BhY2U7XHJcblxyXG4gICAgICAgIH1cclxuICAgICAgICBcclxuICAgICAgICB0aGlzLl9lbmRDYihlLCB0aGlzLmVuZFkpO1xyXG4gICAgfVxyXG59IiwiLy8g5bel5YW357G7XHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFV0aWxzIHtcclxuICAgIHByaXZhdGUgX2V2ZW50TGlzdHM6IG9iamVjdCA9IHt9O1xyXG4gICAgY29uc3RydWN0b3IoKXt9XHJcblxyXG4gICAgcHVibGljIHNlbGVjdChlbG06IHN0cmluZywgdGFyZ2V0PzogYW55KXtcclxuICAgICAgICBpZih0YXJnZXQpe1xyXG4gICAgICAgICAgICByZXR1cm4gdGFyZ2V0LnF1ZXJ5U2VsZWN0b3IoZWxtKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoZWxtKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc2VsZWN0QWxsKGVsbTogc3RyaW5nLCB0YXJnZXQ/OiBhbnkpe1xyXG4gICAgICAgIGlmKHRhcmdldCl7XHJcbiAgICAgICAgICAgIHJldHVybiB0YXJnZXQucXVlcnlTZWxlY3RvckFsbChlbG0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChlbG0pO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBjcmVhdGVFbG0odGFyZ2V0OiBhbnksIGxhYmVsOiBzdHJpbmcsIGNsYXNzTmFtZT86IHN0cmluZyl7XHJcbiAgICAgICAgLy8g5Yib5bu65YWD57SgXHJcbiAgICAgICAgY29uc3QgJGVsbSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQobGFiZWwpO1xyXG4gICAgICAgICRlbG0uY2xhc3NMaXN0LmFkZChjbGFzc05hbWUpO1xyXG4gICAgICAgIHRhcmdldC5hcHBlbmRDaGlsZCgkZWxtKTtcclxuICAgICAgICByZXR1cm4gJGVsbTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc2V0Q3NzKHRhcmdldDogYW55LCBjc3M6IG9iamVjdCl7XHJcbiAgICAgICAgLy8g6K6+572uY3Nz5qC35byPXHJcbiAgICAgICAgZm9yKGxldCBhdHRyIGluIGNzcyl7XHJcbiAgICAgICAgICAgIHRhcmdldC5zdHlsZVthdHRyXSA9IGNzc1thdHRyXTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHNsZWVwKGNiOiBGdW5jdGlvbiwgdGltZW91dDogbnVtYmVyKXtcclxuICAgICAgICAvLyDlu7bov59cclxuICAgICAgICBzZXRUaW1lb3V0KGNiLCB0aW1lb3V0KTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZ2V0VG9kYXkoZm9ybWF0OiBzdHJpbmcpOiBzdHJpbmd7XHJcbiAgICAgICAgLy8g6I635Y+W5LuK5aSp55qE5pel5pyfOiAyMDE5LTAxLTAxXHJcbiAgICAgICAgbGV0IGRhdGUgPSBuZXcgRGF0ZSgpO1xyXG4gICAgICAgIGxldCB5ZWFyID0gZGF0ZS5nZXRGdWxsWWVhcigpO1xyXG4gICAgICAgIGxldCBtb250aDogYW55ID0gZGF0ZS5nZXRNb250aCgpKzE7XHJcbiAgICAgICAgbGV0IGRheTogYW55ID0gZGF0ZS5nZXREYXRlKCk7XHJcbiAgICAgICAgbW9udGggPSBtb250aD49MTA/IG1vbnRoOiAnMCcrbW9udGg7XHJcbiAgICAgICAgZGF5ID0gZGF5Pj0xMD8gZGF5OiAnMCcrZGF5O1xyXG4gICAgICAgIHJldHVybiBbeWVhcixtb250aCxkYXldLmpvaW4oZm9ybWF0KTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgJG9uKGV2ZW50TmFtZTogc3RyaW5nLCBmbjogRnVuY3Rpb24pe1xyXG4gICAgICAgIC8vIOiuoumYheS6i+S7tlxyXG4gICAgICAgIGlmKHRoaXMuX2V2ZW50TGlzdHNbZXZlbnROYW1lXSl7XHJcbiAgICAgICAgICAgIHRoaXMuX2V2ZW50TGlzdHNbZXZlbnROYW1lXS5wdXNoKGZuKTtcclxuICAgICAgICB9ZWxzZXtcclxuICAgICAgICAgICAgdGhpcy5fZXZlbnRMaXN0c1tldmVudE5hbWVdID0gW2ZuXTtcclxuICAgICAgICAgICAgLy8gY29uc29sZS5sb2coJ2V2ZW50TGlzdHMnLHRoaXMuX2V2ZW50TGlzdHNbZXZlbnROYW1lXSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyAkZW1pdChldmVudE5hbWU6IHN0cmluZywgLi4uYXJncyl7XHJcbiAgICAgICAgLy8g6Kem5Y+R5LqL5Lu2XHJcbiAgICAgICAgaWYodGhpcy5fZXZlbnRMaXN0c1tldmVudE5hbWVdKXtcclxuICAgICAgICAgICAgdGhpcy5fZXZlbnRMaXN0c1tldmVudE5hbWVdLmZvckVhY2goKGZuLGkpPT57XHJcbiAgICAgICAgICAgICAgICBmbiguLi5hcmdzKTtcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGFzc2lnbihleHRlbmRlZCxvcHRpb25zKXtcclxuICAgICAgICBmb3IgKGxldCBwcm9wZXJ0eSBpbiBvcHRpb25zKSB7XHJcbiAgICAgICAgICAgIHRyeSB7IFxyXG4gICAgICAgICAgICAgIGlmIChvcHRpb25zW3Byb3BlcnR5XS5jb25zdHJ1Y3RvciA9PSBPYmplY3QpIHtcclxuICAgICAgICAgICAgICAgIGV4dGVuZGVkW3Byb3BlcnR5XSA9IHRoaXMuYXNzaWduKGV4dGVuZGVkW3Byb3BlcnR5XSwgb3B0aW9uc1twcm9wZXJ0eV0pO1xyXG4gICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBleHRlbmRlZFtwcm9wZXJ0eV0gPSBvcHRpb25zW3Byb3BlcnR5XTtcclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0gY2F0Y2ggKGV4KSB7XHJcbiAgICAgICAgICAgICAgZXh0ZW5kZWRbcHJvcGVydHldID0gb3B0aW9uc1twcm9wZXJ0eV07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH1cclxuICAgICAgICBcclxuICAgICAgICAgIHJldHVybiBleHRlbmRlZDtcclxuICAgIH1cclxuXHJcbiAgICAvLyDoh6rlrprkuYnmj5DnpLpcclxuICAgIHB1YmxpYyBUaXAodGlwTmFtZTogc3RyaW5nLCBtc2c6IHN0cmluZywgdGltZW91dD86IG51bWJlcil7XHJcbiAgICAgICAgbGV0ICR0aXAgPSB0aGlzLnNlbGVjdCh0aXBOYW1lKTtcclxuICAgICAgICBsZXQgX3RoaXMgPSB0aGlzO1xyXG4gICAgICAgIGlmKCEkdGlwKXtcclxuICAgICAgICAgICAgJHRpcCA9IHRoaXMuY3JlYXRlRWxtKGRvY3VtZW50LmJvZHksJ2RpdicsdGlwTmFtZSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAkdGlwLmlubmVySFRNTCA9IG1zZztcclxuXHJcbiAgICAgICAgdGhpcy5zZXRDc3MoJHRpcCx7XHJcbiAgICAgICAgICAgICdkaXNwbGF5JzonYmxvY2snLFxyXG4gICAgICAgICAgICAnb3BhY2l0eSc6ICcxJ1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICB0aGlzLnNsZWVwKCgpPT57XHJcbiAgICAgICAgICAgIF90aGlzLnNldENzcygkdGlwLHtcclxuICAgICAgICAgICAgICAgICdvcGFjaXR5JzogJzAnXHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgfSx0aW1lb3V0fHwgMjAwMClcclxuXHJcbiAgICAgICAgdGhpcy5zbGVlcCgoKT0+e1xyXG4gICAgICAgICAgICBfdGhpcy5zZXRDc3MoJHRpcCx7XHJcbiAgICAgICAgICAgICAgICAnZGlzcGxheSc6ICdub25lJ1xyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgIH0sKHRpbWVvdXR8fCAxMDAwKSszMDApXHJcbiAgICB9XHJcblxyXG4gICAgXHJcbiAgICBwdWJsaWMgZXJyb3JUaXAobXNnOiBzdHJpbmcsIHRpbWVvdXQ/OiBudW1iZXIpe1xyXG4gICAgICAgIGxldCB0aXBOYW1lID0gJ2RhdGVQaWNrZXItZXJyb3JUaXAnO1xyXG4gICAgICAgIHRoaXMuVGlwKHRpcE5hbWUsIG1zZywgdGltZW91dCk7XHJcblxyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzdWNjZXNzVGlwKG1zZzogc3RyaW5nLCB0aW1lb3V0PzogbnVtYmVyKXtcclxuICAgICAgICBsZXQgdGlwTmFtZSA9ICdkYXRlUGlja2VyLXN1Y2Nlc3NUaXAnO1xyXG4gICAgICAgIHRoaXMuVGlwKHRpcE5hbWUsIG1zZywgdGltZW91dCk7XHJcblxyXG4gICAgfVxyXG5cclxuXHJcbn1cclxuXHJcbiJdfQ==

//# sourceMappingURL=datePicker.js.map
