import express from 'express'
import http from 'http'
import { initSocket } from '@/shared/infrastructure/websocket/socket.server'
import { env } from '@/shared/config/env'
import { sequelize } from '@/shared/infrastructure/database/sequelize.client'
// Importamos los modelos centralizados para que Sequelize los registre
import '@/SequelizeModels'
import { MenuRouter } from '@/menu/routes/routes'
import { OrderRouter } from '@/orders/routes/routes'

const app = express()
const server = http.createServer(app)

app.use(express.json())

// Rutas
app.use('/api/menu', MenuRouter)
app.use('/api/orders', OrderRouter)

initSocket(server)

async function startServer() {
  try {
    console.log('⏳ Conectando a PostgreSQL con Sequelize...')
    await sequelize.authenticate()
    console.log('✅ Conexión a PostgreSQL establecida exitosamente')

    server.listen(env.PORT, () => {
      console.log(`🚀 Server running on port ${env.PORT}`)
    })
  } catch (error) {
    console.error('❌ No se pudo conectar a PostgreSQL:')
    console.error(error)
    process.exit(1) // Detiene la app si no hay BD
  }
}

startServer()

export default app
