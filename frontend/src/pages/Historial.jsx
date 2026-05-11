import { useEffect, useState } from 'react'
import { auth } from '../firebase/firebaseConfig'
import { getUserData } from '../services/usersService'
import {
  obtenerCotizacionesPorEmpleado,
  obtenerTodasLasCotizaciones,
} from '../services/cotizacionesService'
import CotizacionCard from '../components/CotizacionCard'

function Historial() {
  const [cotizaciones, setCotizaciones] = useState([])
  const [userData, setUserData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const cargarCotizaciones = async () => {
    setLoading(true)
    setError('')

    try {
      const usuarioActual = auth.currentUser

      if (!usuarioActual) {
        setError('No hay un usuario autenticado.')
        return
      }

      const datosUsuario = await getUserData(usuarioActual.uid, usuarioActual.email)
      setUserData(datosUsuario)

      const datos = datosUsuario.role === 'admin'
        ? await obtenerTodasLasCotizaciones()
        : await obtenerCotizacionesPorEmpleado(usuarioActual.uid)

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

  return (
    <div className="page-container">
      <section className="page-hero split-hero">
        <div>
          <span className="eyebrow">Historial</span>
          <h1>Historial de Cotizaciones</h1>
          <p>
            {userData?.role === 'admin'
              ? 'Vista general de todas las cotizaciones generadas por los empleados.'
              : 'Consulta las cotizaciones que has generado.'}
          </p>
        </div>
        <button className="primary-action" onClick={cargarCotizaciones} disabled={loading}>
          {loading ? 'Cargando...' : 'Actualizar'}
        </button>
      </section>

      {error && <div className="error-message wide-message">{error}</div>}

      {!loading && !error && cotizaciones.length === 0 && (
        <div className="empty-state">
          <h2>No hay cotizaciones registradas</h2>
          <p>Cuando se generen cotizaciones, aparecerán en esta sección.</p>
        </div>
      )}

      {loading && <div className="empty-state"><h2>Cargando historial...</h2><p>Espere un momento.</p></div>}

      {cotizaciones.length > 0 && (
        <div className="cotizaciones-grid">
          {cotizaciones.map((cotizacion) => (
            <CotizacionCard
              key={cotizacion.id}
              cotizacion={cotizacion}
              mostrarEmpleado={userData?.role === 'admin'}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default Historial
