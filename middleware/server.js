const express = require('express')
const cors = require('cors')

const app = express()
const PORT = 4000

app.use(cors())
app.use(express.json())

app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'Middleware funcionando correctamente',
    port: PORT,
  })
})

app.post('/cotizar', (req, res) => {
  const { largo, ancho, alto, material, cantidad } = req.body

  if (!largo || !ancho || !alto || !material || !cantidad) {
    return res.status(400).json({
      error: 'Faltan datos para calcular la cotización',
    })
  }

  const volumen = Number(largo) * Number(ancho) * Number(alto)
  const precioBase = 10
  const precioEstimado = (volumen / 1000) * precioBase * Number(cantidad)

  res.json({
    message: 'Cotización calculada desde el middleware',
    nodoUsado: 'middleware-local',
    precioEstimado: Number(precioEstimado.toFixed(2)),
  })
})

app.listen(PORT, () => {
  console.log(`Middleware ejecutándose en http://localhost:${PORT}`)
})