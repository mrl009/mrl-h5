import angular from 'angular'

export default class {
	constructor($scope, Core, $timeout, Layer, RS) {
		$scope.orderType = [
			{id: 0, title: '全部订单'},
			{id: 1, title: '已中奖'},
			{id: 3, title: '已撤单'},
			{id: 4, title: '待开奖'}
		]

		this.Core = Core
		this.$scope = $scope
		this.$timeout = $timeout
		this.l = Layer
		this.rs = RS
		$scope.showList = true
		this.initLogin()

		//非初始化方法，通过bind的方式将该方法bind至$scope对象上，以便页面上调用
		$scope.chooseTab = this.chooseTab.bind(this)
		$scope.refresh = this.refresh.bind(this)
		$scope.loadMore = this.loadMore.bind(this)
		$scope.orderDetail = this.orderDetail.bind(this)
		$scope.goBack = this.goBack.bind(this)
		$scope.orderCancel = this.orderCancel.bind(this)
	}

	initLogin() {
		const isLogin = !!this.Core.getToken()
		if(isLogin) {
			this.initPage()
		} else {
			this.initUnlogin()
		}
	}

	initPage() {
		this.$scope.isLogin = true
		this.initData()
	}

	initData() {
  		this.$scope.orderItems = []
        this.$scope.page = 1
        this.$scope.isEmpty = false
        this.reqData(0)
	}

	//公共的请求方法
	reqData(type, page) {
		this.$scope.type = type
		const params = page ? {
			type,
			page
		} : { type }
		//请求结束返回一个Promise对象
		return this.Core.get('user/bet_record/get_list', params, (json) => {
            var c = angular.fromJson(json)
            if (c.code == 200) {
                if ((!c.data.rows || !c.data.rows.length) && this.$scope.orderItems.length == 0) {
                    this.$scope.isEmpty = true
                } else {
                	this.$scope.isEmpty = false
                	if(!this.$scope.orderItems || !this.$scope.orderItems.length) {
                		this.$scope.orderItems = c.data.rows
                	}
                }
            }
        }, false)
	}

	//下拉刷新使用的刷新方式，供页面去使用
	refresh() {
		const { type = 0 } = this.$scope
		//返回一个Promise对象，供指令准确执行回调
		return this.reqData(type)
				.then((json) => {
					if(json.data) {
						this.$scope.orderItems = json.data.rows
						this.$scope.page = 1
					}
				})
	}

	//上拉加载更多的方法，供页面使用
	loadMore() {
		const { type = 0, page = 1 } = this.$scope
		//返回一个Promise对象，供指令准确执行回调
		return this.reqData(type, Number(page) + 1)
					.then((json) => {
						if(json.code == 200) {
							const c = json.data.rows
							if( c && c.length > 0 ) {
								this.$scope.page = page + 1
								this.$scope.orderItems = this.$scope.orderItems.concat(c)
							}
						}
						return json
					})
	}

	initUnlogin() {
		this.$scope.isLogin = false
	}

	//点击tab使用的方法
	chooseTab(status) {
		this.$scope.page = 0
		this.reqData(status)
			.then((json) => {
				if (!json.data.rows || !json.data.rows.length) {
                    this.$scope.isEmpty = true
                } else {
                	this.$scope.isEmpty = false
                	this.$scope.orderItems = json.data.rows
                }
			})
	}

	// 详情
    orderDetail (
        order_num,
        issue,
        game,
        tname,
        open_resu_num,
        status,
        names,
        price_sum,
        bet_time,
        rebate,
        rate,
        win_price,
        win_counts,
        is_open
    ) {
        this.$scope.showList = false

        this.$scope.title = '投注详情'
        var statusName = ''

        if (status == 1) {
            statusName = '已中奖'
        } else if (status ==3) {
            statusName = '已撤单'
        } else if (status ==4) {
            statusName = '待开奖'
        } else if(status == 5) {
            statusName = '未中奖'
        }
        this.$scope.detail = {
            order_num: order_num,
            issue: issue,
            game: game,
            tname: tname,
            open_resu_num: open_resu_num,
            status: status,
            names: names,
            price_sum: price_sum,
            bet_time: bet_time,
            statusName: statusName,
            rebate: rebate,
            rate: rate,
            win_price: win_price,
            win_counts: win_counts,
            is_open: is_open
        }
    }

    goBack() {
    	this.$scope.showList = true
    }

    // 撤销订单
    orderCancel(order_num) {
    	this.l.confirm({
    		title: '撤销订单',
    		msg: '确定撤销该订单？',
    		yesFn: () => {
    			this.rs
    				.cancelOrder(order_num)
    				.then((c) => {
    					if (c.code == 200) {
		                    this.$scope.detail.is_open = 0
		                    this.$scope.detail.statusName = '已撤单'
		                    this.l.toast('撤销成功', 1)
		                } else {
		                    this.l.toast(c.msg, 1)
		                }
    				})
    		}
    	})
    }
}
