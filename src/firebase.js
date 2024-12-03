// src/firebase.js

import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
    apiKey: "AIzaSyDQNdjC6siv9JiOcvHs4Cg7stEjBGmPHp4",
    authDomain: "coins-30a8c.firebaseapp.com",
    databaseURL: "https://coins-30a8c-default-rtdb.firebaseio.com",
    projectId: "coins-30a8c",
    storageBucket: "coins-30a8c.appspot.com",
    messagingSenderId: "843864900067",
    appId: "1:843864900067:web:3b121ad0b594011c2c20d6"
};

// Inicialize o Firebase
const app = initializeApp(firebaseConfig);

// Exporta o banco de dados
const database = getDatabase(app);

const storage = getStorage(app);

export { database, storage };