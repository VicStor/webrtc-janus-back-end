import replace from 'replace-in-file'
import config from './config'

export const setupJanusConfigs = () =>
  replace({
    files: `${config.janusConfigsDir}/janus.eventhandler.sampleevh.jcfg`,
    from: /{{METRIC_COLLECTOR_URL}}/g,
    to: config.metricCollectorUrl,
  })
