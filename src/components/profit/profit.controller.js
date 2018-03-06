import './profit.less'
export default class {
    constructor($scope, Layer, Core, $state, RS) {
        this.S = $scope
        this.L = Layer
        this.C = Core
        this.$S = $state
        this.RS = RS
        this.init()
    }

    init() {
        this.RS.userProfit().then((res) => {
            if(res.code == 200) {
                this.S.info = res.data
            } else {
                this.L.toast(res.msg)
            }
        })
    }
}
