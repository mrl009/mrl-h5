import angular from 'angular'
import md5 from 'md5'
import $ from 'zepto'

import { API } from '../../config'

// import './login.less'

export default class {
	constructor(
        $rootScope,
		$scope,
		$state,
		Util,
		Core,
		$stateParams,
		Layer,
		$timeout,
		RS
	) {
		this.$state = $state
		this.Util = Util
		this.$scope = $scope
		this.$rootScope = $rootScope
		this.Core = Core
		this.L = Layer
		this.$timeout = $timeout
		this.RS = RS

		$scope.data = {
			username: '',
			pwd: '',
			p_pwd: '',
			code: '',
			codeSrc: '',
			token_private_key: '',
			isCode: false
		}

		this.initPage()
		this.ret = $stateParams.ret ? angular.fromJson($stateParams.ret) : {}

		$scope.goNext = this.goNext.bind(this)
		$scope.codeRefresh = this.codeRefresh.bind(this)
		$scope.login = this.login.bind(this)
        $scope.seePwd = this.seePwd.bind(this)
		$scope.wjtip = this.wjtip.bind(this)
	}

	initPage() {
		if (this.Core.getToken()) {
            this.$state.go('tabs.home')
        } else {
        	this.initNeedsCode()
	        this.getTokenAndCode()
        }
	}

	goNext(url) {
		this.$state.go(url)
	}

	wjtip () {
		this.L.toast('请联系在线客服找回密码')
	}

	// 是否需要验证码
	initNeedsCode() {
		this.RS
			.needCode()
			.then((json) => {
				if (json.code == 200) {
	                this.$scope.data.isCode = json.data.is_code == 1 ? true : false
	            }
			})
	}

	//眼睛密码可视化
    seePwd() {
        $('input[type="password"]').attr('type', 'text').addClass('pwd')
        if(this._t) {
            return
        }
        this._t = this.$timeout(() => {
            this.$timeout.cancel(this._t)
            this._t = 0
            $('.pwd').attr('type', 'password').removeClass('pwd')
        }, 2000)
    }

	codeRefresh() {
		this.$scope.data.codeSrc = this.$scope.data.codeSrc + '&time=' + Math.random() + new Date().getTime()
        // $('.code-img').attr('src', _this.$scope.data.codeSrc + '&time=' + Math.random() + new Date().getTime())
    }

    // 获取token-key和验证码url
    getTokenAndCode() {
		this.RS
			.getToken(true)
			.then((c) => {
                if(c.code == 200) {
                    this.$scope.data.token_private_key = c.data.token_private_key || ''
                    this.$scope.data.codeSrc = API + 'login/code?token_private_key=' + c.data.token_private_key
                }else {
                    this.L.toast(c.msg, 1)
                }
			})
    }

    login() {
    	const {username, pwd= null, code, token_private_key} = this.$scope.data
    	if (
    		!/^\w{4,20}$/.test(username) ||
    		username == undefined
    	) {
        	this.L.toast('用户名为4~14位')
            return false
        }

        if (
        	this.$scope.data.isCode &&
        	!/^\d{4}$/.test(this.$scope.data.code)
        ) {
            this.L.toast('请输入四位数字验证码')
            return false
        }

        if (!pwd) {
        	this.L.toast('请输入密码!')
        	return false
        }
        const password = md5(pwd)
        const param = {
            username,
            pwd: password,
            code,
            token_private_key
        }
		this.RS
			.login(param)
			.then((c) => {
				if (c.code == 200) {
	                this.Core.setToken(c.data.token)
                    this.Core.removeCookie('from_register')
                    //定时登陆start
                    this.RS
                        .rLogin()
                        .then((c) => {
                            if (c.code == 200) {
                                this.Core.setToken(c.data.token)
                                const rParam = Object.assign(param,
                                    {
                                        refresh_time: c.data.refresh_token,
                                        expires_time: new Date().getTime() + parseInt(c.data.refresh_token * 1000),
                                        auto_login: md5('username=' + param.username + '&pwd=' + param.pwd)
                                    })
                                this.Core.setCookie('loginData', rParam)
                                this.$rootScope.loginLoop(rParam.refresh_time * 1000)
                            }
                        })
                    //定时登陆end
	                var url = this.ret.url ? this.ret.url : 'tabs.home'
	                var params = this.ret.params ? this.ret.params : ''
					this.L.toast('登陆成功!', 1, () => {
						this.$state.go(url, params)
					})
	            } else {
	                if (c.code == 425) {
	                	this.$scope.data.isCode = true
	                }
	                this.L.toast(c.msg)
	                this.getTokenAndCode()
	            }
			})
    }
}
