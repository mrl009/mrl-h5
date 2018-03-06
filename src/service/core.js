// import $ from 'zepto'
import $ from 'zepto'
import angular from 'angular'
import {API} from '../config'
// import moment from 'moment'

export const Core = function(
    $http,
    $cookies,
    $cookieStore,
    $state,
    $timeout,
    $httpParamSerializer,
    $location,
    Layer
) {
    return {
        /**
         * GET请求
         * @param string   url 请求地址
         * @param object   params参数
         * @param function success成功回调方法
         */
        get: function () {
            //combine params
            let cvt = Array.prototype.slice.call(arguments)
            const url = cvt.shift()
            let params = cvt.shift()
            let success = null
            if(typeof params === 'function') {
                success = params
                params = {}
            } else {
                success = cvt.shift()
            }

            const cache = cvt.shift()

            const _this = this
            const s = $cookieStore.get('s') == undefined ? 4 : 1
            const headers = {'AuthGC': $location.host() + ';' + this.getToken(), 'FROMWAY': s}

            let l = null
            if(params.needLoading === undefined || params.needLoading == true) {
                l = Layer.loading()
            }
            let t = $timeout(function() {
                $timeout.cancel(t)
                Layer.toast('连接超时')
                Layer.CL()
            }, 20 * 1000)
            delete params.needLoading
            params = params ? '?' + $httpParamSerializer(params) : ''
            return $http({
                method: 'GET',
                url: API + url + params,
                headers: headers,
                //withCredentials:true,
                cache: cache == undefined ? true : false
            }).then(function successCallback(response) {
                l && l.close()
                $timeout.cancel(t)
                if(response.status == 200 ) {
                    if(_this.isCodeInclude(response.data.code)) {
                        _this.removeToken()
                        $state.go('tabs.my')
                        // if(/lottery/i.test($location.path())) {
                        //     location.href= $location.path()
                        // } else {
                        //     // Layer.alert('用户登陆超时', '提示', 2)
                        //     $timeout(function() {location.href = '/'}, 2000)
                        // }
                    } else {
                        success(response.data)
                    }
                } else {
                    // Layer.alert(response.data.msg, '提示', 2)
                }

                // l.close()
                return response.data
            }, function errorCallback(response) {
                $timeout.cancel(t)
                //Layer.toast('发生错误')
                l && l.close()
                return response
            })
        },
        isCodeInclude: function(code) {
            return [
                401,
                600,
                601
            ].indexOf(code) >= 0
        },
        /**
         * POST请求
         * @param string   url 请求地址
         * @param object   params 请求参数对象{id:123}$httpParamSerializer(params),
         * @param function success 成功回调方法
         */
        post: function (url, params, success) {
            const _this = this
            let l = null
            if(params.needLoading === undefined || params.needLoading === true) {
                l = Layer.loading()
            }
            let t = $timeout(function() {
                $timeout.cancel(t)
                Layer.toast('请检查网络')
                Layer.CL()
            }, 10 * 1000)

            delete params.needLoading
            return $http({
                method: 'POST',
                url: API + url,
                headers: {
                    'AuthGC': $location.host() + ';' + this.getToken(),
                    'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
                    'FROMWAY': '4'
                },
                data: $httpParamSerializer(params),
                withCredentials: false
            }).then(function successCallback(response) {
                $timeout.cancel(t)
                l && l.close()
                if(_this.isCodeInclude(response.data.code)) {
                    _this.removeToken()
                    // Layer.alert('用户登陆超时', '提示', 2)
                    if(!/lottery/i.test($location.path())) {
                        $timeout(function() {location.href = '/'}, 1000)
                    } else {
                        $timeout(function() {
                            // Layer.closeLoading()
                        }, 500)
                    }
                } else if(response.data.code == 304) {
                    // Layer.alert('操作太频繁', '提示', 2)
                    // $timeout(function() {Layer.closeLoading()}, 1000)
                    return
                } else {
                    success(response.data)
                }

                return response.data
            }, function errorCallback() {
                Layer.toast('发生错误')
                $timeout.cancel(t)
                l && l.close()
            })
        },
        /**
         * 获取token 没有则返回空
         * @returns {*}
         */
        getToken: function () {
            return $cookieStore.get('token') == undefined ? '' : $cookieStore.get('token')
        },
        setToken: function (val) {
            $cookieStore.put('token', val, {
                expires: new Date(new Date().getTime() + 600)
            })
        },
        removeToken: function () {
            $cookieStore.remove('token')
        },
        setCookie: function (k, v) {
            $cookieStore.put(k, JSON.stringify(v))
        },
        getCookie: function (k) {
            return $cookieStore.get(k) == undefined ? '' : JSON.parse($cookieStore.get(k))
        },
        removeCookie: function (k) {
            $cookieStore.remove(k)
        },
        isLogin: function() {
            return !!this.getToken()
        },
        setIntr: function(val) {
            $cookies.put(
                'intr',
                Number(val),
                { expires: 365 }
            )
        },
        getIntr: function() {
            return $cookieStore.get('intr') == undefined ? '' : $cookieStore.get('intr')
        },
        /**
         * 校验是否登录
         */
        checkLogin: function () {
            //jump = jump == false ? jump : true
            //ret = ret != undefined ? ret : false
            this.get('ping/ping', function (json) {
                var c = angular.fromJson(json)
                if (c.code != 200 || $cookieStore.get('token') == '') {
                    if ($cookieStore.get('token')) {
                        $cookieStore.remove('token')
                    }
                    /*if (jump) {
                     $timeout(function () {
                     $state.go('login', {ret: angular.toJson(ret)})
                     }, 1000)
                     }*/
                }
            }, false)
        },
        //计算两个数组相同个数
        cfNum: function (aa, bb) {
            var cc = []
            for (let i = 0; i < aa.length; i++) {
                for (let j = 0; j < bb.length; j++) {
                    if (aa[i] == bb[j]) {
                        cc.push(aa[i])
                    }
                }
            }
            return cc.length
        },
        /**
         * 动态参数全组合计算（传递多个数组为参数）
         * @param array,array,array....
         * 用于计算五星，四星，后三等直选--复式
         */
        zuHe: function () {
            var heads = arguments[0]
            for (var i = 1, len = arguments.length; i < len; i++) {
                if (arguments[i].length) {
                    heads = this.addNewType(heads, arguments[i])
                }
            }
            return heads.length
        },
        addNewType: function (heads, choices) {
            var result = []
            for (var i = 0, len = heads.length; i < len; i++) {
                for (var j = 0, lenj = choices.length; j < lenj; j++) {
                    result.push(heads[i] + '_' + choices[j])
                }
            }
            return result
        },
        /**
         * 动态参数全组合计算（传递多个数组为参数）
         * @param array,array,array....
         * 相对于zuHe去掉了数组中重复项
         */
        zuHe2: function () {
            var heads = arguments[0]
            for (var i = 1, len = arguments.length; i < len; i++) {
                if (arguments[i].length) {
                    heads = this.addNewType(heads, arguments[i])
                }
            }
            // 去重
            var r = []
            $.each(heads, function (k, d) {
                var c = d.split('_')
                var cc = c.join(',') + ','
                var flag = true
                for (var j = 0; j < c.length; j++) {
                    if (cc.replace(c[j] + ',', '').indexOf(c[j] + ',') > -1) {
                        flag = false
                        break
                    }
                }
                flag && r.push(d)
            })
            return r.length
        },
        /**
         * 组合全排列算法
         * @param INT   n组合的数量
         * @param INT   r几个为一组
         */
        xxZuHe: function () {
            var count = arguments.length
            for (var i = 0, len = arguments.length; i < len; i++) {
                if (arguments[i].length) {
                    count = count * arguments[i].length
                }
            }
            return count
        },
        //球号组合return array
        arrange: function (arr, num) {
            function combine(arr, num) {
                var r = []
                function f(t, a, n) {
                    if (n == 0) {
                        return r.push(t)
                    }
                    for (var i = 0, l = a.length; i <= l - n; i++) {
                        f(t.concat(a[i]), a.slice(i + 1), n - 1)
                    }
                    return null
                }
                f([], arr, num)
                return r
            }

            var a = combine(arr, num)
            return a
        },
        /**
         * 组合算法
         * @param INT   n组合的数量
         * @param INT   r几个为一组
         */
        calculate: function (number) {
            var answer = number
            if (number < 0) {
                answer = 'undefined, number must be an integer >= 0'
            }
            while (number > 1) {
                answer = answer * (number - 1)
                number--
            }
            return answer
        },
        combination: function (n, r) {
            if (n < r) {
                return 0
            }

            var r2num = parseFloat(n) - parseFloat(r)
            var n1 = this.calculate(parseFloat(n))
            var r1 = this.calculate(parseFloat(r))
            var r2 = this.calculate(r2num)
            if (r1 == 0) {
                r1 = eval(1)
            }
            if (r2 == 0) {
                r2 = eval(1)
            }
            const cboAnswer = Math.round(n1 / (r1 * r2))
            return cboAnswer
        },
        permutation: function (n, r) {
            if (n < r) {
                return 0
            }
            var r2num = parseFloat(n) - parseFloat(r)
            var n1 = this.calculate(parseFloat(n))
            var r1 = this.calculate(parseFloat(r))
            var r2 = this.calculate(r2num)
            if (r1 == 0) {
                r1 = eval(1)
            }
            if (r2 == 0) {
                r2 = eval(1)
            }
            const cboAnswer = Math.round(n1 / r2)
            return cboAnswer
        },
        timeDown: function (value) {
            var theTime = parseInt(value) // 秒
            var theTime1 = 0 // 分
            var theTime2 = 0 // 小时
            if (theTime > 59) {
                theTime1 = parseInt(theTime / 60)
                theTime = parseInt(theTime % 60)
                if (theTime1 > 59) {
                    theTime2 = parseInt(theTime1 / 60)
                    theTime1 = parseInt(theTime1 % 60)
                }
            }
            var result = String(String(theTime < 10 ? '0' : '') + parseInt(theTime))
            result = String(theTime1 < 10 ? '0' : '') + parseInt(theTime1) + ':' + result
            result = String(theTime2 < 10 ? '0' : '') + parseInt(theTime2) + ':' + result
            return result
        },

        ShowCountDown: function (endtime) {
            var now = new Date()
            var leftTime = endtime - parseInt(now.getTime())
            var leftsecond = parseInt(leftTime / 1000)
            return leftsecond > 0 ? this.timeDown(leftsecond) : 'end'
        },
        /**
         * 随机获取一注
         * @param array,boolean,int,int,int.... 基础球,是否可以取重复,取多少个
         */
        randomOne: function () {
            var r = []
            var t = []
            var balls = arguments[0]
            var isSame = arguments[1]
            for (var i = 2, len = arguments.length; i < len; i++) {
                if (arguments[i] != undefined) {
                    t = arguments[i] == 0 ? [] : this.getRandom(balls, arguments[i])
                    if (!isSame) {
                        balls = this.arrayDiff(balls, t)
                    }
                    r.push(t)
                }
            }
            return r
        },
        getRandom: function (balls, num) {
            var m = balls.length
            var t = 0
            var i = 0
            while (m) {
                i = Math.floor(Math.random() * m--)
                t = balls[m]
                balls[m] = balls[i]
                balls[i] = t
            }
            return balls.slice(0, num)
        },

        //去除重复数
        arrayDiff: function (a, b) {
            for (var i = 0; i < b.length; i++) {
                for (var j = 0; j < a.length; j++) {
                    if (a[j] == b[i]) {
                        a.splice(j, 1)
                        j--
                    }
                }
            }
            return a
        },
        createArr: (num) => {
            return [...Array(num)].map(function (e, i) {
                return i
            })
        },
        /**
         * 去除小数点后多余0
         */
        cutZero: (old) => {
            var newstr = old
            var leng = old.length - old.indexOf('.') - 1
            if (old.indexOf('.') > -1) {
                for (var i = leng; i > 0; i--) {
                    if (newstr.lastIndexOf('0') > -1 && newstr.substr(newstr.length - 1, 1) == 0) {
                        var k = newstr.lastIndexOf('0')
                        if (newstr.charAt(k - 1) == '.') {
                            return newstr.substring(0, k - 1)
                        } else {
                            newstr = newstr.substring(0, k)
                        }
                    } else {
                        return newstr
                    }
                }
            }
            return old
        },
        /**
         * 按位切割数组
         */
        splitArr: (arr, length) => {
            var result = []
            for (var i = 0, len = arr.length; i < len; i += length) {
                result.push(arr.slice(i, i + length))
            }
            return result
        },

        //表单验证
        valiForm: function(form, rules) {
            function vali(val, msg, reg, required = true) {
                if(required) { //必须
                    if(!val || !reg.test(val)) {
                        Layer.toast(msg)
                        return false
                    } else {
                        return true
                    }
                } else { //非必须
                    if(!val) {
                        return true
                    } else if (!reg.test(val)) {
                        Layer.toast(msg)
                        return false
                    } else {
                        return true
                    }
                }
            }
            let rtn = true
            for(let key in form) {
                rtn = rtn && vali(form[key], rules[key].message, rules[key].reg, rules[key].required)
                if(!rtn) {return false}
            }
            return true
        },

        //千位分隔符
        thousandBitSeparator(num) {
            return num && (num.toString().indexOf('.') != -1 ?
                num.toString().replace(/(\d)(?=(\d{3})+\.)/g, ($0, $1) => {return $1 + ',' }):
                num.toString().replace(/(\d)(?=(\d{3}))/g, ($0, $1) => {return $1 + ','}))
        }
    }
}
