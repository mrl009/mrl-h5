import Detail from '../detail/detail.controller'
import $ from 'zepto'

export default class extends Detail {
	constructor(
		$scope,
		$stateParams,
		$timeout,
		Lottery,
		Lhc,
		Layer,
		Util,
        DB
	) {
		super()
		$scope.service = Lhc
		$scope.rates = {}
		$scope.lr = Layer
		$scope.$timeout = $timeout
		$scope.tmp = 'lhc/tm.tple.html'
		$scope.util = Util
		$scope.rateInfo = 0
        this.db = DB
		this.setData($scope, $stateParams, Lottery)

		$scope.getBalls = this.getBalls.bind(this)
		$scope.ggBalls = this.ggBalls.bind(this)
		$scope.tools = this.tools.bind(this)
	}

	getBall(id) {
		this.scope.service.getBall(id, null, this.scope)
		this.scope.pl.close()
	}

	bet() {
		this.scope.service.bet(this.scope)
	}

	randomOne() {
		this.scope.suData.sumbet = this.scope.service.randomOne(this.scope)
        this.scope.suData.money = this.scope.suData.sumbet * this.scope.suData.txtmoney
	}

    ggBalls(event) {
        this.scope.suData.sumbet = this.scope.service.ggBalls(event.target)
        this.scope.suData.money = this.scope.suData.sumbet * this.scope.suData.txtmoney
    }

	selBalls(event, rate) { //点击选择球计算注数和金额
        this.scope.service.selB(event.target, rate, this.scope)
    }

    getBalls(id, pid, event) {
    	this.scope.service.getBalls(id, pid, this.scope)
    	if(!this.prev) {
    		this.prev = event.target
    	} else {
    		const dr = $(event.target).index() - $(this.prev).index()
    		this.scrollTo(event.target, dr)
    		this.prev = event.target
    	}
    }

    //野兽--选号
    tools(type) {
        this.scope.suData.sumbet = this.scope.service.tools(this.scope.tid, type)
        this.scope.suData.money = this.scope.suData.sumbet * this.scope.suData.txtmoney
    }

    scrollTo(target, dr) {
    	const $p = $(target).parent().parent()
    	const p = $p.get(0)
    	if(p.scrollWidth > p.offsetWidth) {
    		$p.scrollLeft(p.scrollLeft + 60 * dr)
    	}
    }

    kithe() {
    	this.ly.getKithe(this.scope.gid, this.scope)
    		.then(() => {
    			this.ly
    				.getOpen(this.scope.gid, this.scope)
    				.then((json) => {
    					this.scope.lastest = json.data != undefined ? json.data.rows[0] : []
    				})
    		})
    }

    goBack() {
        const self = this
        self.db.getData('lhccarts', function(c) {
            if(self.scope.suData.sumbet || c) {
                self.scope.lr.confirm({
                    title: '提示',
                    msg: '是否放弃所选号码?',
                    yesFn: function() {
                        self.db.deleteOneData('lhccarts', function() {
                            history.go(-1)
                        })
                    }
                })
            } else {
              history.go(-1)
            }
        })
    }
}
