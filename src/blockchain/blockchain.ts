import { Block } from './block'
import chainparams from './chainparams'
import { genesisBlock } from './genesisBlock'
import BlockSchema from '../database/schemas/Block'

class Blockchain {
  public difficultyAdjustment: number
  public blockInterval: number

  constructor(genesisBlock: Block) {
    this.difficultyAdjustment = chainparams.DIFFICULTY_ADJUSTMENT
    this.blockInterval = chainparams.BLOCK_INTERVAL

    this.addGenesisToDatabase(genesisBlock)
  }

  async getChain() {
    const plainChain = await BlockSchema.find()
    const chain = plainChain.map(
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

    return chain
  }

  async getLatestBlock() {
    const plainBlock = await BlockSchema.findOne().sort('-index')

    if (!plainBlock) {
      throw new Error('Block not found!')
    }

    const latestBlock = new Block(
      plainBlock.index,
      plainBlock.timestamp,
      plainBlock.data,
      plainBlock.previousHash,
      plainBlock.difficulty,
      plainBlock.nonce,
      plainBlock.hash
    )

    return latestBlock
  }

  async generateNextBlock(data: any) {
    const previousBlock = await this.getLatestBlock()
    const nextIndex = previousBlock.index + 1
    const nextTimestamp = new Date().getTime()
    const nextPreviousHash = previousBlock.hash
    const newBlock = new Block(
      nextIndex,
      nextTimestamp,
      data,
      nextPreviousHash,
      await this.getDifficulty(),
      0,
      ''
    )

    newBlock.mineBlock()

    if (await this.isBlockValid(newBlock)) {
      await BlockSchema.create(newBlock)
    }
  }

  async isBlockValid(newBlock: Block) {
    const previousBlock = await this.getLatestBlock()
    if (newBlock.index != previousBlock.index + 1) return false
    if (previousBlock.hash != newBlock.previousHash) return false
    else if (!newBlock.hashMatchesDifficulty()) return false

    return true
  }

  async isChainValid() {
    const chain = await this.getChain()

    const realGenesis = JSON.stringify(genesisBlock)

    if (realGenesis !== JSON.stringify(chain[0])) return false

    for (let i = 1; i < chain.length; i++) {
      const previousBlock = chain[i - 1]
      const currentBlock = chain[i]

      if (currentBlock.index != previousBlock.index + 1) return false
      if (currentBlock.hash !== currentBlock.calculateHash()) return false
    }

    return true
  }

  async getDifficulty() {
    const latestBlock = await this.getLatestBlock()

    if (
      latestBlock.index % this.difficultyAdjustment === 0 &&
      latestBlock.index !== 0
    ) {
      return this.getAdjustedDifficulty()
    } else {
      return latestBlock.difficulty
    }
  }

  async getAdjustedDifficulty() {
    const latestBlock = await this.getLatestBlock()
    const prevAdjustmentBlock = await BlockSchema.findOne({
      index: latestBlock.index - this.difficultyAdjustment,
    })
    const timeExpected = this.blockInterval * this.difficultyAdjustment
    const timeTaken =
      (latestBlock.timestamp - prevAdjustmentBlock.timestamp) / 1000

    if (timeTaken < timeExpected / 2) {
      return prevAdjustmentBlock.difficulty + 1
    } else if (timeTaken > timeExpected * 2) {
      return prevAdjustmentBlock.difficulty - 1
    } else {
      return prevAdjustmentBlock.difficulty
    }
  }

  async addGenesisToDatabase(genesisBlock: Block) {
    const chainLength = await BlockSchema.estimatedDocumentCount()

    if (chainLength === 0) {
      BlockSchema.create(genesisBlock)
    }
  }
}

export default new Blockchain(genesisBlock)
