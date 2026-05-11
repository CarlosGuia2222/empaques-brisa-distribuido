const express = require('express')
const cors = require('cors')
const { calcularCotizacion } = require('./calculadoraCotizacion')

const id = process.argv[2] || 'nodo-local'
const PORT = Number(process.argv[3]) || 4001
const nombre = process.argv[4] || 'Nodo Procesador'

const app = express()
let solicitudesProcesadas = 0
let cargaActual = 0

app.use(cors())
app.use(express.json())

app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    id,
    nombre,
    puerto: PORT,
    solicitudesProcesadas,
    cargaActual,
    fecha: new Date().toISOString(),
  })
})

app.post('/procesar-cotizacion', async (req, res) => {
  const inicio = Date.now()
  cargaActual += 1

  try {
    const resultado = calcularCotizacion(req.body)
    solicitudesProcesadas += 1

    res.json({
      ...resultado,
      nodo: {
        id,
        nombre,
        puerto: PORT,
      },
      tiempoProcesamientoMs: Date.now() - inicio,
      fechaProcesamiento: new Date().toISOString(),
    })
  } catch (error) {
    res.status(400).json({
      error: error.message,
      nodo: { id, nombre, puerto: PORT },
    })
  } finally {
    cargaActual = Math.max(0, cargaActual - 1)
  }
})

app.listen(PORT, () => {
  console.log(`${nombre} (${id}) escuchando en http://localhost:${PORT}`)
})
