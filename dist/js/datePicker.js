(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";
// 时间选择器核心代码

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

Object.defineProperty(exports, "__esModule", { value: true });
var utils_1 = require("./utils");
var temp = require("./template");
var touch_1 = require("./touch");

var DatePicker = function (_utils_1$default) {
    _inherits(DatePicker, _utils_1$default);

    function DatePicker(options) {
        _classCallCheck(this, DatePicker);

        var _this2 = _possibleConstructorReturn(this, (DatePicker.__proto__ || Object.getPrototypeOf(DatePicker)).call(this));

        _this2._opt = {}; //全局配置
        _this2._params = {}; //初始化配置
        _this2._key = 1; //唯一key
        _this2._keyList = []; //key列表
        _this2._monthStr = ''; //月份字符串
        _this2._dayStr = ''; //天数字符串
        _this2._currentPicker = null; //保存当前显示的选择器
        _this2._currentIndexs = []; //保存当前选择的格子索引
        _this2._currentValue = []; //保存当前选择的值
        _this2._mask = null; //保存唯一的遮罩
        // 辅助类变量
        _this2._height = 0; //选择器格子的高度
        _this2._maxKeyCount = 20; //可创建选择器的最大数量
        _this2.opt = Object.assign({
            maxKeyCount: _this2._maxKeyCount,
            onchange: function onchange() {},
            success: function success() {}
        }, options);
        _this2.opt.maxKeyCount = _this2.opt.maxKeyCount > 0 && _this2.opt.maxKeyCount <= 20 ? _this2.opt.maxKeyCount : _this2._maxKeyCount;
        _this2.monthStr = _this2.createMonthStr();
        _this2.dayStr = _this2.createDayStr();
        return _this2;
    }

    _createClass(DatePicker, [{
        key: "picker",
        value: function picker(params) {
            this.params = Object.assign({
                startYear: '1990',
                endYear: '2030',
                defaultDate: this.getToday('-'),
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
                console.log('key', this.key);
            }
            if (this.keyList.length > this.opt.maxKeyCount) {
                console.error("\n            Error:\u68C0\u6D4B\u5230\u9875\u9762\u4E0A\u521B\u5EFA\u7684\u9009\u62E9\u5668\u8FC7\u591A!\n            \u8BF7\u68C0\u67E5\u4EE3\u7801\u662F\u5426\u6709\u95EE\u9898\n            \u8BF7\u4E0D\u8981\u5728\u5FAA\u73AF\u6216\u8005\u4E8B\u4EF6\u4E2D\u91CD\u590D\u8C03\u7528.picker()\u65B9\u6CD5\n            \u82E5\u975E\u8981\u5982\u6B64\u8C03\u7528\uFF0C\u4E00\u5B9A\u8981\u52A0\u4E0Akey\u5C5E\u6027\n            \u5EFA\u8BAE\u5728\u5916\u9762\u8C03\u7528.picker()\u65B9\u6CD5\uFF0C\u5728\u91CC\u9762\u8C03\u7528.show()\u65B9\u6CD5\u663E\u793A\n            ");
                return;
            }
            this.render();
            var _this = this;
            // 返回一个对象,方便调用
            return {
                key: _this.params.key,
                show: function show() {
                    _this.show(_this.params.key);
                },
                hide: _this.hide.bind(_this)
            };
        }
    }, {
        key: "render",
        value: function render() {
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
            this.currentPicker = null; //每次渲染前都把之前的选择器释放
            var pickerName = "picker-key-" + this.params.key;
            var $picker = this.select("." + pickerName);
            var $pickerWrapper = this.select("." + pickerName + " .picker-wrapper");
            var _this = this;
            if (!$picker) {
                var yearStr = this.createYearStr();
                var pickerHtml = temp.picker.replace('$1', yearStr).replace('$2', this.monthStr).replace('$3', this.dayStr);
                // console.log('picker',pickerHtml);
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
                var defaultInfo = this.setDefaultView(); //设置默认日期的视图
                this.bindEvents(defaultInfo);
                this.rangeOperation();
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
                html += "<p class=\"date-unit\" data-month=\"" + item + "\">" + item + "\u5E74</p>";
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
                html += "<p class=\"date-unit\" data-month=\"" + item + "\">" + day + "\u65E5</p>";
            });
            // console.log('day',html);
            return html;
        }
    }, {
        key: "setDefaultView",
        value: function setDefaultView() {
            if (!this.params.defaultDate) {
                console.error('Error: 默认日期(defaultDate)不能为空');
                return;
            }
            var dateArray = this.params.defaultDate.split('-');
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
            console.log('monthIndex', this._height * monthIndex);
            this.setCss($dateUtils[1], {
                'transform': "translateY(" + monthIndex * this._height + "px)"
            });
            // month
            var dayIndex = this.currentToIndex(parseInt(dateArray[2]) - 1);
            this.setCss($dateUtils[2], {
                'transform': "translateY(" + dayIndex * this._height + "px)"
            });
            return {
                dateArray: dateArray,
                heightArray: [yearIndex * this._height, monthIndex * this._height, dayIndex * this._height]
            };
        }
    }, {
        key: "bindEvents",
        value: function bindEvents(defaultInfo) {
            if (!this.currentPicker) {
                console.error('Error: 选择器还没有渲染');
                return;
            }
            var $dateGroups = this.selectAll('.date-group', this.currentPicker);
            var _this = this;
            $dateGroups.forEach(function (dateGroup, i) {
                var $dateUtils = _this.select('.date-item', dateGroup);
                _this.setCss($dateUtils, {
                    'transition': '0.1s all linear'
                });
                // 注意：EndY的值不应该为0，而是调用默认视图函数后的距离
                var EndY = defaultInfo.heightArray[i];
                var touchs = new touch_1.default(dateGroup);
                touchs.touchStart(_this.touchStart);
                touchs.touchMove(function (e, range) {
                    _this.touchMove(e, range, EndY, $dateUtils);
                });
                touchs.touchEnd(function (e, endY) {
                    EndY = _this.touchEnd(e, endY, EndY, $dateUtils, i, defaultInfo.dateArray);
                    console.log('touchEnd', EndY);
                });
            });
            this.mask.addEventListener('click', this.hide.bind(_this));
        }
    }, {
        key: "touchStart",
        value: function touchStart() {
            console.log('start');
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
        value: function touchEnd(e, endY, EndY, target, Index, dateArray) {
            EndY = EndY + endY;
            var min = EndY > 0 ? Math.floor(EndY / this._height) : Math.ceil(EndY / this._height);
            var max = EndY > 0 ? min + 1 : min - 1;
            var middle = (max + min) / 2 * this._height;
            var current = 0;
            var currentValue = dateArray;
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
                currentValue[Index] = this.currentPicker.years[arrayIndex];
            } else {
                currentValue[Index] = arrayIndex + 1 >= 10 ? arrayIndex + 1 : '0' + (arrayIndex + 1);
            }
            this.setCss(target, {
                'transform': "translateY(" + EndY + "px)"
            });
            // 调用onchange回调
            this.opt.onchange(currentValue);
            this.params.onchange(currentValue);
            this.$emit("onchange_" + this.params.key, currentValue);
            return EndY;
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
            this.currentPicker = null;
        }
    }, {
        key: "show",
        value: function show(key) {
            if (!key) {
                var tip = "\n            show\u65B9\u6CD5\u4E00\u5B9A\u8981\u4F20\u5165key\u503C\n            \u8BE5\u503C\u4E0Epicker\u65B9\u6CD5\u7684key\u53C2\u6570\u4E00\u81F4\n            ";
                console.error(tip);
                this.errorTip(tip);
                return;
            }
            this.setCss(this.mask, {
                'opacity': '1',
                'display': 'block'
            });
            var $picker = this.select(".picker-key-" + key);
            if (!$picker) {
                var _tip = "\n            \u6CA1\u6709\u8BE5key(" + key + ")\u503C\u7684\u9009\u62E9\u5668\n            \u8BF7\u68C0\u67E5\u662F\u5426\u5199\u9519!\n            ";
                console.error(_tip);
                this.errorTip(_tip);
                return;
            }
            this.currentPicker = $picker;
            var $pickerWrapper = this.select(".picker-wrapper", $picker);
            this.setCss($pickerWrapper, {
                'transform': 'translateY(0px)'
            });
            $picker.classList.remove('__picker-type-hide');
            $picker.classList.remove('__picker-type-show');
        }
    }, {
        key: "rangeOperation",
        value: function rangeOperation() {
            // 时间区间选择器的逻辑事件
            var $picker = this.currentPicker;
            var $rangeChilds = this.selectAll('.range-child', $picker);
            var currentIndex = 0;
            var _this = this;
            $rangeChilds.forEach(function (rangeChild, i) {
                console.log('rangeChild', rangeChild);
                rangeChild.addEventListener('click', function (e) {
                    console.log(e);
                    if (e.target.classList.contains('range-act')) return;
                    $rangeChilds.forEach(function (item) {
                        item.classList.remove('range-act');
                    });
                    e.target.classList.add('range-act');
                    currentIndex = i;
                });
            });
            var startTime = '',
                endTime = '';
            console.log('onchange', "onchange_" + this.params.key);
            this.$on("onchange_" + this.params.key, function (data) {
                var currentDate = data.join(_this.params.outFormat);
                $rangeChilds[currentIndex].innerHTML = currentDate;
                if (currentIndex == 0) {
                    // 开始日期
                    startTime = currentDate;
                } else {
                    endTime = currentDate;
                }
            });
            // 
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
        key: "monthStr",
        get: function get() {
            return this._monthStr;
        },
        set: function set(val) {
            this._monthStr = val;
        }
    }, {
        key: "dayStr",
        get: function get() {
            return this._dayStr;
        },
        set: function set(val) {
            this._dayStr = val;
        }
    }, {
        key: "currentPicker",
        get: function get() {
            return this._currentPicker;
        },
        set: function set(val) {
            this._currentPicker = val;
        }
    }, {
        key: "currentIndexs",
        get: function get() {
            return this._currentIndexs;
        },
        set: function set(val) {
            this._currentIndexs = val;
        }
    }, {
        key: "currentValue",
        get: function get() {
            return this._currentValue;
        },
        set: function set(val) {
            this._currentValue = val;
        }
    }, {
        key: "mask",
        get: function get() {
            return this._mask;
        },
        set: function set(val) {
            this._mask = val;
        }
    }]);

    return DatePicker;
}(utils_1.default);

exports.default = DatePicker;

},{"./template":3,"./touch":4,"./utils":5}],2:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var datePicker_1 = require("./datePicker");
var datePicker1 = new datePicker_1.default();
var picker1 = datePicker1.picker({
    onchange: function onchange(data) {
        console.log('onchange', data);
    }
});
var picker2 = datePicker1.picker({
    onchange: function onchange(data) {
        console.log('onchange', data);
    }
});
document.querySelectorAll('.picker')[0].addEventListener('click', function () {
    picker1.show();
});
document.querySelectorAll('.picker')[1].addEventListener('click', function () {
    picker2.show();
});

},{"./datePicker":1}],3:[function(require,module,exports){
"use strict";
// 模板字符串

Object.defineProperty(exports, "__esModule", { value: true });
exports.mask = "\n<div class=\"picker-mask\"></div>\n";
exports.range = "\n<div class=\"picker-range\">\n    <p class=\"range-child start-time range-act\">\u5F00\u59CB\u65E5\u671F</p>\n    <span>\u81F3</span>\n    <p class=\"range-child end-time\">\u7ED3\u675F\u65E5\u671F</p>\n</div>\n";
exports.picker = "\n<div class=\"picker-wrapper\">\n    <div class=\"picker-head flex space-between\">\n        <span class=\"cancel\">\u53D6\u6D88</span>\n        <span class=\"sure\">\u786E\u5B9A</span>\n    </div>\n    <div class=\"picker-body\">\n        " + exports.range + "\n\n        <div class=\"date-content flex\">\n\n            <div class=\"date-group flex-item\">\n                    <div class=\"content-mask mask-top\"></div>\n                    <div class=\"content-mask mask-bottom\"></div>\n                    <div class=\"date-item \">\n                        $1\n                    </div>\n            </div>\n            <div class=\"date-group flex-item\">\n                <div class=\"content-mask mask-top\"></div>\n                <div class=\"content-mask mask-bottom\"></div>\n                <div class=\"date-item\">\n                    $2\n                </div>\n            </div>\n            <div class=\"date-group flex-item\">\n                <div class=\"content-mask mask-top\"></div>\n                <div class=\"content-mask mask-bottom\"></div>\n                <div class=\"date-item\">\n                    $3\n                </div>\n            </div>\n        </div>\n\n    </div>\n</div>\n";

},{}],4:[function(require,module,exports){
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

Object.defineProperty(exports, "__esModule", { value: true });

var Touchs = function () {
    function Touchs(target) {
        _classCallCheck(this, Touchs);

        // 辅助类参数
        this.bool = true;
        this.limit = 0;
        console.log('init');
        this._target = target;
    }

    _createClass(Touchs, [{
        key: "touchStart",
        value: function touchStart(cb) {
            // touchstart:
            // 1. 给target绑定touch事件
            console.log(this.target);
            var _this = this;
            _this.target.addEventListener('touchstart', function (e) {
                _this.touchStartHander(e, cb);
            }, false);
        }
    }, {
        key: "touchStartHander",
        value: function touchStartHander(e, cb) {
            this.startY = e.touches[0].pageY;
            console.log(this.startY);
            cb(e);
        }
    }, {
        key: "touchMove",
        value: function touchMove(cb) {
            // touchmove
            var _this = this;
            _this.target.addEventListener('touchmove', function (e) {
                e.stopPropagation();
                e.preventDefault();
                _this.touchMoveHander(e, cb);
            }, false);
        }
    }, {
        key: "touchMoveHander",
        value: function touchMoveHander(e, cb) {
            // 限流-start
            this.limit++;
            if (this.limit >= 5) {
                this.limit = 0;
                this.bool = true;
            }
            if (!this.bool) return;
            this.bool = false;
            // 限流-end
            this.range = e.touches[0].pageY - this._startY;
            cb(e, this.range);
        }
    }, {
        key: "touchEnd",
        value: function touchEnd(cb) {
            // touchend
            var _this = this;
            _this.target.addEventListener('touchend', function (e) {
                _this.touchEndHander(e, cb);
            }, false);
            _this.target.addEventListener('touchcancel', function (e) {
                _this.touchEndHander(e, cb);
            }, false);
        }
    }, {
        key: "touchEndHander",
        value: function touchEndHander(e, cb) {
            this.target.removeEventListener('touchstart', this.touchStartHander, false);
            this.target.removeEventListener('touchmove', this.touchMoveHander, false);
            this.target.removeEventListener('touchend', this.touchEndHander, false);
            this.target.removeEventListener('touchcancel', this.touchEndHander, false);
            this.endY = this.range;
            cb(e, this.endY);
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
    }]);

    return Touchs;
}();

exports.default = Touchs;

},{}],5:[function(require,module,exports){
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
                console.log('eventLists', this._eventLists[eventName]);
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
            }, timeout || 1000);
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

},{}]},{},[2])

//# sourceMappingURL=datePicker.js.map
