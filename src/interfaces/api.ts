import { Request } from 'express'
import { Server } from 'socket.io'

export interface connectedPeer {
  [peer: any]: string
}

export interface Req extends Request {
  io: Server
  connectedPeers: connectedPeer[]
}
