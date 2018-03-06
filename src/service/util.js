import angular from 'angular'
import $ from 'zepto'

import Cp from 'clipboard'

export const Util = function(
	$timeout
) {
	return {
		clearCd: function(tc) {
			angular.forEach(tc, function(e) {
				$timeout.cancel(e)
			})
		},
		//注册规则
		rRules: {
			username: /^[a-z][a-z0-9]{5,15}/,
	        password: /^(?![^a-zA-Z]+$)(?!\D+$).{6,12}/,
	        re_password: function (val1) {
	            return function (val2) {
	                return val2 == val1
	            }
	        },
	        verify_code: /^\d{4}$/
		},
		//登录规则
		lRules: {
			username: /^[a-z].+/,
			password: /^.{6,12}$/,
			vcode: /^\d{4}$/
		},
		ogCache: [],
		og: function(fname, target, fn) {
			const OG = function() {
				this.init = function() {
					$(target).on(fname, fn)
				}

				this.destroy = function() {
					$(target).off(fname)
					target = null
				}

				this.init()
			}
			const og = new OG()
			this.ogCache.push(og)
		},
		destroy: function() {
			angular.forEach(this.ogCache, function(e) {
				e.destroy()
			})
			this.ogCache = []
		},
		picker: function(target, fn, format = '-') {
			const _this = this
			if(!this.picker[target]) {
				require.ensure([], (require) => {
					require('pickerjs/dist/picker.min.css')
					const DatePicker = require('pickerjs').default

					this.pickerObj = new DatePicker(target, {
		                format: 'YYYY'+format+'MM'+format+'DD',
		                text: {
		                    title: '请选择日期 / 时间',
		                    cancel: '取消',
		                    confirm: '确认'
		                },
		                hide: function(e) {
		                	fn && fn(e.target.value || e.target.innerHTML)
		                	//destory的原因是确保单例
		                	_this.pickerObj.destroy()
		                }
		            })

		            this.pickerObj.show()
				})
			} else {
				this.pickerObj.show()
			}

			return this.pickerObj
		},
        loopCache: {},
        //instead of setInterval
        loop: function(fn, delay = 1) {
            const _self = this
            const _loopId = '__loopid__' + new Date().getTime()
            const _innerFn = function() {
                if( _self.loopCache[_loopId] !== 'stop') {
                    if(_self.loopCache[_loopId] === undefined) {
                        _self.loopCache[_loopId] = 'run'
                    }
                    const _t = $timeout(function() {
                        $timeout.cancel(_t)
                        _innerFn()
                        fn && fn()
                    }, delay)
                }
            }
            _innerFn()

            return _loopId
        },
        stopLoop: function(loopId) {
            this.loopCache[loopId] = 'stop'
        },
		late: function(fn = () => {}, delay = 1) {
			const _t = $timeout(function() {
				fn()
				$timeout.cancel(_t)
			}, delay * 1000)
		},
		hdDate: function(val, key) {
			return val && val.split(':')[key]
		},
		getBgColor: function($target) {
			const bg = $target.css('background')
			const reg1 = /rgba?\(.+\)/
			const reg2 = /#[0-9a-zA-Z]{6}/
			if(reg1.test(bg)) {
				return this.RGBToHex(bg.match(reg1)[0])
			}
			if(reg2.test(bg)) {
				return bg.match(reg2)[0]
			}
		},
		RGBToHex: function(rgb) {
		   var regexp = /[0-9]{0,3}/g
		   var re = rgb.match(regexp) //利用正则表达式去掉多余的部分，将rgb中的数字提取
		   var hexColor = '#'
		   var hex = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F']
		   for (var i = 0; i < re.length; i++) {
		        var r = null, c = re[i], l = c
		        var hexAr = []
		        while (c > 16) {
		            r = c % 16
		            c = c / 16 >> 0
		            hexAr.push(hex[r])
		        }
		        hexAr.push(hex[c])
		        if(l < 16 && l != '') {
		            hexAr.push(0)
		        }
		       hexColor += hexAr.reverse().join('')
		    }
		    return hexColor
		}
	}
}

export const cfo2a = function(obj) {
	let ret = []
	for(var i in obj) {
		ret.push(obj[i])
	}
	return ret
}

//复制方法
export const copy = function(btn, id, success) {
	const cpob = new Cp(btn, {
		target: function() {
			return document.querySelector(`${id}`)
		}
	})
	cpob.on('success', function(e) {
		success(e)
	})
	cpob.on('error', function(e) {console.log('复制方法出现了错误: ', e)})
	return cpob
}
