import { useEffect, useMemo, useState } from 'react'
import { auth } from '../firebase/firebaseConfig'
import { crearCotizacion } from '../services/cotizacionesService'
import { obtenerClientes } from '../services/clientesService'
import { solicitarCotizacion } from '../services/middlewareService'
import { materiales } from '../data/materiales'

const estadoInicial = {
  clienteId: '',
  cliente: '',
  telefono: '',
  correo: '',
  empresa: '',
  direccion: '',
  largo: '',
  ancho: '',
  alto: '',
  material: '',
  cantidad: '',
  observaciones: '',
}

function NuevaCotizacion() {
  const [formData, setFormData] = useState(estadoInicial)
  const [clientes, setClientes] = useState([])
  const [resultado, setResultado] = useState(null)
  const [mensaje, setMensaje] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [loadingClientes, setLoadingClientes] = useState(true)

  const materialSeleccionado = useMemo(
    () => materiales.find((material) => material.id === formData.material),
    [formData.material]
  )

  useEffect(() => {
    const cargarClientes = async () => {
      try {
        const datos = await obtenerClientes()
        setClientes(datos)
      } catch (error) {
        console.error('Error al cargar clientes:', error)
      } finally {
        setLoadingClientes(false)
      }
    }

    cargarClientes()
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleClienteChange = (e) => {
    const clienteId = e.target.value

    if (!clienteId) {
      setFormData((prev) => ({
        ...prev,
        clienteId: '',
        cliente: '',
        telefono: '',
        correo: '',
        empresa: '',
        direccion: '',
      }))
      return
    }

    const cliente = clientes.find((item) => item.id === clienteId)

    setFormData((prev) => ({
      ...prev,
      clienteId,
      cliente: cliente?.nombre || '',
      telefono: cliente?.telefono || '',
      correo: cliente?.correo || '',
      empresa: cliente?.empresa || '',
      direccion: cliente?.direccion || '',
    }))
  }

  const construirPayload = () => ({
    clienteId: formData.clienteId || null,
    cliente: formData.cliente,
    telefono: formData.telefono,
    correo: formData.correo,
    empresa: formData.empresa,
    direccion: formData.direccion,
    largo: Number(formData.largo),
    ancho: Number(formData.ancho),
    alto: Number(formData.alto),
    materialId: formData.material,
    materialNombre: materialSeleccionado?.nombre || '',
    cantidad: Number(formData.cantidad),
    observaciones: formData.observaciones,
  })

  const validarDatos = () => {
    if (!formData.cliente || !formData.telefono) {
      return 'Captura o selecciona un cliente con teléfono.'
    }

    if (!formData.largo || !formData.ancho || !formData.alto || !formData.cantidad || !formData.material) {
      return 'Completa las medidas, material y cantidad.'
    }

    return ''
  }

  const procesarCotizacion = async ({ guardar }) => {
    setError('')
    setMensaje('')
    setLoading(true)

    try {
      const validacion = validarDatos()

      if (validacion) {
        setError(validacion)
        return
      }

      const respuestaMiddleware = await solicitarCotizacion(construirPayload())
      const calculo = respuestaMiddleware.resultado
      const nodoUsado = respuestaMiddleware.nodoUsado

      const cotizacionCalculada = {
        ...construirPayload(),
        precioEstimado: calculo.precioEstimado,
        precioUnitario: calculo.precioUnitario,
        subtotal: calculo.subtotal,
        volumen: calculo.volumen,
        precioBaseMaterial: calculo.precioBaseMaterial,
        nodoUsado: nodoUsado?.nombre || calculo.nodo?.nombre || 'Sin nodo',
        nodoUsadoId: nodoUsado?.id || calculo.nodo?.id || null,
        puertoNodo: calculo.nodo?.puerto || null,
        tiempoProcesamientoMs: calculo.tiempoProcesamientoMs || 0,
        fechaProcesamiento: calculo.fechaProcesamiento,
        estrategiaDistribucion: respuestaMiddleware.estrategia,
        nodosFallidos: respuestaMiddleware.nodosFallidos || [],
      }

      setResultado(cotizacionCalculada)

      if (guardar) {
        const usuarioActual = auth.currentUser

        if (!usuarioActual) {
          setError('No hay un usuario autenticado.')
          return
        }

        await crearCotizacion({
          ...cotizacionCalculada,
          creadoPorUid: usuarioActual.uid,
          creadoPorEmail: usuarioActual.email,
        })

        setMensaje('Cotización calculada por el middleware y guardada correctamente.')
        setFormData(estadoInicial)
      } else {
        setMensaje(`Cotización calculada correctamente por ${cotizacionCalculada.nodoUsado}.`)
      }
    } catch (error) {
      console.error('Error al procesar cotización:', error)
      const detalle = error.response?.data?.error || error.message
      setError(`No se pudo procesar la cotización. ${detalle}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page-container">
      <section className="page-hero split-hero">
        <div>
          <span className="eyebrow">Cotización distribuida</span>
          <h1>Nueva Cotización</h1>
          <p>
            Captura los datos del cliente y envía el cálculo al middleware para que un nodo procesador disponible genere el precio.
          </p>
        </div>
        <div className="hero-chip">
          <strong>Middleware</strong>
          <span>http://localhost:4000</span>
        </div>
      </section>

      <div className="quote-layout">
        <form className="panel cotizacion-form" onSubmit={(e) => { e.preventDefault(); procesarCotizacion({ guardar: true }) }}>
          <div className="form-section soft-section">
            <div className="section-title-row">
              <h2>Datos del cliente</h2>
              <span>{loadingClientes ? 'Cargando...' : `${clientes.length} registrados`}</span>
            </div>

            <label>Seleccionar cliente registrado</label>
            <select value={formData.clienteId} onChange={handleClienteChange}>
              <option value="">Capturar cliente manualmente</option>
              {clientes.map((cliente) => (
                <option key={cliente.id} value={cliente.id}>
                  {cliente.nombre}{cliente.empresa ? ` - ${cliente.empresa}` : ''}
                </option>
              ))}
            </select>

            <div className="form-grid two-columns">
              <div>
                <label>Nombre del cliente</label>
                <input type="text" name="cliente" value={formData.cliente} onChange={handleChange} placeholder="Ej. Cliente ABC" required />
              </div>
              <div>
                <label>Teléfono</label>
                <input type="text" name="telefono" value={formData.telefono} onChange={handleChange} placeholder="Ej. 8112345678" required />
              </div>
            </div>

            <div className="form-grid two-columns">
              <div>
                <label>Correo</label>
                <input type="email" name="correo" value={formData.correo} onChange={handleChange} placeholder="cliente@correo.com" />
              </div>
              <div>
                <label>Empresa</label>
                <input type="text" name="empresa" value={formData.empresa} onChange={handleChange} placeholder="Ej. Comercial ABC" />
              </div>
            </div>
          </div>

          <div className="form-section soft-section">
            <h2>Datos del empaque</h2>

            <div className="form-grid">
              <div>
                <label>Largo</label>
                <input type="number" name="largo" value={formData.largo} onChange={handleChange} placeholder="cm" min="1" required />
              </div>
              <div>
                <label>Ancho</label>
                <input type="number" name="ancho" value={formData.ancho} onChange={handleChange} placeholder="cm" min="1" required />
              </div>
              <div>
                <label>Alto</label>
                <input type="number" name="alto" value={formData.alto} onChange={handleChange} placeholder="cm" min="1" required />
              </div>
            </div>

            <div className="form-grid two-columns">
              <div>
                <label>Material</label>
                <select name="material" value={formData.material} onChange={handleChange} required>
                  <option value="">Selecciona un material</option>
                  {materiales.map((material) => (
                    <option key={material.id} value={material.id}>{material.nombre}</option>
                  ))}
                </select>
              </div>
              <div>
                <label>Cantidad</label>
                <input type="number" name="cantidad" value={formData.cantidad} onChange={handleChange} placeholder="Ej. 100" min="1" required />
              </div>
            </div>

            <label>Observaciones</label>
            <textarea name="observaciones" value={formData.observaciones} onChange={handleChange} placeholder="Comentarios adicionales" rows="4" />
          </div>

          {mensaje && <div className="success-message">{mensaje}</div>}
          {error && <div className="error-message">{error}</div>}

          <div className="form-actions">
            <button type="button" className="secondary-button" onClick={() => procesarCotizacion({ guardar: false })} disabled={loading}>
              {loading ? 'Procesando...' : 'Calcular con middleware'}
            </button>
            <button type="submit" disabled={loading}>
              {loading ? 'Guardando...' : 'Guardar cotización'}
            </button>
          </div>
        </form>

        <aside className="quote-summary panel">
          <span className="eyebrow">Resultado</span>
          <h2>{resultado ? `$${Number(resultado.precioEstimado).toFixed(2)}` : '$0.00'}</h2>
          <p>El precio se muestra después de procesar la solicitud en un nodo disponible.</p>

          <div className="summary-list">
            <div><span>Material</span><strong>{materialSeleccionado?.nombre || 'Sin seleccionar'}</strong></div>
            <div><span>Volumen</span><strong>{resultado?.volumen ? `${resultado.volumen} cm³` : '-'}</strong></div>
            <div><span>Precio unitario</span><strong>{resultado?.precioUnitario ? `$${resultado.precioUnitario}` : '-'}</strong></div>
            <div><span>Nodo usado</span><strong>{resultado?.nodoUsado || '-'}</strong></div>
            <div><span>Tiempo</span><strong>{resultado?.tiempoProcesamientoMs ? `${resultado.tiempoProcesamientoMs} ms` : '-'}</strong></div>
          </div>

          {resultado?.nodosFallidos?.length > 0 && (
            <div className="warning-box">
              Se aplicó tolerancia a fallos. Nodos omitidos: {resultado.nodosFallidos.map((nodo) => nodo.nombre).join(', ')}.
            </div>
          )}
        </aside>
      </div>
    </div>
  )
}

export default NuevaCotizacion
