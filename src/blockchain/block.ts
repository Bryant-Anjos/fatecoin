import crypto from 'crypto'

export class Block {
  constructor(
    public index: number,
    public timestamp: number,
    public data: any,
    public previousHash: string,
    public difficulty: number,
    public nonce: number,
    public hash: string
  ) {}

  calculateHash() {
    return crypto
      .createHash('sha256')
      .update(
        this.index.toString() +
          this.timestamp.toString() +
          this.data +
          this.previousHash +
          this.difficulty.toString() +
          this.nonce.toString()
      )
      .digest('hex')
  }

  hashMatchesDifficulty() {
    if (!this.hash) {
      return false
    }

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
