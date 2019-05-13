// 时分选择器核心代码
import * as temp from './template';
import BasePicker from './basePicker';

export default class SinglePicker extends BasePicker {
    private currentIndex :number = 0;
    constructor(options?: object){  
        super();  
        this.opt = this.assign({
            onchange: ()=>{},
            success: ()=>{}
        },options);
        
    }


    public renderHtml(): string{
        // 获取html样式的函数，注意，该函数一般要在子类重写
        let yearStr = this.createYearStr();
        let hourStr = this.createHourStr();
        let minuteStr = this.createMinuteStr();
        return temp.minutePicker.replace('$1',yearStr)
                                .replace('$2',this.monthStr)
                                .replace('$3',this.dayStr)
                                .replace('$4',hourStr)
                                .replace('$5',minuteStr);
    }

    public createHourStr(): string {
        // 创建小时
        let hours = [];
        for(let i=0;i<=23;i++){
            hours.push(i);
        }
        let html = '';
        hours.forEach((item,i)=>{
            let hour = item>=10? item: '0'+item;
            html+= `<p class="date-unit" data-hour="${item}">${hour}</p>`;
        });
        return html;
    }

    public createMinuteStr(): string {
        // 创建分钟
        let minutes = [];
        for(let i=0;i<=59;i++){
            minutes.push(i);
        }
        let html = '';
        minutes.forEach((item,i)=>{
            let minute = item>=10? item: '0'+item;
            html+= `<p class="date-unit" data-minute="${item}">${minute}</p>`;
        });
        return html;
    }

    private resolvingString(str: string): Array<any>{
        // 解析日期字符串
        let array = str.split(' ');
        return [].concat(array[0].split(this.params.outFormat),array[1].split(':'));
    }

    public setDefaultView(defaultDate: string){
        if(!defaultDate){
            console.error('Error: 默认日期(defaultDate)不能为空');
            return;
        }
        let dateArray = this.resolvingString(defaultDate)
        console.log('-----------------',dateArray)
        if(!dateArray || dateArray.length<5){
            console.error('Error:默认日期(defaultDate)的格式有误,默认格式:2019-01-01 00:00');
            return;
        }
        
        let $picker = this.currentPicker;
        let $dateUtils = this.selectAll('.date-item',$picker);
        // year
        let yearIndex = this.currentToIndex(parseInt(dateArray[0])-parseInt(this.params.startYear));
        this.setCss($dateUtils[0],{
            'transform':`translateY(${yearIndex*this._height}px)`
        });
        // month
        let monthIndex = this.currentToIndex(parseInt(dateArray[1])-1);

        this.setCss($dateUtils[1],{
            'transform':`translateY(${monthIndex*this._height}px)`
        });

        // day
        let dayIndex = this.currentToIndex(parseInt(dateArray[2])-1);
        this.setCss($dateUtils[2],{
            'transform':`translateY(${dayIndex*this._height}px)`
        });

        // 小时
        let hourIndex = this.currentToIndex(parseInt(dateArray[3]));
        this.setCss($dateUtils[3],{
            'transform':`translateY(${hourIndex*this._height}px)`
        });

        // 分钟
        let minuteIndex = this.currentToIndex(parseInt(dateArray[4]));
        this.setCss($dateUtils[4],{
            'transform':`translateY(${hourIndex*this._height}px)`
        });
        this.defaultInfo = {
            dateArray: dateArray,
            heightArray: [
                yearIndex*this._height,
                monthIndex*this._height,
                dayIndex*this._height,
                hourIndex*this._height,
                minuteIndex*this._height,
            ]
        } ;

    }

    public pickerOperation(){
        // 时间区间选择器的逻辑事件
        let $picker = this.currentPicker;
        let _this = this;
        // 订阅事件，监听选择器的变化
        let selectTime ='';
        this.$on(`onchange_${this.params.key}`,(data)=>{
            // 格式不对，手动转换一下
            let strArray = data.split(this.params.outFormat);
            let str1 = strArray.slice(0,3).join(this.params.outFormat);
            let str2 = strArray.slice(3).join(':');
            selectTime = str1+' '+str2;

        });
        // 确定按钮
        let $sure = this.select('.picker-btn__sure',this.currentPicker);
        if(!$sure){
            let tip = `
            没找到确定按钮,
            请确保class='.picker-btn__sure'的按钮没有被去掉
            `;
            console.error(tip);
            this.errorTip(tip);
            return;
        }
        $sure.addEventListener('click',(e)=>{
            let result = selectTime;
            _this.opt.success(result);
            _this.params.success(result);

            _this.hide();

        });

        // 取消按钮
        let $cancel = this.select('.picker-btn__cancel',this.currentPicker);
        if(!$cancel){
            let tip = `
            没找到取消按钮,
            请确保class='.picker-btn__cancel'的按钮没有被去掉
            `;
            console.error(tip);
            this.errorTip(tip);
            return;
        }

        $cancel.addEventListener('click',(e)=>{
            _this.hide();
        });

        // 点击显示时分选择器
        let $minuteBtn = this.select('.picker-minute-btn',this.currentPicker);
        let $minute = this.select('.date-content-minute');

        if(!$minuteBtn){
            let tip = `
            没找到切换时分选择器按钮,
            请确保class='.picker-minute-btn'的按钮没有被去掉
            `;
            console.error(tip);
            this.errorTip(tip);
            return;
        }

        $minuteBtn.addEventListener('click',(e)=>{
            if(e.target.classList.contains('picker-minute-btn-act')){
                // 关闭
                e.target.classList.remove('picker-minute-btn-act');
                _this.setCss($minute,{
                    'transform':'translateX(100%)'
                })
            }else{
                // 打开
                e.target.classList.add('picker-minute-btn-act');
                _this.setCss($minute,{
                    'transform':'translateX(0)'
                })
            }
        })

    }

    public reView(date: string){
        // 重置选择器距离，date=[开始时间，结束时间]
        let bool = true;
        let _this = this;
        let strArray = this.resolvingString(date);
        bool = strArray.length<5? false: true;
        if(!bool){
            console.error('Error: reView方法传入的参数数组格式不对(格式:2019-01-01 00:00)');
            return;
        }
        this.setDefaultView(date);
        this.$emit(`onchange_${this.params.key}`,date);
    } 
} 