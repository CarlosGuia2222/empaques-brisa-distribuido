import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { obtenerTodasLasCotizaciones } from '../services/cotizacionesService'
import { obtenerClientes } from '../services/clientesService'
import { obtenerEstadoNodos } from '../services/middlewareService'

function InicioAdmin() {
  const [metricas, setMetricas] = useState({ cotizaciones: 0, clientes: 0, nodosActivos: 0 })

  useEffect(() => {
    const cargarMetricas = async () => {
      try {
        const [cotizaciones, clientes, nodos] = await Promise.allSettled([
          obtenerTodasLasCotizaciones(),
          obtenerClientes(),
          obtenerEstadoNodos(),
        ])

        setMetricas({
          cotizaciones: cotizaciones.status === 'fulfilled' ? cotizaciones.value.length : 0,
          clientes: clientes.status === 'fulfilled' ? clientes.value.length : 0,
          nodosActivos: nodos.status === 'fulfilled' ? nodos.value.resumen.activos : 0,
        })
      } catch (error) {
        console.error('Error cargando métricas:', error)
      }
    }

    cargarMetricas()
  }, [])

  return (
    <div className="page-container page-enter">
      <section className="page-hero split-hero hero-premium">
        <div>
          <span className="eyebrow">Panel del administrador</span>
          <h1>Centro de control</h1>
          <p>Supervisa cotizaciones, clientes, reportes y el estado de los nodos procesadores desde una vista ejecutiva.</p>
        </div>
        <div className="hero-orbit" aria-hidden="true">
          <span className="orbit-ring" />
          <span className="orbit-node orbit-node--one">N1</span>
          <span className="orbit-node orbit-node--two">N2</span>
          <span className="orbit-node orbit-node--three">N3</span>
          <strong>MW</strong>
        </div>
      </section>

      <div className="status-strip">
        <div className="metric-card metric-card--glow"><span>Cotizaciones</span><strong>{metricas.cotizaciones}</strong></div>
        <div className="metric-card metric-card--glow"><span>Clientes</span><strong>{metricas.clientes}</strong></div>
        <div className="metric-card metric-card--glow"><span>Nodos activos</span><strong>{metricas.nodosActivos}</strong></div>
      </div>

      <div className="dashboard-grid">
        <Link className="feature-card highlight feature-card--icon" to="/monitoreo">
          <i>◌</i>
          <span>Distribuido</span>
          <h2>Monitoreo de nodos</h2>
          <p>Verifica disponibilidad, carga actual y tolerancia a fallos del sistema.</p>
        </Link>
        <Link className="feature-card feature-card--icon" to="/reportes">
          <i>↗</i>
          <span>Análisis</span>
          <h2>Reportes</h2>
          <p>Consulta totales por material, empleados y nodos procesadores.</p>
        </Link>
        <Link className="feature-card feature-card--icon" to="/historial">
          <i>▦</i>
          <span>Operación</span>
          <h2>Historial global</h2>
          <p>Revisa todas las cotizaciones registradas en Firestore.</p>
        </Link>
      </div>
    </div>
  )
}

export default InicioAdmin
