import $ from 'zepto'
export const S_normal = (Core, Layer, S_lottery) => {
    return {
        //单击选号
        selBalls: function (pn) {
            var c = S_lottery.arrBall().length
            return S_lottery.addActive(pn, c)
        },
        randomOne: function (S) {
            let baseCount = 0
            let lottery = S.lottery
            for (let k in lottery) {
                baseCount += lottery[k].balls.length
            }
            let baseBall = Core.createArr(baseCount)
            let r = Core.randomOne(baseBall, false, 1)
            S_lottery.setRandom(r, 0)
        },
        sel11x5Balls: function (pn, sy, ss, scope) {
            var _ = $(pn)
            let count = 0
            let _t = function(v) {
                if (_.hasClass('active')) {
                    _.removeClass('active')
                    _.addClass('main-color')
                } else {
                    if ($('.balls').eq(sy).find('.active').length >= sy + v) {
                        Layer.toast('只能选择' + (sy + v) + '个号码', true)
                    }else{
                        S_lottery.addActive(pn)
                    }
                }

                $.each($('.balls'), (i, d) => {
                    if ($(d).find('.active').length >= i + v) {
                        count++
                    }
                })
                return count
            }
            let _e = function (i, j) {
                return $('.s_11x5').eq(i).find('.balls').eq(j).find('.active')
            }
            if(scope.sname == 'rx') {
                count = _t(1)
            }else if(scope.sname == 'zx') {
                count = _t(2)
            }else if(scope.sname == 'zhx') {
                if (_.hasClass('active')) {
                    _.removeClass('active')
                    _.addClass('main-color')
                } else {
                    if(sy==0) {
                        let a = _.text()
                        let b = _e(0, (ss==0?1:0)).eq(0).text()
                        if(a == b) {
                            Layer.toast('已经选过此号码', true)
                            return
                        }
                    }else if(sy == 1) {
                        let a = _.text()
                        let bb = ss==0?1:0
                        let cc = ss==2?1:2
                        let b = _e(1, bb).eq(0).text()
                        let c = _e(1, cc).eq(0).text()
                        if((a != null && b != null && a == b) ||
                           (a != null && c != null && a == c) ||
                           (b != null && c != null && b == c)) {
                            Layer.toast('已经选过此号码', true)
                            return
                        }
                    }
                    if (_e(sy, ss).length >= 1) {
                        Layer.toast('只能选择1个号码', true)
                        return
                    }else{
                        S_lottery.addActive(pn)
                        if(_e(0, 0).length>0 && _e(0, 1).length>0) {
                            count++
                        }
                        if(_e(1, 0).length>0 && _e(1, 1).length>0 && _e(1, 2).length>0) {
                            count++
                        }
                    }
                }
            }else{
                count = this.selBalls(pn)
            }
            scope.suData.sumbet = count
            scope.suData.money = scope.suData.sumbet * scope.suData.txtmoney
        },
        selkl10Balls: function (pn, scope) {
            console.log(scope)
            var _ = $(pn)
            var count = 0
            let zs = 0
            if(scope.sname == 'lma') {
                if (_.hasClass('active')) {
                    _.removeClass('active')
                    _.addClass('main-color')
                } else {
                    const ab = $('.balls .active').length
                    if(scope.ballIndex == 0) {
                       zs = 2
                       if(ab >=10) {
                           Layer.toast('只能选择10个号码', true)
                           return
                       }
                    }else if(scope.ballIndex == 1) {
                        zs = 2
                        if(ab >=6) {
                            Layer.toast('只能选择6个号码', true)
                            return
                        }
                    }else if(scope.ballIndex == 2) {
                        zs = 3
                        if(ab >=6) {
                            Layer.toast('只能选择6个号码', true)
                            return
                        }
                    }else if(scope.ballIndex == 3) {
                        zs = 4
                        if(ab >=7) {
                            Layer.toast('只能选择7个号码', true)
                            return
                        }
                    }else if(scope.ballIndex == 4) {
                        zs = 5
                        if(ab >=8) {
                            Layer.toast('只能选择8个号码', true)
                            return
                        }
                    }
                    S_lottery.addActive(pn)
                    count = Core.combination($('.balls .active').length, zs)
                }
            }else{
                count = this.selBalls(pn)
            }
            scope.suData.sumbet = count
            scope.suData.money = scope.suData.sumbet * scope.suData.txtmoney
        }
    }
}
