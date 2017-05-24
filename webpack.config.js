const webpack = require('webpack'),
path = require('path'),
HtmlWebpackPlugin = require('html-webpack-plugin'),
ExtractTextWebpackPlugin = require('extract-text-webpack-plugin'),
CleanWebpackPlugin = require('clean-webpack-plugin'),
publicDirectory = path.resolve(__dirname, 'public'),
isDevelopment = (process.env.NODE_ENV !== 'production'),
port = process.env.PORT || 8000;

const rules = [
    {
        test: /\.js$/,
        loader: 'babel-loader'
    },
    {
        test: /\.css$/,
        use: ExtractTextWebpackPlugin.extract({
            fallback: 'style-loader',
            use : [
                {
                    loader: 'css-loader',
                    options: {
                        sourceMap: isDevelopment,
                        minimize: isDevelopment
                    }
                }
            ]
        })
    },
    {
        test: /\.(jpe?g|png|gif|webp|svg)$/,
        loader: 'file-loader?name=build/img/[name].[hash:8].[ext]'
    },
    {
        test: /\.(woff|woff2|ttf|eot)$/,
        loader: 'file-loader?name=build/font/[name].[hash:8].[ext]'
    }
]

const plugins = [
    new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development')
    }),
    new ExtractTextWebpackPlugin({
        filename: 'build/style/[contenthash:20].css',
        disable: false
    }),
    new HtmlWebpackPlugin({
        template: path.resolve(__dirname, 'src/index.html'),
        favicon: path.resolve(__dirname, 'src/img/favicon.png')
    }),
    // To prevent longterm cache of vendor chunks
    // extract a 'manifest' chunk, then include it to the app
    new webpack.optimize.CommonsChunkPlugin({
        names: [ 'manifest' ]
    })
]

const buildPlugins = [
    new CleanWebpackPlugin(
        path.resolve(publicDirectory, 'build')
    ),
    new webpack.optimize.UglifyJsPlugin({
        compress: {
            drop_console: true
        }
    })
]


module.exports = {

    entry: {
        main: path.resolve(__dirname, 'src/js/main')
    },

    output: {
        path: publicDirectory,
        publicPath: isDevelopment ? '/' : './',
        filename: 'build/js/[name].[chunkhash].js'
    },

    module: {
        rules: rules
    },

    devtool: isDevelopment ? 'eval' : false,

    plugins: isDevelopment ? plugins : [].concat(plugins, buildPlugins),

    resolve: {
        modules: ['node_modules'],
        extensions: ['.js', '.css'],
        descriptionFiles: ['package.json', 'bower.json', '.bower.json']
    },

    devServer: {
        host: '0.0.0.0',
        port: port,
        inline: true,
        compress: true
    },

    stats: 'minimal',

    watchOptions: {
        ignored: /(node_modules)/
    }
}
