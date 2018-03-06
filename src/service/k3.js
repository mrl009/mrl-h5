import $ from 'zepto'

export const K3 = (Lottery, Core) => {
    return {
        // 拖胆选号、二同号_二同单选_标准选号|手动选号
        tdxh: function (pn) {
            var _ = $(pn)
            var id = _.attr('id')
            if (id == 22016 || id == 22033 || id == 22216 || id == 22233 || id == 22416 || id == 22433 ||
                id == 22616 || id == 22633 || id == 22816 || id == 22833) {
                // 胆码
                _.parent().parent().parent().find('li>span').removeClass('active')
                _.parent().parent().parent().parent().parent().next().find('span').eq(_.attr('code')).removeClass('active')
            } else if (id == 22017 || id == 22034 || id == 22217 || id == 22234 || id == 22417 || id == 22434 ||
                id == 22617 || id == 22634 || id == 22817 || id == 22834) {
                // 拖码
                _.parent().parent().parent().parent().parent().prev().find('span').eq(_.attr('code')).removeClass('active')
            }
        },
        tx: function () {
            var _ = $('.balls').find('span').eq(0).hasClass('active')
            if (_) {
                $('.balls span').removeClass('active')
            } else {
                $('.balls span').addClass('active')
            }
        },
        //单击选号
        selBalls: function (pn, e) {
            if ((e.bname == '3th' && e.cname == '3ttx' && e.sname == '3ttx') ||
                (e.bname == '3lh' && e.cname == '3ltx' && e.sname == '3ltx')) {
                this.tx()
            } else {
                if ((e.bname == '2bth' && e.cname == 'tdxh' && e.sname == 'tdxh') ||
                    (e.bname == '2th' && e.cname == '2tdx' && e.sname == 'bzxh')) {
                    this.tdxh(pn, e)
                }
                Lottery.addActive(pn)
            }
            return this.countNum(e)
        },
        //统计注数
        countNum: function (e) {
            //判断玩法对应的注数
            var l0 = Lottery.arrBall(0)
            var l1 = Lottery.arrBall(1)
            if (e.bname == '2bth' && e.cname == 'bzxh' && e.sname == 'bzxh') {// 二不同号_标准选号
                var c = Core.arrange(l0, 2)
                return c.length
            } else if (e.bname == '2bth' && e.cname == 'tdxh' && e.sname == 'tdxh') {// 二不同号_胆拖选号
                if (l0.length == 0 || l1.length == 0) {
                    return 0
                }
                return l1.length
            } else if (e.bname == '2th' && e.cname == '2tdx' && e.sname == 'bzxh') {// 二同号_二同单选_标准选号
                if (l0.length == 0 || l1.length == 0) {
                    return 0
                }
                return l1.length
            } else if (e.bname == '2th' && e.cname == '2tfx' && e.sname == '2tfx') {// 二同号_二同复选
                return l0.length
            } else if (e.bname == '3bth' && e.cname == 'bzxh' && e.sname == 'bzxh') {// 三不同号_标准选号
                var c = Core.arrange(l0, 3)
                return c.length
            } else if (e.bname == '3th' && e.cname == '3tdx' && e.sname == '3tdx') {// 三同号_三同单选
                return l0.length
            } else if ((e.bname == '3th' && e.cname == '3ttx' && e.sname == '3ttx') ||
                e.bname == '3lh' && e.cname == '3ltx' && e.sname == '3ltx') {// 三同号_三同通选|三连号_三连通选
                var _ = $('.balls').find('span').eq(0).hasClass('active')
                if (_) {
                    return 1
                } else {
                    return 0
                }
            } else if (e.bname == 'hz' && e.cname == 'hz' && e.sname == 'hz') {// 和值_和值
                return l0.length
            }
        },
        randomOne: function (e) {
            var baseBall = [1, 2, 3, 4, 5, 6], r = []
            const bname = e.playInfo.bname
            const cname = e.playInfo.cname
            const sname = e.playInfo.sname
            if (bname == '2bth' && cname == 'bzxh' && sname == 'bzxh') {
                r = Core.randomOne(baseBall, false, 2)
                Lottery.setRandom(r, 1)
            } else if (bname == '2bth' && cname == 'tdxh' && sname == 'tdxh') {
                r = Core.randomOne(baseBall, false, 1, 1)
                Lottery.setRandom(r, 1)
            } else if (bname == '2th' && cname == '2tdx' && sname == 'bzxh') {
                r = Core.randomOne(baseBall, false, 1, 1)
                Lottery.setRandom(r, 1)
            } else if (bname == '2th' && cname == '2tfx' && sname == '2tfx') {
                r = Core.randomOne(baseBall, false, 1)
                Lottery.setRandom(r, 1)
            } else if (bname == '3bth' && cname == 'bzxh' && sname == 'bzxh') {
                r = Core.randomOne(baseBall, false, 3)
                Lottery.setRandom(r, 1)
            } else if (bname == '3th' && cname == '3tdx' && sname == '3tdx') {
                r = Core.randomOne(baseBall, false, 1)
                Lottery.setRandom(r, 1)
            } else if (bname == '3th' && cname == '3ttx' && sname == '3ttx') {
                $('.balls span').addClass('active')
            } else if (bname == '3lh' && cname == '3ltx' && sname == '3ltx') {
                $('.balls span').addClass('active')
            } else if (bname == 'hz' && cname == 'hz' && sname == 'hz') {
                baseBall = [3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 17, 18]
                r = Core.randomOne(baseBall, false, 1)
                Lottery.setRandom(r, 3)
            }
        }
    }
}
