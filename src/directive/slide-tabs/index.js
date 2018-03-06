
import angular from 'angular'
const j = angular.element
import $ from 'zepto'

export const slideTabs = function($timeout, $compile, $state, $stateParams, Util, $rootScope, Lottery) {
	return {
		restrict: 'E',
		transclude: true,
		replace: true,
		template: '<div class="slide-wrap">' +
						'<div class="slide-tabs-wrap">' +
							'<ul class="slide-tabs" ng-transclude></ul>' +
						'</div>' +
		          '</div>',
		link: function($scope, $elem, $attr) {
			$scope.width = 0
			let tabs
			let bars
			let pre

			$scope.needWrap = $attr.needWrap == true

			const iw = window.innerWidth

			const setWidth = function() {
				if(!angular.isDefined(tabs)) {
					return false
				}

				let width = 0
				angular.forEach(tabs, function(e) {
					width += e.offsetWidth
				})
				$scope.width = width
				j(document.querySelector('.slide-bars')).css('width', width + 'px')
			}

			//bind
			const bd = function() {
				const target = $('.slide-bars')
				let startP = 0
				let currP = 0
				let currM = 0
				let endP = 0
				if(!target.css('width')) {
					return
				}
				let ew = target.css('width').match(/\d+/)[0]

				const go = function(tx) {
					target.css({
						transition: 'all 0.2s ease-in-out',
						transform: `translateX(${tx}px)`
					})
				}

				const start = function(e) {
					target.css('transition', 'all 0s')
					startP = e.touches[0].pageX
					currM = target.css('transform')
					currM = currM == 'none' ? 0 : Number(currM.match(/-?\d+/g)[0])
				}

				const move = function(e) {
					currP = e.changedTouches[0].pageX
					const ls = currP - startP
					target.css('transform', `translateX(${currM + ls}px)`)
				}

				const end = function(e) {
					endP = e.changedTouches[0].pageX
					const ls = endP - startP
					const _left = target[0].getBoundingClientRect().left

					let fg
					if(ls > 0) {
						if(_left > 0) {
							fg = 0
						}
					}

					if(ls < 0 ) {
						const __l = $('.slide-bars-wrap').get(0).getBoundingClientRect().left
						if($scope.width <= iw - 2 * __l) {
							fg = 0
						} else if(Number(ew) + Number(_left) < Number(iw)) {
							fg = iw - ew
						}
					}

					fg!= undefined && go(fg)
					startP = 0
					currP = 0
					endP = 0
					currM = 0
				}

				Util.og('touchstart', target[0], start)
				Util.og('touchmove', target[0], move)
				Util.og('touchend', target[0], end)
			}

			const scrollToSuitablePosition = function(target, pre) {
				const getBL = function(nh) {
					return nh.getBoundingClientRect().left
				}

				const $bars = $('.slide-bars')
				$bars.css('transition', 'all 0.2s ease-in-out')
				if(!$bars.get(0)) {
					return
				}
				const bw = $bars.get(0).offsetWidth
				if($bars.parent().get(0).offsetWidth + 5 >= bw) {
					return false
				}
				let bc = 10 // 步长
				let boundLeft = getBL(target)
				const w = target.offsetWidth
				const last = $('.slide-bar').last()
				const first = $('.slide-bar').first()
				// const fl = getBL(first[0])
				if(target == first.get(0)) {
					$('.slide-bars').css('transform', 'translateX(0px)')
					return
				} else if(target == last.get(0)) {
					$('.slide-bars').css('transform', `translateX(${iw - bw}px)`)
					return
				}

				let offset = 0
				let direction = ''
				if(pre == null ) {
					direction = 'left'
				} else {
					if($(target).index() > pre.index()) {
						direction = 'left'
					} else if ($(target).index() < pre.index()) {
						direction = 'right'
					} else {
						direction = 'stop'
					}
				}
				offset = bc

				if(direction == 'stop') {
					offset = 0
				} else if(direction == 'left') {
					if(Math.abs(boundLeft)+ bc + iw >= bw) {
						offset = bw - iw
					} else {
						offset = boundLeft - bc
					}
				} else if (direction == 'right' ) {
					if(boundLeft + w + bc <= iw) {
						offset = -bc
					} else {
						if(boundLeft + bc + w < iw - bc) {
							offset = boundLeft
						}
					}
				}

				$bars.css('transform', `translateX(${offset * (direction == 'left' ? -1 : 1)}px)`)
			}

			const scrollToBar = function(type) {
				let target
				pre = $('.slide-bar.active')

				$('.slide-bar').each(function(i) {
					$(this).removeClass('active')
					if(i == type) {
						target = this
					}
				})

				$(target).addClass('active')

				//页面刷新
				if(!pre.length || target == pre.get(0)) {
				    console.log(11111)
					scrollToSuitablePosition(target, null)
				} else {
                    console.log(2222)
					scrollToSuitablePosition(target, pre)
				}
			}

			const handlePage = function(idx) {
				const pageWrap = document.querySelector('.slide-tabs')
				$(pageWrap).children().css({
					height: 'auto'
				})
				j(pageWrap).css({
					transform: `translateX(${-idx * iw}px)`
				})

				if($attr.autoHide) {
					$(pageWrap)
						.children()
						.css({
							height: 0
						})
						.eq(idx)
						.css({
							height: 'auto'
						})
				}
			}

			const goTo = function(t) {
				if(!angular.isDefined(bars)) {
					return false
				}
                Lottery.clearCds()
				let type = t || $stateParams.type
				let idx = 0
				if(type == '' || type == undefined) {
					type = bars[0].type
					idx = 0
				} else {
					angular.forEach(document.querySelectorAll('.slide-bar'), function(e) {
						if(e.getAttribute('data-type') == type) {
							idx = e.getAttribute('data-idx')
						}
					})
				}

				$rootScope.slideTabsId = idx
				scrollToBar(idx)
				handlePage(idx)
				bd()
			}

			$scope.bars = []
			$scope.addBars = function(bar) {
				let flag
				$('.slide-bar').each(function(i, e) {
					if($(e).attr('data-type') == bar.type) {
						flag = true
					}
				})
				if(flag === true) {
					return
				}
				$scope.bars.push(bar)
				$scope.$apply()
				bars = $scope.bars

				$timeout(function() {
					tabs = document.querySelectorAll('.slide-bar')

					setWidth()
					goTo()
				})
			}

			$scope.tabToTap = function(evt, type) {
				goTo(type)
			}

			const init = function() {
				const items = '<div class="slide-bars-wrap"><ul class="slide-bars clearfix"><li class="slide-bar fs14" ng-repeat="bar in bars track by $index" data-type="{{bar.type}}" data-idx="{{$index}}" ng-click="tabToTap($event, bar.type)"><span ng-if="bar.img" class="bar-img"><img ng-src="{{bar.img}}"></span><span class="bar-title">{{bar.title}}</span></li></ul></div>'
				const tpl = $compile(items)($scope)
				$elem.prepend(tpl)
			}

			init()
		},
		controller: function($scope) {
			this.addBars = function(bar) {
                $scope.bars = []
                Util.destroy()
				$timeout(function() {
					if($scope.addBars) {
						$scope.addBars(bar)
					}
				})
			}
            $scope.$watch('slideTabsId', (val) => {
                console.log(val)
                if(val !== undefined && $scope.lotterys !==undefined) {
                    let data = []
                    data = $scope.lotterys[val].items
                    data.forEach((e) => {
                        Lottery.getKithe(e.gid, $scope, false)
                    })
                }
            })

			$scope.$on('$destroy', function() {
				Util.destroy()
			})
		}
	}
}

export const slideTab = function() {
	return {
		restrict: 'E',
		require: '^slideTabs',
		replace: true,
		transclude: true,
		template: '<li ng-transclude class="slide-tab"></li>',
		link: function($scope, $elem, $attr, $parent) {
			const bar = $attr.barImg ? {
				img: $attr.barImg,
				title: $attr.barTitle,
				type: $attr.type
			} : { title: $attr.barTitle, type: $attr.type }
			$parent.addBars(bar)
		}
	}
}
