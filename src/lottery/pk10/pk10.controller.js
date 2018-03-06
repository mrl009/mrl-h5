// import './pk.lottery.less'
import Detail from '../detail/detail.controller'

export default class extends Detail {
    constructor($scope, $stateParams, Lottery, Pk10, Layer, $timeout, Util) {
        super()

        $scope.tmp = 'pk10/xx.tple.html'
        $scope.service = Pk10
        $scope.lr = Layer
        $scope.$timeout = $timeout
        $scope.util = Util
        //继承自父类detail
        this.setData($scope, $stateParams, Lottery)
    }
}
