import { useEffect, useState } from 'react'
import { obtenerNodos } from '../services/nodosService'

function MonitoreoNodos() {
  const [nodos, setNodos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const cargarNodos = async () => {
    setLoading(true)
    setError('')

    try {
      const datos = await obtenerNodos()
      setNodos(datos)
    } catch (error) {
      console.error('Error al cargar nodos:', error)
      setError('No se pudo cargar el monitoreo de nodos.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    cargarNodos()
  }, [])

  const nodosActivos = nodos.filter((nodo) => nodo.activo).length
  const nodosInactivos = nodos.filter((nodo) => !nodo.activo).length

  const totalSolicitudes = nodos.reduce((total, nodo) => {
    return total + Number(nodo.solicitudesProcesadas || 0)
  }, 0)

  const cargaTotal = nodos.reduce((total, nodo) => {
    return total + Number(nodo.cargaActual || 0)
  }, 0)

  if (loading) {
    return (
      <div className="page-container">
        <h1>Cargando monitoreo...</h1>
        <p>Espere un momento.</p>
      </div>
    )
  }

  return (
    <div className="page-container">
      <div className="monitoreo-container">
        <div className="monitoreo-header">
          <div>
            <h1>Monitoreo de Nodos</h1>
            <p>
              Consulta el estado de los nodos procesadores del sistema distribuido.
            </p>
          </div>

          <button onClick={cargarNodos}>Actualizar</button>
        </div>

        {error && <div className="error-message">{error}</div>}

        {!error && (
          <>
            <div className="monitoreo-resumen">
              <div className="monitoreo-card">
                <span>Nodos activos</span>
                <strong>{nodosActivos}</strong>
              </div>

              <div className="monitoreo-card">
                <span>Nodos inactivos</span>
                <strong>{nodosInactivos}</strong>
              </div>

              <div className="monitoreo-card">
                <span>Solicitudes procesadas</span>
                <strong>{totalSolicitudes}</strong>
              </div>

              <div className="monitoreo-card">
                <span>Carga actual total</span>
                <strong>{cargaTotal}</strong>
              </div>
            </div>

            {nodos.length === 0 ? (
              <div className="empty-state">
                <h2>No hay nodos registrados</h2>
                <p>Agrega nodos en Firestore para visualizarlos aquí.</p>
              </div>
            ) : (
              <div className="nodos-grid">
                {nodos.map((nodo) => (
                  <div className="nodo-card" key={nodo.id}>
                    <div className="nodo-card-header">
                      <div>
                        <h2>{nodo.nombre}</h2>
                        <p>{nodo.url}</p>
                      </div>

                      <span
                        className={
                          nodo.activo
                            ? 'nodo-estado activo'
                            : 'nodo-estado inactivo'
                        }
                      >
                        {nodo.activo ? 'Activo' : 'Inactivo'}
                      </span>
                    </div>

                    <div className="nodo-info">
                      <p>
                        <strong>ID del nodo:</strong> {nodo.id}
                      </p>
                      <p>
                        <strong>Solicitudes procesadas:</strong>{' '}
                        {nodo.solicitudesProcesadas}
                      </p>
                      <p>
                        <strong>Carga actual:</strong> {nodo.cargaActual}
                      </p>
                    </div>

                    <div className="nodo-barra">
                      <div
                        className="nodo-barra-fill"
                        style={{
                          width: `${Math.min(Number(nodo.cargaActual || 0) * 25, 100)}%`,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default MonitoreoNodos