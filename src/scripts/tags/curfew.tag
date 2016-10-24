curfew
	.curfew(if="{isShow}")#curfew 門限を確認しましたか？
		.footer
			.center
				span.ion-ios-circle-outline.icon
				| タップ：再表示
				br
				span.ion-ios-circle-filled.icon
				| ダブルタップ：確認

	script.
		var Lockr = require('lockr');
		var anime = require('animejs');
		var utils = require('../utils');
		var d = new Date;
		var now = {
			year: d.getFullYear(),
			month: d.getMonth() + 1,
			date: d.getDate(),
			formated: function() {
				return this.year + '-' + utils.zero(this.month) + '-' + utils.zero(this.date)
			}
		}
		var self = this;

		if('ontouchstart' in window) {
			var checked = Lockr.get('curfew');
			if(checked === now.formated()) {
				self.isShow = false;
			} else {
				self.isShow = true;
			}
		} else {
			self.isShow = false;
		}

		this.on('mount', function() {
			if(this.isShow) {
				var $elem = document.getElementById('curfew');
				// FirstClickの判定フラグ
				var clicked = false;
				// $elemのクリックイベント
				$elem.addEventListener('touchstart', function(e) {
					e.preventDefault();

					// フラグが立っていたらDblclick
					if(clicked) {
						clicked = false;
						Lockr.set('curfew', now.formated());
						anime({
							targets: $elem,
							delay: 300,
							duration: 500,
							easing: 'easeOutCirc',
							scale: 0.6,
							opacity: 0,
							complete: function() {
								$elem.style.display = 'none';
							}
						});
						return;
					}

					// フラグを登録
					clicked = true;
					// 時間経過後でフラグが立ったままならSglclick
					setTimeout(function() {
						if(clicked) {
							anime({
								targets: $elem,
								duration: 500,
								easing: 'easeOutCirc',
								scale: 1.4,
								opacity: 0,
								complete: function() {
									$elem.style.display = 'none';
								}
							});
						}
						clicked = false;
					}, 300);
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