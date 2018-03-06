export default function(target, fn, $timeout) {
	const LoadMore = function() {
		const self = this
		self.$lm = target.find('.refresh-lm')
		self.$load = self.$lm.find('.lm-loading')

		self.bound = self.$load.get(0).offsetHeight
		self.st = 0

		self.isLoading = false
		self.isReqing = false
		self.pre = 0

		self.listenScroll = function() {
			target.on('scroll', function() {
				//最多每秒钟请求一次
				if(self.isLock) {
					return
				}
				self.st = this.scrollTop
				self.sh = target.get(0).scrollHeight
				self.oh = target.get(0).offsetHeight
				if(self.st + self.bound >= self.sh - self.oh) {
					if(self.isLoading || self.isReqing) {
						return
					}
					self.isLoading = true
					self.$load.css('transform', 'scale(1)')

					$timeout(function() {
						self.isReqing = true
						self.isLock = true
						fn().then(function() {
							self.isReqing = false
							self.$load.css('transform', 'scale(0)')
						})

						$timeout(function() {
							self.isLock = false
						}, 1000)
					})
				} else {
					self.isLoading = false
					self.$load.css('transform', 'scale(0)')
				}
			})
		}

		self.destroy = function() {
			target.unbind('scroll')
		}

		self.listenScroll()
	}

	return new LoadMore()
}