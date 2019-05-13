// import { resolve } from "any-promise";
import Utils from './utils';
export default class Touchs extends Utils {
    private _target: any;
    private _startY: number;
    private _endY: number;
    private _range: number;

    // 辅助类参数
    private bool: boolean = true;
    private limit: number = 0; //限流
    private _startTime: number = 0;
    private _endTime: number =0;
    private _supportTouch: boolean = "ontouchend" in document; //判断浏览器是否支持touch
    private _touchName: any = {};
    private _startCb: Function = null;
    private _moveCb: Function = null;
    private _endCb: Function = null;
    private _touchStartHander: any = null;
    private _touchMoveHander: any = null;
    private _touchEndHander: any = null;

    constructor(target: any){
        super();
        console.log('init')
        this._target = target;
        this.touchName = {
            start: this._supportTouch? 'touchstart':'mousedown',
            move: this._supportTouch? 'touchmove':'mousemove',
            end: this._supportTouch? 'touchend':'mouseup',
        }
    }

    get target(): any{
        if(this._target){
            return this._target
        }else{
            console.error('Error: 没有找到target对象');
            return null
        }
    }

    get startY(): number{
        return this._startY;
    }

    set startY(val: number){
        this._startY = val;
    }

    
    get endY(): number{
        return this._endY; 
    }
    
    set endY(val: number) {
        this._endY = val;
    }

    get range(): number {
        return this._range;
    }

    set range(val: number){
        this._range = val;
    }

    get touchName(): any {
        return this._touchName;
    }

    set touchName(val: any){
        this._touchName = val;
    }

    public init(params?: any){
        this._startCb = params.startCb;
        this._moveCb = params.moveCb;
        this._endCb = params.endCb;

        this.touchStart();
    }

    private binds(obj,fn){
        return (e)=>{
            // console.log('arg',e); 
            arguments[0] = e;
            fn.apply(obj, arguments);
        }
    }

    private touchStart(){
        // touchstart:
        // 1. 给target绑定touch事件
        console.log(this.target)  
        let _this = this;
        this._touchStartHander = this.binds(this,this.touchStartHander);
        this._touchMoveHander = this.binds(this,this.touchMoveHander);
        this._touchEndHander = this.binds(this,this.touchEndHander);
        _this.target.addEventListener(this.touchName.start,this._touchStartHander,false);
        
    }

    private touchStartHander(){
        let e = arguments[0]
        this.startY = this._supportTouch?e.touches[0].pageY: e.pageY;
        this._startTime = new Date().getTime();
        this._startCb(e);
        this.target.addEventListener(this.touchName.move,this._touchMoveHander,false);
        this.target.addEventListener(this.touchName.end,this._touchEndHander,false);
        this.target.addEventListener('touchcancel',this._touchEndHander,false);
    }
 

    private touchMoveHander(){
        let e = arguments[0];
        e.stopPropagation();
        e.preventDefault();
        // 限流-start
        this.limit++;
        if(this.limit>=5){
            this.limit = 0;
            this.bool = true;
        }
        if(!this.bool)return;
        this.bool = false;
        // 限流-end
        let pageY = this._supportTouch?e.touches[0].pageY: e.pageY;
        this.range = pageY - this._startY;
        this._moveCb(e,this.range);
    }


    private touchEndHander(){ 
        let e = arguments[0];
        let _this = this;
        // this.target.removeEventListener(this.touchName.start,_this._touchStartHander,false);
        this.target.removeEventListener(this.touchName.move,this._touchMoveHander,false);
        this.target.removeEventListener(this.touchName.end,this._touchEndHander,false);
        this.target.removeEventListener('touchcancel',this._touchEndHander,false);
        
        this.endY = this.range || 0; 
        // 随流效果
        this._endTime = new Date().getTime();
        let rangeTime = (this._endTime - this._startTime)/1000;//单位: 秒
        if(this.endY!==0){

            let space = Math.floor(Math.abs(this.endY)/(rangeTime*3));
            this.endY = this.endY>0? this.endY+space: this.endY-space;

        }
        
        this._endCb(e, this.endY);
    }
}