import $ from 'zepto'

export const Pk10 = function(Lottery, Core) {
    return {
        //单击选号
        selBalls: function (pn, e) {
            Lottery.addActive(pn)
            return this.countNum(e)
        },
        //统计注数
        countNum: function (e) {
            //判断玩法对应的注数
            var l0 = Lottery.arrBall(0)
            var l1 = Lottery.arrBall(1)
            var l2 = Lottery.arrBall(2)
            var l3 = Lottery.arrBall(3)
            var l4 = Lottery.arrBall(4)
            if (e.bname == 'q1' && e.sname == 'q1') {// 前一_前一
                return l0.length
            } else if (e.bname == 'q2' && e.sname == 'q2fs') {// 前二_前二复式
                if (l0.length == 0 || l1.length == 0) {
                    return 0
                }
                return Core.zuHe2(l0, l1)
            } else if (e.bname == 'q3' && e.sname == 'q3fs') {// 前三_前三复式
                if (l0.length == 0 || l1.length == 0 || l2.length == 0) {
                    return 0
                }
                return Core.zuHe2(l0, l1, l2)
            } else if (e.bname == 'dwd') {// 定位胆_第1-5名|定位胆_第6-10名
                return l0.length + l1.length + l2.length + l3.length + l4.length
            } else if (e.bname == 'dx' || e.bname == 'ds') {// 所有大小单双
                return l0.length
            }
        },
        randomOne: function (e) {
            var baseBall = [], r = []
            const oneSname = e.playInfo.bname
            const twoSname = e.playInfo.cname
            if (oneSname == 'q1' && twoSname == 'q1') {
                baseBall = Core.createArr(10)
                r = Core.randomOne(baseBall, false, 1)
                Lottery.setRandom(r, 1)
            } else if (oneSname == 'q2' && twoSname == 'q2fs') {
                baseBall = Core.createArr(10)
                r = Core.randomOne(baseBall, false, 1, 1)
                Lottery.setRandom(r, 1)
            } else if (oneSname == 'q3' && twoSname == 'q3fs') {
                baseBall = Core.createArr(10)
                r = Core.randomOne(baseBall, false, 1, 1, 1)
                Lottery.setRandom(r, 1)
            } else if (oneSname == 'dx' || oneSname == 'ds') {
                baseBall = Core.createArr(2)
                r = Core.randomOne(baseBall, false, 1)
                Lottery.setRandom(r, 1)
            } else if (oneSname == 'dwd') {
                baseBall = Core.createArr(50)
                r = Core.randomOne(baseBall, true, 1)
                this.setRandom(r, 1)
            }
        },
        setRandom: function (r, n) {
            n = n == undefined ? 0 : n
            $('.balls span').removeClass('active')
            $.each(r, function (i, d) {
                if (d !== []) {
                    $.each(d, function (ii, dd) {
                        $('.lot-wrap').find('.ball').eq(dd - n).addClass('active')
                    })
                }
            })
        }
    }
}
