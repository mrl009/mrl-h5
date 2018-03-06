import './discover.less'
import 'animate.css'
import $ from 'zepto'
export default class {
    constructor($scope, Layer, Core, $state, RS, $rootScope, $timeout) {
        this.S = $scope
        this.L = Layer
        this.$timeout = $timeout
        this.C = Core
        this.$S = $state
        this.$rootScope = $rootScope
        this.RS = RS
        this.init()

        $scope.toggleTitle = this.toggleTitle.bind(this)
        $scope.default_img = $rootScope.DEFAULT_IMG
        $scope.topList = [{}]
        $scope.winnerList = [{}]
        $scope.title = 'left'
    }

    init() {
        this.RS.getPrize().then((res) => {
            if(res.code == 200) {
                this.S.winnerList = res.data || []
                if(this.S.winnerList.length >= 20) {
                    this.changeList()
                }
            } else {
                this.L.toast(res.msg)
            }
        })
        this.S.$on('$destroy', () => {
            this.$timeout.cancel(this.S.timer)
        })
    }
    changeList() {
        const _this = this
        if(this.S.winnerList.length <= 20) {
            return false
        }
        this.S.timer = this.$timeout(() => {
            this.S.winnerList = this.S.winnerList.splice(this.S.winnerList.length-1, 1).concat(this.S.winnerList)
            let firstChild = $('.player-item:first-child')
            firstChild.removeClass('addItem').addClass('initHeight')
            if(this.S.timer) {
                _this.$timeout.cancel(this.S.timer)
                this.S.timer = null
                let timer = _this.$timeout(() => {//延后操作
                    firstChild.removeClass('initHeight').addClass('addItem')
                    _this.$timeout.cancel(timer)
                    timer = null
                }, 100)
            }
            this.changeList()
        }, (Math.random()*5+2)*1000)
    }
    toggleTitle(type) {
        if(type == this.S.title) {
            return
        }
        this.S.title = type
        if(this.S.title == 'right') {
            this.getTopList()
            this.$timeout.cancel(this.S.timer)
        } else if(this.S.title == 'left') {
            this.changeList()
        }
    }
    getTopList() {
        this.RS.getTopList().then((res) => {
            if(res.code == 200) {
                this.S.topList = res.data
            } else {
                this.L.toast(res.msg)
            }
        })
    }
}
