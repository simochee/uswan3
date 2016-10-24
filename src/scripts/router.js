require('./tags/home');
require('./tags/common/navbar');
require('./tags/common/credit');
require('./tags/common/utils');
require('./tags/menu-list');

riot.route('/', () => {
	require('./tags/next');
	require('./tags/curfew');
	riot.mount('route', 'home');
});

module.exports = {
	start: function() {
		riot.route.start(true);
	}
}
