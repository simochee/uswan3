btn-icon
	
	button.btn(type="button" onclick="{onClick}")
		span.icon
			span(each="{icon in opts.icons}" class="ion-{icon}")
		| {opts.text}

	script.
		this.onClick = function() {
			// スムーススクロール
			if(opts.scroller) {
				if(!opts.scroller.target) return;
				var target = opts.scroller.target;
				var duration = opts.scroller.duration || 200;
				var offset = opts.scroller.offset;
				var callback = opts.scroller.callback;
				var $target = document.getElementById(target);
				if(!$target) return;
				var pos = $target.getBoundingClientRect().top + offset;
				var pageY = window.pageYOffset;
				var pageX = window.pageXOffset;
				// アニメーション
				var start = new Date;
				var step = function() {
					var progress = new Date - start;
					if(progress < duration) {
						requestAnimationFrame(step);
					} else {
						if(progress != duration) {
							progress = duration;
						}
						if(typeof(callback) === 'function') {
							callback();
						}
					}
					window.scrollTo(pageX, pageY + pos * (progress / duration))
				}
				requestAnimationFrame(step);
			}
		}