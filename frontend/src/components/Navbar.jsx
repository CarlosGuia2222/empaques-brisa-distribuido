import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from '../firebase/firebaseConfig'
import { logoutUser } from '../services/authService'
import { getUserData } from '../services/usersService'

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

  if (loading) {
    return null
  }

  if (!userData) {
    return null
  }

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        Empaques Brisa
      </div>

      <div className="navbar-links">
        {userData.role === 'empleado' && (
          <>
            <Link to="/empleado">Inicio</Link>
            <Link to="/nueva-cotizacion">Nueva Cotización</Link>
            <Link to="/historial">Historial</Link>
            <Link to="/clientes">Clientes</Link>
          </>
        )}

        {userData.role === 'admin' && (
          <>
            <Link to="/admin">Inicio Admin</Link>
            <Link to="/historial">Historial</Link>
            <Link to="/clientes">Clientes</Link>
            <Link to="/reportes">Reportes</Link>
            <Link to="/monitoreo">Monitoreo</Link>
          </>
        )}

        <button className="navbar-logout" onClick={handleLogout}>
          Cerrar sesión
        </button>
      </div>
    </nav>
  )
}

export default Navbar