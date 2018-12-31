const path = require("path");

const autoprefixer = require("autoprefixer");
const { TsConfigPathsPlugin } = require("awesome-typescript-loader");
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const postCssFlexbugsFixesPlugin = require("postcss-flexbugs-fixes");
const TerserPlugin = require("terser-webpack-plugin");
const { EnvironmentPlugin } = require("webpack");

const projectName = path.basename(__dirname);
const entryPoint = "./src/App.tsx";
const outputDir = "dist";

const isProductionMode = process.env.NODE_ENV === 'production';
const publicPath = "/assets/";

const output = {
    filename: projectName + "-bundle.js",
    path: path.resolve(__dirname, outputDir),
    publicPath
};

const devServer = {
    https: false,
    port: 9876,
    publicPath,
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
                    modules: "local",
                    camelCase: true,
                    importLoaders: 3,
                    sourceMap: !isProductionMode
                }
            },
            {
                loader: "postcss-loader",
                options: {
                    sourceMap: !isProductionMode,
                    plugins: [
                        postCssFlexbugsFixesPlugin,
                        autoprefixer({
                            browsers: [ "defaults", "not ie < 9" ],
                            flexbox: "no-2009"
                        })
                    ]
                }
            },
            {
                loader: "resolve-url-loader",
                options: {
                    engine: "postcss",
                    sourceMap: !isProductionMode,
                    keepQuery: true
                }
            },
            {
                loader: "sass-loader",
                options: {
                    implementation: require("node-sass"),
                    sourceMap: true // required by resolve-url-loader
                }
            }
        ]
    }
];

const plugins = [
    new CleanWebpackPlugin([
        outputDir
    ]),
    new HtmlWebpackPlugin({
        title: projectName,
        filename: projectName + ".html",
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
        app: [ entryPoint ],
    },
    output,
    devServer, 
    devtool: "cheap-eval-source-map",
    resolve: {
        extensions: [ ".ts", ".tsx", ".js", ".json" ],
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
