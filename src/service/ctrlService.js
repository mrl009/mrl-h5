import $ from 'zepto'
import angular from 'angular'

export const CtrlService = function(
    Layer,
    DT,
    Util,
    $state
) {
    return {
    	showFilter: function(url, title, scope, fn) {
    		Layer.confirmForm({
	            title: title,
	            url: url,
	            scope: scope,
	            confirm: () => {
	                const {start, end} = scope
	                const tl = DT.addDays(start, 'month', 2)
	                const sd = DT.stringToDt(start)
	                const ed = DT.stringToDt(end)
	                if(sd > ed) {
	                    Layer.toast('开始日期不能大于结束日期', 1)
	                    return false
	                }

	                if(DT.addDays(tl, 'day', 2) < ed ) {
	                    Layer.toast('查询时间不得超过两个月', 1)
	                    return false
	                }
	                fn && fn()
	            }
	        })
    	},
    	draw (data, canvas) {
            const calCircle = function ($target) {
            	const ost1 = $target[0].offsetTop
                $target = $target.find('div')
                const ost2 = $target[0].offsetTop
                const _offset = $target.offset()
                const _width = $target.width()
                const _height = $target.height()

                return {
                    pointX: _offset.left + _width / 2,
                    // pointY: _offset.top + _height / 2,
                    pointY: ost1 + ost2 + _height / 2,
                    width: _width,
                    height: _height
                }
            }

            const drawLine = function (pre, next) {
                const prePoint = calCircle($(pre))
                const nextPoint = calCircle($(next))

                let startX = prePoint.pointX
                let startY = prePoint.pointY
                let endX = nextPoint.pointX
                let endY = nextPoint.pointY

                //半径
                const r = nextPoint.width / 2

                const xw = Math.abs(nextPoint.pointX - prePoint.pointX)
                const yh = Math.abs(nextPoint.pointY - prePoint.pointY)
                if (xw == 0) {
                    startY = startY + r
                    endY = endY - r
                } else {
                    const ls = Math.sqrt(xw * xw + yh * yh)
                    const _y = r / ls * yh
                    const _x = r / ls * xw
                    if (nextPoint.pointX - prePoint.pointX > 0) {
                        startX += _x
                        startY += _y
                        endX -= _x
                        endY -= _y
                    } else {
                        startX -= _x
                        startY += _y
                        endX += _x
                        endY -= _y
                    }
                }

                //获取画板
                if (canvas.getContext) {
                    let ctx = canvas.getContext('2d')
                    const bg = Util.getBgColor($(next).find('div'))
                    ctx.strokeStyle = bg

                    ctx.lineWidth = 1
                    ctx.beginPath()
                    ctx.moveTo(startX, startY) //设置起点
                    ctx.lineTo(endX, endY) //画线
                    ctx.closePath()
                    ctx.stroke()
                }
            }

            angular.forEach(data, function (e, i) {
                if (i > 0) {
                    drawLine(data[i - 1], e)
                }
            })
        },
        showLessMoney() {
            Layer.confirm({
                title: '余额不足',
                msg: '请充值后再进行注单',
                yesText: '充值',
                yesFn: function() {
                    $state.go('topup')
                }
            })
        }
    }
}