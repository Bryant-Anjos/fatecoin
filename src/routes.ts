import { Router } from 'express'

import blockchain from './blockchain/blockchain'

const routes = Router()

routes.get('/difficulty', async (req, res) => {
  const difficulty = await blockchain.getDifficulty()

  return res.json({ difficulty })
})

routes.get('/isvalid', async (req, res) => {
  const ischainvalid = await blockchain.isChainValid()

  return res.json({ ischainvalid })
})

routes.get('/latestblock', async (req, res) => {
  const latestblock = await blockchain.getLatestBlock()

  return res.json({ latestblock })
})

routes.get('/mineblock', async (req, res) => {
  const { data } = req.query

  await blockchain.generateNextBlock(data)

  const latestblock = await blockchain.getLatestBlock()

  return res.json({ blockMined: latestblock })
})

routes.get('/blockchain', async (req, res) => {
  const chain = await blockchain.getChain()

  return res.json(chain)
})

export default routes
