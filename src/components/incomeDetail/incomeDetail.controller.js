export default class{
    constructor($scope, $state, Core) {
        this.$scope = $scope
        this.$state = $state
        this.Core = Core

        !this.Core.getToken() && this.$state.go('tabs.my')

        $scope.info = {}
        this.init()
    }

    init() {
        if(sessionStorage.getItem('incomeDetail')) {
            this.$scope.info = JSON.parse(sessionStorage.getItem('incomeDetail'))
        }else {
            this.$state.go('income')
        }
    }
}
