export default class {
    constructor($scope, $stateParams, RS, $rootScope) {
        this.S = $scope
        this.$ST = $stateParams
        this.RS = RS
        this.$rootScope = $rootScope
        $scope.items = []
        this.init()
    }

    init() {
        this.S.title = this.$ST.type == 0 ? '最新公告' : '会员公告'
        let type = this.$ST.type == 0? 'has_new_notice': 'hasMemberNotice'
        this.RS
            .getNoticeDetail({type: this.$ST.type, show_location: 3})
            .then((json) => {
                if (json.code == 200) {
                    this.S.items = json.data
                    this.RS.setReadNotice(this.$ST.type).then((res) => {
                        if(res.code == 200) {
                            this.$rootScope[type] = false
                        }
                    })
                }
            })
    }
}

