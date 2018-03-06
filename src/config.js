import $ from 'zepto'
const host = window.location.host
console.log()
export let API = 'https://www.gc0606ewirjzdxl.com/'
if (
    host == 'www.gch5.com' ||
    host == 'www.gch5.com:3000' ||
    host == 'wang.gch5.com:3000' ||
    host == 'gc.yunweih5.dev' ||
    host == 'wang.yunweih5.com' ||
    host == 'gc.h5.dev' ||
    host == 'wang.h5.com' ||
    host == 'wang.gcwap.com:3000' ||
    host == 'wang.gcwap.com' ||
    host == 'yunweih5.guocaiapi.com:3000' ||
    host == 'yunweih5.guocaiapi.com'
) {
    API = 'http://www.gc360.com/'
    // API = 'http://xjpuserapigctest.guocaiapi.com/'
} else if (
    host == 'www.sch5.com' ||
    host == 'www.sch5.com:3000' ||
    host == 'sc.h5.dev:3000' ||
    host == 'sc.yunweih5.dev' ||
    host == 'sc.yunweih5.dev:3000'
) {
    API = 'http://www.sc360.com/'
} else if(host == 'gch5.guocaiapi.com' || host == 'www.803645.com') {
    API = 'http://xjpuserapigctest.guocaiapi.com/'
}else if(host == 'www.yunweih5.com' || host == 'www.h5.com') {
    API = 'http://userapi.gc360.com/'
} else {
    ////let url = 'https://www.kuaiso121.com/'
	API = 'https://www.gc0606ewirjzdxl.com/'
}
export const IMG_ROOT = __DEV__ ? 'src/assets/' : './'
export const UPLOAD_API = 'https://www.sqxingyun.com/uploads.php'

//全局颜色
export const setColors = function(color) {
    const main_w = `.s-block>.active,.s-ball>.active,.main-w{background: ${color}!important;color: #fff!important;}`
    const warn_color = `.warn-color{color: ${color}!important;}`
    const main_bg = `.main-bg{background-color: ${color}!important;}`
    const main_color = `.main-color{color: ${color}!important;}`
    const border_color = `.border-color{border-color: ${color}!important;}`
    const active = `.active {color: ${color}!important;}.slide-bar.active:before{background:${color};}`
    const bactive = `.ball.active{background: ${color}!important;border-color: ${color}!important;}`
    const trend = `.trend-content td[code='1'] .cell{background: ${color}}`
    const selected = `.selected{color: ${color}!important;}.selected::after{background:${color}!important;}`
    const ball = `.ball,.s-ball-no,.s-block-no{border-color: ${color}}`
    const invert_active = `.invert-active{color: ${color}!important;}`
    const btn = `.button-fill{background: ${color}!important;}`
    const setBtnBgColor = `.setBtnBgColor{background: ${color}!important; color:#fff!important}`
    $(document.head).append(`<style>
            ${main_w}
            ${warn_color}
            ${main_bg}
            ${main_color}
            ${border_color}
            ${active}
            ${bactive}
            ${trend}
            ${selected}
            ${ball}
            ${invert_active}
            ${btn}
            ${setBtnBgColor}
       </style>`)
}
