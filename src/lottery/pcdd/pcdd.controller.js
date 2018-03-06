// import './pcdd.less'
import Detail from '../detail/detail.controller'
// import $ from 'zepto'

export default class extends Detail {
    constructor($scope, $stateParams, Lottery, $timeout, Pcdd, Layer, Util) {
        super()

        $scope.tmp = 'pcdd/xx.tple.html'
        $scope.service = Pcdd
        $scope.lr = Layer
        $scope.$timeout = $timeout
        $scope.util = Util

        this.sr = Pcdd
        //继承自父类detail
        this.setData($scope, $stateParams, Lottery)

        $scope.getBall = this.getBall.bind(this)
        $scope.randomOne = this.randomOne.bind(this)
        $scope.bet = this.bet.bind(this)

        // $scope.handleChange = this.handleChange.bind(this)
    }

    getBall(id) {
        this.sr.getBall(this.scope, id)
        this.scope.pl.close()
    }

    bet() {
        this.sr.bet(this.scope)
    }
}
