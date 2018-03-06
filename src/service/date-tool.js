/* 基于第一版工具改造 */
export const DateTool = function() {
    return {
        //数字正则
        numReg: /\d+/g,
        //平年闰年的月份
        months: [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31],
        months2: [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31],
        week_china: ['周日', '周一', '周二', '周三', '周四', '周五', '周六'],
        now: new Date(),
        isleap: function(yy) { //判断平年,闰年
            return yy % 100 == 0 && yy % 400 == 0 || yy % 100 != 0 && yy % 4 == 0 ? true : false
        },
        stringToDt: function(str) {
            if(str instanceof Date) {
                return str
            }
            var numarr=[]
            var num
            while((num = this.numReg.exec(str)) != null) {
                numarr.push(num[0])
            }

            var dtarr = [this.now.getFullYear(), this.now.getMonth()+1, this.now.getDate()]
            for(var i = 0; i < numarr.length; i++) {
                if(i >= 3) {
                    break
                }
                dtarr[i] = numarr[i]
            }
            return new Date(dtarr[0], dtarr[1] - 1, dtarr[2])
        },
        reduceDays: function(dt, year, num) {
            if(typeof num == 'string') {
                num = parseInt(num, '10')
            }
            var dt = dt instanceof Date ? dt : this.stringToDt(dt)
            var yy = dt.getFullYear(),
                mm = dt.getMonth(),
                dd = dt.getDate()
            /**减去N年后的日期。
             **/
            if(year == 'year') {
                yy -= num
                var mon = this.isleap(yy) ? this.months2 : this.months
                if(mon[mm] < dd) {
                    dd = mon[mm]
                }
            }
            if(year == 'month') {
                mm -= num
                while(mm < 0) {
                    mm += 12
                    yy -= 1
                }
                var mon = this.isleap(yy) ? this.months2 : this.months
                if(mon[mm] < dd) {
                    dd = mon[mm]
                }
            }

            if(year == 'day') {
                dd -= num
                var mon = this.isleap(yy) ? this.months2 : this.months
                while(dd < 0) {
                    dd += mon[mm-1]
                    mm -= 1
                    if(mm < 0) {
                        mm = 11
                        yy -= 1
                        mon = this.isleap(yy) ? this.months2 : this.months
                    }
                }
            }
            return new Date(yy, mm, dd)
        },
        addDays: function(dt, year = 'day', num) {
            if(typeof num == 'string') {
                num = parseInt(num, '10')
            }
            var dt = dt instanceof Date ? dt : this.stringToDt(dt)
            var yy = dt.getFullYear(),
                mm = dt.getMonth(),
                dd = dt.getDate()-1

            /**添加N年后的日期
             * **/
            if(year == 'year') {
                yy += num
                var mon = this.isleap(yy) ? this.months2 : this.months
                if(mon[mm] < dd) {
                    dd = mon[mm]
                }
            }
            /**
             * 添加N个月后的日期
             * **/
            if(year == 'month') {
                mm += num
                while(mm > 11) {
                    mm -= 12
                    yy += 1
                }
                var mon = this.isleap(yy) ? this.months2 : this.months
                if(mon[mm]<dd) {
                    dd = mon[mm]
                }
            }
            /**
             * 添加N天后的日期
             * **/
            if(year == 'day') {
                dd += num
                var mon = this.isleap(yy) ? this.months2 : this.months
                while(dd > mon[mm]) {
                    dd -= mon[mm]
                    mm += 1
                    if(mm > 11) {
                        mm = 0
                        yy += 1
                        mon = this.isleap(yy) ? this.months2 : this.months
                    }
                }
            }
            return new Date(yy, mm, dd)
        },
        howDaysInTwoDate: function(sdt, edt) {
            var sdate = sdt instanceof Date ? sdt : this.stringToDt(sdt)
            var edate = edt instanceof Date ? edt : this.stringToDt(edt)
            var syy = sdate.getFullYear()
            var smm = sdate.getMonth()
            var sdd = sdate.getDate()

            var eyy = edate.getFullYear()
            var emm = edate.getMonth()
            var edd = edate.getDate()

            //年的天数统计记录
            var count=0

            //先比较年份，一年有365或366天
            //将开始年份增加到结束年份。
            for(var i = syy; i < eyy; i++) {
                var leap = this.isleap(i)
                if(leap) {
                    count += 366
                }else{
                    count += 365
                }
            }
            //比较月份，这时开始日期和结束日期的年份已经相同，开始日期的月份可能会大于结束日期的月份
            var ismax = smm > emm ? true : false
            var k = ismax ? emm : smm
            var len = ismax ? smm : emm
            //判断结束年份是否是闰年，闰年2月有29天。
            var mleap = this.isleap(eyy)
            var mons = mleap ? this.months2 : this.months
            //月份间天数的计数。
            var mcount = 0
            //无论谁大谁小，统计两个日期月份间的天数。
            for( ; k<len; k++) {
                mcount += mons[k]
            }
            //最后统计两个天，两个天之间的天数。
            var dcount = edd - sdd

            var tcount = count + (ismax ? -mcount : mcount) + dcount
            return tcount
        },
        deconstruction_date: function(sdate, edate, needstr, fmt) {
            //解构日期区间为数组格式
            var sdt = sdate instanceof Date ? sdate : this.stringToDt(sdate)
            var edt = edate instanceof Date ? edate : this.stringToDt(edate)
            var arr = []
            var daynums = this.howDaysInTwoDate(sdt, edt)
            var tmpdt = this.stringToDt(sdt)
            for(var i = 0; i < daynums + 1; i++) {
                var ndate = this.addDays(tmpdt, 'day', i)
                needstr ? arr.push(this.dtToString(ndate, fmt)): arr.push(ndate)
            }
            return arr
        },
        deconstructDW: function(sdate, edate, fmt) {
            //解构日期区间为数组格式,包括星期几
            var sdt = sdate instanceof Date ? sdate : this.stringToDt(sdate)
            var edt = edate instanceof Date ? edate : this.stringToDt(edate)
            var arr = []
            var daynums = this.howDaysInTwoDate(sdt, edt)
            var tmpdt = this.stringToDt(sdt)
            for(var i = 0; i < daynums + 1; i++) {
                var ndate = this.addDays(tmpdt, 'day', i)
                var wk = this.getWeek(ndate)
                arr.push({weeknum: wk, week: this.week_china[wk], date: this.dtToString(ndate, fmt)})
            }
            return arr
        },
        dtToString: function(date, fmt = '-', hasMinute = false) {
            date = new Date(date)
            var year = date.getFullYear()
            var month = date.getMonth() + 1
            var day = date.getDate()
            var h = date.getHours()
            var hour = h < 10? ('0'+h): h
            var m = date.getMinutes()
            var minute = m < 10? ('0'+m): m
            var s = date.getSeconds()
            var second = s< 10? '0'+s: s
            if(hasMinute) {
                return [year, month, day].join(fmt)+' '+[hour, minute, second].join(':')
            }else {
                return [year, month, day].join(fmt)
            }
        },
        getWeek: function(date) {
            var wk = date.getDay()
            return wk
        },
        formatDouble: function(mm) {
            if( mm >= 10 ) {
                return mm
            }
            return '0' + mm
        }
    }
}
