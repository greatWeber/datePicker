// 时间选择器核心代码

import Utils from './utils';

import * as temp from './template';
import Touchs from './touch';

// picker参数接口
interface pickers {
        startYear?: string;
        endYear?: string;
        defaultDate?: string;
        key?: number;
        outFormat ?: string;
        onchange?: Function; 
        success?: Function;
        type?: string; //选择器类型：single, range, 

}

export default class BasePicker extends Utils {
    private _opt: object = {}; //全局配置
    private _params: object = {}; //初始化配置
    private _key: number = 1; //唯一key

    private _monthStr: string = ''; //月份字符串
    private _dayStr: string = ''; //天数字符串

    private _currentPicker: any = null; //保存当前显示的选择器

    private _currentIndexs: Array<number> = [];//保存当前选择的格子索引

    private _currentValue: Array<number|string> = []; //保存当前选择的值

    private _mask: any = null; //保存唯一的遮罩

    get opt(): any{
        return this._opt;
    }

    set opt(val: any){
        this._opt = val;
    }

    get params(): pickers{
        return this._params;
    }

    set params(val: pickers){
        this._params = val;
    }

    get key(): number{
        return this._key;
    }

    set key(val: number){
        this._key = val;
    }

    get monthStr(): string{
        return this._monthStr;
    }

    set monthStr(val: string){
        this._monthStr = val;
    }

    get dayStr(): string{
        return this._dayStr;
    }

    set dayStr(val: string){
        this._dayStr = val;
    }

    get currentPicker(): any{
        return this._currentPicker;
    }

    set currentPicker(val: any){
        this._currentPicker = val;
    }

    get currentIndexs(): any{
        return this._currentIndexs;
    }

    set currentIndexs(val: any){
        this._currentIndexs = val;
    }

    get currentValue(): any{
        return this._currentValue;
    }

    set currentValue(val: any){
        this._currentValue = val;
    }

    get mask(): any{
        return this._mask;
    }

    set mask(val: any){
        this._mask = val;
    }

    // 辅助类变量
    private _height :number = 0; //选择器格子的高度
    

    constructor(options?: object){  
        super();  
        this.opt = this.assign({
            onchange: ()=>{},
            success: ()=>{}
        },options);


        this.monthStr = this.createMonthStr();
        this.dayStr = this.createDayStr();
    }

    

    

    public picker(params?: pickers){
        this.params = this.assign({ 
            startYear: '1990',
            endYear: '2030',
            defaultDate: this.getToday('-'),
            key: this.key,
            outFormat: '-',
            onchange: ()=>{},
            success: ()=>{},
            type: 'range'
        },params);

        
        this.render();

    }

    public render(){ 
        // 渲染函数，一般要在子类重写
        this.createMask();
        this.createPicker();
        
    }

    public createMask(){
        // 创建蒙版
        let maskName = `picker-mask`;
        let $mask = this.select(`.${maskName}`);
        let _this = this;
        if(!$mask){
            $mask = this.createElm(document.body,'div',maskName);
            this.setCss($mask,{
                'transition': '0.3s all linear',
                'opacity': '0',
                'display': 'none'
            });

        }

        this.mask = $mask;
    }

    public createPicker(){ 
        // 创建选择器

        let pickerName = `picker-key-${this.params.key}`;
        let $picker = this.select(`.${pickerName}`);
        let $pickerWrapper = this.select(`.${pickerName} .picker-wrapper`);
        let _this = this;
        
        if(!$picker){
            
            let pickerHtml = this.renderHtml();
            // console.log('picker',pickerHtml);
            $picker = this.createElm(document.body,'div',pickerName);
            $picker.innerHTML = pickerHtml;
            $pickerWrapper = this.select(`.${pickerName} .picker-wrapper`);
            this.setCss($pickerWrapper,{
                'transition': '0.3s all linear',
                'transform': 'translateY(100%)'
            });
            if(!_this._height){
                _this._height = _this.select('.date-unit',$picker).clientHeight;
            }
            this.currentPicker = $picker || {}; //保存当前的选择器
            this.currentPicker.years = this.getYearArray();
            let defaultInfo = this.setDefaultView(); //设置默认日期的视图
            this.bindEvents(defaultInfo);
            this.rangeOperation();
        }

        // 添加显示状态
        $picker.classList.add('__picker-type-show');
        this.currentPicker = $picker || {}; //保存当前的选择器
        this.currentPicker.years = this.getYearArray();
    }

