function BrisaLogo({ compact = false, className = '' }) {
  return (
    <div className={`brisa-logo ${compact ? 'brisa-logo--compact' : ''} ${className}`} aria-label="Empaques Brisa">
      <div className="brisa-logo__mark">
        <span className="brisa-logo__box brisa-logo__box--one" />
        <span className="brisa-logo__box brisa-logo__box--two" />
        <span className="brisa-logo__box brisa-logo__box--three" />
      </div>
      {!compact && (
        <div className="brisa-logo__text">
          <strong>Empaques Brisa</strong>
          <small>Sistema distribuido</small>
        </div>
      )}
    </div>
  )
}

export default BrisaLogo
