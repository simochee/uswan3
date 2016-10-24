menu-popup
	.popup-wrapper#popupWrapper(show="{isOpen}")
		.dialog#popup
			.header(class="{date.week(data.date)}")
				{date.date(data.date)}
				span.week {date.week(data.date)}
			.main-area
				ol.menu-list
					li.list-item
						.label 朝
						.menu(onload="{m_main = data.m_main.split(',')}")
							.main
								span {m_main[0]}
								span(if="{m_main[1]}")  / {m_main[1]}
							span.side(each="{m_side in data.m_side.split(',')}") {m_side}
					li.list-item
						.label 昼
						.menu
							span.main {data.l_main}
							span.side(each="{l_side in data.l_side.split(',')}") {l_side}
					li.list-item
						.label 夜
						.menu.dinner(onload="{d_main = data.d_main.split(',')}")
							span.main {d_main[0]}
							span.main {d_main[1]}
							span.side(each="{d_side in data.d_side.split(',')}") {d_side}
			.footer
				button.close-btn(onclick="{close}") 閉じる

	script.
		var self = this;
		var anime = require('animejs');
		self.date = require('../utils').date;

		self.isOpen = false;

		self.close = function() {
			anime({
				targets: document.getElementById('popup'),
				delay: 100,
				duration: 400,
				easing: 'easeOutCubic',
				translateY: '40px',
				opacity: 0,
				update: function(step) {
					var progress = step.progress * 2 < 0 ? 0 : step.progress * 2;
					document.getElementById('blur').style.WebkitFilter = 'blur(' + (3 - 3 * progress / 100) + 'px)'
				},
				complete: function() {
					self.isOpen = false;
					riot.update();
				}
			})
		}

		obs.on('openPopup', function(data) {
			self.data = data;
			self.isOpen = true;
			riot.update();
			var $ele = document.getElementById('popup');
			$ele.style.transform = 'translateY(40px)';
			anime({
				targets: $ele,
				delay: 100,
				duration: 600,
				easing: 'easeOutCubic',
				translateY: 0,
				opacity: 1,
				update: function(step) {
					document.getElementById('blur').style.WebkitFilter = 'blur(' + (3 * step.progress / 100) + 'px)'
				}
			});
		});

	style(type="sass" scoped).
		.popup-wrapper
			position: fixed
			top: 0
			left: 0
			bottom: 0
			right: 0
			z-index: 999
			.dialog
				position: fixed
				top: 30px
				left: 15px
				bottom: 50px
				right: 15px
				display: -webkit-flex
				display: -moz-flex
				display: -ms-flex
				display: -o-flex
				display: flex
				flex-direction: column
				box-sizing: border-box
				border: 5px solid  #797979
				background: rgba(#fff, 0.85)
				opacity: 0
				.header
					margin: 10px 0 5px
					text-align: center
					font-weight: bold
					font-size: 25px
					color: #252512
					&.sun
						color: #f07077
					&.sat
						color: #727bf2
					.week
						display: inline-block
						font-weight: normal
						margin-left: 8px
						font-size: 14px
						text-transform: uppercase
				.main-area
					flex: 1
					overflow-y: auto
					padding: 10px 25px
					.menu-list
						.list-item
							margin-bottom: 30px
							&:last-child
								margin-bottom: 10px
							.label
								max-width: 200px
								height: 20px
								margin: 0 auto
								border-radius: 8px
								background: #d5d5d5
								line-height: 20px
								font-size: 14px
								text-align: center
							.menu
								display: -webkit-flex
								display: -moz-flex
								display: -ms-flex
								display: -o-flex
								display: flex
								flex-direction: column
								align-items: center
								margin: 10px 0
								.main
									margin: 10px 0
									padding: 0
									font-size: 22px
								.side
									margin: 8px 0
									font-size: 15px
									color: #333
								&.dinner
									.main
										margin-left: 26px
										&::before,
										&::after
											display: inline-block
											width: 22px
											height: 22px
											margin: 1px 6px 1px -26px
											background: #333
											font-size: 15px
											line-height: 22px
											text-align: center
											color: #fff
										&:nth-child(1)
											margin-bottom: 5px
											&::before
												content: 'A'
										&:nth-child(2)
											&::before
												content: 'B'
				.footer
					width: 100%
					height: 60px
					.close-btn
						display: block
						width: 90%
						height: 40px
						margin: 10px auto
						outline: rgba(#fff, 0.5)
						border: 1px solid  #aaa
						background: transparent
						font-size: 15px
						color: #454545
						cursor: pointer
						transition: all .2s ease
						&:active
							background: #454545
							border-color: #454545
							color: #e0e0e0