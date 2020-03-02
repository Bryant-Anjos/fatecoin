import { Block } from './block'
import chainparams from './chainparams'
import { genesisBlock } from './genesisBlock'

class Blockchain {
  private chain: Block[]
  public difficultyAdjustment: number
  public blockInterval: number

  constructor(genesisBlock: Block) {
    this.chain = []
    this.chain.push(genesisBlock)
    this.difficultyAdjustment = chainparams.DIFFICULTY_ADJUSTMENT
    this.blockInterval = chainparams.BLOCK_INTERVAL
  }

  get getChain() {
    return this.chain
  }

  getLatestBlock() {
    return this.chain[this.chain.length - 1]
  }

  generateNextBlock(data: any) {
    const previousBlock = this.getLatestBlock()
    const nextTimestamp = new Date().getTime()
    const nextPreviousHash = previousBlock.hash
    const newBlock = new Block(
      nextTimestamp,
      data,
      nextPreviousHash,
      this.getDifficulty(),
      0
    )

    newBlock.mineBlock()

    if (this.isBlockValid(newBlock)) {
      this.chain.push(newBlock)
    }
  }

  isBlockValid(newBlock: Block) {
    const previousBlock = this.getLatestBlock()
    if (previousBlock.hash != newBlock.previousHash) return false
    else if (!newBlock.hashMatchesDifficulty()) return false

    return true
  }

  isChainValid() {
    const realGenesis = JSON.stringify(genesisBlock)

    if (realGenesis !== JSON.stringify(this.chain[0])) return false

    for (let i = 1; i < this.chain.length; i++) {
      const currentBlock = this.chain[i]

      if (currentBlock.hash !== currentBlock.calculateHash()) return false
    }

    return true
  }

  getDifficulty() {
    const latestBlock = this.getLatestBlock()
    const latestBlockIndex = this.chain.findIndex(
      block => block.timestamp === latestBlock.timestamp
    )

    if (
      latestBlockIndex % this.difficultyAdjustment === 0 &&
      latestBlockIndex !== 0
    ) {
      return this.getAdjustedDifficulty()
    } else {
      return latestBlock.difficulty
    }
  }

  getAdjustedDifficulty() {
    const latestBlock = this.getLatestBlock()
    const prevAdjustmentBlock = this.chain[
      this.chain.length - this.difficultyAdjustment
    ]
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
}

export default new Blockchain(genesisBlock)
