// import './apply.less'
import angular from 'angular'

export default class {
    constructor($scope, Layer, $state, Core, RS) {
        this.$scope = $scope
        this.$state = $state
        this.Layer = Layer
        this.Core = Core
        this.$RS = RS
        $scope.register = this.register.bind(this)
        $scope.isSubmit = false
        $scope.formData = {}
        $scope.isDisabled = false
        $scope.isStatusNoTow = false
        $scope.formData.user_memo = ' '
        this.$scope.rules = {
            phone: {
                required: true,
                message: '手机号码格式不正确!',
                reg: /^1[34578]\d{9}$/
            },
            email: {
                required: true,
                message: '邮箱格式不正确!',
                reg: /^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/
            },
            qq: {
                required: true,
                message: 'qq或微信号格式不正确!',
                reg: /^\w{6,16}$/
            },
            user_memo: {
                required: false,
                message: '字数只能50个以内',
                reg: /^.{1,50}$/
            }
        }
        this.init()
    }
    init() {//判断有没有登录
        this.checkAuditStatus()
    }
    checkAuditStatus() {
        const _this = this
        this.$RS.getAuditStatus().then((data) => {
            var c = angular.fromJson(data)
            if (c.code == 200) {
                let statusDate = c.data
                if (statusDate.status) {//审核中的状态
                    _this.$scope.isDisabled = true
                    _this.$scope.isSubmit = true
                    if(statusDate.status == 2) {
                        _this.$scope.isStatusNoTow = true
                    }
                    _this.$scope.formData.phone = statusDate.phone
                    _this.$scope.formData.email = statusDate.email
                    _this.$scope.formData.qq = statusDate.qq
                    _this.$scope.formData.user_memo = statusDate.user_memo
                    _this.$scope.memo = statusDate.memo
                    _this.checkStatusTips(c.data.status)
                }
            } else {
                _this.Layer.toast(c.msg)
            }
        })
    }
    checkStatusTips(status) {
        switch (status) {
            case '1':
                this.$scope.statusTips = '审核中....'
                break
            case '2':
                this.$scope.statusTips = '请补充资料'
                this.$scope.isDisabled = false
                break
            case '3':
                this.$scope.statusTips = '申请已被系统拒绝...'
                break
            case '4':
                this.$state.go('proxy')
                break
            default:
                this.$state.go('tabs.my')
        }
    }
    register() {
        const _this = this
        const form = this.$scope.formData
        const rules = this.$scope.rules
        //提交
        if(!_this.Core.valiForm(form, rules)) {return false}
        this.$RS.submitAudit(form).then((res) => {
            if(res.code == 200) {
                _this.checkAuditStatus()
            } else {
                _this.Layer.toast(res.msg)
            }
        })
    }
}
