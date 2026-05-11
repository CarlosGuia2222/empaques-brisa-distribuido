import { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from '../firebase/firebaseConfig'
import { getUserData } from '../services/usersService'

function ProtectedRoute({ children, allowedRoles }) {
  const [loading, setLoading] = useState(true)
  const [userData, setUserData] = useState(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setIsAuthenticated(false)
        setUserData(null)
        setLoading(false)
        return
      }

      try {
        const data = await getUserData(user.uid, user.email)

        setIsAuthenticated(true)
        setUserData(data)
      } catch (error) {
        console.error('Error verificando ruta protegida:', error)
        setIsAuthenticated(false)
        setUserData(null)
      } finally {
        setLoading(false)
      }
    })

    return () => unsubscribe()
  }, [])

  if (loading) {
    return (
      <div className="page-container">
        <h1>Validando acceso...</h1>
        <p>Espere un momento.</p>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  if (!userData?.activo) {
    return (
      <div className="page-container">
        <h1>Usuario desactivado</h1>
        <p>No tienes permiso para acceder al sistema.</p>
      </div>
    )
  }

  if (!allowedRoles.includes(userData.role)) {
    if (userData.role === 'admin') {
      return <Navigate to="/admin" replace />
    }

    if (userData.role === 'empleado') {
      return <Navigate to="/empleado" replace />
    }

    return <Navigate to="/login" replace />
  }

  return children
}

export default ProtectedRoute