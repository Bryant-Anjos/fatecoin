import { Block } from './block'

const block: Block[] = []

block.push(new Block(new Date().getTime(), 'teste', '', 10, 0))

console.log(block[0])
console.log(block[0].hashMatchesDifficulty())
block[0].mineBlock()
console.log(block[0])
console.log(block[0].hashMatchesDifficulty())
