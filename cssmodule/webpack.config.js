const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const devmode = process.env.NODE_ENV !== "production";
module.exports = {
	entry: "./src/index.js",
    mode:devmode?"development":"production",
	output: {
		path: path.resolve(__dirname, "build"),
	},
	devServer: {
		open: true,
		port: process.env.PORT || 8094,
		historyApiFallback: true
	},
	resolve: {
		alias: {
			"@": path.resolve("src")
		},
	},
	plugins: [
		new HtmlWebpackPlugin({
            template:"index.html"
        }),
		new MiniCssExtractPlugin({
			filename: "css/[name].[hash].css",
			chunkFilename: "css/[id].css",
		}),
	],
	module: {
		rules: [
			{
				test: /\.jsx|\.js$/, ///\.js$/,
				exclude: /node_modules/,
				use: [{
					loader: "babel-loader",
					options: {
						plugins: [],
						compact: true,
					},
				},
                {
					loader: 'linaria/loader',
					options: { sourceMap: devmode},
				}
				]
			},
			{
				test: /\.css$/,
				use: [
					{
						loader:'style-loader'
					},
					{
						loader: "css-loader",
						options: {//due to use linaria,passitive the css module config 
							// modules: {
							// 	localIdentName: "[name]_[local]_[hash:base64:5]",
							// },
							// importLoaders: 1,
							sourceMap: devmode
						},
					},
				],
			},
		]
	}
}