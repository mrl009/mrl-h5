import $ from 'zepto'
import angular from 'angular'

export const Lhc = function(Core, Lottery, Layer, DB, RS, $state) {
	return {
        selB: function(target, rate, scope) {
            scope.suData.sumbet = scope.service.selBalls(target, scope)
            scope.suData.money = scope.suData.sumbet * scope.suData.txtmoney
            if(scope.oneSname == 'hx' && (scope.twoSname == 'z' || scope.twoSname == 'bz')) { //合肖-中  不中处理赔率
                var rateArr = rate.split(',')
                scope.rateInfo = rateArr[$('.balls').eq(0).find('.active').length-1]
            }
        },

        //单击选号
        selBalls: function (pn, scope) {
            var _ = $(pn)
            const {oneSname, twoSname} = scope
            if (_.attr('code') == undefined) {
                _ = _.parent()
            }
            if (_.hasClass('active')) {
                var code=$(_).attr('code')
                $(_).find('div').eq(0).addClass('font'+code)
                _.removeClass('active')
            } else {
                //if (tid > 245 && tid < 251) {
                //连码-三全中-三中二-二全中-二中特-特串
                if (oneSname == 'lm' && (twoSname == '3qz' || twoSname == '3z2' || twoSname == '2qz' || twoSname == '2zt' || twoSname == 'tc')) {
                    if ($('.ball.active').length > 9) {
                        Layer.toast('最多只能选择10个号码', true)
                        return this.countNum(oneSname, twoSname)
                    }
                }

                //if (tid > 251 && tid < 259 && tid != 255) {
                //连肖 三连-四连-五连
                if (oneSname == 'lx' && (twoSname == '3xl' || twoSname == '4xl' || twoSname == '5xl')) {
                    if ($('.ball.active').length > 5) {
                        Layer.toast('最多只能选择6个号码', true)
                        return this.countNum(oneSname, twoSname)
                    }
                }

                //连尾 三连-四连-五连
                if (oneSname == 'lw' && (twoSname == '3wp' || twoSname == '4wp' || twoSname == '5wp')) {
                    if ($('.ball.active').length > 5) {
                        Layer.toast('最多只能选择6个号码', true)
                        return this.countNum(oneSname, twoSname)
                    }
                }

                //六合彩玩法中一 ：五中一、六中一、七中一应限制选择球号“最多只能选择10个号码”
                //if (tid < 295 && tid > 291) {
                if (oneSname == 'z1' && (twoSname == '5z1' || twoSname == '6z1' || twoSname == '7z1')) {
                    if ($('.ball.active').length > 9) {
                        Layer.toast('最多只能选择10个号码', true)
                        return this.countNum(oneSname, twoSname)
                    }
                }

                //自选不中，六不中、七不中应限制选择球号“最多只能选择10个号码”
                //if (tid > 259 && tid < 262) {
                if (oneSname == 'zxbz' && (twoSname == '6bz' || twoSname == '7bz')) {
                    if ($('.ball.active').length > 9) {
                        Layer.toast('最多只能选择10个号码', true)
                        return this.countNum(oneSname, twoSname)
                    }
                }

                //八不中应限制选择球号“最多只能选择11个号码
                //if (tid == 262) {
                if (oneSname == 'zxbz' && twoSname == '8bz') {
                    if ($('.ball.active').length > 10) {
                        Layer.toast('最多只能选择11个号码', true)
                        return this.countNum(oneSname, twoSname)
                    }
                }

                //九不中应限制选择球号“最多只能选择12个号码
                //if(tid == 263) {
                if (oneSname == 'zxbz' && twoSname == '9bz') {
                    if ($('.ball.active').length > 11 ) {
                        Layer.toast('最多只能选择12个号码', true)
                        return this.countNum(oneSname, twoSname)
                    }
                }
                //十不中-十一不中应限制选择球号“最多只能选择13个号码
                //if(tid == 264 || tid == 265) {
                if (oneSname == 'zxbz' && (twoSname == '10bz' || twoSname == '11bz')) {
                    if ($('.ball.active').length > 12 ) {
                        Layer.toast('最多只能选择13个号码', true)
                        return this.countNum(oneSname, twoSname)
                    }
                }
                //十二不中应限制选择球号“最多只能选择14个号码
                //if(tid == 266) {
                if (oneSname == 'zxbz' && twoSname == '12bz') {
                    if ($('.ball.active').length > 13 ) {
                        Layer.toast('最多只能选择14个号码', true)
                        return this.countNum(oneSname, twoSname)
                    }
                }
                const checkRule = (num) => {
                    if ($('.ball.active').length > num) {
                        var max = num + 1
                        Layer.toast('最多只能选择' + max + '球')
                        return this.countNum(oneSname, twoSname)
                    }
                }
                const checkMaxLen = function(oneSname, twoSname) {
                    if (oneSname == 'hx' && twoSname == 'z') {
                        if ($('.balls').eq(0).find('.active').length > 10) {
                            Layer.toast('最多只能选择11球')
                            return true
                        }
                    } else if (oneSname == 'hx' && twoSname == 'bz') {
                        if ($('.balls').eq(0).find('.active').length > 9) {
                            Layer.toast('最多只能选择10球')
                            return true
                        }
                    } else if (oneSname == 'lm' && twoSname == '4qz') {
                        if ($('.ball.active').length > 9) {
                            Layer.toast('最多只能选择10个号码', true)
                            return true
                        }
                    } else if (oneSname == 'lx' && twoSname == '2xl') {
                        if ($('.ball.active').length > 5) {
                            Layer.toast('最多只能选择6个号码', true)
                            return true
                        }
                    } else if (oneSname == 'lw' && twoSname == '2wp') {
                        if ($('.ball.active').length > 5) {
                            Layer.toast('最多只能选择6个号码')
                            return true
                        }
                    } else if (oneSname == 'zxbz' && twoSname == '5bz') {
                        return checkRule(9)
                    } else if (oneSname == 'z1' && twoSname == '8z1') {
                        return checkRule(10)
                    } else if (oneSname == 'z1' && twoSname == '9z1') {
                        return checkRule(11)
                    } else if (oneSname == 'z1' && twoSname == '10z1') {
                        return checkRule(12)
                    }
                    /*switch (tid) {
                        case '282':
                            if ($('.balls').eq(0).find('.active').length > 10) {
                                Layer.toast('最多只能选择11球')
                                return true
                            }
                            break
                        case '283':
                            if ($('.balls').eq(0).find('.active').length > 9) {
                                Layer.toast('最多只能选择10球')
                                return true
                            }
                            break
                        case '245':
                            if ($('.ball.active').length > 9) {
                                Layer.toast('最多只能选择10个号码', true)
                                return true
                            }
                            break
                        case '251':
                            if ($('.ball.active').length > 5) {
                                Layer.toast('最多只能选择6个号码', true)
                                return true
                            }
                            break
                        case '255':
                            if ($('.ball.active').length > 5) {
                                Layer.toast('最多只能选择6个号码')
                                return true
                            }
                            break
                        case '259':
                            return checkRule(9)
                        case '295':
                            return checkRule(10)
                        case '296':
                            return checkRule(11)
                        case '297':
                            return checkRule(12)
                        default:
                        	break
                    }*/
                }
                if (!checkMaxLen(oneSname, twoSname)) {
                    _.addClass('active')
                  $(_).find('div').eq(0).removeAttr('class')
                }
            }
            return this.countNum(oneSname, twoSname)
        },
        //过关选号
        ggBalls: function (pn) {
            var _ = $(pn)
            if (_.attr('code') == undefined) {_ = _.parent()}
            _.parent().siblings().find('span').removeClass('active')
            if (!_.hasClass('active')) {
                _.addClass('active')
            } else {
                _.removeClass('active')
            }
            return $('.balls').parent().find('.active').length >= 2 ? 1 : 0
        },
        //统计注数
        countNum: function (oneSname, twoSname) {
            //判断玩法对应的注数
            var l0 = Lottery.arrBall(0)
            if (oneSname == 'lm' && twoSname == '4qz') {//四全中
                return Core.combination(l0.length, 4)
            } else if (oneSname == 'lm' && twoSname == '3qz') {//三全中
                return Core.combination(l0.length, 3)
            } else if (oneSname == 'lm' && twoSname == '3z2') {//三全中
                return Core.combination(l0.length, 3)
            } else if (oneSname == 'lm' && twoSname == '2qz') {//二全中
                return Core.combination(l0.length, 2)
            } else if (oneSname == 'lm' && twoSname == '2zt') {//二中特
                return Core.combination(l0.length, 2)
            } else if (oneSname == 'lm' && twoSname == 'tc') {//特串
                return Core.combination(l0.length, 2)
            } else if (oneSname == 'lx' && twoSname == '2xl') {//二肖连
                return Core.combination(l0.length, 2)
            } else if (oneSname == 'lx' && twoSname == '3xl') {//三肖连
                return Core.combination(l0.length, 3)
            } else if (oneSname == 'lx' && twoSname == '4xl') {//四肖连
                return Core.combination(l0.length, 4)
            } else if (oneSname == 'lx' && twoSname == '5xl') {//五肖连
                return Core.combination(l0.length, 5)
            } else if (oneSname == 'lw' && twoSname == '2wp') {//二尾碰
                return Core.combination(l0.length, 2)
            } else if (oneSname == 'lw' && twoSname == '3wp') {//三尾碰
                return Core.combination(l0.length, 3)
            } else if (oneSname == 'lw' && twoSname == '4wp') {//四尾碰
                return Core.combination(l0.length, 4)
            } else if (oneSname == 'lw' && twoSname == '5wp') {//五尾碰
                return Core.combination(l0.length, 5)
            } else if ((oneSname == 'z1' && twoSname == '5z1') || (oneSname == 'zxbz' && twoSname == '5bz')) {//五中一 五不中
                return Core.combination(l0.length, 5)
            } else if ((oneSname == 'z1' && twoSname == '6z1') || (oneSname == 'zxbz' && twoSname == '6bz')) {//六中一 六不中
                return Core.combination(l0.length, 6)
            } else if ((oneSname == 'z1' && twoSname == '7z1') || (oneSname == 'zxbz' && twoSname == '7bz')) {//七中一 七不中
                return Core.combination(l0.length, 7)
            } else if ((oneSname == 'z1' && twoSname == '8z1') || (oneSname == 'zxbz' && twoSname == '8bz')) {//八中一 八不中
                return Core.combination(l0.length, 8)
            } else if ((oneSname == 'z1' && twoSname == '9z1') || (oneSname == 'zxbz' && twoSname == '9bz')) {//九中一 九不中
                return Core.combination(l0.length, 9)
            } else if ((oneSname == 'z1' && twoSname == '10z1') || (oneSname == 'zxbz' && twoSname == '10bz')) {///十中一 十不中
                return Core.combination(l0.length, 10)
            } else if (oneSname == 'zxbz' && twoSname == '11bz') {///十一不中
                return Core.combination(l0.length, 11)
            } else if (oneSname == 'zxbz' && twoSname == '12bz') {///十二不中
                return Core.combination(l0.length, 12)
            } else if (oneSname == 'hx' && (twoSname == 'z' || twoSname == 'bz')) {///合肖--中 不中
                return 1
            }
            return l0.length
            /*if (tid == 245) {//四全中
                return Core.combination(l0.length, 4)
            } else if (tid == 246) {//三全中
                return Core.combination(l0.length, 3)
            } else if (tid == 247) {//三中二
                return Core.combination(l0.length, 3)
            } else if (tid == 248) {//二全中
                return Core.combination(l0.length, 2)
            } else if (tid == 249) {//二中特
                return Core.combination(l0.length, 2)
            } else if (tid == 250) {//特串
                return Core.combination(l0.length, 2)
            } else if (tid == 251) {//二肖连
                return Core.combination(l0.length, 2)
            } else if (tid == 252) {//三肖连
                return Core.combination(l0.length, 3)
            } else if (tid == 253) {//四肖连
                return Core.combination(l0.length, 4)
            } else if (tid == 254) {//五肖连
                return Core.combination(l0.length, 5)
            } else if (tid == 255) {//二尾碰
                return Core.combination(l0.length, 2)
            } else if (tid == 256) {//三尾碰
                return Core.combination(l0.length, 3)
            } else if (tid == 257) {//四尾碰
                return Core.combination(l0.length, 4)
            } else if (tid == 258) {//五尾碰
                return Core.combination(l0.length, 5)
            } else if (tid == 292 || tid == 259) {//五中一 五不中
                return Core.combination(l0.length, 5)
            } else if (tid == 293 || tid == 260) {//六中一 六不中
                return Core.combination(l0.length, 6)
            } else if (tid == 294 || tid == 261) {//七中一 七不中
                return Core.combination(l0.length, 7)
            } else if (tid == 295 || tid == 262) {//八中一 八不中
                return Core.combination(l0.length, 8)
            } else if (tid == 296 || tid == 263) {//九中一 九不中
                return Core.combination(l0.length, 9)
            } else if (tid == 297 || tid == 264) {//十中一 十不中
                return Core.combination(l0.length, 10)
            } else if (tid == 265) {//十一不中
                return Core.combination(l0.length, 11)
            } else if (tid == 266) {//十二不中
                return Core.combination(l0.length, 12)
            } else if (tid == 282 || tid == 283) {//合肖--中 不中
                return 1
            }*/
            //return l0.length
        },
         //下注
        bet(S) {
            if(S.suData.sumbet == 0) {
                Layer.toast('请选择球号', 1)
                return false
            }
            if(!Core.getToken()) {
                $state.go('login', {
                	ret: angular.toJson({url: 'lhc', params: {type: S.type, gid: S.gid}})
                })
                return false
            }
            S.service.betSubmit(S, function() {
              	$state.go('lhccart', {gid: S.gid, type: S.type})
            })
        },
        //加入购物车
        betSubmit: function (e, func) {
            //多个球一注
            if (e.oneSname == 'lm' && (e.twoSname == '4qz' || e.twoSname == '3qz' || e.twoSname == '3z2' || e.twoSname == '2qz' || e.twoSname == '2zt' || e.twoSname == 'tc')) {
                //连码
                this.allSubmit(e, func)
            } else if (e.oneSname == 'z1' || e.oneSname == 'zxbz') {// 自选不中-中一
                this.allSubmit(e, func)
            } else if (e.oneSname == 'lx' || e.oneSname == 'lw') {//连肖-连尾
                this.zhSubmit(e, func)
            } else if (e.oneSname == 'hx') {//合肖
                var rate = e.lottery.rate.split(',')
                var l = Lottery.arrBall(0)
                e.lottery.rate = rate[l.length - 1]
                this.allSubmit(e, func)
            } else if (e.oneSname == 'zmgg') {//过关
                this.ggSubmit(e, func)//
            } else {//一注
                this.oneSubmit(e, func)
            }
        },
        //多个球一注
        allSubmit: function (e, func) {
            var ee = $('.balls').eq(0).find('.active')
            var pids = [], contents = [], names = [], rate = [], rebate = []
            $.each(ee, function (i, d) {
                var _ = $(d)
                pids.push(_.attr('pid'))
                contents.push(_.attr('code'))
                names.push(_.attr('name'))
                rate.push(_.attr('rate'))
                rebate.push(_.attr('rebate'))
            })
            // var l0 = Lottery.arrBall(0)
	        DB.getData('lhccarts', function(carts) {
	            var betArr = carts == null ? [] : JSON.parse(carts)
	            betArr = Lottery.checkCart(e, betArr)
	            var bet = {
	                gid: e.gid,
	                tid: e.tid,
	                price: e.suData.txtmoney / e.suData.mtype,
	                counts: e.suData.sumbet,
	                price_sum: e.suData.txtmoney * e.suData.sumbet / e.suData.mtype,
	                rate: e.lottery.rate == undefined ? rate.join() : e.lottery.rate, //玩法赔率不存在取球赔率
	                rebate: e.lottery.rebate == undefined ? rebate.join() : e.lottery.rebate,
	                pids: pids.join(),
	                contents: contents.join(),
	                names: names.join(),
	                atitle: e.playInfo.atitle,
	                btitle: e.playInfo.btitle
	            }
	            betArr.push(bet)
	            DB.saveData({
	            	key: 'lhccarts',
	            	data: JSON.stringify(betArr)
	            }, func())
	        })
        },
        //一个球一注
        oneSubmit: function (e, func) {
            var ee = $('.balls').eq(0).find('.active')
            var bet = {}
	        DB.getData('lhccarts', function(carts) {
	            var betArr = carts == null ? [] : JSON.parse(carts)
	            betArr = Lottery.checkCart(e, betArr)
	            $.each(ee, function (i, d) {
	                bet = {
	                    gid: e.gid,
	                    tid: e.tid,
	                    price: e.suData.txtmoney / e.suData.mtype,
	                    counts: 1,
	                    price_sum: e.suData.txtmoney / e.suData.mtype,
	                    rate: $(d).attr('rate'),
	                    rebate: $(d).attr('rebate'),
	                    pids: $(d).attr('pid'),
	                    contents: $(d).attr('code'),
	                    names: $(d).attr('name'),
	                    atitle: e.playInfo.atitle,
	                    btitle: e.playInfo.btitle
	                }
	                betArr.push(bet)
	            })
	            DB.saveData({
	            	key: 'lhccarts',
	            	data: JSON.stringify(betArr)
	            }, func())
	        })
        },
        //连肖连尾加购物车
        zhSubmit: function (e, func) {
            var ee = $('.balls').eq(0).find('.active')
            var names = [], rates = [], rebates = [], pids = [], codes = []//获取球号名称
            $.each(ee, function (i, d) {
                names.push($(d).attr('name'))
                rates.push($(d).attr('rate'))
                rebates.push($(d).attr('rebate'))
                pids.push($(d).attr('pid'))
                codes.push($(d).attr('code'))
            })
            var bet = {}
	        DB.getData('lhccarts', function(carts) {
	            const {oneSname, twoSname} = e
	            var betArr = carts == null ? [] : JSON.parse(carts)
	            betArr = Lottery.checkCart(e, betArr)
	            let z
	            // if (e.tid == 251 || e.tid == 255) {z = 2}//二连肖连尾
	            // else if (e.tid == 252 || e.tid == 256) {z = 3}//三连肖连尾
	            // else if (e.tid == 253 || e.tid == 257) {z = 4}//四连肖连尾
	            // else if (e.tid == 254 || e.tid == 258) {z = 5}//五连肖连尾
                if ((oneSname == 'lx' && twoSname == '2xl') || (oneSname == 'lw' && twoSname == '2wp')) {z=2}
                else if ((oneSname == 'lx' && twoSname == '3xl') || (oneSname == 'lw' && twoSname == '3wp')) {z=3}
                else if ((oneSname == 'lx' && twoSname == '4xl') || (oneSname == 'lw' && twoSname == '4wp')) {z=4}
                else if ((oneSname == 'lx' && twoSname == '5xl') || (oneSname == 'lw' && twoSname == '5wp')) {z=5}
	            var namesArr = Core.arrange(names, z)
	            var ratesArr = Core.arrange(rates, z)
	            var namesArr = Core.arrange(names, z)
	            var rebatesArr = Core.arrange(rebates, z)
	            var pidsArr = Core.arrange(pids, z)
	            var codesArr = Core.arrange(codes, z)
	            $.each(namesArr, function (i, d) {
	                // var rate = e.onePlayId == 208||e.onePlayId==209 ? Math.min(...ratesArr[i]) : Math.max(...ratesArr[i])
                    // var rebate = e.onePlayId == 208 ||e.onePlayId==209? Math.min(...rebatesArr[i]) : Math.max(...rebatesArr[i])
	                var rate = oneSname == 'lx'||oneSname=='lw' ? Math.min(...ratesArr[i]) : Math.max(...ratesArr[i])
                    var rebate = oneSname == 'lx'||oneSname=='lw' ? Math.min(...rebatesArr[i]) : Math.max(...rebatesArr[i])
	                bet = {
	                    gid: e.gid,
	                    tid: e.tid,
	                    price: e.suData.txtmoney,
	                    counts: 1,
	                    price_sum: e.suData.txtmoney,
	                    rate: rate,
	                    rebate: rebate,
	                    pids: pidsArr[i].join(),
	                    contents: codesArr[i].join(),
	                    names: d.join(),
	                    atitle: e.playInfo.atitle,
	                    btitle: e.playInfo.btitle
	                }
	                betArr.push(bet)
	            })
	            DB.saveData({
	            	key: 'lhccarts',
	            	data: JSON.stringify(betArr)
	            }, func())
	        })
        },
        //过关加入购物车
        ggSubmit: function (e, func) {
            var pids = [],
                contents = [],
                names = [],
                rate = [],
                rebate = ''
            $('.balls').each(function (i, el) {
                var _ = $(el).find('.active')
                pids.push(_.attr('pid'))
                contents.push(_.attr('code'))
                names.push(_.attr('name'))
                rate.push(_.attr('rate'))
                rebate = rebate && rebate != ' ' && rebate != 'undefined' ? rebate : _.attr('rebate')
            })
	        DB.getData('lhccarts', function(carts) {
	            var betArr = carts == null ? [] : JSON.parse(carts)
	            betArr = Lottery.checkCart(e, betArr)
	            var bet = {
	                gid: e.gid,
	                tid: e.tid,
	                price: e.suData.txtmoney,
	                counts: e.suData.sumbet,
	                price_sum: e.suData.txtmoney * e.suData.sumbet,
	                rate: rate.join(), //玩法赔率不存在取球赔率
	                rebate: rebate,
	                pids: pids.join(),
	                contents: contents.join('|'),
	                names: names.join('|'),
	                atitle: e.playInfo.atitle,
	                btitle: e.playInfo.btitle
	            }
	            betArr.push(bet)
	            DB.saveData({
	            	key: 'lhccarts',
	            	data: JSON.stringify(betArr)
	            }, func())
	        })
        },
        //根据玩法选择模板
        selectTmp: function (scope) {
            const {oneSname, twoSname} = scope
            if (oneSname == 'tmab' && (twoSname == 'tma' || twoSname == 'tmb')) {//特码AB
                return 'tm'
            } else if (oneSname == 'zm' && twoSname == 'zm') {//正码
                return 'tm'
            } else if (oneSname == 'tmab' && twoSname == 'qt') {//特码其他
                return 'bigball'
            } else if (oneSname == 'lm' && (twoSname == 'qt' || twoSname == 'z1' || twoSname == 'z2' || twoSname == 'z3' || twoSname == 'z4' || twoSname == 'z5' || twoSname == 'z6')) {//两面
                return 'bigball'
            } else if (oneSname == 'lx' && (twoSname == '2xl' || twoSname == '3xl' || twoSname == '4xl' || twoSname == '5xl')) {//连肖
                return 'sxball'
            } else if (oneSname == 'lw' && (twoSname == '2wp' || twoSname == '3wp' || twoSname == '4wp' || twoSname == '5wp')) {//连尾
                return 'sxball'
            } else if (oneSname == 'sx' && (twoSname == 'zx' || twoSname == '1x' || twoSname == '12x' || twoSname == 'zhongx')) {//生肖
                return 'sxball'
            } else if (oneSname == 'lm' && (twoSname == '4qz' || twoSname == '3qz' || twoSname == '3z2' || twoSname == '2qz' || twoSname == '2zt' || twoSname == 'tc')) {//连码
                return 'lm'
            } else if (oneSname == 'hx' && (twoSname == 'z' || twoSname == 'bz')) {//合肖
                return 'hx'
            } else if (oneSname == 'zmgg') {//过关
                return 'gg'
            } else if (oneSname == 'zxbz' && (twoSname == '5bz' || twoSname == '6bz' || twoSname == '7bz' || twoSname == '8bz' || twoSname == '9bz' || twoSname == '10bz' || twoSname == '11bz' || twoSname == '12bz')) {//自选不中
                return 'zxbz'
            } else if (oneSname == 'sb' && (twoSname == '3sb' || twoSname == '7sb' || twoSname == 'bb' || twoSname == 'bbb')) {//色波
                return 'sb'
            } else if (oneSname == 'ws' && (twoSname == 'tws' || twoSname == 'ztws')) {//尾数
                return 'sb'
            } else if (oneSname == 'wx' && (twoSname == '7m' || twoSname == '5x')) {//七码五行
                return 'sb'
            } else if (oneSname == 'z1' && (twoSname == '5z1' || twoSname == '6z1' || twoSname == '7z1' || twoSname == '8z1' || twoSname == '9z1' || twoSname == '10z1')) {//中一
                return 'zy'
            }else if (oneSname == 'zm16') {
                return 'bigball'
            }
            return 'tm'
            // if (id == 227 || id == 228 || pid == 203) {//一般选号
            //     return 'tm'
            // } else if (id == 229 || pid == 201 || pid == 205) {//特码其他
            //     return 'bigball'
            // } else if (pid == 208 || pid == 209 || pid == 211) {//生肖
            //     return 'sxball'
            // } else if (id == 245 || id == 246 || id == 247 || id == 248 || id == 249 || id == 250) {//连码
            //     return 'lm'
            // } else if (pid == 212) {//合肖
            //     return 'hx'
            // } else if (id == 206) {//过关
            //     return 'gg'
            // } else if (pid == 210) {//自选不中
            //     return 'zxbz'
            // } else if (pid == 213 || pid == 214 || pid == 215) {//色波
            //     return 'sb'
            // } else if (pid == 216) {
            //     return 'zy'
            // }
            // return 'tm'
        },
        tools: function (tid, t) {//t类型1
            var arr = []
            if (t == 1) {arr = [0, 2, 3, 4, 5, 8]}
            else if (t == 2) {arr = [1, 6, 7, 9, 10, 11]}
            else if (t == 3) {arr = [1, 3, 5, 7, 9, 11]}
            else if (t == 4) {arr = [0, 2, 4, 6, 8, 10]}
            else if (t == 5) {arr = [0, 1, 2, 3, 4, 5]}
            else if (t == 6) {arr = [6, 7, 8, 9, 10, 11]}
            else if (t == 7) {arr = [1, 3, 4, 6, 8, 11]}
            else if (t == 8) {arr = [0, 2, 5, 7, 9, 10]}
            var _ = $('.balls li span')
            _.removeClass('active')
            for (var i = 0; i < arr.length; i++) {
                _.eq(arr[i]).addClass('active')
            }
            return this.countNum(tid)
        },
        randomOne: function (e) {
            const ball03 = Core.createArr(3)
            const ball04 = Core.createArr(4)
            const ball05 = Core.createArr(5)
            const ball06 = Core.createArr(6)
            const ball08 = Core.createArr(8)
            const ball10 = Core.createArr(10)
            const ball12 = Core.createArr(12)
            const ball13 = Core.createArr(13)
            const ball14 = Core.createArr(14)
            const ball15 = Core.createArr(15)
            const ball16 = Core.createArr(16)
            const ball49 = Core.createArr(49)
            const {oneSname, twoSname} = e
            let r
            if ((oneSname == 'lm' && twoSname == 'qt') ||
                (oneSname == 'sx' && (twoSname == 'zx' || twoSname == '1x' || twoSname == '12x')) ||
                (oneSname == 'hx' && (twoSname == 'z' || twoSname == 'bz')) ||
                (oneSname == 'sb' && (twoSname == 'bb' || twoSname == 'bbb'))) {
                //两面_其他|生肖_正肖|生肖_一肖|生肖_十二肖|合肖_中|合肖_不中|色波_半波|色波_半半波
                r = Core.randomOne(ball12, false, 1)
                this.setRandom(r)
            } else if (oneSname == 'lm' && (twoSname == 'z1' || twoSname == 'z2' || twoSname == 'z3' || twoSname == 'z4' || twoSname == 'z5' || twoSname == 'z6')) {//两面_正1~两面_正6
                r = Core.randomOne(ball08, false, 1)
                this.setRandom(r)
            } else if ((oneSname == 'tmab' && (twoSname == 'ta' || twoSname == 'tb')) ||
                (oneSname == 'zm' && twoSname == 'zm') ||
                (oneSname == 'zmt' && (twoSname == 'z1t' || twoSname == 'z2t' || twoSname == 'z3t' || twoSname == 'z4t' || twoSname == 'z5t' || twoSname == 'z6t'))) {
                //特码AB_特码A|特码AB_特码B|正码_正码|正码特_正码特1~正码特_正码特6
                r = Core.randomOne(ball49, false, 1)
                this.setRandom(r)
            } else if (oneSname == 'tmab' && twoSname == 'qt') {
                r = Core.randomOne(ball14, false, 1)
                this.setRandom(r)
            } else if (oneSname == 'zm16' && (twoSname == 'zm1' || twoSname == 'zm2' || twoSname == 'zm3' || twoSname == 'zm4' || twoSname == 'zm5' || twoSname == 'zm6')) {
                //正码1-6
                r = Core.randomOne(ball13, false, 1)
                this.setRandom(r)
            } else if (oneSname == 'zmgg') {//正码过关
                let t = [0, 0, 0, 0, 0, 0]
                const n = Core.getRandom(ball06, 2)
                n.forEach(function (i) {
                    t[i] = 1
                })
                r = Core.randomOne(ball13, false, t[0], t[1], t[2], t[3], t[4], t[5])
                this.setRandom(r)
                return 1
            } else if (oneSname == 'lm' && twoSname == '4qz') {//连码_四全中
                r = Core.randomOne(ball49, false, 4)
                this.setRandom(r)
            } else if (oneSname == 'lm' && (twoSname == '3qz' || twoSname == '3z2')) {//连码_三全中|连码_三中二
                r = Core.randomOne(ball49, false, 3)
                this.setRandom(r)
            } else if (oneSname == 'lm' && (twoSname == '2qz' || twoSname == '2zt' || twoSname == 'tc')) {//连码_二全中|连码_二中特|连码_特串
                r = Core.randomOne(ball49, false, 2)
                this.setRandom(r)
            } else if (oneSname == 'lx' && twoSname == '2xl') {//连肖_二肖连
                r = Core.randomOne(ball12, false, 2)
                this.setRandom(r)
            } else if (oneSname == 'lx' && twoSname == '3xl') {//连肖_三肖连
                r = Core.randomOne(ball12, false, 3)
                this.setRandom(r)
            } else if (oneSname == 'lx' && twoSname == '4xl') {//连肖_四肖连
                r = Core.randomOne(ball12, false, 4)
                this.setRandom(r)
            } else if (oneSname == 'lx' && twoSname == '5xl') {//连肖_五肖连
                r = Core.randomOne(ball12, false, 5)
                this.setRandom(r)
            } else if (oneSname == 'lw' && twoSname == '2wp') {//连尾_二尾碰
                r = Core.randomOne(ball10, false, 2)
                this.setRandom(r)
            } else if (oneSname == 'lw' && twoSname == '3wp') {//连尾_三尾碰
                r = Core.randomOne(ball10, false, 3)
                this.setRandom(r)
            } else if (oneSname == 'lw' && twoSname == '4wp') {//连尾_四尾碰
                r = Core.randomOne(ball10, false, 4)
                this.setRandom(r)
            } else if (oneSname == 'lw' && twoSname == '5wp') {//连尾_五尾碰
                r = Core.randomOne(ball10, false, 5)
                this.setRandom(r)
            } else if ((oneSname == 'zxbz' && twoSname == '5bz') || oneSname == 'z1' && twoSname == '5z1') {//自选不中_五不中|中一_五中一
                r = Core.randomOne(ball49, false, 5)
                this.setRandom(r)
            } else if ((oneSname == 'zxbz' && twoSname == '6bz') || oneSname == 'z1' && twoSname == '6z1') {//自选不中_六不中|中一_六中一
                r = Core.randomOne(ball49, false, 6)
                this.setRandom(r)
            } else if ((oneSname == 'zxbz' && twoSname == '7bz') || oneSname == 'z1' && twoSname == '7z1') {//自选不中_七不中|中一_七中一
                r = Core.randomOne(ball49, false, 7)
                this.setRandom(r)
            } else if ((oneSname == 'zxbz' && twoSname == '8bz') || oneSname == 'z1' && twoSname == '8z1') {//自选不中_八不中|中一_八中一
                r = Core.randomOne(ball49, false, 8)
                this.setRandom(r)
            } else if ((oneSname == 'zxbz' && twoSname == '9bz') || oneSname == 'z1' && twoSname == '9z1') {//自选不中_九不中|中一_九中一
                r = Core.randomOne(ball49, false, 9)
                this.setRandom(r)
            } else if ((oneSname == 'zxbz' && twoSname == '10bz') || oneSname == 'z1' && twoSname == '10z1') {//自选不中_十不中|中一_十中一
                r = Core.randomOne(ball49, false, 10)
                this.setRandom(r)
            } else if (oneSname == 'zxbz' && twoSname == '11bz') {//自选不中_十一不中
                r = Core.randomOne(ball49, false, 11)
                this.setRandom(r)
            } else if (oneSname == 'zxbz' && twoSname == '12bz') {//自选不中_十二不中
                r = Core.randomOne(ball49, false, 12)
                this.setRandom(r)
            } else if (oneSname == 'sx' && twoSname == 'zhongx') {//生肖_总肖
                r = Core.randomOne(ball06, false, 1)
                this.setRandom(r)
            } else if (oneSname == 'sb' && twoSname == '3sb') {//色波_3色波
                r = Core.randomOne(ball03, false, 1)
                this.setRandom(r)
            } else if (oneSname == 'sb' && twoSname == '7sb') {//色波_7色波
                r = Core.randomOne(ball04, false, 1)
                this.setRandom(r)
            } else if (oneSname == 'ws' && twoSname == 'tws') {//尾数_头尾数
                r = Core.randomOne(ball15, false, 1)
                this.setRandom(r)
            } else if (oneSname == 'ws' && twoSname == 'ztws') {//尾数_正特尾数
                r = Core.randomOne(ball10, false, 1)
                this.setRandom(r)
            } else if (oneSname == 'wx' && twoSname == '7m') {//七码五行_七码
                r = Core.randomOne(ball16, false, 1)
                this.setRandom(r)
            } else if (oneSname == 'wx' && twoSname == '5x') {//七码五行_五行
                r = Core.randomOne(ball05, false, 1)
                this.setRandom(r)
            }
            return this.countNum(oneSname, twoSname)
            /*var tid = e.tid == '' ? e.show : e.tid
            let r
            if (tid == 220 || tid == 267 || tid == 268 || tid == 279 || tid == 282 || tid == 283 || tid == 286 || tid == 287) {
                //两面_其他|生肖_正肖|生肖_一肖|生肖_十二肖|合肖|合肖_不中|色波_半波|色波_半半波
                r = Core.randomOne(ball12, false, 1)
                this.setRandom(r)
            } else if (tid == 221 || tid == 222 || tid == 223 || tid == 224 || tid == 225 || tid == 226) {//两面_正1~两面_正6
                r = Core.randomOne(ball08, false, 1)
                this.setRandom(r)
            } else if (tid == 227 || tid == 228 || tid == 230 || tid == 232 || tid == 233 || tid == 234 || tid == 235 || tid == 236 || tid == 237) {
                //特码AB_特码A|特码AB_特码B|正码_正码|正码特_正码特1~正码特_正码特6
                r = Core.randomOne(ball49, false, 1)
                this.setRandom(r)
            } else if (tid == 229) {//特码AB_特码其他
                r = Core.randomOne(ball15, false, 1)
                this.setRandom(r)
            } else if (tid == 238 || tid == 239 || tid == 240 || tid == 241 || tid == 242 || tid == 243 || tid == 244) {//正码1-6
                r = Core.randomOne(ball13, false, 1)
                this.setRandom(r)
            } else if (tid == 206) {//正码过关
                var t = [0, 0, 0, 0, 0, 0]
                var n = Core.getRandom(ball06, 2)
                n.forEach(function (i) {
                    t[i] = 1
                })
                r = Core.randomOne(ball13, false, t[0], t[1], t[2], t[3], t[4], t[5])
                this.setRandom(r)
                return 1
            } else if (tid == 245) {//连码_四全中
                r = Core.randomOne(ball49, false, 4)
                this.setRandom(r)
            } else if (tid == 246 || tid == 247) {//连码_三全中|连码_三中二
                r = Core.randomOne(ball49, false, 3)
                this.setRandom(r)
            } else if (tid == 248 || tid == 249 || tid == 250) {//连码_二全中|连码_二中特|连码_特串
                r = Core.randomOne(ball49, false, 2)
                this.setRandom(r)
            } else if (tid == 251) {//连肖_二肖连
                r = Core.randomOne(ball12, false, 2)
                this.setRandom(r)
            } else if (tid == 252) {//连肖_三肖连
                r = Core.randomOne(ball12, false, 3)
                this.setRandom(r)
            } else if (tid == 253) {//连肖_四肖连
                r = Core.randomOne(ball12, false, 4)
                this.setRandom(r)
            } else if (tid == 254) {//连肖_五肖连
                r = Core.randomOne(ball12, false, 5)
                this.setRandom(r)
            } else if (tid == 255) {//连尾_二尾碰
                r = Core.randomOne(ball10, false, 2)
                this.setRandom(r)
            } else if (tid == 256) {//连尾_三尾碰
                r = Core.randomOne(ball10, false, 3)
                this.setRandom(r)
            } else if (tid == 257) {//连尾_四尾碰
                r = Core.randomOne(ball10, false, 4)
                this.setRandom(r)
            } else if (tid == 258) {//连尾_五尾碰
                r = Core.randomOne(ball10, false, 5)
                this.setRandom(r)
            } else if (tid == 259 || tid == 292) {//自选不中_五不中|中一_五中一
                r = Core.randomOne(ball49, false, 5)
                this.setRandom(r)
            } else if (tid == 260 || tid == 293) {//自选不中_六不中|中一_六中一
                r = Core.randomOne(ball49, false, 6)
                this.setRandom(r)
            } else if (tid == 261 || tid == 294) {//自选不中_七不中|中一_七中一
                r = Core.randomOne(ball49, false, 7)
                this.setRandom(r)
            } else if (tid == 262 || tid == 295) {//自选不中_八不中|中一_八中一
                r = Core.randomOne(ball49, false, 8)
                this.setRandom(r)
            } else if (tid == 263 || tid == 296) {//自选不中_九不中|中一_九中一
                r = Core.randomOne(ball49, false, 9)
                this.setRandom(r)
            } else if (tid == 264 || tid == 297) {//自选不中_十不中|中一_十中一
                r = Core.randomOne(ball49, false, 10)
                this.setRandom(r)
            } else if (tid == 265) {//自选不中_十一不中
                r = Core.randomOne(ball49, false, 11)
                this.setRandom(r)
            } else if (tid == 266) {//自选不中_十二不中
                r = Core.randomOne(ball49, false, 12)
                this.setRandom(r)
            } else if (tid == 280) {//生肖_总肖
                r = Core.randomOne(ball06, false, 1)
                this.setRandom(r)
            } else if (tid == 284) {//色波_3色波
                r = Core.randomOne(ball03, false, 1)
                this.setRandom(r)
            } else if (tid == 285) {//色波_7色波
                r = Core.randomOne(ball04, false, 1)
                this.setRandom(r)
            } else if (tid == 288) {//尾数_头尾数
                r = Core.randomOne(ball15, false, 1)
                this.setRandom(r)
            } else if (tid == 289) {//尾数_正特尾数
                r = Core.randomOne(ball10, false, 1)
                this.setRandom(r)
            } else if (tid == 290) {//七码五行_七码
                r = Core.randomOne(ball16, false, 1)
                this.setRandom(r)
            } else if (tid == 291) {//七码五行_五行
                r = Core.randomOne(ball05, false, 1)
                this.setRandom(r)
            }
            return this.countNum(tid)*/
        },
        setRandom: function (r, n) {
            n = n == undefined ? 0 : n
            $('.balls span').removeClass('active')
            $.each(r, function (i, d) {
                if (d !== []) {
                    $.each(d, function (ii, dd) {
                        $('.lot-number').find('.ch_numball').find('.balls').eq(i).find('span').eq(dd - n).addClass('active')
                    })
                }
            })
        },
        randomTitle: function () {
            var _ = $('.playTwo').find('ul > li'), id, pid
            var n = parseInt(Math.random() * _.length)
            _.removeClass('active')
            _.eq(n).addClass('active')
            id = _.eq(n).attr('id')
            pid = _.eq(n).attr('pid')
            this.getBalls(id, pid)
        },
        //获取默认玩法信息
        getPinfo (S, id) {
            $.each(S.playlist.play, function(i, d) {
                $.each(d.play, function(ii, dd) {
                    if(id == dd.id) {
                        S.tid = dd.id
                        S.playInfo = dd
                        S.playInfo.bname = d.sname //大类英文标识
                        S.playInfo.atitle = d.name //购物车玩法名称
                        S.playInfo.cname = dd.sname
                        S.playInfo.btitle = d.name //购物车玩法名称
                        S.playInfo.topTitle = d.name //顶部显示名称
                        if(dd.sname == 'hz') {
                            S.tmp = 'lhc/hz.tple.html'
                        }
                        return false
                    }
                })
            })
        },
        getBall (pid, show, S) {
            S.onePlayId = pid
            $.each(S.playlist.play, (i, d) => {
                if(pid == d.id) {
                    S.tid = d.id
                    S.oneSname = d.sname
                    S.playInfo.topTitle = d.name //顶部显示名称
                    S.playInfo.atitle = d.name //顶部显示名称
                    S.p2 = d.play
                    if(S.p2 == undefined) {
                        S.tid = pid
                        this.getBalls(S.tid, '', S)
                    } else {
                        $.each(S.p2, (i, d) => {
                            if (show) {
                                if (d.id == show) {
                                    this.getBalls(show, d.pid, S)
                                    return false
                                }
                            } else {
                                this.getBalls(d.id, d.pid, S)
                                return false
                            }
                        })
                    }

                    // if(pid==210 || pid == 216) {
                    if (d.sname == 'zxbz' || d.sname == 'z1') {
                        angular.forEach(S.p2, function(el) {
                            S.rates[el.id] = S.pros[el.id].rate
                        })
                    }
                }
            })
        },
        //获取球号
        getPros: function (S, flag) {
        	RS.getProduct(S.gid, flag)
                .then((c) => {
                    if (c.code == 200) {
                    	S.pros = c.data
	                    S.lottery = c.data[S.show]
	                    this.getBall(S.playInfo.pid, S.show, S)
                    }
                })
        },

        getBalls (id, pid, S) {
            S.tid = id
            $.each(S.p2, function(i, d) {
                if(id == d.id) {
                    S.twoSname = d.sname
                    S.playInfo.btitle = d.name //顶部显示名称
                }
            })
            S.lottery = S.pros[id] //根据玩法查询球列表
            S.suData.sumbet = 0
            S.suData.money = 0
            S.tmp = 'lhc/' + this.selectTmp(S)+'.tple.html'
            if(!S.sx || !S.sb) {
                this.getNum(S)
            }
        },
        //根据生肖找出相应数字
        getNum (S) {
            RS.getLhcsx()
            	.then((c) => {
            		if (c.code == 200) {
	                    S.sx = c.data.sx//生肖
	                    S.sb = c.data.sb//色波
	                    S.sxArr = []
	                    var _arr = ['鼠', '猪', '狗', '鸡', '猴', '羊', '马', '蛇', '龙', '兔', '虎', '牛']
	                    $.each(_arr, function(i, d) {
	                        var tmp = []
	                        $.each(c.data.sx, function(ii, dd) {
	                            if(d == dd) {tmp.push(ii)}
	                        })
	                        S.sxArr[d] = tmp.join()
	                    })
	                    //尾几
	                    S.sxArr['尾0'] = '10 20 30 40'
	                    S.sxArr['尾1'] = '01 11 21 31'
	                    S.sxArr['尾2'] = '02 12 22 32 42'
	                    S.sxArr['尾3'] = '03 13 23 33 43'
	                    S.sxArr['尾4'] = '04 14 24 34 44'
	                    S.sxArr['尾5'] = '05 15 25 35 45'
	                    S.sxArr['尾6'] = '06 16 26 36 46'
	                    S.sxArr['尾7'] = '07 17 27 37 47'
	                    S.sxArr['尾8'] = '08 18 28 38 48'
	                    S.sxArr['尾9'] = '09 19 29 39 49'
	                }
            	})
        }
    }
}