    public renderHtml(): string{
        // 获取html样式的函数，注意，该函数一般要在子类重写
        let yearStr = this.createYearStr();
        return temp.picker.replace('$1',yearStr)
                            .replace('$2',this.monthStr)
                            .replace('$3',this.dayStr);
    }

    public getYearArray(): Array<number>{
        let years = [];
        let startYear: any =  this.params.startYear;
        let endYear: any = this.params.endYear;
        for(let i=startYear-0;i<=endYear-0;i++){
            years.push(i);
        }
        return years;
    }

    public createYearStr(): string{
        // 创建年
        let years = [];
        let startYear: any =  this.params.startYear;
        let endYear: any = this.params.endYear;
        for(let i=startYear-0;i<=endYear-0;i++){
            years.push(i);
        }
        let html = '';
        years.forEach((item,i)=>{
            html+= `<p class="date-unit" data-year="${item}">${item}年</p>`;
        });
        // console.log('year',html);
        return html;
    }

    public createMonthStr(): string {
        // 创建月
        let months = [];
        for(let i=1;i<=12;i++){
            months.push(i);
        }
        let html = '';
        months.forEach((item,i)=>{
            let month = item>=10? item: '0'+item;
            html+= `<p class="date-unit" data-month="${item}">${month}月</p>`;
        });
        // console.log('month',html);
        return html;
    }

    public createDayStr(): string {
        // 创建day
        let days = [];
        for(let i=1;i<=31;i++){
            days.push(i);
        }
        let html = '';
        days.forEach((item,i)=>{
            let day = item>=10? item: '0'+item;
            html+= `<p class="date-unit" data-day="${item}">${day}日</p>`;
        });
        // console.log('day',html);
        return html;
    }

