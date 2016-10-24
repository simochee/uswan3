const instance = {
	touchEvent: false
}

module.exports = {
	hasTouchEvent: () => {
		if(instance.touchEvent) {
			return instance.touchEvent;
		}
		if('ontouchstart' in window) {
			const events = {
				TOUCH_START: 'touchstart',
				TOUCH_MOVE: 'touchmove',
				TOUCH_END: 'touchend'
			}
			instance.touchEvent = events;
			return events;
		} else {
			const events = {
				TOUCH_START: 'mousedown',
				TOUCH_MOVE: 'mousemove',
				TOUCH_END: 'mouseup'
			}
			instance.touchEvent = events;
			return events;
		}
	}
}