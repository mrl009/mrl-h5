// import angular from 'angular'
// import './income.less'

export default class {
	constructor($scope, RS, Layer, $state, Util, DT, CS) {
        this.S = $scope
        this.RS = RS
        this.L = Layer
        this.$S = $state
        this.U = Util
        this.DT = DT
        this.cs = CS
        this.S.end = DT.dtToString(new Date())
        this.S.start = DT.dtToString(DT.reduceDays(new Date(), 'month', 2))
        this.S.items = [{}]

        $scope.showFilter = this.showFilter.bind(this)
        $scope.incomeDetail = this.incomeDetail.bind(this)
        $scope.setDate = this.setDate.bind(this)
        $scope.setFilter = this.setFilter.bind(this)
        $scope.refresh = this.refresh.bind(this)
        $scope.more = this.more.bind(this)

        $scope.type = 0
        $scope.page = 1

        this.init()
    }
	init() {
		this.reqData()
	}

	reqData(flag) {
		const param = {
			type: this.S.type,
			time_start: this.S.start,
			time_end: this.S.end,
			page: this.S.page
		}
		return this.RS
				.getIncomeList(param)
				.then((res) => {
		            if (res.code == 200) {
		            	if(flag == undefined) {
		            		this.S.items = res.data.rows
		            	}
		            }
		            return res
		        })
	}

	showFilter() {
        this.cs.showFilter('income-filter.html', '充值记录筛选', this.S, () => {
            this.reqData()
        })
        this.getIncomeType()
	}

	//获取筛选类别
    getIncomeType() {
        if(this.S.types) {
            return
        }
        this.RS.getIncomeType().then((res) => {
            if(res.code == 200) {
	            this.S.types = res.data.rows
            }
        })
    }

    //选择类别
    setFilter(type) {
	    this.S.type = type
    }
	setDate(evt, name) {
		this.U.picker(evt.target, (v) => {
			this.S[name] = v
		})
	}

    incomeDetail(order_num, addtime, style, status, price, discount_price, type) {
	    let params = {
	        order_num,
            addtime,
            style,
            status: type >2 ? ['', '使用过', '未使用'][status] : ['', '等待审核', '审核通过', '审核未通过'][status],
            price,
            discount_price
        }
        params = JSON.stringify(params)
        sessionStorage.setItem('incomeDetail', params)
        this.$S.go('incomeDetail')
    }

    refresh() {
    	this.S.page = 1
    	return this.reqData()
    }

    more() {
    	this.S.page += 1
    	return this.reqData(true)
    			.then((c) => {
    				if(c.data.rows && c.data.rows.length) {
    					this.S.items = this.S.items.slice(c.data.rows)
    				}
    			})
    }
}
