// import './modifyMoneyPwd.less'
import md5 from 'md5'
export default class {
    constructor($scope, RS, Layer, $state, Core, $stateParams) {
        this.S = $scope
        this.$stateParams = $stateParams
        this.RS = RS
        this.L = Layer
        this.C = Core
        this.$S = $state
        $scope.rules = {
            bank_name: {
                required: true,
                reg: /^[\u4e00-\u9fa5]{2,16}$/,
                message: '姓名不正确!'
            },
            phone: {
                required: true,
                reg: /^1[3,5,6,7,8]\d{9}$/,
                message: '手机号码格式不正确!'
            },
            bank_pwd: {
                required: true,
                reg: /^\d{6}$/,
                message: '密码格式不正确!'
            },
            new_pwd: {
                required: true,
                reg: /^\d{6}$/,
                message: '新密码格式不正确!'
            },
            r_new_pwd: {
                required: true,
                reg: /^\d{6}$/,
                message: '与新密码不一致!'
            }
        }
        $scope.data = {}
        $scope.checkType = $stateParams.type
        this.S.modifyMoneyPwd = this.modifyMoneyPwd.bind(this)
        this.S.submitPwd = this.submitPwd.bind(this)
        this.getUserBalance()
    }

    getUserBalance() { //判断用户资金密码
        this.S.title = this.S.checkType == 1 ? '修改资金密码' : '设置资金密码'
        if(this.S.checkType == 1) {
            this.S.form = {
                bank_pwd: '',
                new_pwd: '',
                r_new_pwd: ''
            }
        } else if(this.S.checkType == 2) {
            this.S.form = {
                bank_name: '',
                phone: '',
                bank_pwd: ''
            }
        }
    }

    submitPwd() { //修改密码
        this.S.rules.r_new_pwd.reg = new RegExp(this.S.form.new_pwd, 'i')
        if (!this.C.valiForm(this.S.form, this.S.rules)) {
            return false
        }
        let params = {
            bank_pwd: this.S.form.bank_pwd && md5(this.S.form.bank_pwd),
            new_pwd: this.S.form.new_pwd && md5(this.S.form.new_pwd)
        }
        this.RS.changeBankPwd(params).then((c) => {
                if (c.code == 200) {
                    console.log(c)
                    this.L.toast('修改成功', 0.5, () => {
                        this.$S.go('tabs.my')
                    })
                } else {
                    this.L.toast(c.msg)
                }
            })
    }

    modifyMoneyPwd() { //提交资金密码
        if (!this.C.valiForm(this.S.form, this.S.rules)) {
            return false
        }
        this.S.form.bank_pwd = this.S.form.bank_pwd && md5(this.S.form.bank_pwd)
        console.log(this.S.form)
        this.RS
            .setDrawing(this.S.form)
            .then((res) => {
                this.S.form.pwd = ''
                if (res.code == 200) {
                    if(!res.bank_num) {
                        this.L.toast(res.msg, 1, () => {
                            this.$S.go('tabs.my')
                        })
                    }
                } else {
                    this.L.toast(res.msg)
                }
            })
    }
}
