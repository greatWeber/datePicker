import datePicker from './datePicker';

datePicker.globalOptions({
    success: (data)=>{
        console.log(data);
    }
})
let picker1 = datePicker.picker({
    onchange:(data)=>{
        console.log('onchange',data);
    },
    success: (data)=>{
        picker1.reView(['2019-01-01','2020-01-01']);
    }
});

let picker2 = datePicker.picker({
    type: 'single',
    onchange:(data)=>{
        console.log('onchange',data);
    }
});

let picker3 = datePicker.picker({
    type: 'minute',
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

document.getElementsByClassName('picker')[2].addEventListener('click',()=>{

    picker3.show(); 
})
