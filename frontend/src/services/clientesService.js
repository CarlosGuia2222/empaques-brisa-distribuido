import {
  addDoc,
  collection,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
} from 'firebase/firestore'

import { db } from '../firebase/firebaseConfig'

export const crearCliente = async (cliente) => {
  const clientesRef = collection(db, 'clientes')

  const docRef = await addDoc(clientesRef, {
    ...cliente,
    createdAt: serverTimestamp(),
    activo: true,
  })

  return docRef.id
}

export const obtenerClientes = async () => {
  const clientesRef = collection(db, 'clientes')

  const q = query(clientesRef, orderBy('createdAt', 'desc'))

  const querySnapshot = await getDocs(q)

  return querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }))
}