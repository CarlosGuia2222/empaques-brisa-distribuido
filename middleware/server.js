const express = require('express')
const cors = require('cors')
const axios = require('axios')

const app = express()
const PORT = 4000

app.use(cors())
app.use(express.json())

const nodos = [
  {
    id: 'nodo1',
    nombre: 'Nodo Procesador 1',
    url: 'http://localhost:4001/procesar-cotizacion',
  },
  {
    id: 'nodo2',
    nombre: 'Nodo Procesador 2',
    url: 'http://localhost:4002/procesar-cotizacion',
  },
  {
    id: 'nodo3',
    nombre: 'Nodo Procesador 3',
    url: 'http://localhost:4003/procesar-cotizacion',
  },
]

let indiceNodoActual = 0

const seleccionarNodoRoundRobin = () => {
  const nodo = nodos[indiceNodoActual]
  indiceNodoActual = (indiceNodoActual + 1) % nodos.length
  return nodo
}

app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'Middleware funcionando correctamente',
    port: PORT,
    nodosConfigurados: nodos.length,
  })
})

app.post('/cotizar', async (req, res) => {
  const { largo, ancho, alto, material, cantidad } = req.body

  if (!largo || !ancho || !alto || !material || !cantidad) {
    return res.status(400).json({
      error: 'Faltan datos para calcular la cotización',
    })
  }

  let intentos = 0
  const errores = []

  while (intentos < nodos.length) {
    const nodoSeleccionado = seleccionarNodoRoundRobin()

    try {
      console.log(`Enviando solicitud a ${nodoSeleccionado.nombre}`)

      const respuestaNodo = await axios.post(
        nodoSeleccionado.url,
        {
          largo,
          ancho,
          alto,
          material,
          cantidad,
        },
        {
          timeout: 3000,
        }
      )

      return res.json({
        message: 'Cotización procesada por nodo',
        nodoId: nodoSeleccionado.id,
        nodoUsado: nodoSeleccionado.nombre,
        resultado: respuestaNodo.data,
      })
    } catch (error) {
      console.error(`Error con ${nodoSeleccionado.nombre}:`, error.message)

      errores.push({
        nodo: nodoSeleccionado.nombre,
        error: error.message,
      })

      intentos += 1
    }
  }

  return res.status(500).json({
    error: 'No hay nodos disponibles para procesar la cotización',
    errores,
  })
})

app.listen(PORT, () => {
  console.log(`Middleware ejecutándose en http://localhost:${PORT}`)
})