//import angular from 'angular'
import './activity.less'
import 'animate.css'
export default class {
    constructor($scope, Layer, RS, $stateParams, $sce, Core, $state) {
        this.S = $scope
        this.A = $sce
        this.RS = RS
        this.Core = Core
        this.$state = $state
        this.L = Layer
        this.$stateParams = $stateParams

        this.S.id = $stateParams.id
        this.S.title = '活动详情'
        this.S.info = {}
        this.S.info.is_reward = false
        this.S.vipList = []
        this.init()

        $scope.getAward = this.getAward.bind(this)
    }

    init() {
        if(this.S.id == 88) {
            this.S.title = 'VIP晋级奖励'
            if(this.Core.getToken()) {
                this.RS.checkReward().then((res) => {
                    if(res.code == 200) {
                        this.S.info = res.data
                    }
                })
            }
            this.RS.getVipClass().then((res) => {
                if(res.code == 200) {
                    this.S.vipList = res.data
                    console.log(res.data)
                }
            })
        }else {
            this.RS.getActivityView(this.S.id)
                .then((c) => {
                    if (c.code == 200) {
                        this.S.content = this.A.trustAsHtml(c.data.content)
                    }
                })
        }
    }

    getAward() {
        if (!this.Core.getToken()) {
            this.L.toast('请先登录!')
            this.$state.go('login', {ret: false})
            return false
        }
        if (this.S.info.is_reward == 0 || this.S.info.is_reward === undefined) {
            this.L.toast('没有可领取的奖励!')
            return false
        }
        this.RS.getAward().then((res) => {
            if(res.code == 200) {
                this.S.info.is_reward = false
                this.S.info.money = 0
                this.L.toast('恭喜你,领取成功!')
            }else {
                this.L.toast(res.msg)
            }
        })
    }
}
