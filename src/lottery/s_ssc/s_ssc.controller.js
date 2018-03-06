import Detail from '../detail/detail.controller'
export default class extends Detail {
    constructor ($scope, S_lottery, $stateParams, S_normal, $timeout, Util) {
        super()
        // this.scope = $scope
        // $scope.lr = Layer
        $scope.service = S_normal
        $scope.util = Util
        $scope.tmp = 's_ssc/normal.tple.html'
        $scope.$timeout = $timeout
        this.setData($scope, $stateParams, S_lottery)
        // $scope.selBalls = this.selBalls.bind(this)
    }
}
