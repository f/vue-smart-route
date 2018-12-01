module.exports = {
  mode: process.env.NODE_ENV,
  entry: ["./src/vue-smart-route.js"],
  output: {
    library: "VueSmartRoute",
    libraryTarget: "umd",
    filename: "vue-smart-route.js",
    globalObject: 'typeof self !== \'undefined\' ? self : this',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader"
        }
      }
    ]
  }
};