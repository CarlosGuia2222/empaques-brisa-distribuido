import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { loginUser } from '../services/authService'
import './Login.css'

function Login() {
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()

    setError('')
    setLoading(true)

    try {
      await loginUser(email.trim(), password.trim())

      navigate('/role-router')
    } catch (error) {
      console.error('ERROR FIREBASE:', error.code, error.message)

      if (error.code === 'auth/user-not-found') {
        setError('El usuario no existe en Firebase Authentication.')
      } else if (error.code === 'auth/wrong-password') {
        setError('La contraseña es incorrecta.')
      } else if (error.code === 'auth/invalid-credential') {
        setError('Credenciales inválidas. Revisa el correo o la contraseña.')
      } else if (error.code === 'auth/invalid-email') {
        setError('El correo electrónico no tiene un formato válido.')
      } else if (error.code === 'auth/too-many-requests') {
        setError('Demasiados intentos fallidos. Espera un momento e intenta de nuevo.')
      } else {
        setError(`Error: ${error.code}`)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <h1>Empaques Brisa</h1>
        <h2>Iniciar sesión</h2>
        <p>Sistema Distribuido de Cotizaciones</p>

        <form onSubmit={handleSubmit}>
          <label htmlFor="email">Correo electrónico</label>
          <input
            id="email"
            type="email"
            placeholder="admin@brisa.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label htmlFor="password">Contraseña</label>
          <input
            id="password"
            type="password"
            placeholder="Ingresa tu contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {error && <div className="login-error">{error}</div>}

          <button type="submit" disabled={loading}>
            {loading ? 'Ingresando...' : 'Ingresar'}
          </button>
        </form>

        <div className="login-test-users">
          <p>Usuarios de prueba:</p>
          <span>admin@brisa.com</span>
          <span>empleado1@brisa.com</span>
          <span>empleado2@brisa.com</span>
          <small>Contraseña de prueba: 123456</small>
        </div>
      </div>
    </div>
  )
}

export default Login