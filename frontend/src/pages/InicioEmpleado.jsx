import { Link } from 'react-router-dom'

function InicioEmpleado() {
  return (
    <div className="page-container page-enter">
      <section className="page-hero split-hero hero-premium">
        <div>
          <span className="eyebrow">Panel del empleado</span>
          <h1>Bienvenido a Empaques Brisa</h1>
          <p>Crea cotizaciones, administra clientes y consulta tu historial desde una experiencia más clara, rápida y profesional.</p>
        </div>
        <div className="hero-package" aria-hidden="true">
          <span className="package-face package-face--front" />
          <span className="package-face package-face--side" />
          <span className="package-face package-face--top" />
        </div>
      </section>

      <div className="dashboard-grid">
        <Link className="feature-card highlight feature-card--icon" to="/nueva-cotizacion">
          <i>＋</i>
          <span>Nueva</span>
          <h2>Crear cotización</h2>
          <p>Envía medidas y material al middleware para que un nodo calcule el precio.</p>
        </Link>
        <Link className="feature-card feature-card--icon" to="/historial">
          <i>▦</i>
          <span>Historial</span>
          <h2>Mis cotizaciones</h2>
          <p>Revisa las cotizaciones generadas y el nodo que procesó cada solicitud.</p>
        </Link>
        <Link className="feature-card feature-card--icon" to="/clientes">
          <i>✦</i>
          <span>Clientes</span>
          <h2>Registrar clientes</h2>
          <p>Guarda datos de contacto para reutilizarlos al cotizar.</p>
        </Link>
      </div>
    </div>
  )
}

export default InicioEmpleado
