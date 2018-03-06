import angular from 'angular'
const j = angular.element
// import './activity.less'
export default class {
	constructor($scope, Core, $sce, RS) {
		this.S = $scope
		this.C = Core
		this.A = $sce
		this.RS = RS

		this.init()

		$scope.showText = this.showText.bind(this)
	}

	init() {
	    this.RS
	    	.getActivityList()
	    	.then((res) => {
	    		if (res.code == 200) {
		            this.S.alist = res.data.rows.map((v) => {
		            	v.content = this.A.trustAsHtml(v.content)
		            	return v
		            })
		        }
	    	})
	}

	showText(e) {
		e.stopPropagation()
        var _t = e.target
        while(!j(_t).hasClass('item')) {
            _t = _t.parentNode
        }

        const $tc = j(_t.querySelector('.content'))
        if(!$tc.hasClass('show-content')) {
            angular.forEach(j(_t.parentNode.querySelectorAll('.content')), function(e) {
                j(e).removeClass('show-content')
            })
            $tc.addClass('show-content')
        } else {
            $tc.removeClass('show-content')
        }
	}
}
