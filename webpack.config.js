const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const path = require("path");

module.exports = (env, argv) => ({
  entry: "./index.js",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "telechart.js",
    library: "telechart",
    libraryTarget: "umd",
    globalObject: "this"
  },
  devServer: {
    contentBase: path.join(__dirname, "dist"),
    compress: true,
    port: 9000
  },
  plugins: [
    new MiniCssExtractPlugin({
      // Options similar to the same options in webpackOptions.output
      // both options are optional
      filename: "telechart.css"
    })
    // // ...
    // {
    //   // anonymous plugin
    //   apply(compiler) {
    //     compiler.hooks.beforeRun.tapAsync("MyCustomBeforeRunPlugin", function(
    //       compiler,
    //       callback
    //     ) {
    //       // debugger
    //       console.dir(compiler.options);
    //       callback();
    //     });
    //   }
    // }
  ],
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          argv.mode === "production"
            ? MiniCssExtractPlugin.loader
            : "style-loader",
          { loader: "css-loader", options: { importLoaders: 1 } },
          "postcss-loader"
        ]
      }
    ]
  }
});
