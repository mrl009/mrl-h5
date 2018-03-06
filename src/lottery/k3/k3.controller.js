// import './k3.lottery.less'

import Detail from '../detail/detail.controller'

export default class extends Detail {
    constructor($scope, $stateParams, Lottery, $timeout, K3, Util) {
    	super()

    	$scope.service = K3
        $scope.util = Util
    	$scope.tmp = 'k3/xx.tple.html'
    	$scope.$timeout = $timeout
    	this.setData($scope, $stateParams, Lottery)
    }
}
