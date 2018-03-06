import $ from 'zepto'

export const $11x5 = function (Lottery, Core) {
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
	        if (e.cname == 'q3zhx' && e.sname == 'fs') {//三码_前三直选_复式|单式
	            if (l0.length == 0 || l1.length == 0 || l2.length == 0) {
	                return 0
	            }
	            return Core.zuHe2(l0, l1, l2)
	        } else if (e.cname == 'q3zx' && e.sname == 'fs') {//三码_前三组选_复式
	            var c = Core.arrange(l0, 3)
	            return c.length
	        } else if (e.cname == 'q2zhx' && e.sname == 'fs') {//二码_前二直选_复式
	            if (l0.length == 0 || l1.length == 0) {
	                return 0
	            }
	            return Core.zuHe2(l0, l1)
	        } else if (e.cname == 'q2zx' && e.sname == 'fs') {//二码_前二组选_复式
	            var c = Core.arrange(l0, 2)
	            return c.length
	        } else if (e.bname == 'bdd' && e.sname == 'q3w') {//不定胆前三位
	            return l0.length
	        } else if (e.bname == 'dwd' && e.sname == 'dwd') {//定位胆定位胆
	            return l0.length + l1.length + l2.length + l3.length + l4.length
	        } else if (e.bname == 'rx' && e.sname == '1z1') {//任选复式一中一
	            return l0.length
	        } else if (e.bname == 'rx' && e.sname == '2z2') {//任选复式二中二
	            var c = Core.arrange(l0, 2)
	            return c.length
	        } else if (e.bname == 'rx' && e.sname == '3z3') {//任选复式三中三
	            var c = Core.arrange(l0, 3)
	            return c.length
	        } else if (e.bname == 'rx' && e.sname == '4z4') {//任选复式四中四
	            var c = Core.arrange(l0, 4)
	            return c.length
	        } else if (e.bname == 'rx' && e.sname == '5z5') {//任选复式五中五
	            var c = Core.arrange(l0, 5)
	            return c.length
	        } else if (e.bname == 'rx' && e.sname == '6z5') {//任选复式六中五
	            var c = Core.arrange(l0, 6)
	            return c.length
	        } else if (e.bname == 'rx' && e.sname == '7z5') {//任选复式七中五
	            var c = Core.arrange(l0, 7)
	            return c.length
	        } else if (e.bname == 'rx' && e.sname == '8z5') {//任选复式八中五
	            var c = Core.arrange(l0, 8)
	            return c.length
	        }
	    },
	    randomOne: function (e) {
	        var baseBall = [], r = []
            const cname = e.playInfo.cname
            const bname = e.playInfo.bname
            const sname = e.playInfo.sname
	        if (cname == 'q3zhx' && sname == 'fs') {
	            baseBall = Core.createArr(10)
	            r = Core.randomOne(baseBall, false, 1, 1, 1)
	            Lottery.setRandom(r, 1)
	        } else if (cname == 'q3zx' && sname == 'fs') {
                baseBall = Core.createArr(11)
                r = Core.randomOne(baseBall, false, 3)
                Lottery.setRandom(r, 1)
            } else if (cname == 'q2zhx' && sname == 'fs') {
	            baseBall = Core.createArr(11)
	            r = Core.randomOne(baseBall, false, 1, 1)
	            Lottery.setRandom(r, 1)
	        } else if (cname == 'q2zx' && sname == 'fs') {
                baseBall = Core.createArr(11)
                r = Core.randomOne(baseBall, false, 2)
                Lottery.setRandom(r, 1)
            } else if (bname == 'bdd' && sname == 'q3w') {
                baseBall = Core.createArr(11)
                r = Core.randomOne(baseBall, false, 1)
                Lottery.setRandom(r, 1)
            } else if (bname == 'dwd' && sname == 'dwd') {
                baseBall = Core.createArr(55)
                r = Core.randomOne(baseBall, false, 1)
                this.setRandom(r, 1)
            } else if (bname == 'rx' && sname == '1z1') {
                baseBall = Core.createArr(11)
                r = Core.randomOne(baseBall, false, 1)
                Lottery.setRandom(r, 1)
            } else if (bname == 'rx' && sname == '2z2') {
                baseBall = Core.createArr(11)
                r = Core.randomOne(baseBall, false, 2)
                Lottery.setRandom(r, 1)
            } else if (bname == 'rx' && sname == '3z3') {
                baseBall = Core.createArr(11)
                r = Core.randomOne(baseBall, false, 3)
                Lottery.setRandom(r, 1)
            } else if (bname == 'rx' && sname == '4z4') {
                baseBall = Core.createArr(11)
                r = Core.randomOne(baseBall, false, 4)
                Lottery.setRandom(r, 1)
            } else if (bname == 'rx' && sname == '5z5') {
                baseBall = Core.createArr(11)
                r = Core.randomOne(baseBall, false, 5)
                Lottery.setRandom(r, 1)
            } else if (bname == 'rx' && sname == '6z5') {
                baseBall = Core.createArr(11)
                r = Core.randomOne(baseBall, false, 6)
                Lottery.setRandom(r, 1)
            } else if (bname == 'rx' && sname == '7z5') {
                baseBall = Core.createArr(11)
                r = Core.randomOne(baseBall, false, 7)
                Lottery.setRandom(r, 1)
            } else if (bname == 'rx' && sname == '8z5') {
                baseBall = Core.createArr(11)
                r = Core.randomOne(baseBall, false, 8)
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
	    },
	    toper: function(target, scope, fn) {
    		scope.suData.sumbet = this[fn](target, scope.playInfo, scope.service)
    		scope.suData.money = scope.suData.sumbet * scope.suData.txtmoney
	    },
	    toolXiao: function(pn, e, service) {
	    	var arr = [0, 1, 2, 3, 4, 5]
            return Lottery.tools(pn, e, arr, service)
	    },
	    toolDa: function(pn, e, service) {
	    	var arr = [6, 7, 8, 9, 10]
            return Lottery.tools(pn, e, arr, service)
	    },
	    toolDan: function(pn, e, service) {
	    	var arr = [0, 2, 4, 6, 8, 10]
            return Lottery.tools(pn, e, arr, service)
	    },
        getPlay(pid, s) {
            s.onePlayId = pid
            $.each(s.playlist.play, (i, d) => {
                if(pid == d.id) {
                    s.p2 = d.play
                    this.get2Play(d.play[0].id, s)
                    return false
                }
            })

            if(s.p2.length == 0) {
                $.each(s.playlist.play, function(i, d) {
                    $.each(d.play, function(ii, dd) {
                        if(pid == dd.id) {
                            s.onePlayId=dd.pid
                            s.p2=d.play
                            this.get2Play(dd.id, s)
                            return false
                        }
                    })
                })
            }
        },
        //点击第二级
        get2Play(tid, s) {
            s.twoPlayId = tid
            $.each(s.p2, function(i, d) {
                if(tid == d.id) {
                    s.p3 = d.play
                    if(s.p3 == undefined) {
                        s.p3 = s.p2
                    }
                    return false
                }
            })
        },
        //选择玩法更新球
        getBall (id, s) {
            s.threePlayId=id
            s.lottery=s.pros[id] //根据玩法查询球列表
            s.rate = {
            	rate: s.lottery.rate,
            	rate_min: s.lottery.rate_min,
            	rebate: s.lottery.rebate,
            	volume: 0
            }
            this.getPinfo(id, s)
            s.tid = id //玩法ID
            s.suData.sumbet=0
            s.suData.money=0
        },
        //获取默认玩法信息
        getPinfo (id, s) {
            $.each(s.playlist.play, function(i, d) {
                $.each(d.play, function(ii, dd) {
                    if(dd.play == undefined) {
                        if(id == dd.id) {
                            s.playInfo = dd
                            s.playInfo.bname=d.sname//大类英文标识
                            s.playInfo.atitle=d.name//购物车玩法名称
                            s.playInfo.cname=dd.sname
                            s.playInfo.btitle=d.name //购物车玩法名称
                            s.playInfo.topTitle=d.name //顶部显示名称
                            return false
                        }
                    } else {
                        $.each(dd.play, function(iii, ddd) {
                            if(id == ddd.id) {
                                s.playInfo = ddd
                                s.playInfo.bname = d.sname
                                s.playInfo.atitle = d.name
                                s.playInfo.cname = dd.sname
                                s.playInfo.btitle = ddd.name
                                s.playInfo.topTitle = d.name //顶部显示名称
                                return false
                            }
                        })
                    }
                })
            })
        }
	}
}
