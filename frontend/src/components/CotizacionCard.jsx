function CotizacionCard({ cotizacion, mostrarEmpleado = false }) {
  const formatearFecha = (fechaFirebase) => {
    if (!fechaFirebase) return 'Sin fecha'
    const fecha = fechaFirebase.toDate ? fechaFirebase.toDate() : new Date(fechaFirebase)
    return fecha.toLocaleString('es-MX', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  return (
    <article className="cotizacion-card">
      <div className="cotizacion-card-header">
        <div>
          <h2>{cotizacion.cliente}</h2>
          <p>{cotizacion.telefono}</p>
        </div>
        <span className="estado-badge">{cotizacion.estado || 'generada'}</span>
      </div>

      <div className="cotizacion-price">
        <span>Precio estimado</span>
        <strong>${Number(cotizacion.precioEstimado || 0).toFixed(2)}</strong>
      </div>

      <div className="cotizacion-info">
        <p><strong>Material:</strong> {cotizacion.materialNombre}</p>
        <p><strong>Medidas:</strong> {cotizacion.largo} cm × {cotizacion.ancho} cm × {cotizacion.alto} cm</p>
        <p><strong>Cantidad:</strong> {cotizacion.cantidad}</p>
        {cotizacion.precioUnitario !== undefined && (
          <p><strong>Precio unitario:</strong> ${Number(cotizacion.precioUnitario).toFixed(2)}</p>
        )}
        {cotizacion.nodoUsado && (
          <p><strong>Procesado por:</strong> {cotizacion.nodoUsado}</p>
        )}
        <p><strong>Fecha:</strong> {formatearFecha(cotizacion.createdAt || cotizacion.fechaProcesamiento)}</p>
        {mostrarEmpleado && <p><strong>Empleado:</strong> {cotizacion.creadoPorEmail}</p>}
        {cotizacion.observaciones && <p><strong>Observaciones:</strong> {cotizacion.observaciones}</p>}
      </div>
    </article>
  )
}

export default CotizacionCard
