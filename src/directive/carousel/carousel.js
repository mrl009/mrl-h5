import $ from 'zepto'

export default function(tar, Util, fn) {
	const iw = window.innerWidth
	const Carousel = function() {
		const self = this
		this.target = $(tar.children()[0])
		this.startP = 0
		this.moveP = 0
		this.endP = 0
		this.curr = 0
		this._len = 0

		//初始化
		this.target
			.css('width', iw)
			.css('transform', `translate3d(${-iw}px, 0, 0)`)

		this.calculate = function(val) {
			fn(-val / iw)
			this.target.css('transform', `translate3d(${val}px, 0, 0)`)
		}

		this.go = function(next, ls, from) {
			if(this.curr % iw !== 0) {
				this.curr = Math.abs(this.curr) % iw > iw / 2 ? Math.ceil(this.curr / iw) : Math.floor(this.curr/iw)
			}
			if(ls <= iw * 0.5) {
				this.calculate(Number(this.curr))
			} else {
				if(from !== undefined) {
					self.target.css('transition-duration', '0.5s')
					self.curr = self.target.css('transform').match(/3d\((-?\d+)px/)[1]

					self._len = self.target.children().length
					// if(self.curr == 0) {
					// 	self.target.css('transition-duration', '0s')
					// 	self.curr = -1 * (self._len - 2) * iw
					// }
					if(self.curr <= -1 * (self._len - 1) * iw) {
						self.curr = iw
					}
					// if(self.curr == -1 * (self._len - 1) * iw) {
						// self.target.css('transition-duration', '0s')
					// 	self.curr = -1 * iw
					// }
					this.calculate(Number(this.curr) + next * iw)
				} else {
					// if(this.curr == 0) {
					// 	this.calculate(0)
					// }
					if(this.curr == 0 && next > 0) {
						this.calculate(0)
					} else if(this.curr == (1 - self._len) * iw && next < 0) {
						this.calculate((1 - self._len ) * iw)
					} else {
						this.calculate(Number(this.curr) + next * iw)
					}
				}
				// console.log()
				// fn(next)
			}
		}

		this.start = function(evt) {
			self.target.css('transition-duration', '0ms')
			self._len = self.target.children().length
			self.curr = self.target.css('transform').match(/3d\((-?\d+)px/)[1]
			self.startP = evt.touches[0].pageX
		}

		this.move = function(evt) {
			self.moveP = evt.changedTouches[0].pageX - self.startP
			// if(self.curr == 0) {
			// 	self.curr = -1 * (self._len - 2) * iw
			// }
			// if(self.curr == -1 * (self._len - 1) * iw) {
			// 	self.curr = -1 * iw
			// }
			self.calculate(Number(self.curr) + self.moveP)
		}

		this.end = function(evt) {
			self.target.css('transition-duration', '0.5s')
			self.endP = evt.changedTouches[0].pageX
			const ls = self.endP - self.startP
			const direction = ls > 0 ? 'Right' : 'Left'
			if(direction == 'Left') {
				self.go(-1, Math.abs(self.endP - self.startP))
			}

			if(direction == 'Right') {
				self.go(1, Math.abs(self.endP - self.startP))
			}
			self.startP = 0
			self.moveP = 0
			self.endP = 0
			// self.curr = 0
		}

		fn(0)

		this.initBind = function() {
			Util.og('touchstart', tar[0], this.start)
			Util.og('touchmove', tar[0], this.move)
			Util.og('touchend', tar[0], this.end)
		}

		this.unBind = function() {
			Util.destroy()
		}

		this.initBind()
	}
	return new Carousel()
}