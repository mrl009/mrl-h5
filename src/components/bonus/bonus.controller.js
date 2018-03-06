import $ from 'zepto'
import angular from 'angular'

// import './bonus.less'

export default class {
	constructor($scope, Core) {
		this.S = $scope
		this.C = Core

		this.initData()
	}

	initData() {
		const token = this.C.getToken()
		this.C
			.get('home/get_game_opt', (json) => {
			    return angular.fromJson(json)
			})
			.then((c) => {
				if(c.code == 200) {
					$.each(c.data.rows, (i, d) => {
			            var items = []
			            this.reqDetail(d.value, items, c, token)
			            c.data.rows[i].items = items
			        })
			        this.S.bsItems = c.data.rows
				}
			})
	}

	reqDetail(type, items, c, token) {
		this.C.get('user/bonus_detailed/get_list', {token, type}, function (json) {
            var cc = angular.fromJson(json)
            if (cc.code == 200) {
                var tempItems = []
                $.each(cc.data.rows, function (ii, dd) {
                    $.each(dd.child, function (iii, ddd) {
                        if (ddd.child) {
                            $.each(ddd.child, function (iiii, dddd) {
                                tempItems.push({name: ddd.name + dddd.name, rate: dddd.rate})
                            })
                        } else {
                            tempItems.push({name: ddd.name, rate: ddd.rate})
                        }
                    })
                    items.push({title: dd.name, rebate: dd.rebate, rows: tempItems})
                    tempItems = []
                })
            }
        })
	}
}