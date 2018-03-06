// import './cart.less'
import $ from 'zepto'

export default class {
    constructor($scope, $stateParams, DB, RS, Layer, Lottery, $timeout, Core, $state, CS) {
        $scope.total = 0
        $scope.orderNum = 0
        $scope.gid = $stateParams.gid
        $scope.type = $stateParams.type
        $scope.zh = true
        let _f = (arr, obj) => {
            let i = arr.length
            while (i--) {
                if (arr[i] === obj) {
                    return true
                }
            }
            return false
        }
        if(_f(['s_ssc', 's_pk10', 's_k3', 's_11x5', 's_kl10', 's_yb', 'pcdd'], $scope.type)) {
            $scope.zh = false
        }
        $scope.flag = false //提交按钮开关
        $scope.balance = 0
        $scope.order = []
        $scope.isSubmit = false

        this.db = DB
        this.rs = RS
        this.S = $scope
        this.l = Layer
        this.L = Lottery
        this.$timeout = $timeout
        this.c = Core
        this.$state = $state
        this.cs = CS

        this.getBalance()
        this.getDBData()

        $scope.back = this.back.bind(this)
        $scope.delItem = this.delItem.bind(this)
        $scope.delAll = this.delAll.bind(this)
        $scope.betSubmit = this.betSubmit.bind(this)
        $scope.goToSmartTracking = this.goToSmartTracking.bind(this)
    }

    getDBData() {
        this.db
            .getData('carts', (c) => {
        		this.S.order = JSON.parse(c)
        		$.each(this.S.order, (i, d) => {
        			this.S.total += parseFloat(d.price_sum)
        			this.S.orderNum += parseInt(d.counts)
        		})

                this.S.$apply()
        	})
    }

    getBalance() {
        this.rs
            .getBalance(false)
            .then((c) => {
                if (c.code == 200) {
                    this.S.balance = Number(c.data.balance)
                    this.S.isSubmit = true
                }
            })
    }

    //删除全部购物车信息
	delAll () {
		/*******indexDB***********/
		this.db.deleteOneData('carts', () => {
			this.S.order = []
			this.S.total = 0
	        this.S.orderNum = 0
            this.S.$apply()
		})
	}

	//提交下注
    betSubmit () {
		if(this.S.order && this.S.order.length == 0) {
			this.l.toast('请先下注才能提交', 1)
			return false
		}
        if(this.S.total > this.S.balance) {
            this.cs.showLessMoney()
            return false
        }
		this.S.flag = true
		this.L.betSubmit(this.S.gid)
		var _t = this.$timeout(() => {
			this.$timeout.cancel(_t)
			this.S.flag = false
		}, 2000)
	}

	//删除指定购物车一项目
	delItem (id) {
		this.L.delItem(id, (c, orderNum, newArr) => {
			this.S.total = c
			this.S.orderNum = orderNum
			this.S.order = newArr
            this.S.$apply()
		})
	}

	handleRate(rate) {
		return typeof rate == 'string' ? rate.replace(/,/g, ' ') : rate
	}
	//返回上一页
	back () {
		history.go(-1)
	}

	goToSmartTracking() {
        if(this.S.order.length == 0) {
            this.l.toast('请先下注才能追号')
            return false
        }
        let total = String(this.S.total.toFixed(3)).replace('.', '-')
		this.$state.go('smartTrack', {gid: this.S.gid, total})
    }
}
