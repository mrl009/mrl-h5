// import './cashRecord.less'
export default class{
    constructor($scope, RS, Layer, Core, $state, DT, Util, CS) {
        this.$scope = $scope
        this.RS = RS
        this.DT = DT
        this.Util = Util
        this.Layer = Layer
        this.Core = Core
        this.$state = $state
        this.cs = CS

        $scope.end = DT.dtToString(new Date())
        $scope.start = DT.dtToString(DT.reduceDays(new Date(), 'month', 2))

        $scope.showFilter = this.showFilter.bind(this)
        $scope.setFilter = this.setFilter.bind(this)
        $scope.setDate = this.setDate.bind(this)
        $scope.refresh = this.refresh.bind(this)
        $scope.more = this.more.bind(this)

        $scope.items = [{}]
        $scope.page = 1
        $scope.type = 0
        this.getList()
    }
    showFilter() {
        this.cs.showFilter('cash-filter.html', '账户明细筛选', this.$scope, () => {
            this.getList()
        })
        !this.$scope.status && this.getCashType()
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

    getList(flag) {
        let data = {
            type: this.$scope.type,
            time_start: this.$scope.start,
            time_end: this.$scope.end,
            page: this.$scope.page
        }
        return this.RS
            .getCashList(data)
            .then((res) => {
                if(res.code == 200) {
                    if(!flag) {
                        this.$scope.items = res.data.rows
                    }
                }
                return res
            })
    }

    getCashType() {
        this.RS
            .getCashType()
            .then( (res) => {
                if(res.code == 200) {
                    this.$scope.status = res.data.rows
                }else {
                    this.Layer.toast(res.msg)
                }
            })
    }

    refresh() {
        this.$scope.page = 1
        return this.getList()
    }

    more() {
        this.$scope.page += 1
        return this.getList(true)
                .then((c) => {
                    console.log(c)
                    if(c.data.rows && c.data.rows.length) {
                        this.$scope.items = this.$scope.items.concat(c.data.rows)
                    }
                })
    }
}
