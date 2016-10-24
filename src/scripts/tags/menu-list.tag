menu-list

	ol.menu-list
		li.menu-item(each="{item, i in menu}" onclick="{openPopup(item, date.isToday(item.date))}" data-index="{i}" class="{date.isToday(item.date) ? 'today' : 'open-popup'} {date.week(item.date)}")
			.date
				{date.date(item.date)}
				span.week {date.week(item.date)}
			ol.item-list(if="{!date.isToday(item.date)}")
				li.list-item
					.label 朝
					.menu(onload="{m_main = item.m_main.split(',')}")
						span {m_main[0]}
						span(if="{m_main[1]}")  / {m_main[1]}
				li.list-item
					.label 昼
					.menu
						span {item.l_main}
				li.list-item
					.label 夜
					.menu.dinner(onload="{d_main = item.d_main.split(',')}")
						div(if="{d_main[1]}")
							span {d_main[0]}
							span {d_main[1]}
						div(if="{!d_main[1]}")
			//- 今日の献立
			ol.item-list#today(if="{date.isToday(item.date)}")
				li.list-item
					.label 朝
					.menu(onload="{m_main = item.m_main.split(',')}")
						span.main {m_main[0]}
						span.main(if="{m_main[1]}") {m_main[1]}
						hr.partition
						span.side(each="{m_side in item.m_side.split(',')}") {m_side}
				li.list-item
					.label 昼
					.menu
						span.main {item.l_main}
						hr.partition
						span.side(each="{l_side in item.l_side.split(',')}") {l_side}
				li.list-item
					.label 夜
					.menu.dinner(if="{d_main[1]}" onload="{d_main = item.d_main.split(',')}")
						span.main {d_main[0]}
						span.main {d_main[1]}
						hr.partition
						span.side(each="{d_side in item.d_side.split(',')}") {d_side}
					.event(if="{!d_main[1]}")

	script.
		var utils = require('../utils');
		var self = this;

		self.year = opts.year;
		self.month = opts.month;
		
		self.date = utils.date;

		self.openPopup = function(item, isToday) {
			if(isToday) return;
			return function(e) {
				obs.trigger('openPopup', item);
			}
		}

		obs.on('getMenu:res', function(data) {
			self.menu = data;
			riot.update();
		});

	style(type="sass" scoped).
		.menu-list
			width: 100%
			.menu-item
				width: 100%
				box-sizing: border-box
				&:not(.today)
					display: -webkit-flex
					display: -moz-flex
					display: -ms-flex
					display: -o-flex
					display: flex
					align-items: center
					padding: 8px 5px
					background: #fff
					border-top: 1px solid  #bbb
					&:last-child
						border-bottom: 1px solid  #bbb
					.date
						width: 30px
						font-size: 20px
						text-align: center
						color: #191919
						.week
							display: block
							font-size: 10px
							text-transform: uppercase
					.item-list
						flex: 1
						.list-item
							display: -webkit-flex
							display: -moz-flex
							display: -ms-flex
							display: -o-flex
							display: flex
							align-items: center
							padding: 8px 5px
							.label
								display: block
								width: 25px
								height: 25px
								border-radius: 100%
								background: #ccc
								line-height: 25px
								text-align: center
								font-size: 12px
								color: #111
							.menu
								flex: 1
								margin-left: 5px
								padding: 8px
								border-radius: 5px
								background: #fff
								font-size: 15px
								line-height: 20px
								&.dinner
									span
										display: block
										margin-left: 22px
										&::before
											display: inline-block
											width: 18px
											height: 18px
											margin: 1px 2px 1px -20px
											background: #444
											font-size: 12px
											line-height: 18px
											text-align: center
											color: #fff
										&:first-child
											margin-bottom: 5px
											&::before
												content: 'A'
										&:last-child
											&::before
												content: 'B'
				&.sat
					background: #d9dbf6
					.item-list
						.list-item
							.label
								background: #a5abf0
							.menu
								background: #d9dbf6
				&.sun
					background: #f6d9db
					.item-list
						.list-item
							.label
								background: #f0a5a9
							.menu
								background: #f6d9db
				&.open-popup
					cursor: pointer
					&:hover
						background: #ccc
						.label
							background: #aaa
						&.sun
							background: #f6a6ab
							.label
								background: #f07077
						&.sat
							background: #a5aaf6
							.label
								background: #727bf2
		.today
			padding: 5px
			border:
				top: 5px solid  #bbb
				right: 2px solid  #bbb
				bottom: 4px solid  #bbb
				left: 2px solid  #bbb
			background: #fff
			.date
				font-weight: bold
				text-align: center
				font-size: 25px
				color: #252521
				.week
					font-weight: normal
					margin-left: 8px
					font-size: 14px
			.item-list
				.list-item
					display: -webkit-flex
					display: -moz-flex
					display: -ms-flex
					display: -o-flex
					display: flex
					align-items: center
					margin: 15px 0
					.label
						width: 20px
						margin: 0 5px
						padding: 40px 0
						border-radius: 20px
						background: #ccc
						text-align: center
						line-height: 30px
						color: #222
					.menu
						display: -webkit-flex
						display: -moz-flex
						display: -ms-flex
						display: -o-flex
						display: flex
						flex-direction: column
						align-items: center
						flex: 1
						margin: 0 10px
						.main
							margin: 6px 0
							font-size: 18px
						.side
							margin: 4px 0
							font-size: 15px
							color: #333
						.partition
							width: 95%
							margin: 5px auto 8px
							border:
								top: 0
								right: 0
								bottom: 1px dashed  #aaa
								left: 0
						&.dinner
							.main
								margin-left: 26px
								&::before
									display: inline-block
									width: 20px
									height: 20px
									margin: 1px 4px 1px -24px
									background: #333
									font-size: 15px
									line-height: 20px
									text-align: center
									color: #fff
								&:nth-child(1)
									margin-bottom: 5px
									&::before
										content: 'A'
								&:nth-child(2)
									&::before
										content: 'B'