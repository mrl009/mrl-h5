import angular from 'angular'
const af = angular.forEach

export default class {
    constructor(
        $scope,
        Core,
        $stateParams,
        $sce,
        RS
    ) {
        $scope.games = []
        $scope.gid = $stateParams.gid || 0

        this.$scope = $scope
        this.C = Core
        this.$sce = $sce
        this.RS = RS

        this.initHome()
    }

    initHome() {
        this.RS
            .getGameOpt()
            .then((json) => {
                if(json.code == 200) {
                    let temp = []
                    af(json.data.rows, (e, idx) => {
                        this.reqDetail(e.tmp, (c) => {
                            json.data.rows[idx].html = this.$sce.trustAsHtml(c)
                        })
                        e.tmp != 's_sx' && temp.push(e)
                    })
                    this.$scope.games = temp
                }
            })
    }

    reqDetail(type, fn) {
        this.RS
            .getRule(type)
            .then(function(json) {
                fn && fn(json)
            })
    }
}
