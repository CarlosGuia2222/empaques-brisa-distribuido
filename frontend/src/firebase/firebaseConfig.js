import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: 'AIzaSyDyiPCejneQ1Vgfljs98Hx4exu6i0V8Nvw',
  authDomain: 'empaques-brisa-distribuido.firebaseapp.com',
  projectId: 'empaques-brisa-distribuido',
  storageBucket: 'empaques-brisa-distribuido.firebasestorage.app',
  messagingSenderId: '253934059118',
  appId: '1:253934059118:web:d8e19dde46605518edb07f',
}

const app = initializeApp(firebaseConfig)

export const auth = getAuth(app)
export const db = getFirestore(app)

export default app