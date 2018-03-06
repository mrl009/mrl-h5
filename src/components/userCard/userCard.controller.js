export default class {
    constructor($scope, $state, RS) {
        this.S = $scope
        this.$S = $state
        this.RS = RS
        this.S.isAdded = ''

        this.S.items = [{}]
        this.S.showCode = false

        this.init()
        $scope.showQRCode = this.showQRCode.bind(this)
    }
    init() {
        this.RS
            .getUserCard()
            .then((c) => {
                if (c.code == 200 && c.data) {
                    this.S.items = c.data
                    this.S.isAdded = this.S.items.length < 3 ? true : false
                } else {
                    this.S.items = []
                }
            })
    }
    showQRCode(index, is_bind) {
        if (is_bind == 1) {
            if (index != 2) {
                if(this.S.showCode === index) {
                    this.S.showCode = false
                }else {
                    this.S.showCode = index
                }
            }
        } else {
            this.goBindCard(index)
        }
    }

    goBindCard(index) {
        this.$S.go('bindCard', {type: index})
    }
}
