// import './yb.lottery.less'
import Detail from '../detail/detail.controller'

export default class extends Detail {
    constructor($scope, $stateParams, Lottery, $timeout, Yb, Util) {
        super()
        $scope.tmp = 'yb/xx.tple.html'
        $scope.$timeout = $timeout
        $scope.service = Yb
        $scope.util = Util
        this.setData($scope, $stateParams, Lottery)
    }
}