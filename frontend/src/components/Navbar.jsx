import { Link, useNavigate } from 'react-router-dom'
import { logoutUser } from '../services/authService'

function Navbar() {
  const navigate = useNavigate()

  const handleLogout = async () => {
    try {
      await logoutUser()
      navigate('/login')
    } catch (error) {
      console.error('Error al cerrar sesión:', error)
    }
  }

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        Empaques Brisa
      </div>

      <div className="navbar-links">
        <Link to="/login">Login</Link>
        <Link to="/empleado">Empleado</Link>
        <Link to="/admin">Admin</Link>
        <Link to="/nueva-cotizacion">Nueva Cotización</Link>
        <Link to="/historial">Historial</Link>
        <Link to="/clientes">Clientes</Link>
        <Link to="/monitoreo">Monitoreo</Link>
        <Link to="/reportes">Reportes</Link>

        <button className="navbar-logout" onClick={handleLogout}>
          Cerrar sesión
        </button>
      </div>
    </nav>
  )
}

export default Navbar