// import './withdraw.less'
import $ from 'zepto'
import md5 from 'md5'
export default class {
    constructor($scope, Layer, Core, $state, RS, $timeout) {
        this.$scope = $scope
        this.Layer = Layer
        this.Core = Core
        this.$state = $state
        this.RS = RS
        this.tm = $timeout

        !this.Core.getToken() && this.$state.go('tabs.my')

        $scope.withdraw = this.withdraw.bind(this)
        $scope.move = this.move.bind(this)
        $scope.cancel = this.cancel.bind(this)
        $scope.continue = this.continue.bind(this)
        $scope.handleChange = this.handleChange.bind(this)
        $scope.handleFocus = this.handleFocus.bind(this)
        $scope.handleLeave = this.handleLeave.bind(this)
        $scope.sure = this.sure.bind(this)
        $scope.checkType = this.checkType.bind(this)

        $scope.items = {}
        $scope.data = {}
        $scope.out_type = 0
        $scope.$modal = null
        $scope.$modalPutPwd = null

        $scope.pass_len = 6
        $scope.pass_arr = [0, 1, 2, 3, 4, 5]
        $scope.currIdx = -1
        $scope._password = ''
        $scope.pwd = {pwd: ''}
        $scope.outMax = {bank: 0, wx: 0, zfb: 0}
        $scope.outMin = 0

        this.init()
    }

    init() {
        const _this = this
        if (sessionStorage.getItem('drawState')) {
            _this.Layer.toast(sessionStorage.getItem('drawState'), 1, () => {
                _this.$state.go('tabs.my')
            })
            return
        }
        this.RS
            .getWithdrawData()
            .then((res) => {
                if (res.code == 200) {
                    _this.$scope.items = res.data
                    _this.maxAndMin()
                }
            })
    }

    maxAndMin () {
        const _this = this
        if (_this.$scope.items != undefined) {
            _this.$scope.outMin = _this.$scope.items.out_min
            $.each(_this.$scope.items.out_type, function (i, d) {
                switch (i) {
                    case 'bank':
                        _this.$scope.outMax.bank = d.out_max
                        break
                    case 'wx':
                        _this.$scope.outMax.wx = d.out_max
                        break
                    case 'zfb':
                        _this.$scope.outMax.zfb = d.out_max
                        break
                    default:
                        break
                }
            })
        }
    }

    withdraw() {
        const _this = this
        if(!_this.$scope.data.money) {
            _this.Layer.toast('请输入提款金额!')
            return
        } else if (parseFloat(_this.$scope.data.money) < _this.$scope.outMin) {
            _this.Layer.toast('提现最小额度为'+_this.$scope.outMin+'元!')
            return
        } else if(parseFloat(_this.$scope.data.money) > _this.$scope.items.balance - _this.$scope.items.all_fee) {
            _this.Layer.toast('余额不足..!')
            return
        }
        if (parseInt(_this.$scope.items.all_fee) > 0) {
            _this.$scope.$modal = _this.Layer.popup({
                tpl: `<div class="withdraw-alert" ng-show="true">
                     <div class="withdraw-alert-title m-b10">
                         <i class="icon-dama inline fl"></i>
                         <span class="withdraw-alert-right">还需要打码量：{{items.auth_dml - items.dml}}</span>
                     </div>
                     <div class="withdraw-alert-title m-b10">
                          <i class="icon-shouxf inline fl"></i>
                          <span class="withdraw-alert-right">手续费：{{items.out_fee}}</span>
                     </div>
                     <div class="withdraw-alert-title m-b5">
                          <i class="icon-xzf inline fl"></i>
                          <span class="withdraw-alert-right">行政费：{{items.total_ratio_price}}</span>
                     </div>
                     <div class="withdraw-alert-title">
                          <i class="inline icon-zkk fl"></i>
                          <span class="withdraw-alert-right">总扣除：{{items.all_fee}}</span>
                     </div>
                     <div class="withdraw-alert-button text-center m-t20">
                          <button class="withdraw-alert-cancel_button bg-gray light-gray" ng-click="cancel($modal)">取消</button>
                          <button class="withdraw-alert-ok_button white main-bg" ng-click="continue()">继续</button>
                     </div>
                 </div>`,
                wrap: function(html) {
                    return `<div class="popup-form">
                                <div class="popup-content clearfix">
                                    ${html || ''}
                                </div>
                            </div>`
                },
                scope: _this.$scope
            })
            _this.$scope.$modal.find('.modal-content').css({
                'width': '80%',
                'borderRadius': '0.5rem'
            })
            _this.$scope.$modal.find('.withdraw-alert').css({
                'height': '16rem'
            })
        } else {
            _this.continue()
        }
    }

