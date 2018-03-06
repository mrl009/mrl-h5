// import Promise from 'promise'

export default function(target, Util, $timeout, Layer, cbFn) {
	const Refresh = function(target) {
		const self = this
		const $refresher = target.find('.refresher')
		this.target = target[0]
		this.startP = 0
		this.currP = 0
		this.endP = 0
		this.sh = 0

		//scrollTop st为0的时候才去执行事件操作
		this.sT = 0
		this.isScrolling = false

		//refresherHeight
		this.rh = $refresher.get(0).offsetHeight
		//boundHeight 刷新的临界高度
		this.bh = this.rh / 2

		this.start = function(e) {
			if(self.isScrolling) {
				return
			}
			self.sT = self.target.scrollTop
			if(self.sT <= 50) {
				self.startP = e.touches[0].pageY
				target.css({
					'transition-delay': '0s'
				})
				$refresher.css({
					'transition-delay': '0s'
				})
			}
		}
		this.showLoading = function() {
			target.css({'transition': 'all 0.2s ease-in-out', 'padding-top': self.rh + 'px'})
			$refresher.css({'transition': 'all 0.2s ease-in-out', top: 0}).removeClass('active')
			$refresher.find('div').hide()
			$refresher.find('.loading').show()
		}

		this.reset = function() {
			target.css({'padding-top': 0})
			$refresher.css('top', -self.rh + 'px').removeClass('active')
			$refresher.find('div').show()
			$refresher.find('.loading').hide()
		}
		//回滚并执行回调
		this.rollBack = function() {
			self.isScrolling = true
			//先回滚至0状态
			self.showLoading()

			//10s 最长刷新时间，如果没有获取结果，弹出错误提示
			const _t = $timeout(function() {
				$timeout.cancel(_t)
				Layer.toast('请求超时')
			}, 10000)

			cbFn().then(function() {
				$timeout.cancel(_t)
				const _t1 = $timeout(function() {
					$timeout.cancel(_t1)
					self.reset()
					self.isScrolling = false
				}, 500)
			})
		}

		this.move = function(e) {
			if(self.isScrolling) {
				return
			}
			if(self.sT <= 50) {
				self.currP = e.changedTouches[0].pageY
				self.sh = self.currP - self.startP
				// sh > 0 向下拉
				if(self.sh > 0) {
					target.css({
						'padding-top': self.sh + 'px'
					})

					$refresher.css({
						top: self.sh - self.rh + 'px'
					})
					if(self.sh >= self.rh) {
						$refresher.addClass('active')
					} else {
						if($refresher.hasClass('active')) {
							$refresher.removeClass('active')
						}
					}
				}
			}
		}
		this.end = function() {
			if(self.isScrolling) {
				return
			}

			if(self.sh >= self.rh) {
				self.rollBack()
			} else {
				target.css({'transition': 'all 0.2s ease-in-out', 'padding-top': 0})
				$refresher.css({'transition': 'all 0.2s ease-in-out', top: -self.rh + 'px'}).removeClass('active')
			}

			self.sh = 0
			self.startP = 0
			self.currP = 0
			self.endP = 0
			self.sT = 0
		}

		this.bind = function() {
			Util.og('touchstart', this.target, this.start)
			Util.og('touchmove', this.target, this.move)
			Util.og('touchend', this.target, this.end)
		}

		this.destroy = function() {
			Util.destroy()
		}

		this.bind()
	}

	return new Refresh(target)
}
