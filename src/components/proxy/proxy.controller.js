//import angular from 'angular'
import { copy } from '../../service/util'
// import './redPacketNotice.less'
export default class {
    constructor($scope, $state, Core, RS, Layer) {
        this.Core = Core
        this.$RS = RS
        this.l = Layer
        this.$scope = $scope
        this.$state = $state
        $scope.jump = this.jump.bind(this)
        $scope.copy = this.copy.bind(this)
        $scope.initData = {}
        this.initLogin()
    }

    jump(url) {
        this.$state.go(url)
    }

    initLogin() {
        this.initPage()
    }

    copy(eleId, tgt) {
        copy(`.${tgt}`, `#${eleId}`, () => {
            this.l.toast('复制成功', 1)
        })
    }

    initPage() {
        this.$scope.isLogin = true
        this.getAgentData()
    }

    getAgentData() {
        const _this = this
        _this.$RS
            .getAgentData()
            .then((res) => {
                if(res.code == 422) {
                    _this.$scope.initData.isAgent = false
                }else if(res.code == 200) {
                    _this.$scope.initData.isAgent = true
                    _this.$scope.initData = Object.assign(_this.$scope.initData, res.data)
                }
            })
    }
}
