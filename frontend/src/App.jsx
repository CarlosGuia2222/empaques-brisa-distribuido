import { Routes, Route, Navigate } from 'react-router-dom'
import './App.css'

import Login from './pages/Login'
import RoleRouter from './pages/RoleRouter'
import InicioEmpleado from './pages/InicioEmpleado'
import InicioAdmin from './pages/InicioAdmin'
import NuevaCotizacion from './pages/NuevaCotizacion'
import Historial from './pages/Historial'
import Clientes from './pages/Clientes'
import MonitoreoNodos from './pages/MonitoreoNodos'
import Reportes from './pages/Reportes'

import Navbar from './components/Navbar'

function App() {
  return (
    <>
      <Navbar />

      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/role-router" element={<RoleRouter />} />

        <Route path="/empleado" element={<InicioEmpleado />} />
        <Route path="/admin" element={<InicioAdmin />} />

        <Route path="/nueva-cotizacion" element={<NuevaCotizacion />} />
        <Route path="/historial" element={<Historial />} />
        <Route path="/clientes" element={<Clientes />} />
        <Route path="/monitoreo" element={<MonitoreoNodos />} />
        <Route path="/reportes" element={<Reportes />} />
      </Routes>
    </>
  )
}

export default App