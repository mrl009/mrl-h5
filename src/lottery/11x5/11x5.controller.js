// import './11x5.lottery.less'

import Detail from '../detail/detail.controller'

export default class extends Detail {
    constructor($scope, $stateParams, Lottery, $timeout, $11x5, Util) {
    	super()
        $scope.tmp = '11x5/xx.tple.html'
        $scope.$timeout = $timeout
        $scope.service = $11x5
        $scope.util = Util

        this.sr = $11x5
        this.setData($scope, $stateParams, Lottery)
    }

    toolDa(e) {
    	this.sr.toper(e.target, this.scope, 'toolDa')
    }

    toolXiao(e) {
    	this.sr.toper(e.target, this.scope, 'toolXiao')
    }

    toolDan(e) {
    	this.sr.toper(e.target, this.scope, 'toolDan')
    }

    /*getPlay(gid) {
        this.sr.getPlay(gid, this.scope)
    }*/

    get2Play(gid) {
        this.sr.get2Play(gid, this.scope)
    }

    getBall(id) {
        this.sr.getBall(id, this.scope)
        this.scope.pl.close()
    }
}
