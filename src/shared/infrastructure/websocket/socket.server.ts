import { Server as HttpServer } from 'http'
import { Server as SocketIOServer } from 'socket.io'
import { env } from '@/shared/config/env'

let io: SocketIOServer

export function initSocket(server: HttpServer): SocketIOServer {
  io = new SocketIOServer(server, {
    cors: {
      origin: env.CLIENT_URL,
      methods: ['GET', 'POST'],
    },
  })

  io.on('connection', (socket) => {
    console.log(`🔌 Cliente conectado: ${socket.id}`)

    socket.on('disconnect', () => {
      console.log(`❌ Cliente desconectado: ${socket.id}`)
    })
  })

  return io
}

export function getSocket(): SocketIOServer {
  if (!io) throw new Error('Socket.io no inicializado aún')
  return io
}
