// import "babel-polyfill";
import polyfill from  './polyfill'; 
polyfill();  
import Utils from './utils';
import BasePicker from './basePicker';
import RangePicker from './rangePicker';
import SinglePicker from './singlePicker';
import MinutePicker from './minutePicker';


interface globalOpt {
    maxKeyCount?: number,
    onchange?: Function,
    success?: Function
}
 
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

class DatePicker extends Utils{
    constructor(){super()}
    private _opt: globalOpt = {};
    private _params: object = {}; //初始化配置
    private _key: number = 1; //唯一key
    private _keyList: Array<number> = []; //key列表
    private _pickerList: Array<any> = []; //保存创建的picker对象

    get opt(): globalOpt {
        return this._opt;
    }

    set opt(val: globalOpt) {
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

    get keyList(): any{
        return this._keyList;
    }

    set keyList(val: any){
        this._keyList = val;
    }

    get pickerList(): any{
        return this._pickerList;
    }

    set pickerList(val: any){
        this._pickerList = val;
    } 


    // 辅助变量
    private _maxKeyCount :number = 10; //可创建选择器的最大数量

    public globalOptions(opt?: globalOpt){
        this.opt = this.assign({
            maxKeyCount: this._maxKeyCount,
            onchange: ()=>{},
            success: ()=>{}
        },opt);

        this.opt.maxKeyCount = this.opt.maxKeyCount > 0 && this.opt.maxKeyCount<=20
                                ? this.opt.maxKeyCount
                                : this._maxKeyCount;
    }

    public picker(params?: pickers){
        console.log('params',params.type)
        let defaultDate = params.type == 'minute'? this.getToday('-')+' 00:00': this.getToday('-');
        console.log('defaultDate',defaultDate)
        this.params = this.assign({ 
            startYear: '1990',
            endYear: '2030',
            defaultDate: defaultDate,
            key: this.key,
            outFormat: '-',
            onchange: ()=>{},
            success: ()=>{},
            type: 'range'
        },params);

        // 保存key值，如果列表的key值过多，禁止创建
        if(!this.keyList.includes(this.params.key)){

            this.keyList.push(this.params.key);
            this.key+=1;
           
            let picker = this.render(); 
            picker.picker(this.params);//初始化
            this.pickerList.push({
                key: this.params.key,
                picker: picker
            });

        }
        if(this.keyList.length>this.opt.maxKeyCount){
            let tip = `
            Error:检测到页面上创建的选择器过多!
            请检查代码是否有问题
            请不要在循环或者事件中重复调用.picker()方法
            若非要如此调用，一定要加上key属性
            建议在外面调用.picker()方法，在里面调用.show()方法显示
            `;
            console.error(tip);
            this.errorTip(tip); 
            return;
        }

        let picker = this.pickerList.find(item=>item.key==this.params.key);
        
        if(!picker){
            let tip = `
            Error:找不到该key(${this.params.key})的选择器,
            请检查代码是否有问题
            `;
            console.error(tip);
            this.errorTip(tip);
            return;
        }

        return picker.picker; 

    }

    private render(){
        let picker = null;
        switch (this.params.type) {
            case 'range':
                picker = new RangePicker(this.opt);
                break;
            
            case 'single':
                picker = new SinglePicker(this.opt);
                break;
            case 'minute':
                picker = new MinutePicker(this.opt);
                break;
        
            default:
                break;
        }
        return picker;
    }

}

const datePicker = new DatePicker();

export default datePicker;