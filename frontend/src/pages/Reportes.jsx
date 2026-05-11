import { useEffect, useState } from 'react'
import { obtenerTodasLasCotizaciones } from '../services/cotizacionesService'
import { obtenerClientes } from '../services/clientesService'

function Reportes() {
  const [cotizaciones, setCotizaciones] = useState([])
  const [clientes, setClientes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const cargarReportes = async () => {
    setLoading(true)
    setError('')

    try {
      const datosCotizaciones = await obtenerTodasLasCotizaciones()
      const datosClientes = await obtenerClientes()

      setCotizaciones(datosCotizaciones)
      setClientes(datosClientes)
    } catch (error) {
      console.error('Error al cargar reportes:', error)
      setError('No se pudieron cargar los reportes.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    cargarReportes()
  }, [])

  const totalCotizaciones = cotizaciones.length

  const totalCotizado = cotizaciones.reduce((total, cotizacion) => {
    return total + Number(cotizacion.precioEstimado || 0)
  }, 0)

  const totalClientes = clientes.length

  const obtenerCotizacionesPorEmpleado = () => {
    const resumen = {}

    cotizaciones.forEach((cotizacion) => {
      const empleado = cotizacion.creadoPorEmail || 'Sin empleado'

      if (!resumen[empleado]) {
        resumen[empleado] = 0
      }

      resumen[empleado] += 1
    })

    return Object.entries(resumen).map(([empleado, total]) => ({
      empleado,
      total,
    }))
  }

  const obtenerMaterialMasUsado = () => {
    const resumen = {}

    cotizaciones.forEach((cotizacion) => {
      const material = cotizacion.materialNombre || 'Sin material'

      if (!resumen[material]) {
        resumen[material] = 0
      }

      resumen[material] += 1
    })

    const materialesOrdenados = Object.entries(resumen).sort(
      (a, b) => b[1] - a[1]
    )

    if (materialesOrdenados.length === 0) {
      return 'Sin datos'
    }

    return `${materialesOrdenados[0][0]} (${materialesOrdenados[0][1]} cotizaciones)`
  }

  const cotizacionesPorEmpleado = obtenerCotizacionesPorEmpleado()
  const materialMasUsado = obtenerMaterialMasUsado()

  if (loading) {
    return (
      <div className="page-container">
        <h1>Cargando reportes...</h1>
        <p>Espere un momento.</p>
      </div>
    )
  }

  return (
    <div className="page-container">
      <div className="reportes-container">
        <div className="reportes-header">
          <div>
            <h1>Reportes Administrativos</h1>
            <p>
              Consulta métricas generales sobre cotizaciones, clientes y
              actividad de empleados.
            </p>
          </div>

          <button onClick={cargarReportes}>Actualizar</button>
        </div>

        {error && <div className="error-message">{error}</div>}

        {!error && (
          <>
            <div className="reportes-grid">
              <div className="reporte-card">
                <span>Total de cotizaciones</span>
                <strong>{totalCotizaciones}</strong>
              </div>

              <div className="reporte-card">
                <span>Total cotizado</span>
                <strong>${totalCotizado.toFixed(2)}</strong>
              </div>

              <div className="reporte-card">
                <span>Clientes registrados</span>
                <strong>{totalClientes}</strong>
              </div>

              <div className="reporte-card">
                <span>Material más usado</span>
                <strong>{materialMasUsado}</strong>
              </div>
            </div>

            <div className="reportes-section">
              <h2>Cotizaciones por empleado</h2>

              {cotizacionesPorEmpleado.length === 0 ? (
                <p>No hay cotizaciones registradas.</p>
              ) : (
                <div className="tabla-reportes">
                  <table>
                    <thead>
                      <tr>
                        <th>Empleado</th>
                        <th>Total de cotizaciones</th>
                      </tr>
                    </thead>

                    <tbody>
                      {cotizacionesPorEmpleado.map((item) => (
                        <tr key={item.empleado}>
                          <td>{item.empleado}</td>
                          <td>{item.total}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            <div className="reportes-section">
              <h2>Últimas cotizaciones</h2>

              {cotizaciones.length === 0 ? (
                <p>No hay cotizaciones registradas.</p>
              ) : (
                <div className="tabla-reportes">
                  <table>
                    <thead>
                      <tr>
                        <th>Cliente</th>
                        <th>Empleado</th>
                        <th>Material</th>
                        <th>Cantidad</th>
                        <th>Precio</th>
                      </tr>
                    </thead>

                    <tbody>
                      {cotizaciones.slice(0, 5).map((cotizacion) => (
                        <tr key={cotizacion.id}>
                          <td>{cotizacion.cliente}</td>
                          <td>{cotizacion.creadoPorEmail}</td>
                          <td>{cotizacion.materialNombre}</td>
                          <td>{cotizacion.cantidad}</td>
                          <td>${cotizacion.precioEstimado}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default Reportes