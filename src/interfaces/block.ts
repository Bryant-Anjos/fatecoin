import { Document } from 'mongoose'

export interface BlockDTO extends Document {
  index: number
  timestamp: number
  data: any
  previousHash?: string
  difficulty: number
  nonce: number
  hash: string

  calculateHash: () => string
  hashMatchesDifficulty: () => boolean
  mineBlock: () => boolean
}
