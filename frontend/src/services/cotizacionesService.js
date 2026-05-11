import {
  addDoc,
  collection,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  where,
} from 'firebase/firestore'

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

export const obtenerCotizacionesPorEmpleado = async (uid) => {
  const cotizacionesRef = collection(db, 'cotizaciones')

  const q = query(
    cotizacionesRef,
    where('creadoPorUid', '==', uid)
  )

  const querySnapshot = await getDocs(q)

  const cotizaciones = querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }))

  return cotizaciones.sort((a, b) => {
    const fechaA = a.createdAt?.seconds || 0
    const fechaB = b.createdAt?.seconds || 0
    return fechaB - fechaA
  })
}

export const obtenerTodasLasCotizaciones = async () => {
  const cotizacionesRef = collection(db, 'cotizaciones')

  const q = query(
    cotizacionesRef,
    orderBy('createdAt', 'desc')
  )

  const querySnapshot = await getDocs(q)

  return querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }))
}