// import './payoutRecord.less'
export default class {
    constructor($scope, Core, Layer, $state, RS, Util, DT, CS) {
        this.$scope = $scope
        this.Core = Core
        this.Layer = Layer
        this.$state = $state
        this.RS = RS
        this.Util = Util
        this.DT = DT
        this.cs = CS

        $scope.showFilter = this.showFilter.bind(this)
        $scope.setFilter = this.setFilter.bind(this)
        $scope.setDate = this.setDate.bind(this)
        $scope.refresh = this.refresh.bind(this)

        $scope.list = [{}]
        $scope.status = []
        $scope.type = 0
        $scope.page = 1
        $scope.end = DT.dtToString(new Date())
        $scope.start = DT.dtToString(DT.reduceDays(new Date(), 'month', 2))
        this.getWithdrawRecord()
    }

    getWithdrawRecord(flag) {
        let data = {
            type: this.$scope.type,
            time_start: this.$scope.start,
            time_end: this.$scope.end,
            page: this.$scope.page
        }
        return this.RS
                .getWithdrawRecord(data)
                .then((res) => {
                    if(res.code == 200) {
                        if(flag == undefined) {
                            this.$scope.list = res.data.rows
                            res.data.status.forEach((v) => {
                                this.$scope.status[v.value] = v.label
                            })
                        }
                    }
                    return res
                })
    }

    showFilter() {
        this.cs.showFilter('payout-filter.html', '提现记录筛选', this.$scope, () => {
            this.getWithdrawRecord()
        })
    }

    //选择类别
    setFilter(type) {
        this.$scope.type = type
    }

    setDate(evt, name) {
        this.Util.picker(evt.target, (v) => {
            this.$scope[name] = v
        })
    }

    refresh() {
        return this.getWithdrawRecord(true)
    }
}
