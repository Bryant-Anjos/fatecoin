import crypto from 'crypto'

export class Block {
  public timestamp: number
  public data: any
  public previousHash: string
  public difficulty: number
  public nonce: number
  public hash: string

  constructor(
    timestamp: number,
    data: any,
    previousHash: string,
    difficulty: number,
    nonce: number
  ) {
    this.timestamp = timestamp
    this.data = data
    this.previousHash = previousHash
    this.difficulty = difficulty
    this.nonce = nonce
    this.hash = this.calculateHash()
  }

  calculateHash() {
    return crypto
      .createHash('sha256')
      .update(
        this.timestamp +
          this.data +
          this.previousHash +
          this.difficulty +
          this.nonce
      )
      .digest('hex')
  }

  hashMatchesDifficulty() {
    const hashBinary = parseInt(this.hash, 16)
      .toString(2)
      .padStart(256, '0')
    const requiredPrefix = '0'.repeat(this.difficulty)

    return hashBinary.startsWith(requiredPrefix)
  }

  mineBlock() {
    while (!this.hashMatchesDifficulty()) {
      this.nonce++
      this.hash = this.calculateHash()
    }

    return true
  }
}
