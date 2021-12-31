import { Server } from 'socket.io'

declare global {
  namespace Express {
    export type ConnectedPeer = Record<string, string>

    interface Request {
      io: Server
      connectedPeers: ConnectedPeer
    }
  }
}
