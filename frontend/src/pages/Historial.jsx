import { useEffect, useState } from 'react'
import { auth } from '../firebase/firebaseConfig'
import { getUserData } from '../services/usersService'
import {
  obtenerCotizacionesPorEmpleado,
  obtenerTodasLasCotizaciones,
} from '../services/cotizacionesService'

function Historial() {
  const [cotizaciones, setCotizaciones] = useState([])
  const [userData, setUserData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const formatearFecha = (fechaFirebase) => {
    if (!fechaFirebase) {
      return 'Sin fecha'
    }

    const fecha = fechaFirebase.toDate()
    return fecha.toLocaleString('es-MX', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const cargarCotizaciones = async () => {
    setLoading(true)
    setError('')

    try {
      const usuarioActual = auth.currentUser

      if (!usuarioActual) {
        setError('No hay un usuario autenticado.')
        setLoading(false)
        return
      }

      const datosUsuario = await getUserData(usuarioActual.uid, usuarioActual.email)
      setUserData(datosUsuario)

      let datos = []

      if (datosUsuario.role === 'admin') {
        datos = await obtenerTodasLasCotizaciones()
      } else {
        datos = await obtenerCotizacionesPorEmpleado(usuarioActual.uid)
      }

      setCotizaciones(datos)
    } catch (error) {
      console.error('Error al cargar historial:', error)
      setError('No se pudo cargar el historial de cotizaciones.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    cargarCotizaciones()
  }, [])

  if (loading) {
    return (
      <div className="page-container">
        <h1>Cargando historial...</h1>
        <p>Espere un momento.</p>
      </div>
    )
  }

  return (
    <div className="page-container">
      <div className="historial-container">
        <div className="historial-header">
          <div>
            <h1>Historial de Cotizaciones</h1>
            <p>
              {userData?.role === 'admin'
                ? 'Vista general de todas las cotizaciones generadas por los empleados.'
                : 'Consulta las cotizaciones que has generado.'}
            </p>
          </div>

          <button onClick={cargarCotizaciones}>
            Actualizar
          </button>
        </div>

        {error && <div className="error-message">{error}</div>}

        {!error && cotizaciones.length === 0 && (
          <div className="empty-state">
            <h2>No hay cotizaciones registradas</h2>
            <p>Cuando se generen cotizaciones, aparecerán en esta sección.</p>
          </div>
        )}

        {cotizaciones.length > 0 && (
          <div className="cotizaciones-grid">
            {cotizaciones.map((cotizacion) => (
              <div className="cotizacion-card" key={cotizacion.id}>
                <div className="cotizacion-card-header">
                  <div>
                    <h2>{cotizacion.cliente}</h2>
                    <p>{cotizacion.telefono}</p>
                  </div>

                  <span className="estado-badge">
                    {cotizacion.estado}
                  </span>
                </div>

                <div className="cotizacion-info">
                  <p>
                    <strong>Material:</strong> {cotizacion.materialNombre}
                  </p>
                  <p>
                    <strong>Medidas:</strong> {cotizacion.largo} cm × {cotizacion.ancho} cm × {cotizacion.alto} cm
                  </p>
                  <p>
                    <strong>Cantidad:</strong> {cotizacion.cantidad}
                  </p>
                  <p>
                    <strong>Precio estimado:</strong> ${cotizacion.precioEstimado}
                  </p>
                  <p>
                    <strong>Fecha:</strong> {formatearFecha(cotizacion.createdAt)}
                  </p>

                  {userData?.role === 'admin' && (
                    <p>
                      <strong>Empleado:</strong> {cotizacion.creadoPorEmail}
                    </p>
                  )}

                  {cotizacion.observaciones && (
                    <p>
                      <strong>Observaciones:</strong> {cotizacion.observaciones}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Historial