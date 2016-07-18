import webpack from 'webpack'
import Express from 'express'
import webpackDevMiddleware from 'webpack-dev-middleware'
import webpackHotMiddleware from 'webpack-hot-middleware'
import config from './webpack.config'

const app = new Express()
const port = 3000

const compiler = webpack(config)
app.use(webpackDevMiddleware(compiler, {
  noInfo: true,
  publicPath: config.output.publicPath,
}))
app.use(webpackHotMiddleware(compiler))

app.listen(port, error => {
  if (error) {
    console.error(error) // eslint-disable-line no-console
  } else {
    const msg = '==> 🌎  Listening on port %s. Open up http://localhost:%s/ in your browser.'
    console.info(msg, port, port) // eslint-disable-line no-console
  }
})
