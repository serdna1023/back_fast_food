import { Server as HttpServer } from 'http'
import { Server as SocketIOServer } from 'socket.io'
import { env } from '@/shared/config/env'
import { JwtService } from '@/auth/security/JwtService'

let io: SocketIOServer
const tokenService = new JwtService()

export function initSocket(server: HttpServer): SocketIOServer {
  io = new SocketIOServer(server, {
    cors: {
      origin: env.CLIENT_URL,
      methods: ['GET', 'POST'],
    },
  })

  // Middleware de Autenticación para Sockets
  io.use((socket, next) => {
    try {
      // Intentamos obtener el token desde handshake.auth o handshake.query
      const token = socket.handshake.auth?.token || socket.handshake.query?.token
      
      if (!token) {
        return next(new Error('Authentication error: Token missing'))
      }

      const payload = tokenService.verifyToken<any>(token)
      if (!payload || !payload.restaurantId) {
        return next(new Error('Authentication error: Invalid token structure'))
      }

      // Almacenamos el restaurantId en el socket para uso posterior
      ;(socket as any).restaurantId = payload.restaurantId
      ;(socket as any).userId = payload.sub
      ;(socket as any).mesaId = payload.mesaId

      next()
    } catch (err) {
      next(new Error('Authentication error: ' + (err as Error).message))
    }
  })

  io.on('connection', (socket) => {
    const restaurantId = (socket as any).restaurantId
    const mesaId = (socket as any).mesaId

    // El socket se une automáticamente a la sala de su restaurante
    socket.join(`restaurant_${restaurantId}`)
    console.log(`🔌 Cliente [${socket.id}] unido a sala: restaurant_${restaurantId}`)

    // Si es una mesa específica (invitado), también se une a su mesa
    if (mesaId) {
      socket.join(`mesa_${restaurantId}_${mesaId}`)
      console.log(`💺 Cliente [${socket.id}] unido a sala: mesa_${restaurantId}_${mesaId}`)
    }

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
