import {cfo2a} from '../../service/util'
import 'animate.css'
import $ from 'zepto'
export default class {
	constructor($scope, RS, $stateParams, $rootScope) {
		this.$scope = $scope
		this.rs = RS

		$scope.convert = this.convert.bind(this)
        $scope.changeList = this.changeList.bind(this)
        $scope.initData = this.initData.bind(this)
        $scope.defaultLottery = true
        $scope.all_gc_list = {
            normal_list: [],
            list: {}
        }
        $scope.all_sc_list = {
		    normal_list: [],
		    list: {}
        }
        $scope.gtype = 'gc'
        $scope.allauth = false
        let cp = $rootScope.lottery_auth ? $rootScope.lottery_auth : '1,2'
        cp = cp.split(',')
        if($.inArray('1', cp)>-1 && $.inArray('2', cp)>-1) {
            $scope.allauth = true
        }
        if($stateParams.type) {
            $scope.gtype = $stateParams.type
        }

        this.initData($scope.gtype)
	}
	initData(type) {
        this.$scope.gtype = type
        let cpType = 'all_'+type+'_list'
        if(this.$scope[cpType].list.length) {
            return false
        }else if(sessionStorage.getItem(cpType)) {
            this.$scope[cpType] = JSON.parse(sessionStorage.getItem(cpType))
        }else {
            this.rs
                .getGameList({use: 'all'}, false)
                .then((response) => {
                    if(response.code == 200) {
                        this.serialization(response.data[0])
                    }
            })
        }
	}

    serialization(list) {
	    let keys = Object.keys(list)
        list = Object.values(list).map((item) => Object.values(item))

        list.forEach((item, i) => {
            this.$scope.all_gc_list.list[keys[i]] = []
            this.$scope.all_sc_list.list[keys[i]] = []
	        item.forEach((v) => {
	            if(v.ctg === 'gc') {
                    this.$scope.all_gc_list.normal_list.push(v)
                    this.$scope.all_gc_list.list[keys[i]].push(v)
                }else {
                    this.$scope.all_sc_list.normal_list.push(v)
                    this.$scope.all_sc_list.list[keys[i]].push(v)
                }
            })
        })
        sessionStorage.setItem('all_sc_list', JSON.stringify(this.$scope.all_sc_list))
        sessionStorage.setItem('all_gc_list', JSON.stringify(this.$scope.all_gc_list))
    }
	convert(obj) {
		const ret = cfo2a(obj)
		return ret.length
	}
    changeList() {
	    this.$scope.defaultLottery = !this.$scope.defaultLottery
    }
}
