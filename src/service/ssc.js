import $ from 'zepto'

export const Ssc = function ($http, Core, Lottery) {
    return {
        /**
         * 五星组合
         * @param ARRAY   aa二重号数组
         * @param ARRAY   bb单号数组
         */
        //组120
        wxz120: function () {
            var aa = this.arrBall(0)
            return Core.combination(aa.length, 5)
        },
        //组60
        wxz60: function () {
            var aa = this.arrBall(0)
            var bb = this.arrBall(1)
            return aa.length * Core.combination(bb.length, 3) - Core.cfNum(aa, bb) * Core.combination(bb.length - 1, 2) //组60
        },
        //组30
        wxz30: function () {
            var aa = this.arrBall(0)
            var bb = this.arrBall(1)
            return Core.combination(aa.length, 2) * Core.combination(bb.length, 1) - Core.cfNum(aa, bb) * Core.combination(aa.length - 1, 1)
        },
        //组20
        wxz20: function () {
            var aa = this.arrBall(0)
            var bb = this.arrBall(1)
            return Core.combination(aa.length, 1) * Core.combination(bb.length, 2) - Core.cfNum(aa, bb) * Core.combination(bb.length - 1, 1)
        },
        //组10
        wxz10: function () {
            var aa = this.arrBall(0)
            var bb = this.arrBall(1)
            return Core.combination(aa.length, 1) * Core.combination(bb.length, 1) - Core.cfNum(aa, bb)
        },
        //组5
        wxz5: function () {
            var aa = this.arrBall(0)
            var bb = this.arrBall(1)
            return this.wxz10(aa, bb)
        },
        /**
         * 后四-前四--组选
         * @param ARRAY   aa二重号数组
         * @param ARRAY   bb单号数组
         */
        h4z24: function () {
            var aa = this.arrBall(0)
            return Core.combination(aa.length, 4)
        },
        h4z12: function (aa, bb) {
            var aa = this.arrBall(0)
            var bb = this.arrBall(1)
            return Core.combination(aa.length, 1) * Core.combination(bb.length, 2) - Core.cfNum(aa, bb) * Core.combination(bb.length - 1, 1)
        },
        h4z6: function (aa) {
            var aa = this.arrBall(0)
            return Core.combination(aa.length, 2)
        },
        h4z4: function (aa, bb) {
            var aa = this.arrBall(0)
            var bb = this.arrBall(1)
            return Core.combination(aa.length, 1) * Core.combination(bb.length, 1) - Core.cfNum(aa, bb)
        },
        /**
         * 后三-中三-前三--组选
         * @param INT 球号
         */
        h3hz: function () {
            //三星 和值 每个球对应的下注数表
            var aa = this.arrBall(0)
            var count = 0
            var arr = [1, 3, 6, 10, 15, 21, 28, 36, 45, 55, 63, 69, 73, 75, 75, 73, 69, 63, 55, 45, 36, 28, 21, 15, 10, 6, 3, 1]
            aa.forEach(function (e) {
                count += arr[e]
            })
            return count
        },
        /**
         * 二星--组选
         * @param INT 球号
         */
        exhz: function () {
            /* 二星 和值 每个球对应的下注数表 */
            var aa = this.arrBall(0)
            var count = 0
            var arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1]
            aa.forEach(function (e) {
                count += arr[e]
            })
            return count
        },
        //二星不定胆二码
        ex2m: function (n) { //n选择球个数
            return Core.combination(n, 2)
        },
        /**
         * 任选--复式
         * @param ARRAY 选择球的二维数组
         */
        //任2复式
        rxr2fs: function (arr) {
            var count = 0
            for (let i = 0; i < arr.length; i++) {
                for (let j = i + 1; j < arr.length; j++) {
                    count += Core.zuHe(arr[i], arr[j])
                }
            }
            return count
        },
        //任2组选
        rxr2zx: function (w, q) {//w位置个数   q选择球数量
            return Core.combination(w, 2) * Core.combination(q, 2)
        },
        //任3复式
        rxr3fs: function (arr) {
            var count = 0
            for (let i = 0; i < arr.length; i++) {
                for (let j = i + 1; j < arr.length; j++) {
                    for (let d = j + 1; d < arr.length; d++) {
                        count += Core.zuHe(arr[i], arr[j], arr[d])
                    }
                }
            }
            return count
        },
        //任3组3
        rxr3z3: function (w, q) {//w位置个数   q选择球数量
            return Core.combination(w, 3) * Core.combination(q, 2) * 2
        },
        //任3组6
        rxr3z6: function (w, q) {//w位置个数   q选择球数量
            return Core.combination(w, 3) * Core.combination(q, 3)
        },
        //任4复式
        rxr4fs: function (arr) {
            var count = 0
            for (let i = 0; i < arr.length; i++) {
                for (let j = i + 1; j < arr.length; j++) {
                    for (let d = j + 1; d < arr.length; d++) {
                        for (let s = d + 1; s < arr.length; s++) {
                            count += Core.zuHe(arr[i], arr[j], arr[d], arr[s])
                        }
                    }
                }
            }
            return count
        },

        /**
         * 跨度
         * @param INT 球号
         */
        wxkd3: function (arr) {
            /* 跨度 前三 中三 后三 每个球对应的下注数表*/
            var rs = [10, 54, 96, 126, 144, 150, 144, 126, 96, 54]
            var count = 0
            for (let i = 0; i < arr.length; i++) {
                count += rs[arr[i]]
            }
            return count
        },
        wxkd2: function (arr) {
            /* 跨度 前二 后二 每个球对应的下注数表 */
            var rs = [10, 18, 16, 14, 12, 10, 8, 6, 4, 2]
            var count = 0
            for (let i = 0; i < arr.length; i++) {
                count += rs[arr[i]]
            }
            return count
        },
        /***********操作选号**********************/
        //对象转数组
        arrBall: function (v) {
            let arr = []
            const e = $('.balls').eq(v).find('.active')
            $.each(e, (i, d) => {
                arr.push($(d).attr('name'))
            })
            return arr
        },

        //摇一摇
        randomOne: function (e) {
            var baseBall = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9], r = []
            const oneSname = e.playInfo.bname
            const twoSname = e.playInfo.cname
            const lastSname = e.playInfo.sname
            if (oneSname == '5x' && twoSname == '5xzhx' && (lastSname == 'fs' || lastSname == 'zh') ) {//五星_五星直选_复式|五星_五星直选_组合
                r = Core.randomOne(baseBall, true, 1, 1, 1, 1, 1)
                Lottery.setRandom(r)
            } else if (oneSname == '5x' && twoSname == '5xzx' && lastSname == 'zx120') {//五星_五星直选_组选120
                r = Core.randomOne(baseBall, false, 5)
                Lottery.setRandom(r)
            } else if (oneSname == '5x' && twoSname == '5xzx' && lastSname == 'zx60') {//五星_五星直选_组选60
                r = Core.randomOne(baseBall, false, 1, 3)
                Lottery.setRandom(r)
            } else if (oneSname == '5x' && twoSname == '5xzx' && lastSname == 'zx30') {//五星_五星直选_组选30
                r = Core.randomOne(baseBall, false, 2, 1)
                Lottery.setRandom(r)
            } else if (oneSname == '5x' && twoSname == '5xzx' && lastSname == 'zx20') {//五星_五星直选_组选20
                r = Core.randomOne(baseBall, false, 1, 2)
                Lottery.setRandom(r)
            } else if (oneSname == '5x' && twoSname == '5xzx' && (lastSname == 'zx10' || lastSname == 'zx5')) {//五星_五星直选_组选10|五星_五星直选_组选5
                r = Core.randomOne(baseBall, false, 1, 1)
                Lottery.setRandom(r)
            } else if ((twoSname == 'h4zhx' || twoSname == 'q4zhx') && (lastSname == 'fs' || lastSname == 'zh')) {//后四_后四直选_复式|后四_后四直选_组合
                r = Core.randomOne(baseBall, true, 1, 1, 1, 1)
                Lottery.setRandom(r)
            } else if ((twoSname == 'h4zx' || twoSname == 'q4zx') && (lastSname == 'zx24')) {//后四_后四组选_组选24|后四_后四组选_组选24
                r = Core.randomOne(baseBall, false, 4)
                Lottery.setRandom(r)
            } else if ((twoSname == 'h4zx' || twoSname == 'q4zx') && (lastSname == 'zx12')) {//后四_后四组选_组选12|前四_前四组选_组选12
                r = Core.randomOne(baseBall, false, 1, 2)
                Lottery.setRandom(r)
            } else if ((twoSname == 'h4zx' || twoSname == 'q4zx') && (lastSname == 'zx6')) {//后四_后四组选_组选6|前四_前四组选_组选6
                r = Core.randomOne(baseBall, false, 2)
                Lottery.setRandom(r)
            } else if ((twoSname == 'h4zx' || twoSname == 'q4zx') && (lastSname == 'zx4')) {//后四_后四组选_组选4|前四_前四组选_组选4
                r = Core.randomOne(baseBall, false, 1, 1)
                Lottery.setRandom(r)
            } else if ((twoSname == 'h3zhx' || twoSname == 'z3zhx' || twoSname == 'q3zhx') && (lastSname == 'fs')) {//后三_后三直选_复式|中三_后三直选_复式|前三_后三直选_复式
                r = Core.randomOne(baseBall, true, 1, 1, 1)
                Lottery.setRandom(r)
            } else if ((twoSname == 'h3zhx' || twoSname == 'z3zhx' || twoSname == 'q3zhx') && (lastSname == 'zxhz')) {//后三_后三直选_直选和值|中三_中三直选_直选和值|前三_前三直选_直选和值
                baseBall = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27]
                r = Core.randomOne(baseBall, false, 1)
                Lottery.setRandom(r)
            } else if ((twoSname == 'h3zx' || twoSname == 'z3zx' || twoSname == 'q3zx') && (lastSname == 'zx3')) {//后三_后三直选_组选3|中三_后三直选_组选3|前三_后三直选_组选3
                r = Core.randomOne(baseBall, false, 2)
                Lottery.setRandom(r)
            } else if ((twoSname == 'h3zx' || twoSname == 'z3zx' || twoSname == 'q3zx') && (lastSname == 'zx6')) {//后三_后三直选_组选6式|中三_后三直选_组选6|前三_后三直选_组选6
                r = Core.randomOne(baseBall, false, 3)
                Lottery.setRandom(r)
            } else if ((twoSname == 'h2zhx' || twoSname == 'q2zhx') && (lastSname == 'fs')) {//二星_后二直选_复试|二星_前二直选_复试
                r = Core.randomOne(baseBall, true, 1, 1)
                Lottery.setRandom(r)
            } else if ((twoSname == 'h2zhx' || twoSname == 'q2zhx') && (lastSname == 'zxhz')) {//二星_后二直选_直选和值|二星_前二直选_直选和值
                baseBall = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 17, 18]
                r = Core.randomOne(baseBall, false, 1)
                Lottery.setRandom(r)
            } else if ((twoSname == 'h2zhx' || twoSname == 'q2zhx') && (lastSname == 'dxds')) {//二星_后二直选_大小单双|二星_前二直选_大小单双
                baseBall = [0, 1, 2, 3]
                r = Core.randomOne(baseBall, true, 1, 1)
                Lottery.setRandom(r)
            } else if ((twoSname == 'h2zx' || twoSname == 'q2zx') && (lastSname == 'fs')) {//二星_后二组选_复试|二星_前二组选_复试
                r = Core.randomOne(baseBall, false, 2)
                Lottery.setRandom(r)
            } else if (twoSname == 'dwd') {//定位胆
                r = Core.randomOne(baseBall, true, 1, 1, 1, 1, 1)
                Lottery.setRandom(r)
            } else if (twoSname == '3x1m' && (lastSname == 'h3' || lastSname == 'z3' || lastSname == 'q3')) {//三星一码前中后
                r = Core.randomOne(baseBall, false, 1)
                Lottery.setRandom(r)
            } else if (twoSname == '3x2m' && (lastSname == 'h3' || lastSname == 'z3' || lastSname == 'q3')) {//三星二码前中后
                r = Core.randomOne(baseBall, false, 2)
                Lottery.setRandom(r)
            } else if (twoSname == 'rx2' && lastSname == 'fs') {//任选_任二_复试
                var t = [0, 0, 0, 0, 0]
                var n = Core.getRandom([0, 1, 2, 3, 4], 2)
                t[n[0]] = 1
                t[n[1]] = 1
                r = Core.randomOne(baseBall, false, t[0], t[1], t[2], t[3], t[4])
                Lottery.setRandom(r)
            } else if (twoSname == 'rx2' && lastSname == 'zx') {//任选_任二_组选
                r = Core.randomOne([0, 1, 2, 3, 4], false, 2)
                let b = Core.randomOne(baseBall, false, 2)
                r.push(b[0])
                Lottery.setRandom(r)
            } else if (twoSname == 'rx3' && lastSname == 'fs') {//任选_任三_复试
                var t = [0, 0, 0, 0, 0]
                var n = Core.getRandom([0, 1, 2, 3, 4], 3)
                t[n[0]] = 1
                t[n[1]] = 1
                t[n[2]] = 1
                r = Core.randomOne(baseBall, false, t[0], t[1], t[2], t[3], t[4])
                Lottery.setRandom(r)
            } else if (twoSname == 'rx3' && lastSname == 'z3') {//任选_任三_组3
                r = Core.randomOne([0, 1, 2, 3, 4], false, 3)
                let b = Core.randomOne(baseBall, false, 2)
                r.push(b[0])
                Lottery.setRandom(r)
            } else if (twoSname == 'rx3' && lastSname == 'z6') {//任选_任三_组6
                r = Core.randomOne([0, 1, 2, 3, 4], false, 3)
                let b = Core.randomOne(baseBall, false, 3)
                r.push(b[0])
                Lottery.setRandom(r)
            } else if (twoSname == 'rx4' && lastSname == 'fs') {//任选_任四_复试
                var t = [0, 0, 0, 0, 0]
                var n = Core.getRandom([0, 1, 2, 3, 4], 4)
                t[n[0]] = 1
                t[n[1]] = 1
                t[n[2]] = 1
                t[n[3]] = 1
                r = Core.randomOne(baseBall, false, t[0], t[1], t[2], t[3], t[4])
                Lottery.setRandom(r)
            } else if (lastSname == 'kdq3' || lastSname == 'kdz3' || lastSname == 'kdh3' || lastSname == 'kdq2' || lastSname == 'kdh2') {
                //跨度_跨度_前三跨度|跨度_跨度_中三跨度|跨度_跨度_后三跨度|跨度_跨度_前二跨度|跨度_跨度_后二跨度
                r = Core.randomOne(baseBall, false, 1)
                Lottery.setRandom(r)
            } else if (twoSname == 'ts' && (lastSname == 'qw1' || lastSname == 'qw2' || lastSname == 'qw3' || lastSname == 'qw4')) {
                //趣味_特殊_一帆风顺|趣味_特殊_好事成双|趣味_特殊_三星报喜|趣味_特殊_四季发财
                r = Core.randomOne(baseBall, false, 1)
                Lottery.setRandom(r)
            } else if (lastSname == 'wq' || lastSname == 'wb' || lastSname == 'ws' || lastSname == 'wg' || lastSname == 'qb' || lastSname == 'qs' || lastSname == 'qg' || lastSname == 'bs' || lastSname == 'bg' || lastSname == 'sg') {
                //龙虎_龙虎_万千|万百|万十|万个|千百|千十|千个|百十|百个|十个
                baseBall = [0, 1, 2]
                r = Core.randomOne(baseBall, false, 1)
                Lottery.setRandom(r)
            }
        },
        //单击选号
        selBalls: function (pn, e) {
            Lottery.addActive(pn)
            return this.countNum(e)
        },
        //统计注数
        countNum: function (e) {
            //判断玩法对应的注数
            var l0 = this.arrBall(0)
            var l1 = this.arrBall(1)
            var l2 = this.arrBall(2)
            var l3 = this.arrBall(3)
            var l4 = this.arrBall(4)
            if (e.cname == '5xzhx') {//五星直选
                if (l0.length == 0 || l1.length == 0 || l2.length == 0 || l3.length == 0 || l4.length == 0) {
                    return 0
                }
                if (e.sname == 'fs') {//复式
                    return Core.zuHe(l0, l1, l2, l3, l4)
                } else if (e.sname == 'zh') {//组合
                    return Core.xxZuHe(l0, l1, l2, l3, l4)
                }
            } else if (e.cname == '5xzx') {//五星组选
                if (e.sname == 'zx120') {
                    return this.wxz120()
                } else if (e.sname == 'zx60') {
                    return this.wxz60()
                } else if (e.sname == 'zx30') {
                    return this.wxz30()
                } else if (e.sname == 'zx20') {
                    return this.wxz20()
                } else if (e.sname == 'zx10') {
                    return this.wxz10()
                } else if (e.sname == 'zx5') {
                    return this.wxz5()
                }
            } else if (e.cname == 'dwd') { //定胆位
                return $('.balls .active').length
            } else if (e.cname == 'h4zhx' || e.cname == 'q4zhx') { //后四直选
                if (l0.length == 0 || l1.length == 0 || l2.length == 0 || l3.length == 0) {
                    return 0
                }
                if (e.sname == 'fs') {//复式
                    return Core.zuHe(l0, l1, l2, l3)
                } else if (e.sname == 'zh') {//组合
                    return Core.xxZuHe(l0, l1, l2, l3)
                }
            } else if (e.cname == 'h4zx' || e.cname == 'q4zx') {//四星组选
                if (e.sname == 'zx24') {
                    return this.h4z24()
                } else if (e.sname == 'zx12') {
                    return this.h4z12()
                } else if (e.sname == 'zx6') {
                    return this.h4z6()
                } else if (e.sname == 'zx4') {
                    return this.h4z4()
                }
            } else if (e.cname == 'h3zhx' || e.cname == 'z3zhx' || e.cname == 'q3zhx') {//后、中、前三直选
                if (e.sname == 'fs') {//复式
                    if (l0.length == 0 || l1.length == 0 || l2.length == 0) {
                        return 0
                    }
                    return Core.zuHe(l0, l1, l2)
                } else if (e.sname == 'zxhz') {//直选和值
                    return this.h3hz()
                }
            } else if (e.cname == 'h3zx' || e.cname == 'z3zx' || e.cname == 'q3zx') {//后、中、前三组选
                if (e.sname == 'zx3') {
                    return Core.permutation(l0.length, 2)
                } else if (e.sname == 'zx6') {
                    return Core.combination(l0.length, 3)
                }
            } else if (e.cname == 'h2zhx' || e.cname == 'q2zhx') {//前后二直选
                if (e.sname == 'fs') { //复式
                    if (l0.length == 0 || l1.length == 0) {
                        return 0
                    }
                    return Core.zuHe(l0, l1)
                } else if (e.sname == 'zxhz') {//组选和值
                    return this.exhz()
                } else if (e.sname == 'dxds') {//组选大小单双
                    return l0.length * l1.length
                }
            } else if (e.cname == 'h2zx' || e.cname == 'q2zx') {//前后二组选
                if (e.sname == 'fs') {
                    return Core.combination(l0.length, 2)
                }
            } else if (e.cname == '3x1m') { //不定位-三星一码
                return l0.length
            } else if (e.cname == '3x2m') { //不定位-三星一码
                return Core.combination(l0.length, 2)
            } else if (e.cname == 'rx2') { //任选-任二
                if (l0.length + l1.length + l2.length + l3.length + l4.length < 2) {
                    return 0
                }
                if (e.sname == 'fs') { //任选-任二-复式
                    var arr = []
                    for (let i = 0; i < 5; i++) {
                        if (this.arrBall(i).length != 0) {
                            arr.push(this.arrBall(i))
                        }
                    }
                    return this.rxr2fs(arr)
                } else if (e.sname == 'zx') {//任选-任二-组
                    return this.rxr2zx(this.arrBall(0).length, this.arrBall(1).length)
                }
            } else if (e.cname == 'rx3') {//任选-任三
                if (e.sname == 'fs') { //任选-任三-复式
                    var arr = []
                    for (let i = 0; i < 5; i++) {
                        if (this.arrBall(i).length != 0) {
                            arr.push(this.arrBall(i))
                        }
                    }
                    return this.rxr3fs(arr)
                } else if (e.sname == 'z3') {//任选-任三-组3
                    return this.rxr3z3(this.arrBall(0).length, this.arrBall(1).length)
                } else if (e.sname == 'z6') {//任选-任三-组6
                    return this.rxr3z6(this.arrBall(0).length, this.arrBall(1).length)
                }
            } else if (e.cname == 'rx4') {//任选-任四
                if (e.sname == 'fs') { //任选-任四-复式
                    var arr = []
                    for (let i = 0; i < 5; i++) {
                        if (this.arrBall(i).length != 0) {
                            arr.push(this.arrBall(i))
                        }
                    }
                    return this.rxr4fs(arr)
                }
            } else if (e.cname == 'kdq3' || e.cname == 'kdz3' || e.cname == 'kdh3') {//跨度-前三跨度
                return this.wxkd3(this.arrBall(0))
            } else if (e.cname == 'kdq2' || e.cname == 'kdh2' || e.cname == 'kdh3') {//跨度-前二跨度
                return this.wxkd2(this.arrBall(0))
            } else if (e.cname == 'ts') {//趣味
                return this.arrBall(0).length
            } else if (e.bname == 'lh') {//龙虎
                return this.arrBall(0).length
            }
        }
    }
}
