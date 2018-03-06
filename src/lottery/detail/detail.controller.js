export default class {
	//代替了constructor
	setData (scope, sp, ly) {
		scope.suData = {money: 0, txtmoney: 2, sumbet: 0, mtype: 1}//金额数据
        // 元角分
	    scope.moneytype = 'y'

	    //彩票类型
	    scope.type = sp.type
        let _f = (arr, obj) => {
            let i = arr.length
            while (i--) {
                if (arr[i] === obj) {
                    return true
                }
            }
            return false
        }
        scope.mtxt = false
        if(_f(['s_ssc', 's_pk10', 's_k3', 's_11x5', 's_kl10', 's_yb', 'pcdd'], sp.type)) {
            scope.mtxt = true
        }
	    //游戏ID
	    scope.gid = sp.gid
		//默认元
		scope.moneytype = 'y'
        //连码默认项
        scope.ballIndex = 0
		scope.tid = ''

		this.scope = scope
		this.ly = ly

		this.init()
		// this.getOpen()

		this.kithe()

		this.getCart()

		//0.5秒后更新缓存
		const _t = scope.$timeout(() => {
			if(scope.type != 'pcdd') {
				this.getPros(true)
			} else {
				this.scope.service.getPros(this.scope, true)
			}
			scope.$timeout.cancel(_t)
		}, 500)

        //连码选项
        scope.selectItem = function($index) {
		    console.log($index)
            scope.ballIndex = $index
            scope.suData.sumbet = 0
        }
		scope.toolQuan = this.toolQuan.bind(this)
        scope.toolDa = this.toolDa.bind(this)
        scope.toolXiao = this.toolXiao.bind(this)
        scope.toolDan = this.toolDan.bind(this)
        scope.toolShuang = this.toolShuang.bind(this)
        scope.toolClear = this.toolClear.bind(this)

		scope.getBall = this.getBall.bind(this)
		scope.openType = this.openType.bind(this)
		scope.openLottery = this.openLottery.bind(this)
		scope.getPlay = this.getPlay.bind(this)
        scope.get2Play = this.get2Play.bind(this)

		scope.clearAll = this.clearAll.bind(this)
		scope.randomOne = this.randomOne.bind(this)

		scope.selBalls = this.selBalls.bind(this)

		scope.goBack = this.goBack.bind(this)

		scope.bet = this.bet.bind(this)

		scope.unit = this.unit.bind(this)

		scope.dropMenu = this.dropMenu.bind(this)

		scope.hdDate = this.hdDate.bind(this)

		scope.showTips = this.showTips.bind(this)

		scope.$on('$destroy', function() {
			ly.clearCds()
		})
	}

	toolQuan (event) {
		this.ly.tq(event, this.scope)
	}

	toolDa (event) {
		this.ly.td(event, this.scope)
	}

	toolXiao (event) {
		this.ly.tx(event, this.scope)
	}

	toolDan (event) {
		this.ly.tDan(event, this.scope)
	}

	toolShuang (event) {
		this.ly.ts(event, this.scope)
	}

	toolClear (event) {
		this.ly.tc(event, this.scope)
	}

	init(flag) {
        this.ly.initPage(this.scope, flag)
    }

	getOpen() {
		return this.ly.getOpen(this.scope.gid, this.scope)
	}

	//选择玩法更新球
    getBall (id, sname) {
       this.ly.getBall(id, sname, this.scope)
    }

	openType() {
        this.scope.pl = this.ly.showPlaylist(this.scope)
    }

	openLottery() {
		this.dm && this.dm.close()
		this.getOpen()
			.then(() => {
				this.ly.showOpenlist(this.scope)
			})
    }

	getPlay(pid) {
        this.ly.getPlay(pid, this.scope)
    }

    get2Play(tid, sname, t) {
        this.ly.get2Play4Ssc(tid, sname, t, this.scope)
    }

	clearAll() {
		this.scope.suData.sumbet = this.ly.allClear()
		this.scope.suData.money = 0
	}

	hdDate(val, key) {
		return this.scope.util.hdDate(val, key)
	}

	randomOne() {
        this.ly.ro(this.scope)
	}

	selBalls(event) {//点击选择球计算注数和金额
		this.ly.selBalls(event, this.scope)
	}

	goBack() {
		this.ly.goBack(this.scope)
	}

	kithe() {
		this.ly.getKithe(this.scope.gid, this.scope)
	}

	bet() {
		this.ly.bet(this.scope)
	}

	unit(type) {
		this.ly.unit(this.scope, type)
	}

	getCart() {
		this.ly.getCart(this.scope)
	}

	dropMenu(event) {
		this.dm = this.ly.dropMenu(this.scope, event.target)
	}

	getPros(flag) {
		this.ly.getPros(this.scope, flag)
	}

	showTips() {
		this.ly.showTips(this.scope)
	}
}
