// 工具类
export default class Utils {
    constructor(){}

    public select(elm: string){
        return document.querySelector(elm);
    }

    public selectAll(elm: string){
        return document.querySelectorAll(elm);
    }


}

