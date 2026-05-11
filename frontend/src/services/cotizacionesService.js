import { addDoc, collection, serverTimestamp } from 'firebase/firestore'
import { db } from '../firebase/firebaseConfig'

export const crearCotizacion = async (cotizacion) => {
  const cotizacionesRef = collection(db, 'cotizaciones')

  const docRef = await addDoc(cotizacionesRef, {
    ...cotizacion,
    createdAt: serverTimestamp(),
    estado: 'generada',
  })

  return docRef.id
}