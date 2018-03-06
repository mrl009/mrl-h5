import './maintenance.less'
export default class {
    constructor($scope, $state, RS) {
        this.S = $scope
        this.$state = $state
        this.RS = RS

        this.init()
    }
    init() {
        this.RS.getLottery({new_hot: '1'}).then((res) => {
            if(res.code !== 403) {
                console.log('1111111')
                this.$state.go('tabs.home')
            }
        })
    }
}
