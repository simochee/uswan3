menu-list

	ol.menu-list
		li.menu-item(each="{item in menu}" class="{date.isToday(item.date) ? 'today' : 'open-popup', date.week(item.date)}")
			.date
				{date.date(item.date)}
				span.week {date.week(item.date)}

	script.
		var utils = require('../utils');
		var self = this;

		self.year = opts.year;
		self.month = opts.month;
		
		self.date = utils.date;

		console.log(self.date.isToday(20161024))

		obs.on('getMenu:res', function(data) {
			self.menu = data;
			console.log(self.date.week(self.menu[0].date))
			riot.update();
		});