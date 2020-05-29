// this extra webpack config allows to get rid of moment as a dependency
// that chart.js drags in, whereas we don't use it
// see https://www.chartjs.org/docs/2.8.0/getting-started/integration.html
// the config is consumed by @angular-builders/custom-webpack
module.exports = {
  externals: {
    moment: 'moment'
  }
};
