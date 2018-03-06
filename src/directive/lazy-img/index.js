import loading from '../../assets/img/defaultGames/loadingBall.png' //球默认图
import loadingBig from '../../assets/img/defaultGames/loading.png' //球默认图
import $ from 'zepto'
export const lazyImg = function() {
	return {
		restrict: 'E',
		replace: true,
		template: `<img src="${''}" class="lazy-img">`,
		link: function(scope, elem, attr) {
			const ih = window.innerHeight
			const iw = window.innerWidth
			let bh = elem[0].getBoundingClientRect().top
            let width = getComputedStyle(elem.parent()[0], null).getPropertyValue('width')
            let eleWidth = parseInt(getComputedStyle(elem[0], null).getPropertyValue('width'))
            let image = new Image()
                image.src = attr.url
            if(eleWidth > iw*0.6 && parseInt(width) > iw*0.8) {
                elem[0].src = loadingBig
            }else {
                elem[0].src = loading
            }
            const reset = function() { //加载完
                elem.removeClass('lazy-img')
                elem.parent().removeClass('text-center')
            }
            const fn = function() {
                bh = elem[0].getBoundingClientRect().top
                if( bh <= ih + 220) {
                    // elem[0].src = attr.url
                    elem[0].onload = reset
                }
            }

            image.onload = function() {
			   elem.attr('src', image.src)
               elem[0].onload = fn
            }

            attr.wrap = attr.wrap || 'content'
			elem.parent().addClass('text-center')

			// if(bh <= ih + 220) { //加载图片
			// 	elem[0].src = attr.url
			// 	elem[0].onload = reset
			// }

			$(`.${attr.wrap}`).on('scroll', fn)

			scope.$on('$destroy', function() {
				$(`.${attr.wrap}`).off('scroll')
			})
		}
	}
}
