import DatePicker from './datePicker';

const datePicker = new DatePicker();

datePicker.picker({
    onchange:(data)=>{
        console.log('onchange',data);
    }
});