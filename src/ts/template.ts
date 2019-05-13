// 模板字符串

export const mask = `
<div class="picker-mask"></div>
`;

export const range = `
<div class="picker-range">
    <p class="range-child start-time range-act">开始日期</p>
    <span>至</span>
    <p class="range-child end-time">结束日期</p>
</div>
`;


export const rangePicker = `
<div class="picker-wrapper picker-type__range">
    <div class="picker-head flex space-between">
        <span class="cancel picker-btn__cancel">取消</span>
        <span class="sure picker-btn__sure">确定</span>
    </div>
    <div class="picker-body">
        ${range}

        <div class="date-content flex">

            <div class="date-group flex-item">
                    <div class="content-mask mask-top"></div>
                    <div class="content-mask mask-bottom"></div>
                    <div class="date-item ">
                        $1
                    </div>
            </div>
            <div class="date-group flex-item">
                <div class="content-mask mask-top"></div>
                <div class="content-mask mask-bottom"></div>
                <div class="date-item">
                    $2
                </div>
            </div>
            <div class="date-group flex-item">
                <div class="content-mask mask-top"></div>
                <div class="content-mask mask-bottom"></div>
                <div class="date-item">
                    $3
                </div>
            </div>
        </div>

    </div>
</div>
`;

export const singlePicker = `
<div class="picker-wrapper picker-type__single">
    <div class="picker-head flex space-between">
        <span class="cancel picker-btn__cancel">取消</span>
        <span class="sure picker-btn__sure">确定</span>
    </div>
    <div class="picker-body">
        <div class="date-content flex">

            <div class="date-group flex-item">
                    <div class="content-mask mask-top"></div>
                    <div class="content-mask mask-bottom"></div>
                    <div class="date-item ">
                        $1
                    </div>
            </div>
            <div class="date-group flex-item">
                <div class="content-mask mask-top"></div>
                <div class="content-mask mask-bottom"></div>
                <div class="date-item">
                    $2
                </div>
            </div>
            <div class="date-group flex-item">
                <div class="content-mask mask-top"></div>
                <div class="content-mask mask-bottom"></div>
                <div class="date-item">
                    $3
                </div>
            </div>
        </div>

    </div>
</div>
`;

export const minutePicker = `
<div class="picker-wrapper picker-type__minute">
    <div class="picker-head flex space-between">
        <span class="cancel picker-btn__cancel">取消</span>
        <span class="sure picker-btn__sure">确定</span>
    </div>
    <div class="picker-body">
        <div class="date-content flex">

            <div class="date-group flex-item">
                    <div class="content-mask mask-top"></div>
                    <div class="content-mask mask-bottom"></div>
                    <div class="date-item ">
                        $1
                    </div>
            </div>
            <div class="date-group flex-item">
                <div class="content-mask mask-top"></div>
                <div class="content-mask mask-bottom"></div>
                <div class="date-item">
                    $2
                </div>
            </div>
            <div class="date-group flex-item">
                <div class="content-mask mask-top"></div>
                <div class="content-mask mask-bottom"></div>
                <div class="date-item">
                    $3
                </div>
            </div>
        </div>

        <span class="picker-minute-btn"></span>
        <div class="date-content date-content-minute flex">
            
            <div class="date-group flex-item">
                    <div class="content-mask mask-top"></div>
                    <div class="content-mask mask-bottom"></div>
                    <div class="date-item ">
                        $4
                    </div>
            </div>
            <div class="date-group flex-item">
                <div class="content-mask mask-top"></div>
                <div class="content-mask mask-bottom"></div>
                <div class="date-item">
                    $5
                </div>
            </div>
        </div>

    </div>
</div>
`

