import DatePicker from './datePicker';

const datePicker1 = new DatePicker();

let picker1 = datePicker1.picker({
    onchange:(data)=>{
        console.log('onchange',data);
    }
});

let picker2 = datePicker1.picker({
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
