import './wx-accounts.less'
import 'animate.css'
import { copy } from '../../service/util'
export default class {
    constructor($scope, Layer, Core, $state, RS, DB, $sce) {
        this.$scope = $scope
        this.Layer = Layer
        this.Core = Core
        this.$state = $state
        this.A = $sce
        this.RS = RS
        this.DB = DB

        $scope.type = 1
        $scope.payData = {}
        $scope.stepContent = {}
        $scope.showPayBtn = false
        $scope.copyWx = this.copyWx.bind(this)
        $scope.checkPay = this.checkPay.bind(this)
        this.init()
    }

    init() {
        this.$scope.showPayBtn = !(/Android|BlackBerry|SymbianOS/i.test(navigator.userAgent))
        this.DB.getData('payData', (data) => {
            let info = JSON.parse(data)
            this.$scope.payData = info
            this.$scope.img = info.qrcode? info.qrcode: info.img
            switch (info.type) {
                case 'wx' :
                        this.$scope.textId = info.jump == 3 ? 12: 13
                        this.$scope.payUrl = 'weixin://scanqrcode'
                    break
                case 'zfb':
                        this.$scope.textId = info.jump == 3 ? 14: 15
                        this.$scope.payUrl = 'alipayqr://platformapi/startapp?saId=10000007'
                    break
                case 'qq':
                        this.$scope.textId = info.jump == 3 ? 22: 23
                        this.$scope.payUrl = ''
                    break
                case 'jd':
                        this.$scope.textId = 24
                        this.$scope.payUrl = ''
                    break
                case 'yl':
                        this.$scope.textId = 30
                        this.$scope.payUrl = ''
                    break
                case 'cft':
                        this.$scope.textId = info.jump == 3 ? 28: 29
                        this.$scope.payUrl = ''
                    break
                case 'kj':
                        this.$scope.textId = 26
                        this.$scope.payUrl = ''
                    break
                case 'syt':
                        this.$scope.textId = 30
                        this.$scope.payUrl = ''
                    break
                default:
                    this.$scope.textId = 0
            }
            this.RS.wxStep(this.$scope.textId).then((res) => {
                if(res.code == 200) {
                    this.$scope.stepContent = res.data[0]
                    this.$scope.stepContent.content = this.A.trustAsHtml(this.$scope.stepContent.content)
                }
            })
        })
    }

    checkPay() {
        if(this.$scope.payData.jump == 3) {//如果是第三方支付
            this.$state.go('tabs.my')
            return true
        }

        let data = {
            id: this.$scope.payData.id,
            code: this.$scope.payData.code,
            money: this.$scope.payData.money,
            confirm: this.$scope.payData.order_num? this.$scope.payData.order_num.slice(-9): ''
        }
        this.RS.wxSubmit(data).then((res) => {
            if(res.code == 200) {
                this.Layer.toast('检测成功', 1, () => {
                    this.$state.go('tabs.my')
                })
            }else {
                this.Layer.toast(res.msg)
            }
        })
    }
    copyWx(btn, id) {
        copy(`.${btn}`, `#${id}`, () => {
            this.Layer.toast('复制成功', 0.5)
        })
    }
}
