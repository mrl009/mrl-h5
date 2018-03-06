// import './set.less'
import angular from 'angular'

export default class {
    constructor($scope, Layer, Core, $timeout, $state, RS) {
        this.S = $scope
        this.L = Layer
        this.C = Core
        this.$timeout = $timeout
        this.$S = $state
        this.RS = RS
        this.S.isSetBankPwd = ''

        $scope.logout = this.logout.bind(this)
        $scope.isLogin = Core.getToken()
        this.checkPwd()
    }

    logout() {
        const _this = this
        this.L.confirm({
            title: '退出登录',
            msg: '是否退出登录？',
            yesFn: function () {
                _this.C.get('login/logout', function (json) {
                    var c = angular.fromJson(json)
                    if (c.code == 604) {
                        _this.C.removeToken()
                        _this.C.removeCookie('loginData')
                        _this.L.toast(c.msg)
                        _this.$timeout(function () {
                            _this.$S.go('tabs.my')
                        }, 1000)
                    } else {
                        _this.L.toast(c.msg)
                    }
                })
            }
        })
    }

    checkPwd() {
        if(this.C.getToken()) {
            this.RS
                .getBalance()
                .then((c) => {
                    if (c.code == 200) {
                        let pwd = c.data.bank_pwd
                        this.S.isSetBankPwd = pwd? '已设置' : '未设置'
                    }
                })
        }
    }
}
