const path = require("path");

const { TsConfigPathsPlugin } = require("awesome-typescript-loader");
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const { EnvironmentPlugin } = require("webpack");

const isProductionMode = process.env.NODE_ENV === 'production';

const output = {
    filename: "bundle.js",
    path: __dirname + "/dist",
    publicPath: "/assets/"
};

const devServer = {
    https: false,
    port: 9876,
    publicPath: "/assets/",
    watchContentBase: true,
    watchOptions: {
        poll: true
    }
};

const tsLoaderOptions = {
    compiler: "typescript",
    configFileName: "tsconfig.json"
};

const rules = [
    {
        test: /\.tsx?$/i,
        use: [
            {
                loader: "awesome-typescript-loader",
                options: tsLoaderOptions
            }
        ],
    },
    {
        enforce: "pre",
        test: /\.js$/i,
        use: "source-map-loader"
    },
    {
        test: /\.(sa|sc|c)ss$/i,
        use: [
            isProductionMode ? MiniCssExtractPlugin.loader : {
                loader: "style-loader",
                options: {}
            },
            {
                loader: "css-loader",
                options: {
                    camelCase: true,
                    sourceMap: !isProductionMode
                }
            },
            {
                loader: "sass-loader",
                options: {
                    implementation: require("node-sass"),
                    sourceMap: !isProductionMode
                }
            }
        ]
    }
];

const plugins = [
    new CleanWebpackPlugin([
        "dist"
    ]),
    new HtmlWebpackPlugin({
        title: "react-redux-test-app",
        filename: "react-redux-test-app.html",
        template: "src/index.html",
        inject: "body",
        minify: false,
        hash: true,
        cache: false
    }),
    new MiniCssExtractPlugin({
        filename: isProductionMode ? "[name].[hash].css" : "[name].css",
        chunkFilename: isProductionMode ? "[id].[hash].css" : "[id].css"
      }),
    new EnvironmentPlugin([
        'NODE_ENV'
    ])
];

module.exports = {
    entry: {
        app: ["./src/App.tsx"],
    },
    output,
    devServer, 
    devtool: "cheap-eval-source-map",
    resolve: {
        extensions: [".ts", ".tsx", ".js", ".json"],
        plugins: [
            new TsConfigPathsPlugin(tsLoaderOptions)
        ]
    },
    module: { rules },
    optimization: {
        minimize: isProductionMode,
        minimizer: [ new TerserPlugin({
            test: /\.js$/i,
            cache: "./.terser-minify-cache/",
            parallel: true,
            terserOptions: {
                warnings: true
            }
        }) ]
    },
    plugins,
    watch: false
}