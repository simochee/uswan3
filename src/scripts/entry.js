"use strict"

// Observable
window.obs = riot.observable();

const router = require('./router');
router.start();

const api = require('./api');
const d = new Date;
obs.on('getMenu:req', (year = d.getFullYear(), month = d.getMonth() + 1) => {
	api.get(2016, 10).then((data) => {
		if(data.status === 'success') {
			obs.trigger('getMenu:res', data.items);
		} else {
			obs.trigger('getMenu:res', {
				status: 'notfound'
			});
		}
	});
});