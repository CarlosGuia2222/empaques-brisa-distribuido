const materiales = {
  carton_sencillo: { nombre: 'Cartón sencillo', precioBase: 8 },
  carton_doble: { nombre: 'Cartón doble', precioBase: 12 },
  corrugado: { nombre: 'Cartón corrugado', precioBase: 15 },
  kraft: { nombre: 'Papel kraft', precioBase: 10 },
}

function redondear(numero) {
  return Number(numero.toFixed(2))
}

function calcularCotizacion(datos) {
  const largo = Number(datos.largo)
  const ancho = Number(datos.ancho)
  const alto = Number(datos.alto)
  const cantidad = Number(datos.cantidad)
  const material = materiales[datos.materialId]

  if (!material) {
    throw new Error('Material no reconocido por el nodo procesador.')
  }

  const volumen = largo * ancho * alto
  const precioUnitario = (volumen / 1000) * material.precioBase
  const subtotal = precioUnitario * cantidad
  const precioFinal = subtotal < 50 ? 50 : subtotal

  return {
    volumen: redondear(volumen),
    precioBaseMaterial: material.precioBase,
    precioUnitario: redondear(precioUnitario),
    subtotal: redondear(subtotal),
    precioEstimado: redondear(precioFinal),
    materialId: datos.materialId,
    materialNombre: material.nombre,
    cantidad,
  }
}

module.exports = { calcularCotizacion }
