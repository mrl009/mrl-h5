// import './sheet.less'
const WEEK = [7, 1, 2, 3, 4, 5, 6]

export default class {
    constructor($scope, RS, $state, Core, Layer, Util, DT) {
        this.$scope = $scope
        this.$RS = RS
        this.$state = $state
        this.Core = Core
        this.Layer = Layer
        this.$Util = Util
        this.DT = DT

        $scope.time_start = this.DT.dtToString(this.DT.addDays(new Date(), 'day', -1))
        $scope.time_end = this.DT.dtToString(this.DT.addDays(new Date(), 'day', 0))
        $scope.total_now_price = 0
        $scope.total_rate_price = 0
        $scope.agentData = {}
        $scope.dataSet = []

        $scope.checkDate = this.checkDate.bind(this)
        $scope.setStart = this.setStart.bind(this)
        $scope.setEnd = this.setEnd.bind(this)
        $scope.getSheet = this.getSheet.bind(this)

        $scope.currentIndex = 0
        $scope.dateList = [
            {title: '昨天'},
            {title: '本周'},
            {title: '本月'},
            {title: '查询'}
        ]
        this.init()
    }

    init() {
        //判断是否 是代理
        this.checkAgent()
    }
    checkAgent() {
        this.$RS
            .getAuditStatus()
            .then((res) => {
                if(res.code == 200) {
                    this.getSheet()
                    this.getAgentData()
                    this.getAgentSet()
                }else{
                    this.Layer.toast(res.msg)
                }
            })
    }

    getSheet() {
        let time = {
            time_start: this.$scope.time_start,
            time_end: this.$scope.time_end
        }
        //如果起始到截止 大于2月报错
        if(this.DT.addDays(time.time_start, 'month', 2) < this.DT.stringToDt(time.time_end)) {
            this.Layer.toast('日期范围不能超过2月!')
            return
        }

        if(time.time_start > time.time_end) {
            this.Layer.toast('起始日期不能大于结束日期!')
            return
        }

        this.$RS
            .getSheet(time)
            .then((res) => {
                if(res.code == 200) {
                    this.$scope.total_now_price = res.data[0].total_now_price
                    this.$scope.total_rate_price = res.data[0].total_rate_price
                } else {
                    this.Layer.toast(res.msg)
                }
            })
    }

    getAgentData() {
        this.$RS
            .getAgentData()
            .then((res) => {
                if(res.code == 200) {
                    this.$scope.agentData.off_sum = res.data.off_sum
                    this.$scope.agentData.date_sum = res.data.date_num
                }
            })
    }
    // 代理分成模式
    getAgentSet() {
        this.$RS
            .getAgentSet()
            .then((res) => {
                if(res.code == 200) {
                    this.$scope.dataSet = res.data
                }
            })
    }

    setStart(e) {
        this.$Util
            .picker(e.target, (v) => {
                this.$scope.time_start = v
            })
    }

    setEnd(e) {
        this.$Util.picker(e.target, (v) => {
            this.$scope.time_end = v
        })
    }
    checkDate(index) {
        this.$scope.currentIndex = index

        switch (index) {
            case 0: //昨天
                this.$scope.time_start = this.DT.dtToString(this.DT.addDays(new Date(), 'day', -1))
                this.$scope.time_end = this.DT.dtToString(this.DT.addDays(new Date(), 'day', 0))
                break
            case 1: //本周
                var w = -WEEK[new Date().getDay()]
                this.$scope.time_start = this.DT.dtToString(this.DT.addDays(new Date(), 'day', w))
                this.$scope.time_end = this.DT.dtToString(this.DT.addDays(new Date(), 'day', 0))
                break
            case 2://本月
                var m = -new Date().getDate()+1
                this.$scope.time_start = this.DT.dtToString(this.DT.addDays(new Date(), 'day', m))
                this.$scope.time_end = this.DT.dtToString(this.DT.addDays(new Date(), 'day', 0))
                break
            case 3://查询
                this.$scope.time_start = ''
                this.$scope.time_end = ''
                break
            default:
                this.$scope.time_start = ''
                this.$scope.time_end = ''
        }
        this.getSheet()
    }
}
