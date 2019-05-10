import datePicker from './datePicker';

datePicker.globalOptions({
    success: (data)=>{
        console.log(data);
    }
})
let picker1 = datePicker.picker({
    onchange:(data)=>{
        console.log('onchange',data);
    }
});
console.log('-----------------------')
let picker2 = datePicker.picker({
    onchange:(data)=>{
        console.log('onchange',data);
    }
});

document.getElementsByClassName('picker')[0].addEventListener('click',()=>{
    console.log('click')
    picker1.show();
})

document.getElementsByClassName('picker')[1].addEventListener('click',()=>{

    picker2.show(); 
})
