import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// Configuração do Firebase
const firebaseConfig = {
  apiKey: 'AIzaSyBi4yS5BsUr22u_516Src8w7-SdgWA-OKs',
  authDomain: 'tarefaspuls.firebaseapp.com',
  projectId: 'tarefaspuls',
  storageBucket: 'tarefaspuls.appspot.com',
  messagingSenderId: '456789513080',
  appId: '1:456789513080:web:b09ae1a451a611d52eee8d',
};

// Inicializa o Firebase
const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);

export { db };
