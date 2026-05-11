import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from '../firebase/firebaseConfig'
import { getUserData } from '../services/usersService'

function RoleRouter() {
  const navigate = useNavigate()
  const [message, setMessage] = useState('Verificando usuario...')

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        navigate('/login')
        return
      }

      try {
        const userData = await getUserData(user.uid, user.email)

        if (!userData.activo) {
          setMessage('El usuario está desactivado.')
          return
        }

        if (userData.role === 'admin') {
          navigate('/admin')
          return
        }

        if (userData.role === 'empleado') {
          navigate('/empleado')
          return
        }

        setMessage('El usuario no tiene un rol válido.')
      } catch (error) {
        console.error('ERROR AL OBTENER ROL:', error)
        setMessage(`No se pudo obtener el rol del usuario: ${error.message}`)
      }
    })

    return () => unsubscribe()
  }, [navigate])

  return (
    <div className="page-container">
      <h1>{message}</h1>
      <p>Espere un momento mientras se valida su acceso.</p>
    </div>
  )
}

export default RoleRouter