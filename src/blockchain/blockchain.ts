import { Block } from './block'
import chainparams from './chainparams'
import { genesisBlock } from './genesisBlock'
import database from '../database'

class Blockchain {
  public difficultyAdjustment: number
  public blockInterval: number

  constructor(genesisBlock: Block) {
    this.difficultyAdjustment = chainparams.DIFFICULTY_ADJUSTMENT
    this.blockInterval = chainparams.BLOCK_INTERVAL

    this.addGenesisToDatabase(genesisBlock)
  }

  async getChain() {
    const blocks = await database.block.find()
    return blocks
  }

  async getLatestBlock() {
    const latestBlock = await database.block.getLatest()

    if (!latestBlock) {
      throw new Error('Block not found!')
    }

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
      await database.block.create(newBlock)
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
    const prevAdjustmentBlock = await database.block.findByIndex(
      latestBlock.index - this.difficultyAdjustment
    )

    if (!prevAdjustmentBlock) {
      return latestBlock.difficulty
    }

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
    const chainLength = await database.block.count()

    if (chainLength === 0) {
      await database.block.create(genesisBlock)
    }
  }
}

export default new Blockchain(genesisBlock)
