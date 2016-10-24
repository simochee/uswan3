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
		return new Promise((resolve, reject) => {
			request
				.get(`http://163.44.175.114:4301/${year}/${month}`)
				.end((err, res) => {
					if(err) {
						reject(err);
						return
					}
					resolve(res.body);
				});
		});
	},
	search: function(word, year, month) {
		year = year || now.year;
		month = month || now.month;
		return new Promise((resolve, reject) => {
			request
				.get(`http://163.44.175.114:4301/${year}/${month}/${word}`)
				.end((err, res) => {
					if(err) {
						reject(err);
						return;
					}
					resolve(res.body);
				});
		});
	}
}