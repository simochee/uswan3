require('./tags/home');
require('./tags/common/navbar');
require('./tags/common/credit');
require('./tags/common/utils');
require('./tags/menu-list');
require('./tags/menu-popup');

riot.route('/', () => {
	require('./tags/next');
	require('./tags/curfew');
	
	obs.trigger('getMenu:req');

	riot.mount('route', 'home');
});

module.exports = {
	start: function() {
		riot.route.start(true);
	}
}
