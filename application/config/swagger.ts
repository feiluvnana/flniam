import path from 'node:path'
import url from 'node:url'

export default {
  common: { parameters: {}, headers: {} },
  tagIndex: 1,
  snakeCase: true,
  ignore: ['/swagger', '/docs'],
  info: { title: 'Flniam', version: '1.0.0', description: '' },
  path: path.dirname(url.fileURLToPath(import.meta.url)) + '/../',
}
