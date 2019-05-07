import Touchs from '../src/ts/touch';

let dateGroup = document.querySelectorAll('.date-group');

let dateUtils = dateGroup[0].querySelectorAll('.date-item');
 

let height = dateUtils[0].querySelectorAll('.date-unit')[0].clientHeight;

const touchs = new Touchs(dateGroup[0]);

let EndY = 0;

console.log('height',height)


const setCss = (target: any , css: object) => { 
    for(let attr in css){
        target.style[attr] = css[attr];
    }
} 

setCss(dateUtils[0],{
    'transition': '.3s all linear'
});



touchs.touchStart(()=>{
    // console.log('start');
})
touchs.touchMove((e: any, range: number)=>{
    // console.log('move',range);  
    // console.log('EndY',EndY);  
    // console.log('translateY',EndY+range*1);
    setCss(dateUtils[0],{
        'transform': `translateY(${EndY+range*1}px)`
    });
})

touchs.touchEnd((e: any, endY: number)=>{
    // console.log('end',endY); 
    EndY = EndY+endY;
    let min = EndY >0?Math.floor(EndY / height): Math.ceil(EndY / height);
    let max = EndY >0? min+1: min-1;
    let middle = (max+min)/2*height;
    let current = 0;
    console.log('min',min);
    console.log('middle',middle);
    console.log('EndY', EndY);
    if(Math.abs(EndY)>=Math.abs(middle)){
        EndY = max*height;
        current = max;
    }else{
        EndY = min*height;
        current = min;
    }
    // 逻辑：
    // 根据页面个结构，每个选择器只显示3个格子，所以中心的是2
    // 那么头部不能超过的距离是 1*height
    // 底部不能超过的距离是-(格子数量-2)*height
    if(EndY>1*height){
        EndY = 1*height;
        current = 1;
    }else if(Math.abs(EndY)>Math.abs(-(4-2)*height)){
        EndY = -(4-2)*height;
        current = -(4-2);
    }
    setCss(dateUtils[0],{
        'transform': `translateY(${EndY}px)`
    });
    let Index = getCurrentIndex(current);
    console.log('Index',Index);
})

const getCurrentIndex = (current: number) => {
    console.log('current',current);
    // 逻辑：
    // 根据页面布局，得来第一个格子是正数，其他的距离都是负数
    // 所以可以通过(1-current)来获取当前格子的索引
    return 1-current;
}
