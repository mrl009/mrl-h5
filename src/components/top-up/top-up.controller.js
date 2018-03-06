//import $ from 'zepto'
export default class {
    constructor($scope, Core, $sce, Layer, DB, $timeout, $state, RS) {
        this.S = $scope
        this.C = Core
        this.$S = $sce
        this.L = Layer
        this.DB = DB
        this.$T = $timeout
        this.$state = $state
        this.RS = RS
        //let num = parseFloat(Math.random().toFixed(2))
        $scope.moneyArr = [50, 100, 300, 500, 800, 1000, 2000, 3000]
        $scope.paycard = { card_pwd: '' }
        $scope.pay = { money: '' }
        $scope.lock = false
        $scope.payList = []
        this.S.lock = false
        $scope.payIndex = null
        this.init()

        $scope.changeMoney = this.changeMoney.bind(this)
        $scope.okAlert = this.okAlert.bind(this)
        $scope.paySelect = this.paySelect.bind(this)
        $scope.filter = this.filter.bind(this)
    }

    init() {
        this.RS
            .payMethod()
            .then((c) => {
                if (c.code == 200) {
                    this.S.user = c.data.user
                    this.S.payList = c.data.zhifu || []
                    // 充值弹出框
                    this.S.bomb_box = c.data.is_bomb_box.bomb_box
                    this.S.html = this.$S.trustAsHtml(c.data.is_bomb_box.bomb_box)
                    this.S.gg = this.S.html ? this.L.popupFromUrl('topUpAlert.html', {scope: this.S}) : null
                }
            })
    }

    filter() {
        if(/\D/g.test(this.S.pay.money)) {
            this.S.pay.money = this.S.pay.money || ''
            this.S.pay.money = this.S.pay.money.replace(/[^\d{1,}\.\d{1,}|\d{1,}]|^0{1,}\d{1,}|[\,,\|,\{,\}]{1,}/g, '')
            if(this.S.pay.money.indexOf('.') > -1 && this.S.pay.money.split('.')[1] != '' && this.S.pay.money.split('.')[1].length > 2) {
                this.S.pay.money = parseFloat(parseInt(this.S.pay.money * 100) / 100)
            }
        }
    }
    okAlert() {
        this.S.gg && this.S.gg.close()
    }

    changeMoney (v) {
        this.S.pay.money = parseFloat(v)
    }

    paySelect(name, type, item, index) {
        if (this.S.lock) {
            return
        }
        this.lock()
        this.S.payIndex = index
        this.S.pay.type = type
        this.S.pay.name = name
        // var $span = $(event.target).parents('.tab-list-content').find('span')
        // //选中状态
        // $('.pay').removeClass('active')
        // $span.parent().addClass('active')
        //基础属性
        // this.S.type = $span.attr('type')
        this.S.type = type
        this.S.catm = { catm_min: item.catm_min, catm_max: item.catm_max }
        const fnName = this.S.type ? `set${this.S.type.charAt(0).toUpperCase() + this.S.type.slice(1)}` : 'set'

        this[fnName] && this[fnName](item)
        !this[fnName] && this.setOther(item)
        this.topUp()
    }

    lock() {
        const _this = this
        _this.S.lock = true
        _this.$T(function () {
            _this.S.lock = false
        }, 500)
    }

    setCard(item) {
        this.S.data = {
            id: item.id,
            code: item.code,
            jump_mode: item.jump_mode,
            is_confirm: item.is_confirm,
            card_pwd: this.S.paycard.card_pwd,
            from_way: 4
        }
    }

    setWy(item) {
        this.S.data = {
            money: parseFloat(this.S.pay.money),
            id: item.id,
            code: item.code,
            jump_mode: item.jump_mode,
            is_confirm: item.is_confirm,
            qrcode: item.qrcode,
            bank_type: item.bank_type,
            from_way: 4
        }
    }

    setBank(item) {
        this.S.data = {
            type: this.S.pay.type,
            money: parseFloat(this.S.pay.money),
            name: this.S.pay.name,
            id: item.id,
            code: item.code,
            jump_mode: item.jump_mode,
            is_confirm: item.is_confirm,
            qrcode: item.qrcode,
            bank_name: item.bank_name,
            user: item.name,
            card_address: item.card_address,
            num: item.num,
            bank_style: '',
            from_way: 4
        }
    }

    setOther(item) {
        this.S.data = {
            type: this.S.pay.type,
            name: this.S.pay.name,
            money: parseFloat(this.S.pay.money),
            id: item.id,
            code: item.code,
            jump_mode: item.jump_mode,
            is_confirm: item.is_confirm,
            qrcode: item.qrcode,
            from_way: 4,
            bank_name: item.bank_name,
            card_address: item.card_address,
            user: item.name,
            num: item.num
        }
    }

    //充值开始
    topUp () {
        if (!this.S.data || !this.S.data.id) {
            this.L.toast('请选择充值方式', 1)
            return false
        }
        this.S.data.money = this.S.data.money === ''? 0: this.S.data.money

        if (!this.S.data.money || this.S.data.money < 0) {
            this.L.toast('请输入充值金额', 1)
            return false
        } else if (this.S.data.money < this.S.catm.catm_min) {
            this.L.toast('最少充值金额为' + this.S.catm.catm_min+'元', 1)
            return false
        } else if (this.S.data.money > this.S.catm.catm_max) {
            this.L.toast('该方式充值上限为' + this.S.catm.catm_max+'元', 1)
            return false
        }

        if (this.S.type == 'bank' || this.S.data.jump_mode == 2) {
            // sessionStorage.setItem('bankData', JSON.stringify(this.S.data))
            this.DB.saveData({key: 'bankData', data: JSON.stringify(this.S.data)}, () => {
                this.$state.go('topupTwo')
            })
            return false
        }

        if (this.S.data.jump_mode == 4) {
            this.S.data.confirm = ''
            this.S.data.title = this.S.data.name+'好友转账支付'
            this.DB.saveData({key: 'payData', data: JSON.stringify(this.S.data)}, () => {
                this.$state.go('wxAccount')
            })
        } else {
            this.RS.payDo(this.S.data)
                .then((c) => {
                    if (c.code == 200) {
                        let info = c.data
                        this.S.data.money = info.money
                        if (this.S.pay.type == 'card') {
                            this.L.toast('充值成功', 1, () => {
                                this.$state.go('tab.my')
                            })
                            return false
                        }
                        if(info.jump == 3) {//二维码扫码支付
                            this.S.data.title = this.S.data.name+'-扫码支付'
                            this.S.data.jump = info.jump
                            this.DB.saveData({key: 'payData', data: JSON.stringify( Object.assign(this.S.data, info))}, () => {
                                this.$state.go('wxAccount')
                            })
                            return false
                        }else if(info.jump == 5) { //跳走
                            window.location.href = info.url
                            return false
                        }else {
                            this.DB.saveData({key: 'payData', data: JSON.stringify(info)}, () => {
                                this.$state.go('topUpConfirm')
                            })
                        }
                    }else {
                        this.L.toast(c.msg, 1)
                    }
                })
        }
    }
}
