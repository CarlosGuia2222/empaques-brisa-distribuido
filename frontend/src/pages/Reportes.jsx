import { useEffect, useMemo, useState } from 'react'
import { obtenerTodasLasCotizaciones } from '../services/cotizacionesService'

function Reportes() {
  const [cotizaciones, setCotizaciones] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const cargarReportes = async () => {
    setLoading(true)
    setError('')

    try {
      const datos = await obtenerTodasLasCotizaciones()
      setCotizaciones(datos)
    } catch (error) {
      console.error('Error al cargar reportes:', error)
      setError('No se pudieron cargar los reportes desde Firestore.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    cargarReportes()
  }, [])

  const reportes = useMemo(() => {
    const totalCotizado = cotizaciones.reduce((total, item) => total + Number(item.precioEstimado || 0), 0)
    const totalPiezas = cotizaciones.reduce((total, item) => total + Number(item.cantidad || 0), 0)

    const porMaterial = Object.values(cotizaciones.reduce((acc, item) => {
      const llave = item.materialNombre || 'Sin material'
      acc[llave] ||= { nombre: llave, cantidad: 0, total: 0 }
      acc[llave].cantidad += 1
      acc[llave].total += Number(item.precioEstimado || 0)
      return acc
    }, {})).sort((a, b) => b.total - a.total)

    const porNodo = Object.values(cotizaciones.reduce((acc, item) => {
      const llave = item.nodoUsado || 'Sin nodo registrado'
      acc[llave] ||= { nombre: llave, cantidad: 0, total: 0 }
      acc[llave].cantidad += 1
      acc[llave].total += Number(item.precioEstimado || 0)
      return acc
    }, {})).sort((a, b) => b.cantidad - a.cantidad)

    return { totalCotizado, totalPiezas, porMaterial, porNodo }
  }, [cotizaciones])

  return (
    <div className="page-container">
      <section className="page-hero split-hero">
        <div>
          <span className="eyebrow">Reportes administrativos</span>
          <h1>Reportes</h1>
          <p>Resumen operativo de cotizaciones, materiales y nodos procesadores utilizados.</p>
        </div>
        <button className="primary-action" onClick={cargarReportes} disabled={loading}>
          {loading ? 'Cargando...' : 'Actualizar'}
        </button>
      </section>

      {error && <div className="error-message wide-message">{error}</div>}

      <div className="status-strip">
        <div className="metric-card"><span>Total cotizado</span><strong>${reportes.totalCotizado.toFixed(2)}</strong></div>
        <div className="metric-card"><span>Cotizaciones</span><strong>{cotizaciones.length}</strong></div>
        <div className="metric-card"><span>Piezas solicitadas</span><strong>{reportes.totalPiezas}</strong></div>
      </div>

      <div className="reports-grid">
        <section className="panel">
          <div className="section-title-row">
            <h2>Ventas por material</h2>
            <span>{reportes.porMaterial.length} materiales</span>
          </div>
          {reportes.porMaterial.length === 0 && <p>No hay datos suficientes.</p>}
          <div className="ranking-list">
            {reportes.porMaterial.map((item) => (
              <div className="ranking-item" key={item.nombre}>
                <div>
                  <strong>{item.nombre}</strong>
                  <span>{item.cantidad} cotizaciones</span>
                </div>
                <b>${item.total.toFixed(2)}</b>
              </div>
            ))}
          </div>
        </section>

        <section className="panel">
          <div className="section-title-row">
            <h2>Trabajo por nodo</h2>
            <span>Procesamiento distribuido</span>
          </div>
          {reportes.porNodo.length === 0 && <p>No hay datos suficientes.</p>}
          <div className="ranking-list">
            {reportes.porNodo.map((item) => (
              <div className="ranking-item" key={item.nombre}>
                <div>
                  <strong>{item.nombre}</strong>
                  <span>{item.cantidad} solicitudes guardadas</span>
                </div>
                <b>${item.total.toFixed(2)}</b>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}

export default Reportes
