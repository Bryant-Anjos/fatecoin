import { BlockchainDatabase } from '../interfaces'
import { Block } from '../../blockchain/block'

import BlockRepository from './block/block.repository'

class MemoryDB implements BlockchainDatabase {
  private chain: Block[] = []

  async init() {
    this.chain = []
  }

  get block() {
    return new BlockRepository(this.chain)
  }
}

export default new MemoryDB()
