import './question.less'
export default class {
    constructor($scope, RS, Layer, $stateParams, $sce) {
        this.$RS = RS
        this.L = Layer
        this.A = $sce
        this.$scope = $scope
        this.$stateParams = $stateParams
        this.init()

        $scope.title = ''
        $scope.content = ''
    }

    init() {
        this.$RS.getDescription(this.$stateParams.id).then((res) => {
            if(res.code == 200) {
                let info = res.data[0]
                this.$scope.title = info.title
                this.$scope.content = this.A.trustAsHtml(info.content)
                console.log(info)
            }else {
                this.L.toast(res.msg)
            }
        })
    }
}
