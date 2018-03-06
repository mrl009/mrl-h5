// import $ from 'zepto'
// import angular from 'angular'
import Swiper from 'swiper'

 import './carousel.less'

export const carousel = function(Core, $timeout) {
    return {
        restrict: 'E',
        replace: true,
        transclude: true,
        template: '<div class="swiper-container">' +
                    '<div class="swiper-wrapper" ng-transclude></div>' +
                    '<div class="swiper-pagination sp"></div>' +
                  '</div>',
        link: function($scope, $elem, $attr) {
            let conf = {
                direction: 'horizontal',
                observer: true,
                observeParents: true,
                loop: true,
                autoplay: {
                        // stopOnLastSlide: true,
                        delay: 3000,
                        disableOnInteraction: false
                    },
                speed: 300,
                autoplayDisableOnInteraction: true,
                lazy: true
            }

            if($attr.pagination) {
                conf.pagination = {
                    el: `.${$attr.pagination}`,
                    clickable: true
                }
            }
            $timeout(function() {
                new Swiper ('.swiper-container', conf)
            }, 22)
        }
    }
}

export const carouselItem = function() {
	return {
		restrict: 'E',
		require: '^carousel',
		replace: true,
		transclude: true,
		template: '<div class="swiper-slide" ng-transclude></div>'
		// link: function($scope, $elem, $attr, $parent) {
		// 	$parent.addTab($elem)
		// }
	}
}
