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

let picker2 = datePicker.picker({
    onchange:(data)=>{
        console.log('onchange',data);
    }
});

document.querySelectorAll('.picker')[0].addEventListener('click',()=>{

    picker1.show();
})

document.querySelectorAll('.picker')[1].addEventListener('click',()=>{

    picker2.show(); 
})
