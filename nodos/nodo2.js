const express = require('express')
const cors = require('cors')

const app = express()
const PORT = 4002

app.use(cors())
app.use(express.json())

app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    nodo: 'Nodo Procesador 2',
    port: PORT,
    activo: true,
  })
})

app.post('/procesar-cotizacion', (req, res) => {
  const { largo, ancho, alto, material, cantidad } = req.body

  if (!largo || !ancho || !alto || !material || !cantidad) {
    return res.status(400).json({
      error: 'Faltan datos para procesar la cotización',
    })
  }

  const preciosMaterial = {
    carton_sencillo: 8,
    carton_doble: 12,
    corrugado: 15,
    kraft: 10,
  }

  const precioBase = preciosMaterial[material] || 10

  const volumen = Number(largo) * Number(ancho) * Number(alto)
  const precioUnitario = (volumen / 1000) * precioBase
  const subtotal = precioUnitario * Number(cantidad)
  const precioFinal = subtotal < 50 ? 50 : subtotal

  res.json({
    message: 'Cotización procesada correctamente',
    nodoUsado: 'Nodo Procesador 2',
    puerto: PORT,
    precioEstimado: Number(precioFinal.toFixed(2)),
  })
})

app.listen(PORT, () => {
  console.log(`Nodo Procesador 2 ejecutándose en http://localhost:${PORT}`)
})