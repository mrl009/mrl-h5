// import './register.less'
//import angular from 'angular'
// import $ from 'zepto'
import { API } from '../../config'
import md5 from 'md5'

export default class {
    constructor($scope, Layer, Core, Util, RS, $state, $timeout, $cookieStore, $rootScope) {
        this.$scope = $scope
        this.$rootScope = $rootScope
        this.layer = Layer
        this.Core = Core
        this.util = Util
        this.$RS = RS
        this.$state = $state
        this.$timeout = $timeout

        $scope.submit = this.submit.bind(this)
        $scope.getCode = this.getCode.bind(this)
        this.getCode()

        $scope.data = {
            username: '',
            bank_name: '',
            password: '',
            repwd: ''
        }
        $scope.isFillForm = true
        $scope.data.agent_id = $cookieStore.get('intr') || ''
        $scope.is_agent_id = $cookieStore.get('intr') || false
        $scope.is_show_agent = this.$rootScope.IS_AGENT == undefined ? 1 : this.$rootScope.IS_AGENT
        $scope.is_show_code = this.$rootScope.ROVCODE == undefined ? 1 : this.$rootScope.ROVCODE
        $scope.is_show_bankname = this.$rootScope.IS_BANK_NAME == undefined ? 1 : this.$rootScope.IS_BANK_NAME
        $scope.rules = {
            username: {
                required: true,
                reg: /^[a-zA-Z0-9]{4,14}$/,
                message: '请输入4~14位会员账号'
            },
            password: {
                required: true,
                reg: /^\w{6,12}$/,
                message: '密码必须为6~12位有效字符'
            },
            repwd: {
                required: true,
                reg: /^\w{6,12}$/,
                message: '两次密码输入不一致!'
            },
            agent_id: {
                required: false,
                reg: /^\d{1,10}$/,
                message: '邀请码不正确'
            },
            bank_name: {
                required: false,
                reg: /^[\u4E00-\u9FA5]{2,5}(?:·[\u4E00-\u9FA5]{2,5})*$/,
                message: '姓名格式不正确'
            }
        }
        $scope.codeSrc = ''
        $scope.token_private_key = ''
        this.formatRule()
    }

    getCode() {
        this.$RS.getCode().then((c) => {
            if (c.code == 200) {
                this.$scope.token_private_key = c.data.token_private_key
                this.$scope.codeSrc = API + '/login/code?token_private_key=' + c.data.token_private_key
            }
        })
    }

    formatRule() { //检测密码强度
        const _this = this
        _this.$RS.getSystem().then((c) => {
            if (c.code == 200) {
                _this.$scope.is_show_agent = c.data.is_agent
                _this.$rootScope.IS_AGENT = c.data.is_agent
                _this.$scope.is_show_code = c.data.register_open_verificationcode
                _this.$rootScope.ROVCODE = c.data.register_open_verificationcode
                _this.$rootScope.IS_BANK_NAME = c.data.register_open_username
                _this.$scope.is_show_bankname = c.data.register_open_username
                if (c.data.strength_pwd == 1) {
                    _this.$scope.rules.password = {
                        required: true,
                        reg: /^(?![^a-zA-Z]+$)(?!\D+$).{6,12}/,
                        message: '请输入6~12位密码,至少包含一个字母和一个数字,不能包含空格'
                    }
                }
                if (c.data.is_agent == 2) {
                    _this.$scope.rules.agent_id = {
                        required: true,
                        reg: /^\d{1,10}$/,
                        message: '仅限邀请注册,请输入邀请码'
                    }
                }
                if(c.data.register_open_verificationcode == 1) {
                    _this.$scope.rules.code = {
                        required: true,
                        reg: /^\w{4}$/,
                        message: '验证码不正确'
                    }
                }
                if (c.data.register_open_username == 1) {
                    _this.$scope.rules.bank_name.required = true
                }
                _this.$scope.$watch('data', (val) => {
                    let isFillForm = true
                    for(let key in _this.$scope.rules) {
                        if(_this.$scope.rules[key].required) {
                            isFillForm = isFillForm && !!val[key]
                        }
                    }
                    _this.$scope.isFillForm = isFillForm
                }, true)
            }
        })
    }

    submit() {
        const _this = this
        this.$scope.rules.repwd.reg = new RegExp(this.$scope.data.password, 'i')
        if(!_this.Core.valiForm(_this.$scope.data, _this.$scope.rules)) {
            return false
        }

        var postData = {
            username: this.$scope.data.username,
            bank_name: this.$scope.data.bank_name,
            pwd: this.$scope.data.password && md5(this.$scope.data.password),
            agent_id: this.$scope.data.agent_id,
            yzm: this.$scope.data.code,
            token_private_key: this.$scope.token_private_key,
            ip: '192.168.8.192'
        }
        this.$RS
            .register(postData)
            .then((res) => {
                if (res.code == 200) {
                    _this.Core.setToken(res.data.token)
                    _this.layer.toast('注册成功!', 1, () => {
                        _this.Core.setCookie('from_register', 1)
                        _this.$state.go('tabs.my')
                    })
                } else {
                    _this.layer.toast(res.msg)
                    _this.getCode()
                }
            })
    }
}
