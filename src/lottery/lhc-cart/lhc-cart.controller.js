import './lhc-cart.less'
import $ from 'zepto'

export default class {
	constructor($scope, Core, DB, RS, Layer, $stateParams, Lottery, $timeout, CS) {
		this.S = $scope
		this.C = Core
		this.dbobj = DB
		this.rs = RS
		this.L = Layer
		this.ly = Lottery
		this.$tm = $timeout
		this.cs = CS

		this.S.total = 0
		this.S.orderNum = 0
		this.S.gid = $stateParams.gid
		this.S.type = $stateParams.type

		this.db()
		this.getDB()
		this.getBalance()
		this.init()

		$scope.delAll = this.delAll.bind(this)
		$scope.betSubmit = this.betSubmit.bind(this)
        $scope.isSubmit = false

		$scope.$on('$destroy', function() {
			Lottery.clearCds()
		})
	}

	//decorateBalls
	db() {
		this.S.balls = this.C.createArr(17)
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

	getDB() {
		this.dbobj
            .getData('lhccarts', (c) => {
        		this.S.order = JSON.parse(c)
        		$.each(this.S.order, (i, d) => {
        			this.S.total += parseFloat(d.price_sum)
        		})

                this.S.$apply()
        	})
	}

	clearAll () {
		this.dbobj.deleteOneData('lhccarts', () => {
			this.S.total = 0
			this.S.order = null
            this.S.$apply()
		})
	}

	//删除全部购物车信息
	delAll () {
		const self = this
		/*******indexDB***********/
		if(this.S.total > 0) {
			this.L.confirm({
				title: '确定要清除所有彩注?',
				yesFn: function() {
					self.clearAll()
				}
			})
		}
	}

	//初始化lhc信息
	init() {
		this.ly.getKithe(this.S.gid, this.S)
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
		this.ly.betSubmit(this.S.gid, this.S.type)
		var _t = this.$tm(() => {
			this.$tm.cancel(_t)
			this.S.flag = false
		}, 2000)
	}
}
