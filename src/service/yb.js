import $ from 'zepto'

export const Yb = function ( Core, Lottery, RS) {
    return {
        /***********操作选号**********************/
        getPinfo(S, id) {
            $.each(S.playlist.play, function(i, d) {
                $.each(d.play, function(ii, dd) {
                    if(dd.play == undefined) {
                        if(id == dd.id) {
                            S.playInfo = dd
                            S.playInfo.bname = d.sname//大类英文标识
                            S.playInfo.atitle = d.name//购物车玩法名称
                            S.playInfo.cname = dd.sname
                            S.playInfo.btitle = d.name //购物车玩法名称
                            S.playInfo.topTitle = d.name //顶部显示名称
                            return false
                        }
                    }else{
                        $.each(dd.play, function(iii, ddd) {
                            if(id == ddd.id) {
                                S.playInfo = ddd
                                S.playInfo.bname = d.sname
                                S.playInfo.atitle = d.name
                                S.playInfo.cname = dd.sname
                                S.playInfo.btitle = ddd.name
                                S.playInfo.topTitle = d.name //顶部显示名称
                                if(ddd.sname == 'hz' || ddd.sname == 'zxhz') {
                                    S.tmp = 'yb/hz.tple.html'
                                } else {
                                    S.tmp = 'yb/xx.tple.html'
                                }
                                return false
                            }
                        })
                    }
                })
            })
        },
        getPros (S, flag) {
            RS.getProduct(S.gid, flag)
                .then((c) => {
                    S.pros = c.data
                    S.lottery = c.data[S.show]
                    S.rate = {
                        rate: S.lottery.rate,
                        rate_min: S.lottery.rate_min,
                        rebate: S.lottery.rebate,
                        volume: 0
                    }
                    this.getPlay(S.playInfo.pid, S)
                    S.threePlayId = S.show
                })
        },
        getPlay(pid, S) {
            S.onePlayId = pid
            $.each(S.playlist.play, (i, d) => {
                if(pid == d.id) {
                    S.p2 = d.play
                    this.get2Play(d.play[0].id, S)
                    return false
                }
            })
        },
        //点击第二级
        get2Play(tid, S) {
            S.twoPlayId = tid
            $.each(S.p2, function(i, d) {
                if(tid == d.id) {
                    S.p3 = d.play
                    if(S.p3 == undefined) {
                        S.p3 = S.p2
                    }
                    return false
                }
            })
        },
        //单击选号
        selBalls: function (pn, e) {
            Lottery.addActive(pn)
            return this.countNum(e)
        },
        //对象转数组
        arrBall: function (v) {
            var arr = []
            var e = $('.balls').eq(v).find('.active')
            $.each(e, function (i, d) {
                arr.push($(d).attr('name'))
            })
            return arr
        },
        //统计注数
        countNum: function (e) {
            //判断玩法对应的注数
            var l0 = Lottery.arrBall(0)
            var l1 = Lottery.arrBall(1)
            var l2 = Lottery.arrBall(2)
            if (e.bname == '3m' && e.cname == 'zhx' && e.sname == 'fs') {// 三码_直选_直选复式
                if (l0.length == 0 || l1.length == 0 || l2.length == 0) {
                    return 0
                }
                return Core.zuHe(l0, l1, l2)
            } else if (e.bname == '3m' && e.cname == 'zhx' && e.sname == 'zxhz') {// 三码_直选_直选和值
                var c = this.arrBall(0)
                var count = 0
                var arr = [1, 3, 6, 10, 15, 21, 28, 36, 45, 55, 63, 69, 73, 75, 75, 73, 69, 63, 55, 45, 36, 28, 21, 15, 10, 6, 3, 1]
                c.forEach(function (e) {
                    count += arr[e]
                })
                return count
            } else if (e.bname == '3m' && e.cname == 'zx' && e.sname == 'z3') {// 三码_组选_组三
                var c = Core.arrange(l0, 2)
                return c.length * 2
            } else if (e.bname == '3m' && e.cname == 'zx' && e.sname == 'z6') {// 三码_组选_组六
                var c = Core.arrange(l0, 3)
                return c.length
            } else if (e.bname == '2m' && e.cname == 'hezhx' && e.sname == 'fs') {// 二码_后二直选_复式
                if (l0.length == 0 || l1.length == 0) {
                    return 0
                }
                return Core.zuHe(l0, l1)
            } else if (e.bname == '2m' && e.cname == 'hezhx' && e.sname == 'zxhz') {// 二码_后二直选_直选和值
                var c = this.arrBall(0)
                var count = 0
                var arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1]
                c.forEach(function (e) {
                    count += arr[e]
                })
                return count
            } else if (e.bname == '2m' && e.cname == 'hezx' && e.sname == 'fs') {// 二码_后二组选_复式
                var c = Core.arrange(l0, 2)
                return c.length
            } else if (e.bname == '2m' && e.cname == 'qezhx' && e.sname == 'fs') {// 二码_前二直选_复式
                if (l0.length == 0 || l1.length == 0) {
                    return 0
                }
                return Core.zuHe(l0, l1)
            } else if (e.bname == '2m' && e.cname == 'qezhx' && e.sname == 'zxhz') {// 二码_前二直选_直选和值
                var c = this.arrBall(0)
                var count = 0
                var arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1]
                c.forEach(function (e) {
                    count += arr[e]
                })
                return count
            } else if (e.bname == '2m' && e.cname == 'qezx' && e.sname == 'fs') {// 二码_前二组选_复式
                var c = Core.arrange(l0, 2)
                return c.length
            } else if (e.bname == 'dwd') {// 定位胆_定位胆
                return l0.length + l1.length + l2.length
            } else if (e.bname == 'bdw' && e.cname == 'bdw' && e.sname == 'bdw') {// 不定位_不定位
                return l0.length
            }
        },
        randomOne: function (e) {
            var baseBall = [], r = []
            const oneSname = e.playInfo.bname
            const twoSname = e.playInfo.cname
            const lastSname = e.playInfo.sname
            if (oneSname == '3m' && twoSname == 'zhx' && lastSname == 'fs') {
                baseBall = Core.createArr(10)
                r = Core.randomOne(baseBall, false, 1, 1, 1)
                Lottery.setRandom(r, 1)
            } else if (oneSname == '3m' && twoSname == 'zhx' && lastSname == 'zxhz') {
                baseBall = Core.createArr(28)
                r = Core.randomOne(baseBall, false, 1, 1)
                Lottery.setRandom(r, 1)
            } else if (oneSname == '3m' && twoSname == 'zx' && lastSname == 'z3') {
                baseBall = Core.createArr(10)
                r = Core.randomOne(baseBall, false, 2)
                Lottery.setRandom(r, 1)
            } else if (oneSname == '3m' && twoSname == 'zx' && lastSname == 'z6') {
                baseBall = Core.createArr(10)
                r = Core.randomOne(baseBall, false, 3)
                Lottery.setRandom(r, 1)
            } else if (oneSname == '2m' && twoSname == 'hezhx' && lastSname == 'fs') {
                baseBall = Core.createArr(10)
                r = Core.randomOne(baseBall, false, 1, 1)
                Lottery.setRandom(r, 1)
            } else if (oneSname == '2m' && twoSname == 'hezhx' && lastSname == 'zxhz') {
                baseBall = Core.createArr(19)
                r = Core.randomOne(baseBall, false, 1)
                Lottery.setRandom(r, 1)
            } else if (oneSname == '2m' && twoSname == 'hezx' && lastSname == 'fs') {
                baseBall = Core.createArr(10)
                r = Core.randomOne(baseBall, false, 2)
                Lottery.setRandom(r, 1)
            } else if (oneSname == '2m' && twoSname == 'qezhx' && lastSname == 'fs') {
                baseBall = Core.createArr(10)
                r = Core.randomOne(baseBall, false, 1, 1)
                Lottery.setRandom(r, 1)
            } else if (oneSname == '2m' && twoSname == 'qezhx' && lastSname == 'zxhz') {
                baseBall = Core.createArr(19)
                r = Core.randomOne(baseBall, false, 1)
                Lottery.setRandom(r, 1)
            } else if (oneSname == '2m' && twoSname == 'qezx' && lastSname == 'fs') {
                baseBall = Core.createArr(10)
                r = Core.randomOne(baseBall, false, 2)
                Lottery.setRandom(r, 1)
            } else if (oneSname == 'dwd') {
                baseBall = Core.createArr(30)
                r = Core.randomOne(baseBall, false, 1)
                this.setRandom(r, 1)
            } else if (oneSname == 'bdw' && twoSname == 'bdw' && lastSname == 'bdw') {
                baseBall = Core.createArr(10)
                r = Core.randomOne(baseBall, false, 1)
                Lottery.setRandom(r, 1)
            }
        },
        setRandom: function (r, n) {
            n = n == undefined ? 0 : n
            $('.balls span').removeClass('active')
            $.each(r, function (i, d) {
                if (d !== []) {
                    $.each(d, function (ii, dd) {
                        $('.lot-number-wrap').find('.ball').eq(dd - n).addClass('active')
                    })
                }
            })
        }
    }
}
