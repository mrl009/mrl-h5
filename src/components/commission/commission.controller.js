// import './commission.less'
export default class {
    constructor($scope, RS, $state, Layer) {
        this.$scope = $scope
        this.$state = $state
        this.$RS = RS
        this.Layer = Layer

        $scope.init = {}

        this.init()
    }
    init() {
        //检测代理信息
        this.$RS
            .getAuditStatus()
            .then((res) => {
                if(res.code == 200) {
                    if(!res.data.status) {
                        this.$state.go('tabs.my')
                    }else{
                        this.getCommission()
                    }
                }else{
                    this.Layer.toast(res.msg)
                }
            })
    }

    getCommission() {
        var page = 1
        this.$RS
            .getCommissionData({page})
            .then((res) => {
                if(res.code == 200) {
                    this.$scope.init.list = res.data.rows
                    this.$scope.init.now_price = res.data.total_now_price
                    this.$scope.init.rate_price = res.data.total_rate_price
                }
            })
    }
}
