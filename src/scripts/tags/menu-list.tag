menu-list

	ol.menu-list
		li.menu-item(each="{item in menu}" class="{date.isToday(item.date) ? 'today' : 'open-popup', date.week(item.date)}")
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
					.menu(onload="{d_main = item.d_main.split(',')}")
						div(if="{d_main[1]}")
							span {d_main[0]}
							span {d_main[1]}
						div(if="{!d_main[1]}")
			//- 今日の献立
			ol.item-list(if="{date.isToday(item.date)}")
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
					.menu(onload="{d_main = item.d_main.split(',')}")
						div(if="{d_main[1]}")
							span.main {d_main[0]}
							span.main {d_main[1]}
							hr.partition
							span.side(each="{d_side in item.d_side.split(',')}") {d_side}
						div(if="{!d_main[1]}")
							span.event {d_main[0]}

	script.
		var utils = require('../utils');
		var self = this;

		self.year = opts.year;
		self.month = opts.month;
		
		self.date = utils.date;

		obs.on('getMenu:res', function(data) {
			self.menu = data;
			console.log(data)
			console.log(self.date.week(self.menu[0].date))
			riot.update();
		});