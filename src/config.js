const os = require('os')

const config = {
  appPort: process.env.APP_PORT || 8080,
  metricCollectorUrl:
    process.env.METRIC_COLLECTOR_URL || 'http://stats-collector:4040/',
  nodeEnv: process.env.NODE_ENV,
  isDev: process.env.NODE_ENV === 'development',
  isProd: process.env.NODE_ENV === 'production',
  isMacOS: os.platform() === 'darwin',
  isLinuxOS: os.platform() === 'linux',
  osPlatform: os.platform(),
  janusConfigsDir: `${__dirname}/janus/config`,
}

export default config