    continue() {
        const _this = this
        _this.$scope.$modal && _this.$scope.$modal.remove()
        _this.clearActive()
        _this.$scope.$modalPutPwd = _this.Layer.popup({
            tpl: `<div class="cash-wrap">
                    <div class="cash-tip fs16">
                        <span class="m-r10"
                            ng-click="checkType(3)"
                            ng-if="items.out_type.wx.is_bangding != 0 && items.out_type.wx.out_max != 0"
                        >
                            <i class="border_color circle" ng-class="{active:out_type == 3 }"></i>
                            微信
                        </span>
                        <span class="m-r10"
                        ng-click="checkType(2)"
                        ng-if="items.out_type.zfb.is_bangding != 0 && items.out_type.zfb.out_max != 0">
                             <i class="border_color circle" ng-class="{active:out_type == 2 }"></i>
                             支付宝
                        </span>
                        <span class="m-r10"
                            ng-click="checkType(1)"
                            ng-if="items.out_type.bank.is_bangding != 0"
                        >
                            <i class="border_color circle" ng-class="{active:out_type == 1 }"></i>
                            银行卡
                        </span>
                    </div>
                    <p class="fs14 black">请输入资金密码</p>
                    <ul class="wdp-list">
                        <li class="wdp-item" ng-repeat="i in pass_arr track by $index" ng-class="{active: currIdx >= i, 'last-child': i == pass_arr.length-1}" >
                        <input type="tel"
                               class="wdp-input"
                               ng-change="handleChange()"
                               ng-model="pwd.pwd"
                               ng-focus="handleFocus()"
                               ng-mouseleave="handleLeave()"/>
                    </ul>
                </div>`,
            wrap: function(html) {
                return `<div class="popup-form">
                            <div class="popup-title main-bg white-text fs14">提现金额:{{data.money}}</div>
                            <div class="popup-content clearfix">
                                  ${html || ''}
                            </div>
                        </div>`
            },
            scope: _this.$scope
        })
        _this.$scope.$modalPutPwd.find('.modal-content').css('borderRadius', '0.5rem')
    }
    checkType(type) {
        this.$scope.out_type = type
    }
    //确定取款
    sure() {
        this.clearActive()
        this.$scope.$modalPutPwd.remove()

        var data = {
            money: this.$scope.data.money,
            bank_pwd: md5(this.$scope._password),
            out_type: this.$scope.out_type
        }
        this.$scope._password = []
        this.RS.withdraw(data).then((res) => {
            if(res.code == 200) {
                this.$scope.data.money = ''
                this.$scope.$modalPutPwd.remove()
                this.Layer.toast('提现成功!', 1, () => {
                    this.$state.go('tabs.my')
                    sessionStorage.setItem('drawState', '出款审核中不能提现!')
                })
            }else{
                this.Layer.toast(res.msg)
            }
        })
    }
    //监听密码输入框的变化，给li进行样式设定
    handleChange () {
        const password = this.$scope.pwd.pwd
        this.$scope._password = password
        this.$scope.currIdx = this.$scope._password.length - 1
        var $target = $('.wdp-list').children('.wdp-item')

        $target.eq(this.$scope.currIdx + 1).addClass('focus-cursor').siblings().removeClass('focus-cursor')
        if(this.$scope.currIdx == this.$scope.pass_len -1) {
            $target.removeClass('focus-cursor')
        }
        if(password.length == 6) {
            this.$scope.pwd.pwd = ''
            if (this.$scope.out_type == 0) {
                this.clearActive()
                this.Layer.toast('请选择提现方式')
            } else {
                this.sure()
            }
        }
    }

    //闪动光标效果
    handleFocus() {
        var $target = $('.wdp-list').children('.wdp-item')
        $target.eq(this.$scope.currIdx + 1).addClass('focus-cursor')
    }

    //焦点离开清除光标
    handleLeave() {
        $('.wdp-list').children('.wdp-item').removeClass('focus-cursor')
    }

    //清除密码效果
    clearActive() {
        const _this = this
        var $children = $('.wdp-list').children('.wdp-item')
        var _timer = this.tm(function() {
            if(!$children.length) {
                _this.clearActive()
            } else {
                _this.tm.cancel(_timer)
                _this.$scope.currIdx = -1
                _this.$scope._password = ''
                $children.removeClass('active')
            }
        }, 15)
    }
    cancel($modal) {
        this.clearActive()
        $modal.remove()
    }

    move(direction) {
        if(direction === 'up') {
            $('.withdraw').addClass('move')
        } else if(direction === 'down') {
            $('.withdraw').removeClass('move')
        }
    }
}
