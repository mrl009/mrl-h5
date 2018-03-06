
import Detail from '../detail/detail.controller'

export default class extends Detail {
    constructor ($scope, S_lottery, $stateParams, $timeout, Util, S_normal) {
        super()
        // this.scope = $scope
        // $scope.lr = Layer
        $scope.util = Util
        $scope.service = S_normal
        $scope.tmp = 's_11x5/normal.tple.html'
        $scope.$timeout = $timeout
        $scope.rate = {
            rate: '',
            min_rate: ''
        }
        this.setData($scope, $stateParams, S_lottery)
        $scope.selBalls = this.selBalls.bind(this)
    }

    selBalls(event, sy, ss) { //点击选择球计算注数和金额
        this.scope.service.sel11x5Balls(event.target, sy, ss, this.scope)
    }
}
