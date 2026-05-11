function NodoCard({ nodo }) {
  const porcentajeCarga = Math.min(100, (Number(nodo.cargaActual || 0) / 5) * 100)

  return (
    <article className={`node-card ${nodo.activo ? 'is-online' : 'is-offline'}`}>
      <div className="node-card__top">
        <div>
          <h3>{nodo.nombre}</h3>
          <p>{nodo.url}</p>
        </div>
        <span className={`status-pill ${nodo.activo ? 'success' : 'danger'}`}>
          {nodo.activo ? 'Activo' : 'Inactivo'}
        </span>
      </div>

      <div className="node-card__details">
        <p><strong>ID:</strong> {nodo.id}</p>
        <p><strong>Solicitudes:</strong> {nodo.solicitudesProcesadas ?? 0}</p>
        <p><strong>Errores:</strong> {nodo.errores ?? 0}</p>
        <p><strong>Carga actual:</strong> {nodo.cargaActual ?? 0}</p>
        {nodo.latenciaMs !== undefined && nodo.latenciaMs !== null && (
          <p><strong>Latencia:</strong> {nodo.latenciaMs} ms</p>
        )}
        {nodo.ultimoUso && (
          <p><strong>Último uso:</strong> {new Date(nodo.ultimoUso).toLocaleTimeString('es-MX')}</p>
        )}
        {!nodo.activo && nodo.ultimoError && (
          <p className="node-error"><strong>Detalle:</strong> {nodo.ultimoError}</p>
        )}
      </div>

      <div className="load-bar" aria-label="Carga actual del nodo">
        <span style={{ width: `${porcentajeCarga}%` }} />
      </div>
    </article>
  )
}

export default NodoCard
