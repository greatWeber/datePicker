// 时间选择器核心代码

import Utils from './utils';

import * as temp from './template';

// picker参数接口
interface pickers {
        startYear?: string;
        endYear?: string;
        defaultDate?: string;
        key?: string|number;
        outFormat ?: string;
        onchange?: Function;
        success?: Function;
        type?: string; //选择器类型：single, range, 

}

class DatePicker extends Utils {
    private _opt: object = {}; //全局配置
    private _params: object = {}; //初始化配置
    private _key: string|number = 1; //唯一key

    get opt(): object{
        return this._opt;
    }

    set opt(val: object){
        this._opt = val;
    }

    get params(): object{
        return this._params;
    }

    set params(val: object){
        this._params = val;
    }

    get key(): string|number{
        return this._key;
    }

    set key(val: string|number){
        this._key = val;
    }

    // 辅助类变量

    constructor(options: object){
        super();
        this.opt = Object.assign({
            onchange: ()=>{},
            success: ()=>{}
        },options)
    }

    

    

    public picker(params: pickers){
        this.params = Object.assign({
            startYear: '1990',
            endYear: '2030',
            defaultDate: '2019-05-07',
            key: this.key,
            outFormat: '-',
            onchange: ()=>{},
            success: ()=>{},
            type: 'range'
        },params)
    }

}