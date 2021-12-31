import { Block } from '../../../blockchain/block'
import { BlockRepositoryBase } from '../../interfaces'

class BlockRepository implements BlockRepositoryBase {
  constructor(private chain: Block[]) {}

  async create(block: Block) {
    const newBlock = new Block(
      block.index,
      block.timestamp,
      block.data,
      block.previousHash,
      block.difficulty,
      block.nonce,
      block.hash
    )
    this.chain.push(newBlock)
  }

  async find() {
    return this.chain
  }

  async getLatest() {
    const block = this.chain[this.chain.length - 1]

    if (!block) {
      return null
    }

    return block
  }

  async findByIndex(index: number) {
    const block = this.chain.find(item => item.index === index)

    if (!block) {
      return null
    }

    return block
  }

  async count() {
    return this.chain.length
  }
}

export default BlockRepository
