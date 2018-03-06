import $ from 'zepto'

export const drawLine = function($timeout, CS) {
	return {
		restrict: 'A',
		link: function($scope, $elem) {
			const $table = $($elem[0])
			//获取球
			$scope.getBalls = function() {
				$scope.balls = $table.find('tbody').find('td[code="1"]')
			}

			$scope.drawLines = function () {
	            const $target = $table
	            const canvasId = `__conv${new Date().getTime()}`
	            $target.append(`
					<canvas
						style="position:absolute;left:${$target.css('marginLeft') || 0};top: ${$target.css('marginTop')||0}"
						id="${canvasId}"
						width="${$target.width()}"
						height="${$target.height()}">
					</canvas>
				`)

	            $target
	                .css('width', $target.width())
	                .css('margin-left', $target.css('marginLeft'))

	            const _canvas = document.getElementById(canvasId)

	            CS.draw($scope.balls, _canvas)
	        }

			$timeout(function() {
				$scope.getBalls()
				$scope.drawLines()
			})
		}
	}
}