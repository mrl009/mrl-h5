import './topup-two.less'
import angular from 'angular'
import { copy } from '../../service/util'

export default class {
    constructor($scope, Core, Layer, DB, $state, RS, DT) {
        this.$scope = $scope
        this.Core = Core
        this.Layer = Layer
        this.DB = DB
        this.DT = DT
        this.$state = $state
        this.RS = RS

        $scope.copyUrl = this.copyUrl.bind(this)
        $scope.setBankStyle = this.setBankStyle.bind(this)
        $scope.topUp = this.topUp.bind(this)
        $scope.items = {}

        this.init()
    }

    init() {
        this.DB.getItem('bankData').then((item) => {
            this.$scope.items = item
            this.$scope.data = {
                money: item.money,
                id: item.id,
                time: this.DT.dtToString(new Date(), '-', true),
                code: item.code,
                from_way: item.from_way,
                name: ''
            }
            switch (item.type) {
                case 'bank':
                    this.$scope.data.bank_style = 1
                    break
                case 'zfb':
                    this.$scope.data.bank_style = 6
                    break
                case 'wx':
                    this.$scope.data.bank_style = 7
                    break
                default:
                        this.$scope.data.bank_style = item.jump_mode == 2? 5:0
            }
        })
    }
    topUp() {
        if (this.$scope.data.money <= 0) {
            this.Layer.toast('请输入充值金额')
            return false
        }
        if (this.$scope.data.name == '') {
            this.Layer.toast('请输入存款人姓名')
            return false
        }
        if (this.$scope.items.jump_mode !=2 && this.$scope.data.bank_style == 0) {
            this.Layer.toast('请选择充值方式!')
            return false
        }
        this.RS.payDo(this.$scope.data).then((json) => {
            var c = angular.fromJson(json)
            if (c.code == 200) {
                this.Layer.toast('充值成功!', 1, () => {
                    this.$state.go('topUpFinish')
                })
            } else {
                this.Layer.toast(c.msg)
            }
        })
    }
    setBankStyle(bank_style) {
        this.$scope.data.bank_style = bank_style
    }

    copyUrl(btn, id) {
        copy(`.${btn}`, `#${id}`, () => {
            this.Layer.toast('复制成功', 1)
        })
    }
}
