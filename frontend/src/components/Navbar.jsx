import { Link } from 'react-router-dom'

function Navbar() {
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
      </div>
    </nav>
  )
}

export default Navbar