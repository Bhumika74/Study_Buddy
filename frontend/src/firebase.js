import { initializeApp } from 'firebase/app'
import { getAuth, signInWithPopup, GithubAuthProvider, GoogleAuthProvider } from 'firebase/auth'
import { getDatabase } from 'firebase/database'

export const firebaseConfig = {
  apiKey: 'AIzaSyB9kH8knUsgg2xbylO_pArTInpCq61a1Vw',
  authDomain: 'resumeanalyzer-50e48.firebaseapp.com',
  projectId: 'resumeanalyzer-50e48',
  storageBucket: 'resumeanalyzer-50e48.firebasestorage.app',
  messagingSenderId: '734092078043',
  appId: '1:734092078043:web:62db51a75673753bfbd5fe',
  measurementId: 'G-H9KB7957M8',
}

export const firebaseApp = initializeApp(firebaseConfig)

export const auth = getAuth(firebaseApp)
const googleProvider = new GoogleAuthProvider()
const githubProvider = new GithubAuthProvider()
export const database = getDatabase(firebaseApp)

export function signInWithGitHub() {
  return signInWithPopup(auth, githubProvider)
}

export function signInWithGoogle() {
  return signInWithPopup(auth, googleProvider)
}
