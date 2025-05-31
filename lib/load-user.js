import {fileURLToPath} from 'node:url'
import path, {dirname} from 'node:path'
import {loadJsonFile} from 'load-json-file'

const directoryName = dirname(fileURLToPath(import.meta.url))

const loadUser = async hostname => {
  // 始终读取 Brra1n0.json
  const user = {
    copyright: '<copyright holders>',
    format: 'html',
    license: 'MIT',
  }

  try {
    return {
      ...user,
      ...await loadJsonFile(path.join(directoryName, '..', 'users', `Brra1n0.json`)),
    }
  } catch (error) {
    if (error.code === 'ENOENT') {
      return user
    }

    throw error
  }
}

export default loadUser
