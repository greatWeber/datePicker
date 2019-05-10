// 工具类
export default class Utils {
    private _eventLists: object = {};
    constructor(){}

    public select(elm: string, target?: any){
        if(target){
            return target.querySelector(elm);
        }
        return document.querySelector(elm);
    }

    public selectAll(elm: string, target?: any){
        if(target){
            return target.querySelectorAll(elm);
        }
        return document.querySelectorAll(elm);
    }

    public createElm(target: any, label: string, className?: string){
        // 创建元素
        const $elm = document.createElement(label);
        $elm.classList.add(className);
        target.appendChild($elm);
        return $elm;
    }

    public setCss(target: any, css: object){
        // 设置css样式
        for(let attr in css){
            target.style[attr] = css[attr];
        }
    }

    public sleep(cb: Function, timeout: number){
        // 延迟
        setTimeout(cb, timeout);
    }

    public getToday(format: string): string{
        // 获取今天的日期: 2019-01-01
        let date = new Date();
        let year = date.getFullYear();
        let month: any = date.getMonth()+1;
        let day: any = date.getDate();
        month = month>=10? month: '0'+month;
        day = day>=10? day: '0'+day;
        return [year,month,day].join(format);
    }

    public $on(eventName: string, fn: Function){
        // 订阅事件
        if(this._eventLists[eventName]){
            this._eventLists[eventName].push(fn);
        }else{
            this._eventLists[eventName] = [fn];
            console.log('eventLists',this._eventLists[eventName]);
        }
    }

    public $emit(eventName: string, ...args){
        // 触发事件
        if(this._eventLists[eventName]){
            this._eventLists[eventName].forEach((fn,i)=>{
                fn(...args);
            })
        }
    }

    public assign(extended,options){
        for (let property in options) {
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
    public Tip(tipName: string, msg: string, timeout?: number){
        let $tip = this.select(tipName);
        let _this = this;
        if(!$tip){
            $tip = this.createElm(document.body,'div',tipName);
        }

        $tip.innerHTML = msg;

        this.setCss($tip,{
            'display':'block',
            'opacity': '1'
        });

        this.sleep(()=>{
            _this.setCss($tip,{
                'opacity': '0'
            })
        },timeout|| 2000)

        this.sleep(()=>{
            _this.setCss($tip,{
                'display': 'none'
            })
        },(timeout|| 1000)+300)
    }

    
    public errorTip(msg: string, timeout?: number){
        let tipName = 'datePicker-errorTip';
        this.Tip(tipName, msg, timeout);

    }

    public successTip(msg: string, timeout?: number){
        let tipName = 'datePicker-successTip';
        this.Tip(tipName, msg, timeout);

    }


}

