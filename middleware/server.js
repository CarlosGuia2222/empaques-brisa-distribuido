const express = require('express')
const cors = require('cors')
const axios = require('axios')

const app = express()
const PORT = process.env.PORT || 4000
const REQUEST_TIMEOUT_MS = 3500

app.use(cors())
app.use(express.json())

const nodos = [
  {
    id: 'nodo1',
    nombre: 'Nodo Procesador 1',
    url: 'http://localhost:4001',
    solicitudesProcesadas: 0,
    errores: 0,
    cargaActual: 0,
    ultimoUso: null,
    ultimoError: null,
    activo: false,
  },
  {
    id: 'nodo2',
    nombre: 'Nodo Procesador 2',
    url: 'http://localhost:4002',
    solicitudesProcesadas: 0,
    errores: 0,
    cargaActual: 0,
    ultimoUso: null,
    ultimoError: null,
    activo: false,
  },
  {
    id: 'nodo3',
    nombre: 'Nodo Procesador 3',
    url: 'http://localhost:4003',
    solicitudesProcesadas: 0,
    errores: 0,
    cargaActual: 0,
    ultimoUso: null,
    ultimoError: null,
    activo: false,
  },
]

let indiceRoundRobin = 0

const validarCotizacion = (datos) => {
  const requerido = ['largo', 'ancho', 'alto', 'materialId', 'cantidad']
  const faltantes = requerido.filter((campo) => datos[campo] === undefined || datos[campo] === null || datos[campo] === '')

  if (faltantes.length > 0) {
    return `Faltan campos obligatorios: ${faltantes.join(', ')}`
  }

  const largo = Number(datos.largo)
  const ancho = Number(datos.ancho)
  const alto = Number(datos.alto)
  const cantidad = Number(datos.cantidad)

  if ([largo, ancho, alto, cantidad].some((valor) => Number.isNaN(valor) || valor <= 0)) {
    return 'Las medidas y la cantidad deben ser números mayores a cero.'
  }

  return null
}

const revisarNodo = async (nodo) => {
  const inicio = Date.now()

  try {
    const respuesta = await axios.get(`${nodo.url}/health`, {
      timeout: REQUEST_TIMEOUT_MS,
    })

    nodo.activo = respuesta.data?.status === 'ok'
    nodo.latenciaMs = Date.now() - inicio
    nodo.ultimoError = null
  } catch (error) {
    nodo.activo = false
    nodo.latenciaMs = null
    nodo.ultimoError = error.code || error.message
  }

  return nodo
}

const revisarTodosLosNodos = async () => {
  await Promise.all(nodos.map(revisarNodo))
  return nodos
}

const seleccionarNodosRoundRobin = () => {
  const ordenados = []

  for (let i = 0; i < nodos.length; i += 1) {
    const indice = (indiceRoundRobin + i) % nodos.length
    ordenados.push(nodos[indice])
  }

  indiceRoundRobin = (indiceRoundRobin + 1) % nodos.length
  return ordenados
}

const resumenNodos = () => {
  const activos = nodos.filter((nodo) => nodo.activo).length
  const inactivos = nodos.length - activos
  const solicitudesProcesadas = nodos.reduce((total, nodo) => total + nodo.solicitudesProcesadas, 0)
  const cargaActualTotal = nodos.reduce((total, nodo) => total + nodo.cargaActual, 0)
  const errores = nodos.reduce((total, nodo) => total + nodo.errores, 0)

  return {
    activos,
    inactivos,
    total: nodos.length,
    solicitudesProcesadas,
    cargaActualTotal,
    errores,
  }
}

app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    servicio: 'middleware',
    puerto: PORT,
    fecha: new Date().toISOString(),
  })
})

app.get('/nodos', async (req, res) => {
  await revisarTodosLosNodos()

  res.json({
    resumen: resumenNodos(),
    nodos,
    fechaActualizacion: new Date().toISOString(),
  })
})

app.post('/cotizar', async (req, res) => {
  const errorValidacion = validarCotizacion(req.body)

  if (errorValidacion) {
    return res.status(400).json({ error: errorValidacion })
  }

  await revisarTodosLosNodos()

  const candidatos = seleccionarNodosRoundRobin()
  const nodosFallidos = []

  for (const nodo of candidatos) {
    if (!nodo.activo) {
      nodosFallidos.push({ id: nodo.id, nombre: nodo.nombre, motivo: 'Nodo inactivo' })
      continue
    }

    nodo.cargaActual += 1

    try {
      const inicio = Date.now()
      const respuesta = await axios.post(`${nodo.url}/procesar-cotizacion`, req.body, {
        timeout: REQUEST_TIMEOUT_MS,
      })

      nodo.solicitudesProcesadas += 1
      nodo.ultimoUso = new Date().toISOString()
      nodo.ultimoError = null
      nodo.latenciaMs = Date.now() - inicio

      return res.json({
        message: nodosFallidos.length > 0
          ? 'Cotización procesada después de reintento'
          : 'Cotización procesada correctamente',
        estrategia: 'round-robin-con-failover',
        nodoUsado: {
          id: nodo.id,
          nombre: nodo.nombre,
          url: nodo.url,
        },
        nodosFallidos,
        resultado: respuesta.data,
        resumen: resumenNodos(),
        fecha: new Date().toISOString(),
      })
    } catch (error) {
      nodo.errores += 1
      nodo.activo = false
      nodo.ultimoError = error.code || error.message
      nodosFallidos.push({ id: nodo.id, nombre: nodo.nombre, motivo: nodo.ultimoError })
    } finally {
      nodo.cargaActual = Math.max(0, nodo.cargaActual - 1)
    }
  }

  return res.status(503).json({
    error: 'No hay nodos disponibles para procesar la cotización.',
    nodosFallidos,
    resumen: resumenNodos(),
  })
})

app.listen(PORT, () => {
  console.log(`Middleware de Empaques Brisa escuchando en http://localhost:${PORT}`)
})
