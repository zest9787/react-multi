const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const {HotModuleReplacementPlugin} = require('webpack');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');

const mode = 'development';
const plugins = [
    //Allows remove/clean the build folder
    new CleanWebpackPlugin(),
    //Allows update react components in real time
    new HotModuleReplacementPlugin(),
    //Allows to create an index.html in our build folder
    new HtmlWebpackPlugin({
        template: path.resolve(__dirname, "./templates/index.html"), //we put the file that we created in public folder
    }),
    //This get all our css and put in a unique file
    new MiniCssExtractPlugin({
        filename: "styles.[contentHash].css",
    }),
]

module.exports = {
    // index file
    entry : path.resolve(__dirname, "./src/index.js"),
    // build file ouput
    output : {
        path: path.resolve(__dirname, "dist"),
        filename: "bundle.[contenthash].js",
        publicPath: "/"
    },
    devtool: 'eval-cheap-source-map',
    mode: mode,
    module: {
        rules : [
            //Allows use javascript
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/, //don't test node_modules folder
                use: {
                    loader: "babel-loader",
                },
                resolve: {
                    extensions: [".js", ".jsx"],
                },
            },
            {
                test: /\.(js|jsx|tsx|ts)?$/,
                include: /node_modules/,
                use: ['react-hot-loader/webpack'],
            },
            //Allows use of CSS
            {
                test: /\.css$/i,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader,
                    },
                    "css-loader",
                ],
            },
            //Allows use of images
            {
                test: /\.(png|jpg|svg)$/i,
                loader: "file-loader",
            },
        ]
    },
    plugins: plugins,
    //Config for webpack-dev-server module
    devServer: {
        historyApiFallback: true,
        contentBase: path.resolve(__dirname, "dist"),
        hot: true,
        port: 8000,
        proxy: {
            '/api': {
                target: 'http://localhost:8888',
                changeOrigin: true,
                pathRewrite: { '^/api': '' },
            },
        }
    },
}