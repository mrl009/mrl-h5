// import './account.less'
export default class{
    constructor($scope, RS, $state, Layer, Core) {
        this.$scope = $scope
        this.$state = $state
        this.$RS = RS
        this.Layer = Layer
        this.Core = Core

        // $scope.data = {
        //     username: '',
        //     page: $scope.page
        // }
        $scope.data = { username: '' }
        $scope.page = 1
        $scope.items = []
        $scope.getAccountList = this.getAccountList.bind(this)
        $scope.refresh = this.refresh.bind(this)
        $scope.more = this.more.bind(this)
        this.init()
    }

    init() {
        //检测用户代理信息
        this.$RS
            .getAuditStatus()
            .then((res) => {
                if(res.code == 200) {
                    if(!res.data.status) {
                        this.$state.go('tabs.my')
                    }else{
                        this.getAccountList()
                    }
                }else{
                    this.Layer.toast(res.msg)
                }
            })
    }
    getAccountList(page, flag) {
        const data = {
            username: this.$scope.data.username,
            page: page || this.$scope.page
        }
        return this.$RS
            .getAccountList(data)
            .then((res) => {
                if(res.code == 200) {
                    if(flag == undefined) {
                        this.$scope.items = res.data.rows
                    }
                }
                return res
            })
    }

    more() {
        return this.getAccountList(this.$scope.page + 1, true)
                .then((c) => {
                    this.$scope.page += 1
                    this.$scope.items = this.$scope.items.concat(c.data.rows)
                })
    }

    refresh() {
        this.$scope.page = 1
        return this.getAccountList()
    }
}
