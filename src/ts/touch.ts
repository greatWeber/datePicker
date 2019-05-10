import { resolve } from "any-promise";

export default class Touchs {
    private _target: any;
    private _startY: number;
    private _endY: number;
    private _range: number;

    // 辅助类参数
    private bool: boolean = true;
    private limit: number = 0; //限流
    private _startTime: number = 0;
    private _endTime: number =0;

    constructor(target: any){
        console.log('init')
        this._target = target;
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


    public touchStart(cb: Function){
        // touchstart:
        // 1. 给target绑定touch事件
        console.log(this.target)  
        let _this = this;
        _this.target.addEventListener('touchstart',(e: any)=>{
            _this.touchStartHander(e,cb);
        },false)
    }

    private touchStartHander(e: any, cb: Function){
        this.startY = e.touches[0].pageY;
        this._startTime = new Date().getTime();
        console.log(this.startY);
        cb(e);
    }

    public touchMove(cb: Function){
        // touchmove
        let _this = this;
        _this.target.addEventListener('touchmove',(e: any)=>{
            e.stopPropagation();
            e.preventDefault();
            _this.touchMoveHander(e,cb);
        },false)
    }

    private touchMoveHander(e: any, cb: Function){
        // 限流-start
        this.limit++;
        if(this.limit>=5){
            this.limit = 0;
            this.bool = true;
        }
        if(!this.bool)return;
        this.bool = false;
        // 限流-end
        
        this.range = e.touches[0].pageY - this._startY;
        cb(e,this.range);
    }

    public touchEnd(cb: Function){
        // touchend
        let _this = this;
        _this.target.addEventListener('touchend',(e: any)=>{
            _this.touchEndHander(e,cb);
        },false);

        _this.target.addEventListener('touchcancel',(e: any)=>{
            _this.touchEndHander(e,cb);
        },false);

    }

    private touchEndHander(e: any, cb: Function){
        this.target.removeEventListener('touchstart',this.touchStartHander,false);
        this.target.removeEventListener('touchmove',this.touchMoveHander,false);
        this.target.removeEventListener('touchend',this.touchEndHander,false);
        this.target.removeEventListener('touchcancel',this.touchEndHander,false);
        
        console.log('-----------------range',this.range);
        this.endY = this.range || 0; 
        // 随流效果
        this._endTime = new Date().getTime();
        let rangeTime = (this._endTime - this._startTime)/1000;//单位: 秒
        console.log('rangeTime',rangeTime);
        if(this.endY!==0){

            let space = Math.floor(Math.abs(this.endY)/(rangeTime*10));
            console.log('space',space,this.endY);
            this.endY = this.endY>0? this.endY+space: this.endY-space;

        }
        cb(e, this.endY);
    }
}