const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CopyPlugin = require("copy-webpack-plugin");
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
    }),
    new CopyPlugin([
      { from: "./src/polyfill.js", to: "./telechart.polyfill.js" }
    ])
  ],
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader"
        }
      },
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
