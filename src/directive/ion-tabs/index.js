import angular from 'angular'
const j = angular.element
import $ from 'zepto'
import './ion-tabs.less'

export const ionTabs = function($compile, $timeout) {
	return {
		retrict: 'E',
		transclude: true,
		template: '<div class="ion-tabs" ><div class="ion-list-wrap" ng-transclude></div></div>',
		replace: true,
		controller: function($scope) {
			$scope.titles = []
			this.addTabs = function(title) {
				$scope.titles.push(title)
			}
		},
		link: function($scope, $elem) {
			const iw = window.innerWidth
			$scope.active = 0
			$scope.changeTab = function(cid) {
				const $pre = $('.selected')
				$scope.active = cid

				$('.ion-tab-wrap').each(function() {
					const _trans = parseInt($(this).css('transform').match(/-?\d+/)[0])
					$(this).css({'transform': `translateX(${_trans + ($pre.index() - cid) * iw}px)`,
                        transition: 'transform 0.2s ease-in-out'})
				})
			}
			var _tabs = '<ul class="ion-lists"><li class="ion-titem ion-titem-{{titles.length}}" ng-class="{selected: $index == active}" ng-repeat="title in titles track by $index" ng-click="changeTab($index)">{{title}}</li></ul>'
			$elem.prepend($compile(_tabs)($scope))

			$timeout(function() {
				document.querySelectorAll('.ion-tab-wrap').forEach(function(e, i) {
					j(e).css('transform', `translateX(${i * iw}px)`)
				})
			})
		}
	}
}

export const ionTab = function() {
	return {
		require: '^ionTabs',
		retrict: 'E',
		replace: true,
		transclude: true,
		template: '<div class="ion-tab-wrap" ng-transclude></div>',
		link: function($scope, $elem, $attr, $parent) {
			$parent.addTabs($attr.title || '标题')
		}
	}
}

export const ionView = function() {
	return {
		retrict: 'E',
		replace: true,
		transclude: true,
		template: '<div class="ion-tab-view" ng-transclude></div>'
	}
}
