// 范围选择器核心代码
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
        return temp.rangePicker.replace('$1',yearStr)
                            .replace('$2',this.monthStr)
                            .replace('$3',this.dayStr);
    }

    public pickerOperation(){
        // 时间区间选择器的逻辑事件
        let $picker = this.currentPicker;
        let $rangeChilds = this.selectAll('.range-child',$picker);
        let _this = this;
        Array.prototype.slice.call($rangeChilds).forEach((rangeChild,i)=>{
            console.log('rangeChild',rangeChild);
            rangeChild.addEventListener('click',(e)=>{
                console.log(e)
                if(e.target.classList.contains('range-act'))return;
                Array.prototype.slice.call($rangeChilds).forEach(item => {

                    item.classList.remove('range-act')
                });

                e.target.classList.add('range-act');
                _this.currentIndex = i;
            })
        });

        // 订阅事件，监听选择器的变化，修改开始和结束的时间显示
        let startTime ='', endTime = '';
        this.$on(`onchange_${this.params.key}`,(data)=>{
            if(typeof data === 'string'){

                $rangeChilds[_this.currentIndex].innerHTML = data;
                if(_this.currentIndex==0){
                    // 开始日期
                    startTime = data; 
                }else{
                    endTime = data;
                }
            }

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
            if(new Date(endTime).getTime()<new Date(startTime).getTime()){
                let tip = `开始日期不能大于结束日期`;
                this.errorTip(tip);
                return;
            }
            let result = {
                startTime,
                endTime
            }
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

    public reView(date: Array<string>){
        this.setDefaultView(date[this.currentIndex]);
        this.$emit(`onchange_${this.params.key}`,this.defaultInfo.dateArray);
    } 
}