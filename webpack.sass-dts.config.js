const glob = require("glob");
const path = require("path");

const dummyOutputDir = "webpack/sass-dts-dummy-output";

module.exports = {
    entry: glob.sync("./src/**/*.scss"),
    output: {
        filename: "dummy.out",
        path: path.resolve(__dirname, dummyOutputDir)
    },
    plugins: [
        {
            apply: function(compiler) {
                compiler.hooks.emit.tapAsync('No Output', (compilation, callback) => {
                  Object.keys(compilation.assets).forEach(asset => delete compilation.assets[asset]);
                  callback();
                });
            }
        }
    ],
    module: {
        rules: [
            {
                test: /\.scss$/i,
                enforce: "pre",
                use: [
                    {
                        loader: "css-loader",
                        options: {}
                    },
                    {
                        loader: "typed-css-modules-loader",
                        options: {
                            noEmit: true,
                            camelCase: true
                        }
                    },
                    {
                        loader: "sass-loader",
                        options: {
                            implementation: require("node-sass")
                        }
                    }
                ]
            }
        ]
    },
    watch: false
}