// 单个选择器核心代码
import * as temp from './template';
import BasePicker from './basePicker';

export default class RangePicker extends BasePicker {
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
        return temp.singlePicker.replace('$1',yearStr)
                            .replace('$2',this.monthStr)
                            .replace('$3',this.dayStr);
    }

    public pickerOperation(){
        // 时间区间选择器的逻辑事件
        let $picker = this.currentPicker;
        let _this = this;
        // 订阅事件，监听选择器的变化
        let selectTime ='';
        this.$on(`onchange_${this.params.key}`,(data)=>{
            selectTime = data;

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
        })

    }

    public reView(date: string){
        // 重置选择器距离，date=[开始时间，结束时间]
        let bool = true;
        let _this = this;
        let strArray = date.split(_this.params.outFormat);
        bool = strArray.length<3? false: true;
        if(!bool){
            console.error('Error: reView方法传入的参数字符格式不对');
            return;
        }
        this.setDefaultView(date[this.currentIndex]);
        this.$emit(`onchange_${this.params.key}`,date);
    } 
}