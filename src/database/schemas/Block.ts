import mongoose from 'mongoose'

const BlockSchema = new mongoose.Schema({
  timestamp: {
    type: Number,
    required: true,
  },
  data: {
    type: String,
    required: true,
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

export default mongoose.model('Block', BlockSchema)
