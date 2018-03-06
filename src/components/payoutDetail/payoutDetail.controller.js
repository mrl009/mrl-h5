export default class{
    constructor($scope, $stateParams, RS, Layer, Core, $state) {
        this.$scope = $scope
        this.$stateParams = $stateParams
        this.RS = RS
        this.Layer = Layer
        this.Core = Core
        this.$state = $state

        //检测登录
        !this.Core.getToken() && this.$state.go('tabs.my')
        this.payoutInfo()
    }

    payoutInfo() {
        const _this = this
        _this.RS.payoutDetail(_this.$stateParams.id).then((res) => {
            if (res.code == 200) {
                _this.$scope.info = res.data
            }else{
                _this.Layer.toast(res.msg)
            }
        })
    }
}
