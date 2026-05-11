import { collection, getDocs, orderBy, query } from 'firebase/firestore'
import { db } from '../firebase/firebaseConfig'

export const obtenerNodos = async () => {
  const nodosRef = collection(db, 'nodos')

  const q = query(nodosRef, orderBy('nombre', 'asc'))

  const querySnapshot = await getDocs(q)

  return querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }))
}