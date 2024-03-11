/* eslint-disable @typescript-eslint/no-var-requires */
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const dotenv = require('dotenv');
const webpack = require('webpack');

const encoded = {};
const parsed = dotenv.config().parsed;
for (let key in parsed) {
    encoded[key] = JSON.stringify(parsed[key]);
}

const production = process.env.NODE_ENV === "production";

module.exports = {
  devtool: "inline-source-map",
  devServer: {
    historyApiFallback: true,
  },
  entry: "./src/index.tsx",
  mode: production ? "production" : "development",
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        exclude: /node_modules/,
        resolve: {
            extensions: [".ts", ".tsx", ".js", ".json"],
        },
        use: "ts-loader",
      },
      {
          test: /\.(gif|jpg|png|svg|mp3)$/,
          include: path.resolve(__dirname, "public/images"),
          use: [
              {
                  loader: "file-loader",
                  options: {
                      name: "[name].[ext]",
                  },
              },
          ],
      }
    ]
  },
  output: {
    path: path.resolve(__dirname, "./dist"),
    publicPath: "/",
  },
  plugins: [
    new HtmlWebpackPlugin({ template: "public/index.html" }),
    new webpack.DefinePlugin({
        "process.env": {
            ...encoded,
        },
    }),
    new CopyWebpackPlugin({
      'patterns': [
        { from: './public/images', to: 'images' },
        { from: './public/sounds', to: 'sounds' },
        { from: './public/index.css', to: 'index.css' },
      ]
    })
  ],
  resolve: {
    alias: {
        react: path.resolve("./node_modules/react"),
        stream: require.resolve("readable-stream"),
    },
    modules: [
        path.resolve(__dirname, "node_modules"),
        path.resolve(__dirname, "./"),
    ],
    extensions: [".js", ".jsx", ".ts", ".tsx"]
  }
};
