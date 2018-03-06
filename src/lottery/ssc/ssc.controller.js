
import Detail from '../detail/detail.controller'

export default class extends Detail {
    constructor ($scope, Lottery, $stateParams, Ssc, Layer, $timeout, Util) {
        super()

        this.scope = $scope
        $scope.service = Ssc
        $scope.lr = Layer
        $scope.util = Util
        $scope.tmp = 'ssc/xx.tple.html'
        $scope.$timeout = $timeout
        this.setData($scope, $stateParams, Lottery)

        $scope.toolDan = this.toolDan.bind(this)
    }
}
