import $ from 'zepto'

export const imarquee = function(
	Core,
	Util
) {
    return {
        restrict: 'E',
        replace: true,
        transclude: true,
        template: '<div id="ion-marquee"><ul ng-transclude></ul></div>',
        link: function(scope, element, attrs) {
        	element.css({
        		height: '150px',
        		overflow: 'hidden'
        	})
        	var _defaults = {
				isEqual: true,		//所有滚动的元素长宽是否相等,true,false
				loop: 0,			//循环滚动次数，0时无限
				direction: 'up',	//滚动方向，"left","right","up","down"
				scrollAmount: 1,	//步长
				scrollDelay: 20		//时长
			}

			var _opts = (function() { //初始化参数
				var _ret = {}
				for(var i in _defaults) {
					_ret[i] = attrs[i] || _defaults[i]
				}
				return _ret
			})()

			var init = function() {
				var $marquee=$(element[0])		//滚动元素容器
				var _scrollObj=$marquee.get(0)		//滚动元素容器DOM
				var scrollW=$marquee.width()		//滚动元素容器的宽度
				var scrollH=$marquee.height()		//滚动元素容器的高度
				var $element=$marquee.children()	//滚动元素
				var $kids=$element.children()		//滚动子元素
				var scrollSize=0					//滚动元素尺寸
				//防止获取不到子元素进行的延时操作
				if($kids.length ==0 ) {
					var _t = setTimeout(function() {
						if($kids.length > 0) {
							clearTimeout(_t)
						}
						init()
					}, 100)
					return false
				}
				//滚动类型，1左右，0上下
				var _type=_opts.direction == 'left' || _opts.direction == 'right' ? 1 : 0

				//防止滚动子元素比滚动元素宽而取不到实际滚动子元素宽度
				$element.css(_type ? 'width': 'height', 10000)

				//获取滚动元素的尺寸
				if(_opts.isEqual) {
					// scrollSize=$kids[_type?'outerWidth':'outerHeight']()*$kids.length
					scrollSize=$kids[_type ? 'width' : 'height']()*$kids.length
				}

				//滚动元素总尺寸小于容器尺寸，不滚动
				if(scrollSize < (_type?scrollW:scrollH)) { return }

				//克隆滚动子元素将其插入到滚动元素后，并设定滚动元素宽度
				$element
					.append($kids.clone())
					.css(_type ? 'width' : 'height', scrollSize * 2)

				function scrollFunc() {
					var _dir= 'scrollTop'
					if(_opts.direction == 'up') {
						var newPos = _scrollObj[_dir] + _opts.scrollAmount
						if(newPos >= scrollSize) {
							newPos -= scrollSize
						}
						_scrollObj[_dir] = newPos
					}
				}

				//滚动开始
				const _loopId = Util.loop(scrollFunc, _opts.scrollDelay)
				scope.$on('$destroy', function() {
					Util.stopLoop(_loopId)
				})
			}
			init()
        }
    }
}
