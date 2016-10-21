"use strict"

const request = require('superagent');
const d = new Date;
const now = {
	year: d.getFullYear(),
	month: d.getMonth() + 1
}

module.exports = {
	get: function(year, month) {
		year = year || now.year;
		month = month || now.month;
		request
			.get(`http://localhost:4301/${year}/${month}`)
			.end((err, res) => {
				console.log(res)
			});
	}
}