// import angular from 'angular'

export default class {
	constructor($scope, Core, $timeout, Layer, $state, RS, $rootScope, CS) {
		$scope.lock = false
		this.$timeout = $timeout
		this.S = $scope
        this.C = Core
        this.CS = CS
        this.L = Layer
        this.$S = $state
        this.RS = RS
        this.$rootScope = $rootScope

		$scope.isLogin = !!Core.getToken()
		$scope.data = {
		    img: ''
        }
        $scope.imgs = []
        $scope.checkImgIndex = 0

		$scope.refresh = this.refresh.bind(this)
		$scope.uploadAvatar = this.uploadAvatar.bind(this)
        $scope.showWithdraw = this.showWithdraw.bind(this)
        $scope.showPhotos = this.showPhotos.bind(this)
        $scope.selectPicture = this.selectPicture.bind(this)
        $scope.jumpTo = this.jumpTo.bind(this)
        $scope.checkLogin = this.checkLogin.bind(this)
        this.init()
	}

    showPhotos() {
        const _this = this
	    _this.RS.getTouXiang().then((res) => {
	        if(res.code == 200) {
	            _this.S.imgs = res.data

                _this.S.modal = _this.L.confirmForm({
                    title: '请选择头像',
                    url: 'change-photos.html',
                    scope: _this.S,
                    confirm: () => {
                        let url = _this.S.imgs[_this.S.checkImgIndex]
                        _this.S.data.img = url
                        _this.RS.setDefaultPortrait(url).then((res) => {
                            console.log(res)
                        })
                        // _this.S.$apply(_this.S.data.img)
                    }
                })
            }
        })
    }

    selectPicture(index) {
        if(index == this.S.checkImgIndex) {
	        return
        }
        this.S.checkImgIndex = index
    }

    //图片上传
    uploadAvatar(input) {
        let file = input.target.files[0]
        if(!file) {
            return
        }
        if(typeof FileReader === 'undefined') {
            this.L.toast('浏览器版本过低!')
            return
        } else if (!/image\/\w+/.test(file.type)) {
            this.L.toast('请确认上传图片格式为jpg或png!')
            return
        } else if (file.size > 1024*1024) {
            this.L.toast('图片大小不能超过1M!')
            return
        }
        let data = new FormData()
        data.append('file', file)
        this.S.modal.hide()
        let l = this.L.loading()
        this.RS.upDataAvatar(data).then((res) => {
            if(res.status == 200 && res.data.code == 200) {
                this.S.modal.remove()
                l && l.close()
                this.init()
                this.L.toast('头像更新成功!')
            }
        })
    }

    refresh() {
    	const _this = this
        if(this.S.lock) {
            return
        }
        this.S.lock = true
        this.S.clicked = 'clicked'

        this.S.data.balance = '正在刷新'
        var _b = 0
        this.RS.getBalance(false, {needLoading: false})
            .then((res) => {
                if(res.code == '200') {
                    _b = this.C.thousandBitSeparator(res.data.balance.toFixed(2))
                }
            })
        var _timer = this.$timeout(function() {
            _this.$timeout.cancel(_timer)
            _this.S.data.balance = _b
            _this.S.clicked = null
            _this.S.lock = false
        }, 2000)
    }
    checkLogin(e) {
	    if(!this.C.getToken()) {
	        e.preventDefault()
	        this.L.toast('请先登录!')
        }
    }
    jumpTo(url, needLogin, ret) {
        needLogin = needLogin == false ? needLogin : true
        ret = ret == '' ? '' : ret
        if (needLogin && !this.S.isLogin) {
            this.L.toast('请先登录')
        } else {
            if (ret != '') {
                this.$S.go(url, {ret: ret})
            }else {
                this.$S.go(url)
            }
        }
    }

    init() {
        const _this = this
        if(_this.S.isLogin) {
            _this.$timeout(function () {
                const isRegister = _this.C.getCookie('from_register')
                _this.C.removeCookie('from_register')
                if (isRegister == 1) {
                    _this.L.confirm({
                        title: '请第一时间绑定收款方式',
                        msg: '率先支持微信支付宝银行卡提款',
                        cancelText: '知道了',
                        yesText: '去绑定',
                        yesFn: () => {
                            _this.$S.go('userCard')
                        }
                    })
                }
            }, 500)
            _this.RS
                .getBalance(false)
                .then((json) => {
                    if (json.code == 200) {
                        _this.S.data = json.data
                        _this.S.data.balance = _this.C.thousandBitSeparator(json.data.balance.toFixed(2))
                        _this.S.data.img = _this.S.data.img == 0? _this.$rootScope.DEFAULT_IMG: _this.S.data.img
                    }else {
                        _this.S.isLogin = false
                    }
                })
        }
        //检查会员消息公告
        _this.RS.getNotice().then((res) => {
            if(res.code == 200) {
                let info = res.data.is_new_notice
                this.$rootScope.hasMemberNotice = info
            }
        })
    }

    showWithdraw() {
        if(!this.S.isLogin) {
            this.L.toast('请先登录')
            return false
        }

        if (this.S.data.binding !=1 || this.S.data.bank_pwd !=1 ) {
            /*var _title = '', _url = ''

            if(this.S.data.binding !=1 ) {
                this.S.ret = angular.toJson({url: 'bindCard', params: {ret: 'withdraw-record'}})
                _title = '请绑定银行卡'
                _url = 'bindCard'
            }else if(this.S.data.bank_pwd !=1 ) {
                this.S.ret = angular.toJson({url: 'withdraw-record'})
                _title = '请先设置资金密码'
                _url = 'modifyMoneyPwd'
            }

            this.L.confirm({
                title: _title,
                msg: _title,
                yesFn: () => {
                    this.$S.go(_url)
                }
            })*/
            this.L.confirm({
                title: '请绑定收款方式',
                msg: '去绑定银行卡或微信支付宝',
                yesFn: () => {
                    this.$S.go('userCard')
                }
            })
        } else {
            const token = this.C.getToken()
            this.RS
                .getOutShow({token}, '不缓存')
                .then((res) => {
                    if(res.code == 200) {
                        sessionStorage.setItem('drawState', '')
                        this.$S.go('withdraw')
                    } else {
                        this.L.toast(res.msg)
                        sessionStorage.setItem('drawState', res.msg)
                    }
                })
        }
    }
}