    public setDefaultView(){
        if(!this.params.defaultDate){
            console.error('Error: 默认日期(defaultDate)不能为空');
            return;
        }
        let dateArray = this.params.defaultDate.split('-');
        if(!dateArray || dateArray.length<3){
            console.error('Error:默认日期(defaultDate)的格式有误,默认格式:2019-01-01 or 2019-1-1');
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

        // month
        let dayIndex = this.currentToIndex(parseInt(dateArray[2])-1);
        this.setCss($dateUtils[2],{
            'transform':`translateY(${dayIndex*this._height}px)`
        });
        return{
            dateArray: dateArray,
            heightArray: [yearIndex*this._height,monthIndex*this._height,dayIndex*this._height]
        } ;

    }

    public bindEvents(defaultInfo: any){
        if(!this.currentPicker){
            console.error('Error: 选择器还没有渲染');
            return;
        }



        let $dateGroups = this.selectAll('.date-group',this.currentPicker);
        let _this = this;
        Array.prototype.slice.call($dateGroups).forEach((dateGroup,i)=>{
            let $dateUtils = _this.select('.date-item',dateGroup);
            
            _this.setCss($dateUtils,{
                'transition':'0.1s all linear' 
            });   
            // 注意：EndY的值不应该为0，而是调用默认视图函数后的距离
            let EndY: number = defaultInfo.heightArray[i];

            let touchs = new Touchs(dateGroup);
            touchs.init({
                startCb: (e: any, range: number)=>{
                    _this.touchStart(e,$dateUtils);
                },
                moveCb: (e: any, range: number)=>{
                    _this.touchMove(e,range,EndY,$dateUtils); 
                },
                endCb: (e:any, endY: number)=>{
                    EndY = _this.touchEnd(e,endY,EndY, $dateUtils,i,defaultInfo.dateArray);
                    console.log('touchEnd',EndY) 
                }
            })
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

        this.mask.addEventListener('click',this.hide.bind(_this));

    }

    private touchStart(e: any, target: any){
        console.log('start');
        this.setCss(target,{
            'transition':'.3s all linear',
        });
    }

    private touchMove(e: any, range: number, EndY: number, target: any){
        this.setCss(target,{
            'transform': `translateY(${EndY+range*1}px)`
        });
    }

    private touchEnd(e: any, endY: number, EndY: number, target: any, Index: number, dateArray: Array<any>){
        EndY = EndY+endY;
        let min = EndY >0?Math.floor(EndY / this._height): Math.ceil(EndY / this._height);
        let max = EndY >0? min+1: min-1;
        let middle = (max+min)/2*this._height;
        let current = 0;
        this.currentValue = dateArray;
        // console.log('min',min);
        // console.log('middle',middle);
        // console.log('EndY', EndY);
        if(Math.abs(EndY)>=Math.abs(middle)){
            EndY = max*this._height;
            current = max;
        }else{
            EndY = min*this._height;
            current = min;
        }
        // 关于格子的数量
        // 只有年和日是变化的，月份都是固定的(12)
        var counts = 0;
        switch (Index) {
            case 0: //年
                counts = this.currentPicker.years.length;
                break;
            case 1: //月
                counts = 12;
                break;
            case 2: //日
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
        if(EndY>1*this._height){
            EndY = 1*this._height;
            current = 1;
        }else if(Math.abs(EndY)>Math.abs(-(counts-2)*this._height)){
            EndY = -(counts-2)*this._height;
            current = -(counts-2);
        }
        this.currentIndexs[Index] = current; //保存当前的格子索引
        let arrayIndex = this.currentToIndex(current); //把格子索引转成数组索引
        if(Index==0){
            // 只有年需要从数组中读取值
            this.currentValue[Index] = this.currentPicker.years[arrayIndex];
        }else{
            this.currentValue[Index] = arrayIndex+1>=10?arrayIndex+1:'0'+(arrayIndex+1);
        }
        this.setCss(target,{
            'transition':'.3s all linear',
            'transform': `translateY(${EndY}px)`
        });

        // 调用onchange回调
        this.opt.onchange(this.currentValue);
        this.params.onchange(this.currentValue);
        this.$emit(`onchange_${this.params.key}`,this.currentValue, Index);
        return EndY;
    }

    public getDay(){
        // 获取当月的天数
        let _this = this;
        let days = new Date(this.currentValue[0],this.currentValue[1],0).getDate();
        console.log('days',days);
        let $untis = this.selectAll('[data-day]',this.currentPicker);
        const fade = (index,opacity)=>{
            for(var i = 30; i>=index;i--){
                _this.setCss($untis[i],{
                    'opacity': opacity
                })
            }
        }
        switch (days) {
            case 30:
                fade(30,'0');
                break;

            case 28:
                fade(28,'0');
                break;

            case 31:
                fade(28,'1');
                break;
        
            default:
                break;
        }
        return days;
    }

    public currentToIndex(current: number){
        // 逻辑：
        // 根据页面布局，得来第一个格子是正数，其他的距离都是负数
        // 所以可以通过(1-current)来获取当前格子数组的索引
        return 1-current;
    }

    public hide(){
        let _this = this;
        // 关闭遮罩
        this.setCss(this.mask,{
            'opacity':'0'
        });
        this.sleep(()=>{
            _this.setCss(_this.mask,{
                'display':'none'
            });
        },300);
        // 关闭选择器
        let $pickerWrapper = this.select(`.picker-wrapper`,this.currentPicker);
        this.setCss($pickerWrapper,{
            'transform':'translateY(100%)'
        });
        this.currentPicker.classList.remove('__picker-type-show');
        this.currentPicker.classList.add('__picker-type-hide');
    }

    public show(){

        this.setCss(this.mask,{
            'opacity': '1',
            'display': 'block'
        })

        let $picker = this.currentPicker;
        
        if(!$picker){
            let tip = `
            没有该key(${this.params.key})值的选择器
            请检查是否写错!
            `;
            console.error(tip);
            this.errorTip(tip);
            return;
        }
        let $pickerWrapper = this.select(`.picker-wrapper`,$picker);
        this.setCss($pickerWrapper,{
            'transform':'translateY(0px)'
        });

        $picker.classList.remove('__picker-type-hide');
        $picker.classList.remove('__picker-type-show');

    }

    public rangeOperation(){
        // 时间区间选择器的逻辑事件
        let $picker = this.currentPicker;
        let $rangeChilds = this.selectAll('.range-child',$picker);
        let currentIndex = 0;
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
                currentIndex = i;
            })
        });

        // 订阅事件，监听选择器的变化，修改开始和结束的时间显示
        let startTime ='', endTime = '';
        this.$on(`onchange_${this.params.key}`,(data)=>{
            let currentDate = data.join(_this.params.outFormat);
            $rangeChilds[currentIndex].innerHTML = currentDate;
            if(currentIndex==0){
                // 开始日期
                startTime = currentDate; 
            }else{
                endTime = currentDate;
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
}