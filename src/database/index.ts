import memorydb from './memorydb'
import mongodb from './mongodb'

const nodeEnv = process.env.NODE_ENV ?? 'dev'

const getDatabase = (env: string) => {
  switch (env) {
    case 'test':
      return memorydb
    default:
      return mongodb
  }
}

const database = getDatabase(nodeEnv)

export default database
