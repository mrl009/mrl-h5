// import './submasses.less'

export default class {
    constructor($scope, $state, RS, Layer) {
        $scope.users = []
        $scope.page = 1

        this.$scope = $scope
        this.$state = $state
        this.$RS = RS
        this.Layer = Layer

        this.init()
        this.checkAgent()

        $scope.getSubList = this.getSubList.bind(this)
        $scope.refresh = this.refresh.bind(this)
        $scope.loadMore = this.loadMore.bind(this)
        $scope.handleChange = this.handleChange.bind(this)
    }
    //判断登录状态
    init() {
        //初始化数据
        this.getSubList()
    }

    checkAgent() {
        this.$RS
            .getAuditStatus()
            .then((res) => {
                if(res.code == 200) {
                    if(!res.data.status) {
                        this.$state.go('tabs.my')
                    }
                }else{
                    this.Layer.toast(res.msg)
                }
            })
    }

    refresh() {
        this.$scope.page = 1
        return this.getSubList()
    }

    loadMore() {
        if(this.$scope.total < 15) {
            return
        }
        if(this.$scope.total <= (this.$scope.page + 1) * 15) {
            return
        }
        this.$scope.page += 1
        return this.getSubList()
    }

    getSubList() {
        const params = {
            username: this.$scope.username,
            page: this.$scope.page
        }
        return this.$RS
                    .getSubUsers(params)
                    .then((res) => {
                        if(res.code == 200) {
                            this.$scope.users = res.data.rows
                            this.$scope.total = res.data.total
                        }
                    })
    }

    handleChange(t) {
        this.$scope.username = t.username
    }
}
