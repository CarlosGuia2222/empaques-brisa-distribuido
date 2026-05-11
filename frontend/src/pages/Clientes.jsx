import { useEffect, useState } from 'react'
import { auth } from '../firebase/firebaseConfig'
import { crearCliente, obtenerClientes } from '../services/clientesService'

function Clientes() {
  const [clientes, setClientes] = useState([])
  const [formData, setFormData] = useState({
    nombre: '',
    telefono: '',
    correo: '',
    empresa: '',
    direccion: '',
  })

  const [loading, setLoading] = useState(false)
  const [loadingClientes, setLoadingClientes] = useState(true)
  const [mensaje, setMensaje] = useState('')
  const [error, setError] = useState('')

  const cargarClientes = async () => {
    setLoadingClientes(true)
    setError('')

    try {
      const datos = await obtenerClientes()
      setClientes(datos)
    } catch (error) {
      console.error('Error al cargar clientes:', error)
      setError('No se pudieron cargar los clientes.')
    } finally {
      setLoadingClientes(false)
    }
  }

  useEffect(() => {
    cargarClientes()
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target

    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    setLoading(true)
    setMensaje('')
    setError('')

    try {
      const usuarioActual = auth.currentUser

      if (!usuarioActual) {
        setError('No hay un usuario autenticado.')
        setLoading(false)
        return
      }

      const nuevoCliente = {
        nombre: formData.nombre,
        telefono: formData.telefono,
        correo: formData.correo,
        empresa: formData.empresa,
        direccion: formData.direccion,
        creadoPorUid: usuarioActual.uid,
        creadoPorEmail: usuarioActual.email,
      }

      await crearCliente(nuevoCliente)

      setMensaje('Cliente registrado correctamente.')

      setFormData({
        nombre: '',
        telefono: '',
        correo: '',
        empresa: '',
        direccion: '',
      })

      await cargarClientes()
    } catch (error) {
      console.error('Error al registrar cliente:', error)
      setError('Ocurrió un error al registrar el cliente.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page-container">
      <div className="clientes-container">
        <div className="clientes-header">
          <div>
            <h1>Clientes</h1>
            <p>Registra y consulta los clientes de Empaques Brisa.</p>
          </div>

          <button onClick={cargarClientes}>Actualizar</button>
        </div>

        <div className="clientes-layout">
          <div className="clientes-form-card">
            <h2>Registrar cliente</h2>

            <form onSubmit={handleSubmit} className="clientes-form">
              <label>Nombre del cliente</label>
              <input
                type="text"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                placeholder="Ej. Carlos Guía"
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

              <label>Correo electrónico</label>
              <input
                type="email"
                name="correo"
                value={formData.correo}
                onChange={handleChange}
                placeholder="Ej. cliente@correo.com"
              />

              <label>Empresa</label>
              <input
                type="text"
                name="empresa"
                value={formData.empresa}
                onChange={handleChange}
                placeholder="Ej. Comercial ABC"
              />

              <label>Dirección</label>
              <textarea
                name="direccion"
                value={formData.direccion}
                onChange={handleChange}
                placeholder="Dirección del cliente"
                rows="3"
              />

              {mensaje && <div className="success-message">{mensaje}</div>}
              {error && <div className="error-message">{error}</div>}

              <button type="submit" disabled={loading}>
                {loading ? 'Guardando...' : 'Guardar cliente'}
              </button>
            </form>
          </div>

          <div className="clientes-list-card">
            <h2>Lista de clientes</h2>

            {loadingClientes && <p>Cargando clientes...</p>}

            {!loadingClientes && clientes.length === 0 && (
              <div className="empty-state">
                <h3>No hay clientes registrados</h3>
                <p>Cuando registres clientes, aparecerán aquí.</p>
              </div>
            )}

            {!loadingClientes && clientes.length > 0 && (
              <div className="clientes-list">
                {clientes.map((cliente) => (
                  <div className="cliente-card" key={cliente.id}>
                    <h3>{cliente.nombre}</h3>

                    <p>
                      <strong>Teléfono:</strong> {cliente.telefono}
                    </p>

                    {cliente.correo && (
                      <p>
                        <strong>Correo:</strong> {cliente.correo}
                      </p>
                    )}

                    {cliente.empresa && (
                      <p>
                        <strong>Empresa:</strong> {cliente.empresa}
                      </p>
                    )}

                    {cliente.direccion && (
                      <p>
                        <strong>Dirección:</strong> {cliente.direccion}
                      </p>
                    )}

                    <p className="cliente-creado">
                      Registrado por: {cliente.creadoPorEmail}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Clientes