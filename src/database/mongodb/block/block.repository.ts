import BlockSchema from './block.model'
import { Block } from '../../../blockchain/block'
import { BlockRepositoryBase } from '../../interfaces'

class BlockRepository implements BlockRepositoryBase {
  async create(block: Block) {
    await BlockSchema.create(block)
  }

  async find() {
    const plainBlocks = await BlockSchema.find()
    const blocks = plainBlocks.map(
      block =>
        new Block(
          block.index,
          block.timestamp,
          block.data,
          block.previousHash,
          block.difficulty,
          block.nonce,
          block.hash
        )
    )

    return blocks
  }

  async getLatest() {
    const block = await BlockSchema.findOne().sort('-index')

    if (!block) {
      return null
    }

    const latestBlock = new Block(
      block.index,
      block.timestamp,
      block.data,
      block.previousHash,
      block.difficulty,
      block.nonce,
      block.hash
    )

    return latestBlock
  }

  async findByIndex(index: number) {
    const plainBlock = await BlockSchema.findOne({ index })

    if (!plainBlock) {
      return null
    }

    const block = new Block(
      plainBlock.index,
      plainBlock.timestamp,
      plainBlock.data,
      plainBlock.previousHash,
      plainBlock.difficulty,
      plainBlock.nonce,
      plainBlock.hash
    )

    return block
  }

  async count() {
    return await BlockSchema.estimatedDocumentCount()
  }
}

export default BlockRepository
