curfew
	.curfew(if="{isSP}")#curfew 門限を確認しましたか？
		.header
			.left
				span.ion-ios-arrow-back.icon
				| 左スワイプ：確認
			.right
				| 右スワイプ：設定
				span.ion-ios-arrow-forward.icon
		.footer
			.center
				span.ion-ios-circle-filled.icon
				| タップ：再表示


	script.
		var lockr = require('lockr');

		if('ontouchstart' in window) {
			this.isSP = true;
		} else {
			this.isSP = false;
		}

		this.on('mount', function() {
			if(this.isSP) {
				var $elem = document.getElementById('curfew');
				var startPos;
				$elem.addEventListener('touchstart', function(e) {
					var touchObj = e.changedTouches[0];
					var pos = {
						x: touchObj.pageX,
						y: touchObj.pageY
					}
					startPos = pos;
				});
				$elem.addEventListener('touchmove', function(e) {
					var touchObj = e.changedTouches[0];
					var pos = {
						x: touchObj.pageX,
						y: touchObj.pageY
					}
					
				});
				$elem.addEventListener('touchend', function(e) {

				});
			}				
		});


	style(type="sass" scoped).
		.curfew
			position: absolute
			top: 0
			left: 0
			display: -webkit-inline-flex
			display: -moz-inline-flex
			display: -ms-inline-flex
			display: -o-inline-flex
			display: inline-flex
			align-items: center
			justify-content: center
			width: 100%
			height: 100%
			background: #ad1514
			color: #fff
			font-size: 20px
			text-align: center
			z-index: 1
			cursor: default
			.header, .footer
				position: absolute
				left: 0
				width: 100%
				color: rgba(#fff, 0.7)
				font-size: 11px
				.icon
					margin: 0 4px
			.header
				top: 5px
				.left
					position: absolute
					left: 10px
				.right
					position: absolute
					right: 10px
			.footer
				bottom: 5px
				.center
					margin: 0 auto