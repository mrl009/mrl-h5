import $ from 'zepto'
// import './refresh.less'

import refresh from './refresh'
import loadmore from './more'

export const pullRefresh = function(Util, $timeout, Layer) {
	return {
		restrict: 'A',
		scope: {
			refresh: '&',
			loadMore: '&',
			noMore: '='
		},
		link: function($scope, $elem, $attr) {
			const refresher = `
				<div class="refresher">
					<div class="iconfont icon-xjt"></div>
					<div class="refresher-text">刷新中</div>
					<div class="loading"></div>
				</div>
			`
			const loadmoreTpl = `
				<div class="refresh-lm">
					<div class="lm-loading"></div>
				</div>
			`
			if($scope.refresh) {
				$elem.addClass('refresh-wrap').prepend(refresher)
			}

			if($attr.noMore != 'true') {
				$elem.append(loadmoreTpl)
			}

			let Refresh, Lm
			if($scope.refresh ) {
				Refresh = refresh($('.refresh-wrap'), Util, $timeout, Layer, function() {
					return $scope.refresh()
				})
			}

			if($attr.noMore != 'true') {
				Lm = loadmore($('.refresh-wrap'), function() {
					return $scope.loadMore()
				}, $timeout)
			}

			$scope.$on('$destroy', function() {
				Refresh && Refresh.destroy()
				Lm && Lm.destroy()
			})
		}
	}
}