import 'dotenv/config'

import express, { Express } from 'express'
import io, { Server } from 'socket.io'
import http from 'http'

import routes from './routes'

import './database'

class App {
  public server: http.Server
  private app: Express
  private io: Server
  private connectedPeers: Express.ConnectedPeer

  constructor() {
    this.app = express()
    this.server = new http.Server(this.app)

    this.socket()

    this.middlewares()
    this.routes()
  }

  socket() {
    this.io = io(this.server)

    this.io.on('connection', socket => {
      const { peer } = socket.handshake.query
      if (peer) this.connectedPeers[peer] = socket.id

      socket.on('disconnect', () => delete this.connectedPeers[peer])
    })
  }

  middlewares() {
    this.app.use(express.json())

    this.app.use((req, res, next) => {
      req.io = this.io
      req.connectedPeers = this.connectedPeers

      next()
    })
  }

  routes() {
    this.app.use('/chainparams', routes)
  }
}

export default new App().server
