import { Block } from './block'

export const genesisBlock = new Block(
  new Date().getTime(),
  'Genesis Block',
  '',
  0,
  0
)
