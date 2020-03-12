import { Router } from 'express'

import blockchain from './blockchain/blockchain'
import Block from './database/schemas/Block'

const routes = Router()

routes.get('/difficulty', (req, res) => {
  const difficulty = blockchain.getDifficulty()

  return res.json({ difficulty })
})

routes.get('/isvalid', (req, res) => {
  const ischainvalid = blockchain.isChainValid()

  return res.json({ ischainvalid })
})

routes.get('/latestblock', (req, res) => {
  const latestblock = blockchain.getLatestBlock()

  return res.json({ latestblock })
})

routes.get('/mineblock', async (req, res) => {
  const { data } = req.query
  blockchain.generateNextBlock(data)
  const latestblock = blockchain.getLatestBlock()
  await Block.create(latestblock)

  return res.json({ blockMined: latestblock })
})

routes.get('/blockchain', async (req, res) => {
  const chain = blockchain.getChain

  return res.json(chain)
})

export default routes
