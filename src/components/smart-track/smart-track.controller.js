import angular from 'angular'
import $ from 'zepto'
import './st.lottery.less'
export default class {
	constructor($scope, DB, $stateParams, Core, Layer, RS, $timeout, $state) {
        this.S = $scope
        this.C = Core
        this.db = DB
        this.l = Layer
        this.RS = RS
        this.$tm = $timeout
        this.$st = $state

	    /**
	     * 追号数据
	     * @type {{dataList: Array, Expected: string, period: number, multiple: number, number: number, fnumber: number}}
	     */
	    $scope.senior = {
	        period: 10,
	        multiple: 5,
	        number: 1,
	        fnumber: 1
	    }
        $scope.toggleID = 0
	    $scope = Object.assign($scope, {
	    	gid: $stateParams.gid,
	        total: $stateParams.total.replace('-', '.')*1,
            showAdvanced: false,
            sum_total: 0,
	        cache: [],
            dataList: [],
            initDataList: []
	    })

        $scope.betSubmit = this.betSubmit.bind(this)
        $scope.switch = this.switch.bind(this)
        $scope.changeType = this.changeType.bind(this)
        $scope.increment = this.increment.bind(this)
        $scope.filter = this.filter.bind(this)

        //初始化数据列表
        this.init()
        //获取缓存数据
        this.initData()
	}

    createDataList(options = this.S.senior) {
        let dataList = []
        var n = 1
         //普通追号
            for(let i = 0; i < options.period; i++) {
                let multiple = options.multiple
                if( i % parseInt(options.number) == 0 && i !== 0) {
                    n *= options.fnumber
                }

                multiple = multiple * n * this.S.total > 20480000 ? 1 : multiple*n
                dataList[i] = Object.assign({multiple}, this.S.initDataList[i])
            }
        return dataList
    }

    //计算总价格
    getTotal() {
        this.S.sum_total = this.S.dataList.reduce((sum, val) => {
            return Math.round((sum + val.multiple * this.S.total)*1000)/1000
        }, 0)
    }

	/**
	* 获取缓存数据
	*/
	initData () {
		this.db.getData('carts', (c) => {
		    this.S.cache = angular.fromJson(c)
		})
	}

    betSubmit () {
        var params = []
        this.S.dataList.forEach((item) => { //循环追号期数
            params.push(`"${item.kithe}":"${item.multiple}"`)
        })
       var kitheStr = '{' + params.join() + '}'
       var dataStr = JSON.stringify(this.S.cache)
       var params_data = {bets: dataStr, issues: kitheStr}
        this.RS.zhBet(this.S.gid, this.S.toggleID, params_data)
    	.then((c) => {
    		if (c.code == 200) {
               this.l.toast('下注成功')
               this.db.deleteOneData('carts', () => {
                   this.$tm(function () {
                       history.go(-2)
                   }, 1000)
               })
           } else {
               if (c.code == 401) {
                   this.l.toast('没有登陆')
                   this.$st.go('login')
               } else {
                   this.l.toast(c.msg)
               }
           }
    	})
}

    /**
     * 倍数增减
     */
    increment(obj, status = '+') {
        if(status === '+') {
            obj.multiple++
        }else if(status === '-') {
            obj.multiple>1 ? obj.multiple--: obj.multiple = 1
        }
        this.getTotal()
    }

    filter(e) {
        let val = e.target.value.replace(/\D/g, '')
        e.target.value = val < 1 || Number.isNaN(val)? '' : val
        this.getTotal()
    }
    dataChange() {
        let timer = null
        this.S.$watch('senior', (val, oldval) => {
            this.$tm.cancel(timer)
            timer = this.$tm(() => {
                let newLn = val.period
                let oldLn = oldval.period
                if(newLn == 0 || '') {
                    return
                }
                if(newLn > this.S.initDataList.length) {
                    this.l.toast('以超过最大期数'+this.S.initDataList.length+'!')
                    val.period = this.S.initDataList.length
                }
                if(newLn < oldLn) {
                    this.S.dataList.length = newLn
                } else {
                    this.S.dataList = this.createDataList(val)
                }
                this.getTotal()
            }, 250)
        }, true)
    }
    /**
     * 获取后台数据
     */
    init() {
    	this.RS.getZhop(this.S.gid)
    		.then((c) => {
                if (c.code == 200 && c.data.length) {
    	            this.S.initDataList = c.data
                    this.dataChange()
                    this.getTotal()
		        }
    		})
    }

    /*
     * 开关 toggle
     */
    switch (e) {
        var $sliding = $(e.target).parent('.sliding')
        $sliding.toggleClass('active')
        $sliding.hasClass('active') ? this.S.toggleID = 1 : this.S.toggleID = 0
    }

    //切换追号模式
    changeType(type = 1) {
        if(type === 1) { //普通
            $('.tab-indicator').css('left', 0)
            this.S.showAdvanced = false
            this.S.senior.number = 1
            this.S.senior.fnumber = 1
        }else if(type === 2) {
            $('.tab-indicator').css('left', '50%')
            this.S.showAdvanced = true
            this.S.senior.number = 2
            this.S.senior.fnumber = 2
        }
    }
}
