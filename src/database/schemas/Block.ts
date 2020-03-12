import mongoose from 'mongoose'

import { BlockDTO } from '../../interfaces/block'

const BlockSchema = new mongoose.Schema({
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
    required: false,
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

export default mongoose.model<BlockDTO>('Block', BlockSchema)
