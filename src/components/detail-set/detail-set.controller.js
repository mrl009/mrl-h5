import $ from 'zepto'
import angular from 'angular'

// import './detail-set.less'

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
			        this.S.dsItems = c.data.rows
				}
			})
	}

	reqDetail(type, items, c, token) {
		this.C
			.get('user/detailed_set/get_list', {token, type}, function (json) {
            	var cc = angular.fromJson(json)
	            if (cc.code == 200) {
	                $.each(cc.data.rows, function (ii, dd) {
	                    var id = dd.split(':')
	                    $.each(cc.data.vals, function (iii, ddd) {
	                        if (iii===id[1]) {
	                            items.push({title: id[0], max_play: ddd.max_play, max_stake: ddd.max_stake})
	                        }
	                    })
	                })
	            }
	        })
	}
}