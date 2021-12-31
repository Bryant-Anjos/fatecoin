import { Document } from 'mongoose'

export interface IBlock extends Document {
  index: number
  timestamp: number
  data: any
  previousHash: string
  difficulty: number
  nonce: number
  hash: string
}
