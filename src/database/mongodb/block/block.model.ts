import mongoose from 'mongoose'

import { IBlock } from './block.inteface'

const BlockSchema = new mongoose.Schema<IBlock>({
  index: {
    type: Number,
    required: true,
  },
  timestamp: {
    type: Number,
    required: true,
  },
  data: {
    type: String,
    required: false,
  },
  previousHash: {
    type: String,
    required: true,
  },
  difficulty: {
    type: Number,
    required: true,
  },
  nonce: {
    type: Number,
    required: true,
  },
  hash: {
    type: String,
    required: true,
  },
})

export default mongoose.model<IBlock>('Block', BlockSchema)
