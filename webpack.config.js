var path = require('path')

module.exports = {
  target: 'web',
  entry: path.join(__dirname, 'lib/index.js'),
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'babel-plugin-transform-simple-jsx.min.js',
    library: 'babel-plugin-transform-simple-jsx',
    libraryTarget: 'umd'
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader'
        }
      }
    ]
  }
}
