import { useEffect, useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from '../firebase/firebaseConfig'
import { logoutUser } from '../services/authService'
import { getUserData } from '../services/usersService'
import BrisaLogo from './BrisaLogo'

function Navbar() {
  const navigate = useNavigate()

  const [userData, setUserData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setUserData(null)
        setLoading(false)
        return
      }

      try {
        const data = await getUserData(user.uid, user.email)
        setUserData(data)
      } catch (error) {
        console.error('Error obteniendo datos del usuario:', error)
        setUserData(null)
      } finally {
        setLoading(false)
      }
    })

    return () => unsubscribe()
  }, [])

  const handleLogout = async () => {
    try {
      await logoutUser()
      navigate('/login')
    } catch (error) {
      console.error('Error al cerrar sesión:', error)
    }
  }

  if (loading || !userData) return null

  const linkClass = ({ isActive }) => (isActive ? 'nav-link is-active' : 'nav-link')

  return (
    <nav className="navbar">
      <NavLink className="navbar-brand" to={userData.role === 'admin' ? '/admin' : '/empleado'}>
        <BrisaLogo />
      </NavLink>

      <div className="navbar-links">
        {userData.role === 'empleado' && (
          <>
            <NavLink className={linkClass} to="/empleado">Inicio</NavLink>
            <NavLink className={linkClass} to="/nueva-cotizacion">Nueva Cotización</NavLink>
            <NavLink className={linkClass} to="/historial">Historial</NavLink>
            <NavLink className={linkClass} to="/clientes">Clientes</NavLink>
          </>
        )}

        {userData.role === 'admin' && (
          <>
            <NavLink className={linkClass} to="/admin">Inicio Admin</NavLink>
            <NavLink className={linkClass} to="/historial">Historial</NavLink>
            <NavLink className={linkClass} to="/clientes">Clientes</NavLink>
            <NavLink className={linkClass} to="/reportes">Reportes</NavLink>
            <NavLink className={linkClass} to="/monitoreo">Monitoreo</NavLink>
          </>
        )}

        <span className="navbar-user">{userData.role}</span>
        <button className="navbar-logout" onClick={handleLogout}>Cerrar sesión</button>
      </div>
    </nav>
  )
}

export default Navbar
