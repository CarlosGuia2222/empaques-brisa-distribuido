import { useState } from 'react'
import { auth } from '../firebase/firebaseConfig'
import { crearCotizacion } from '../services/cotizacionesService'
import { materiales } from '../data/materiales'

function NuevaCotizacion() {
  const [formData, setFormData] = useState({
    cliente: '',
    telefono: '',
    largo: '',
    ancho: '',
    alto: '',
    material: '',
    cantidad: '',
    observaciones: '',
  })

  const [precioEstimado, setPrecioEstimado] = useState(null)
  const [mensaje, setMensaje] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target

    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const calcularPrecio = () => {
    const largo = Number(formData.largo)
    const ancho = Number(formData.ancho)
    const alto = Number(formData.alto)
    const cantidad = Number(formData.cantidad)

    if (!largo || !ancho || !alto || !cantidad || !formData.material) {
      return null
    }

    const materialSeleccionado = materiales.find(
      (material) => material.id === formData.material
    )

    if (!materialSeleccionado) {
      return null
    }

    const volumen = largo * ancho * alto
    const precioUnitario = (volumen / 1000) * materialSeleccionado.precioBase
    const subtotal = precioUnitario * cantidad
    const precioFinal = subtotal < 50 ? 50 : subtotal

    return Number(precioFinal.toFixed(2))
  }

  const handleCalcular = () => {
    setError('')
    setMensaje('')

    const precio = calcularPrecio()

    if (precio === null) {
      setError('Completa las medidas, material y cantidad para calcular.')
      return
    }

    setPrecioEstimado(precio)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    setError('')
    setMensaje('')
    setLoading(true)

    try {
      const usuarioActual = auth.currentUser

      if (!usuarioActual) {
        setError('No hay un usuario autenticado.')
        setLoading(false)
        return
      }

      const precio = calcularPrecio()

      if (precio === null) {
        setError('No se pudo calcular el precio. Revisa los datos.')
        setLoading(false)
        return
      }

      const materialSeleccionado = materiales.find(
        (material) => material.id === formData.material
      )

      const nuevaCotizacion = {
        cliente: formData.cliente,
        telefono: formData.telefono,
        largo: Number(formData.largo),
        ancho: Number(formData.ancho),
        alto: Number(formData.alto),
        materialId: materialSeleccionado.id,
        materialNombre: materialSeleccionado.nombre,
        cantidad: Number(formData.cantidad),
        observaciones: formData.observaciones,
        precioEstimado: precio,
        creadoPorUid: usuarioActual.uid,
        creadoPorEmail: usuarioActual.email,
      }

      await crearCotizacion(nuevaCotizacion)

      setMensaje('Cotización guardada correctamente.')
      setPrecioEstimado(precio)

      setFormData({
        cliente: '',
        telefono: '',
        largo: '',
        ancho: '',
        alto: '',
        material: '',
        cantidad: '',
        observaciones: '',
      })
    } catch (error) {
      console.error('Error al guardar cotización:', error)
      setError('Ocurrió un error al guardar la cotización.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page-container">
      <div className="form-container">
        <h1>Nueva Cotización</h1>
        <p>
          Captura los datos del cliente, las medidas del empaque y el material
          para generar una cotización.
        </p>

        <form className="cotizacion-form" onSubmit={handleSubmit}>
          <div className="form-section">
            <h2>Datos del cliente</h2>

            <label>Nombre del cliente</label>
            <input
              type="text"
              name="cliente"
              value={formData.cliente}
              onChange={handleChange}
              placeholder="Ej. Cliente ABC"
              required
            />

            <label>Teléfono</label>
            <input
              type="text"
              name="telefono"
              value={formData.telefono}
              onChange={handleChange}
              placeholder="Ej. 8112345678"
              required
            />
          </div>

          <div className="form-section">
            <h2>Datos del empaque</h2>

            <div className="form-grid">
              <div>
                <label>Largo</label>
                <input
                  type="number"
                  name="largo"
                  value={formData.largo}
                  onChange={handleChange}
                  placeholder="cm"
                  min="1"
                  required
                />
              </div>

              <div>
                <label>Ancho</label>
                <input
                  type="number"
                  name="ancho"
                  value={formData.ancho}
                  onChange={handleChange}
                  placeholder="cm"
                  min="1"
                  required
                />
              </div>

              <div>
                <label>Alto</label>
                <input
                  type="number"
                  name="alto"
                  value={formData.alto}
                  onChange={handleChange}
                  placeholder="cm"
                  min="1"
                  required
                />
              </div>
            </div>

            <label>Material</label>
            <select
              name="material"
              value={formData.material}
              onChange={handleChange}
              required
            >
              <option value="">Selecciona un material</option>
              {materiales.map((material) => (
                <option key={material.id} value={material.id}>
                  {material.nombre}
                </option>
              ))}
            </select>

            <label>Cantidad</label>
            <input
              type="number"
              name="cantidad"
              value={formData.cantidad}
              onChange={handleChange}
              placeholder="Ej. 100"
              min="1"
              required
            />

            <label>Observaciones</label>
            <textarea
              name="observaciones"
              value={formData.observaciones}
              onChange={handleChange}
              placeholder="Comentarios adicionales de la cotización"
              rows="4"
            />
          </div>

          {precioEstimado !== null && (
            <div className="precio-box">
              <span>Precio estimado:</span>
              <strong>${precioEstimado}</strong>
            </div>
          )}

          {mensaje && <div className="success-message">{mensaje}</div>}
          {error && <div className="error-message">{error}</div>}

          <div className="form-actions">
            <button type="button" onClick={handleCalcular}>
              Calcular precio
            </button>

            <button type="submit" disabled={loading}>
              {loading ? 'Guardando...' : 'Guardar cotización'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default NuevaCotizacion