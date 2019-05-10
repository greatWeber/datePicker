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

var BasePicker = function (_utils_1$default) {
    _inherits(BasePicker, _utils_1$default);

    function BasePicker(options) {
        _classCallCheck(this, BasePicker);

        var _this2 = _possibleConstructorReturn(this, (BasePicker.__proto__ || Object.getPrototypeOf(BasePicker)).call(this));

        _this2._opt = {}; //全局配置
        _this2._params = {}; //初始化配置
        _this2._key = 1; //唯一key
        _this2._monthStr = ''; //月份字符串
        _this2._dayStr = ''; //天数字符串
        _this2._currentPicker = null; //保存当前显示的选择器
        _this2._currentIndexs = []; //保存当前选择的格子索引
        _this2._currentValue = []; //保存当前选择的值
        _this2._mask = null; //保存唯一的遮罩
        // 辅助类变量
        _this2._height = 0; //选择器格子的高度
        _this2.opt = _this2.assign({
            onchange: function onchange() {},
            success: function success() {}
        }, options);
        _this2.monthStr = _this2.createMonthStr();
        _this2.dayStr = _this2.createDayStr();
        return _this2;
    }

    _createClass(BasePicker, [{
        key: "picker",
        value: function picker(params) {
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
                var pickerHtml = this.renderHtml();
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
        key: "renderHtml",
        value: function renderHtml() {
            // 获取html样式的函数，注意，该函数一般要在子类重写
            var yearStr = this.createYearStr();
            return temp.picker.replace('$1', yearStr).replace('$2', this.monthStr).replace('$3', this.dayStr);
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
            Array.prototype.slice.call($dateGroups).forEach(function (dateGroup, i) {
                var $dateUtils = _this.select('.date-item', dateGroup);
                _this.setCss($dateUtils, {
                    'transition': '0.1s all linear'
                });
                // 注意：EndY的值不应该为0，而是调用默认视图函数后的距离
                var EndY = defaultInfo.heightArray[i];
                var touchs = new touch_1.default(dateGroup);
                touchs.init({
                    startCb: function startCb(e, range) {
                        _this.touchStart(e, $dateUtils);
                    },
                    moveCb: function moveCb(e, range) {
                        _this.touchMove(e, range, EndY, $dateUtils);
                    },
                    endCb: function endCb(e, endY) {
                        EndY = _this.touchEnd(e, endY, EndY, $dateUtils, i, defaultInfo.dateArray);
                        console.log('touchEnd', EndY);
                    }
                });
                // touchs.touchStart((e: any, range: number)=>{
                //     _this.touchStart(e,$dateUtils);
                // });
                // touchs.touchMove((e: any, range: number)=>{
                //     _this.touchMove(e,range,EndY,$dateUtils); 
                // });
                // touchs.touchEnd((e:any, endY: number)=>{
                //     EndY = _this.touchEnd(e,endY,EndY, $dateUtils,i,defaultInfo.dateArray);
                //     console.log('touchEnd',EndY)
                // })
            });
            this.mask.addEventListener('click', this.hide.bind(_this));
        }
    }, {
        key: "touchStart",
        value: function touchStart(e, target) {
            console.log('start');
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
        value: function touchEnd(e, endY, EndY, target, Index, dateArray) {
            EndY = EndY + endY;
            var min = EndY > 0 ? Math.floor(EndY / this._height) : Math.ceil(EndY / this._height);
            var max = EndY > 0 ? min + 1 : min - 1;
            var middle = (max + min) / 2 * this._height;
            var current = 0;
            this.currentValue = dateArray;
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
            } else {
                this.currentValue[Index] = arrayIndex + 1 >= 10 ? arrayIndex + 1 : '0' + (arrayIndex + 1);
            }
            this.setCss(target, {
                'transition': '.3s all linear',
                'transform': "translateY(" + EndY + "px)"
            });
            // 调用onchange回调
            this.opt.onchange(this.currentValue);
            this.params.onchange(this.currentValue);
            this.$emit("onchange_" + this.params.key, this.currentValue, Index);
            return EndY;
        }
    }, {
        key: "getDay",
        value: function getDay() {
            // 获取当月的天数
            var _this = this;
            var days = new Date(this.currentValue[0], this.currentValue[1], 0).getDate();
            console.log('days', days);
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
        key: "rangeOperation",
        value: function rangeOperation() {
            var _this3 = this;

            // 时间区间选择器的逻辑事件
            var $picker = this.currentPicker;
            var $rangeChilds = this.selectAll('.range-child', $picker);
            var currentIndex = 0;
            var _this = this;
            Array.prototype.slice.call($rangeChilds).forEach(function (rangeChild, i) {
                console.log('rangeChild', rangeChild);
                rangeChild.addEventListener('click', function (e) {
                    console.log(e);
                    if (e.target.classList.contains('range-act')) return;
                    Array.prototype.slice.call($rangeChilds).forEach(function (item) {
                        item.classList.remove('range-act');
                    });
                    e.target.classList.add('range-act');
                    currentIndex = i;
                });
            });
            // 订阅事件，监听选择器的变化，修改开始和结束的时间显示
            var startTime = '',
                endTime = '';
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

    return BasePicker;
}(utils_1.default);

exports.default = BasePicker;

},{"./template":5,"./touch":6,"./utils":7}],2:[function(require,module,exports){
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
var basePicker_1 = require("./basePicker");

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
            // 保存key值，如果列表的key值过多，禁止创建
            if (!this.keyList.includes(this.params.key)) {
                this.keyList.push(this.params.key);
                this.key += 1;
                var _picker = new basePicker_1.default(this.opt);
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

},{"./basePicker":1,"./polyfill":4,"./utils":7}],3:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var datePicker_1 = require("./datePicker");
datePicker_1.default.globalOptions({
    success: function success(data) {
        console.log(data);
    }
});
var picker1 = datePicker_1.default.picker({
    onchange: function onchange(data) {
        console.log('onchange', data);
    }
});
console.log('-----------------------');
var picker2 = datePicker_1.default.picker({
    onchange: function onchange(data) {
        console.log('onchange', data);
    }
});
document.getElementsByClassName('picker')[0].addEventListener('click', function () {
    console.log('click');
    picker1.show();
});
document.getElementsByClassName('picker')[1].addEventListener('click', function () {
    picker2.show();
});

},{"./datePicker":2}],4:[function(require,module,exports){
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

},{}],5:[function(require,module,exports){
"use strict";
// 模板字符串

Object.defineProperty(exports, "__esModule", { value: true });
exports.mask = "\n<div class=\"picker-mask\"></div>\n";
exports.range = "\n<div class=\"picker-range\">\n    <p class=\"range-child start-time range-act\">\u5F00\u59CB\u65E5\u671F</p>\n    <span>\u81F3</span>\n    <p class=\"range-child end-time\">\u7ED3\u675F\u65E5\u671F</p>\n</div>\n";
exports.picker = "\n<div class=\"picker-wrapper\">\n    <div class=\"picker-head flex space-between\">\n        <span class=\"cancel picker-btn__cancel\">\u53D6\u6D88</span>\n        <span class=\"sure picker-btn__sure\">\u786E\u5B9A</span>\n    </div>\n    <div class=\"picker-body\">\n        " + exports.range + "\n\n        <div class=\"date-content flex\">\n\n            <div class=\"date-group flex-item\">\n                    <div class=\"content-mask mask-top\"></div>\n                    <div class=\"content-mask mask-bottom\"></div>\n                    <div class=\"date-item \">\n                        $1\n                    </div>\n            </div>\n            <div class=\"date-group flex-item\">\n                <div class=\"content-mask mask-top\"></div>\n                <div class=\"content-mask mask-bottom\"></div>\n                <div class=\"date-item\">\n                    $2\n                </div>\n            </div>\n            <div class=\"date-group flex-item\">\n                <div class=\"content-mask mask-top\"></div>\n                <div class=\"content-mask mask-bottom\"></div>\n                <div class=\"date-item\">\n                    $3\n                </div>\n            </div>\n        </div>\n\n    </div>\n</div>\n";

},{}],6:[function(require,module,exports){
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
        console.log('init');
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
            console.log(this.target);
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
                var space = Math.floor(Math.abs(this.endY) / (rangeTime * 5));
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

},{"./utils":7}],7:[function(require,module,exports){
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

//# sourceMappingURL=datePicker.js.map
