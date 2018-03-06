import './modifyLoginPwd.less'
import md5 from 'md5'

export default class {
    constructor($scope, RS, Layer, Core, $state) {
        this.S = $scope
        this.RS = RS
        this.L = Layer
        this.$S = $state
        this.C = Core

        $scope.rules = {
            pwd: {
                required: true,
                reg: null,
                message: ''
            },
            new_pwd: {
                required: true,
                reg: null,
                message: ''
            },
            r_new_pwd: {
                required: true,
                reg: null,
                message: '与新密码输入不一致!'
            }
        }
        $scope.form = {
            pwd: '',
            new_pwd: '',
            r_new_pwd: ''
        }
        this.S.modifyLoginPwd = this.modifyLoginPwd.bind(this)
        this.getStrengthPwd()
    }

    getStrengthPwd() {
        this.RS
            .needCode()
            .then((c) => {
                if (c.code == 200) {
                    let info = c.data
                    this.S.rules.pwd.reg = info.strength_pwd == 1 ? /^(?![^a-zA-Z]+$)(?!\D+$).{6,12}/ : /^\w{6,12}$/
                    this.S.rules.pwd.message = info.strength_pwd == 1 ? '请输入6~12位密码,至少包含一个字母和一个数字，不能包含汉字和空格' : '请输入6~12位密码，不能包含汉字和空格'
                    this.S.rules.new_pwd.reg = info.strength_pwd == 1 ? /^(?![^a-zA-Z]+$)(?!\D+$).{6,12}/ : /^\w{6,12}$/
                    this.S.rules.new_pwd.message = info.strength_pwd == 1 ? '新密码,至少包含一个字母和一个数字的6~12位，不能包含汉字和空格' : '新密码不能包含汉字和空格'
                }
            })
    }

    modifyLoginPwd() {
        this.S.rules.r_new_pwd.reg = new RegExp(this.S.form.new_pwd, 'i')
        if (!this.C.valiForm(this.S.form, this.S.rules)) {
            return false
        }
        this.S.form.pwd = md5(this.S.form.pwd)
        this.S.form.new_pwd = md5(this.S.form.new_pwd)
        this.RS.changeLoginPwd({pwd: this.S.form.pwd, new_pwd: this.S.form.new_pwd}).then((c) => {
            if (c.code == 200) {
                this.S.form = {}
                this.C.setToken(c.data.token)
                this.L.toast('修改成功', 1, () => {
                    this.$S.go('tabs.my')
                })
            } else {
                this.L.toast(c.msg)
                this.S.form.pwd = ''
                this.S.form.new_pwd = ''
                this.S.form.r_new_pwd = ''
            }
        })
    }
}
