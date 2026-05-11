import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import './App.css'

import Navbar from './components/Navbar'
import ProtectedRoute from './components/ProtectedRoute'

import Login from './pages/Login'
import RoleRouter from './pages/RoleRouter'
import InicioEmpleado from './pages/InicioEmpleado'
import InicioAdmin from './pages/InicioAdmin'
import NuevaCotizacion from './pages/NuevaCotizacion'
import Historial from './pages/Historial'
import Clientes from './pages/Clientes'
import MonitoreoNodos from './pages/MonitoreoNodos'
import Reportes from './pages/Reportes'

function App() {
  const location = useLocation()

  const ocultarNavbar = location.pathname === '/login'

  return (
    <>
      {!ocultarNavbar && <Navbar />}

      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />

        <Route path="/login" element={<Login />} />
        <Route path="/role-router" element={<RoleRouter />} />

        <Route
          path="/empleado"
          element={
            <ProtectedRoute allowedRoles={['empleado']}>
              <InicioEmpleado />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <InicioAdmin />
            </ProtectedRoute>
          }
        />

        <Route
          path="/nueva-cotizacion"
          element={
            <ProtectedRoute allowedRoles={['empleado']}>
              <NuevaCotizacion />
            </ProtectedRoute>
          }
        />

        <Route
          path="/historial"
          element={
            <ProtectedRoute allowedRoles={['empleado', 'admin']}>
              <Historial />
            </ProtectedRoute>
          }
        />

        <Route
          path="/clientes"
          element={
            <ProtectedRoute allowedRoles={['empleado', 'admin']}>
              <Clientes />
            </ProtectedRoute>
          }
        />

        <Route
          path="/monitoreo"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <MonitoreoNodos />
            </ProtectedRoute>
          }
        />

        <Route
          path="/reportes"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <Reportes />
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  )
}

export default App