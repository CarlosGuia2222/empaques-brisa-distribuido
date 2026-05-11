export const solicitarCotizacionAlMiddleware = async (datosCotizacion) => {
  const respuesta = await fetch('http://localhost:4000/cotizar', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(datosCotizacion),
  })

  if (!respuesta.ok) {
    const errorData = await respuesta.json()
    throw new Error(errorData.error || 'Error al conectar con el middleware')
  }

  return await respuesta.json()
}