import mongoose from 'mongoose'

import BlockRepository from './block/block.repository'
import { BlockchainDatabase } from '../interfaces'

class MongoDB implements BlockchainDatabase {
  async init(connectionString: string) {
    await mongoose.connect(connectionString, {
      useNewUrlParser: true,
      useFindAndModify: true,
      useUnifiedTopology: true,
    })
  }

  get block() {
    return new BlockRepository()
  }
}

export default new MongoDB()
