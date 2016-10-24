require('./tags/home');

riot.route('/', () => {
	riot.mount('route', 'home');
});

module.exports = {
	start: function() {
		riot.route.start(true);
	}
}