import { Block } from '../blockchain/block'

export interface BlockRepositoryBase {
  create(block: Block): Promise<void>
  find(): Promise<Block[]>
  getLatest(): Promise<Block | null>
  findByIndex(index: number): Promise<Block | null>
  count(): Promise<number>
}

export interface BlockchainDatabase {
  init(connectionString: string): Promise<void>
  get block(): BlockRepositoryBase
}
