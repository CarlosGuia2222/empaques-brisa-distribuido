import axios from 'axios'

const API_URL = import.meta.env.VITE_MIDDLEWARE_URL || 'http://localhost:4000'

export const solicitarCotizacion = async (datosCotizacion) => {
  const response = await axios.post(`${API_URL}/cotizar`, datosCotizacion, {
    timeout: 6000,
  })

  return response.data
}

export const obtenerEstadoNodos = async () => {
  const response = await axios.get(`${API_URL}/nodos`, {
    timeout: 6000,
  })

  return response.data
}

export const verificarMiddleware = async () => {
  const response = await axios.get(`${API_URL}/health`, {
    timeout: 4000,
  })

  return response.data
}
