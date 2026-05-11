import { collection, doc, getDoc, getDocs, query, where } from 'firebase/firestore'
import { db } from '../firebase/firebaseConfig'

export const getUserData = async (uid, email) => {
  // Primero intenta buscar por UID
  const userRef = doc(db, 'users', uid)
  const userSnap = await getDoc(userRef)

  if (userSnap.exists()) {
    return {
      id: userSnap.id,
      ...userSnap.data(),
    }
  }

  // Si no encuentra por UID, intenta buscar por email
  const usersRef = collection(db, 'users')
  const q = query(usersRef, where('email', '==', email))
  const querySnapshot = await getDocs(q)

  if (!querySnapshot.empty) {
    const userDoc = querySnapshot.docs[0]

    return {
      id: userDoc.id,
      ...userDoc.data(),
    }
  }

  throw new Error('No se encontró información del usuario en Firestore')
}