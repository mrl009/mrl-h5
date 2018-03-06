// import './betting.less'
export default class {
    constructor($scope, RS, $state, Layer, Core) {
        this.$scope = $scope
        this.$state = $state
        this.$RS = RS
        this.Layer = Layer
        this.Core = Core

        $scope.sheetList = []
        $scope.username = ''
        $scope.type = 0
        $scope.page = 1
        $scope.tabs = [
            {'name': '全部订单', type: 0},
            {'name': '已中奖', type: 1},
            {'name': '已撤单', type: 3},
            {'name': '待开奖', type: 4}
        ]
        $scope.getBettingList = this.getBettingList.bind(this)
        $scope.checkTab = this.checkTab.bind(this)
        $scope.search = this.search.bind(this)
        $scope.refresh = this.refresh.bind(this)
        $scope.more = this.more.bind(this)

        this.init()
    }

    init() {
        this.$RS
            .getAuditStatus()
            .then((res) => {
                if(res.code == 200) {
                    if(!res.data.status) {
                        this.$state.go('tabs.my')
                    }else{
                        this.getBettingList()
                    }
                }else{
                    this.Layer.toast(res.msg)
                }
            })
    }
    getBettingList() {
        var data = {
            type: this.$scope.type,
            username: this.$scope.username,
            page: this.$scope.page
        }

        return this.$RS
            .getBettingList(data)
            .then((res) => {
                if(res.code == 200) {
                    if(!this.$scope.sheetList || !this.$scope.sheetList.length) {
                        this.$scope.sheetList = res.data.rows
                    }
                }
                return res
            })
    }

    search() {
        this.$scope.type = 0
        this.getBettingList()
    }

    checkTab(index) {
        this.$scope.page = 1
        this.$scope.type = index
        this.getBettingList()
    }

    refresh() {
        this.$scope.page = 1
        return this.getBettingList()
                    .then((c) => {
                        if(c.data) {
                            this.$scope.sheetList = c.data.rows
                        }
                    })
    }

    more() {
        this.$scope.page += 1
        return this.getBettingList()
                    .then((c) => {
                        if(c.data.rows && c.data.rows.length) {
                            this.$scope.sheetList = this.$scope.sheetList.concat(c.data.rows)
                        }
                    })
    }
}
