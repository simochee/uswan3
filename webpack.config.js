var webpack = require('webpack');

module.exports = {
	watch: true,
	entry: './src/scripts/entry.js',
	output: {
		path: __dirname + '/docs/scripts',
		filename: 'bundle.js',
		publicPath: '/docs/'
	},
	module: {
		preLoaders: [
			{
				test: /\.tag$/,
				exclude: /node_modules/,
				loader: 'riotjs-loader',
				query: {
					type: 'babel',
					template: 'jade'
				}
			}
		],
		loaders: [
			{
				test: /\.js$|\.tag/,
				exclude: /node_modules/,
				loader: 'babel-loader',
				query: {
					presets: ["es2015"],
					cacheDirectory: true
				}
			}
		]
	},
	resolve: {
		extensions: ['', '.js', '.tag']
	},
	plugins: [
		// new webpack.optimize.UglifyJsPlugin(),
		new webpack.ProvidePlugin({
			riot: 'riot'
		})
	],
	devtool: 'inline-source-map'
}