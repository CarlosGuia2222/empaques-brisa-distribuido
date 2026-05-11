import { useEffect, useState } from 'react'
import NodoCard from '../components/NodoCard'
import { obtenerEstadoNodos, verificarMiddleware } from '../services/middlewareService'

function MonitoreoNodos() {
  const [datos, setDatos] = useState(null)
  const [middleware, setMiddleware] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const cargarEstado = async () => {
    setLoading(true)
    setError('')

    try {
      const [estadoMiddleware, estadoNodos] = await Promise.all([
        verificarMiddleware(),
        obtenerEstadoNodos(),
      ])

      setMiddleware(estadoMiddleware)
      setDatos(estadoNodos)
    } catch (error) {
      console.error('Error al cargar monitoreo:', error)
      setError('No se pudo conectar con el middleware. Verifica que esté corriendo en el puerto 4000.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    cargarEstado()
  }, [])

  const resumen = datos?.resumen || {
    activos: 0,
    inactivos: 0,
    solicitudesProcesadas: 0,
    cargaActualTotal: 0,
    errores: 0,
  }

  return (
    <div className="page-container">
      <section className="page-hero split-hero">
        <div>
          <span className="eyebrow">Sistema distribuido</span>
          <h1>Monitoreo de Nodos</h1>
          <p>Consulta en tiempo real el estado del middleware, los nodos procesadores y la carga del sistema.</p>
        </div>
        <button className="primary-action" onClick={cargarEstado} disabled={loading}>
          {loading ? 'Actualizando...' : 'Actualizar'}
        </button>
      </section>

      {error && <div className="error-message wide-message">{error}</div>}

      {!error && (
        <>
          <div className="status-strip">
            <div className="metric-card">
              <span>Nodos activos</span>
              <strong>{resumen.activos}</strong>
            </div>
            <div className="metric-card">
              <span>Nodos inactivos</span>
              <strong>{resumen.inactivos}</strong>
            </div>
            <div className="metric-card">
              <span>Solicitudes procesadas</span>
              <strong>{resumen.solicitudesProcesadas}</strong>
            </div>
            <div className="metric-card">
              <span>Carga total</span>
              <strong>{resumen.cargaActualTotal}</strong>
            </div>
            <div className="metric-card">
              <span>Errores</span>
              <strong>{resumen.errores}</strong>
            </div>
          </div>

          <div className="middleware-card panel">
            <div>
              <span className="eyebrow">Middleware</span>
              <h2>{middleware?.servicio || 'middleware'}</h2>
              <p>Puerto {middleware?.puerto || 4000} · Estrategia Round Robin con failover</p>
            </div>
            <span className="status-pill success">Operativo</span>
          </div>

          <div className="nodes-grid">
            {(datos?.nodos || []).map((nodo) => (
              <NodoCard key={nodo.id} nodo={nodo} />
            ))}
          </div>

          {datos?.fechaActualizacion && (
            <p className="last-update">Última actualización: {new Date(datos.fechaActualizacion).toLocaleString('es-MX')}</p>
          )}
        </>
      )}
    </div>
  )
}

export default MonitoreoNodos
