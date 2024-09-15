import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, getDocs, updateDocs, doc } from "firebase/firestore";


const firebaseConfig = {
    apiKey: "AIzaSyCEFWoIscCyjx6G7fX27vnQscmPGVOE--E",
    authDomain: "mytaskapp-react.firebaseapp.com",
    projectId: "mytaskapp-react",
    storageBucket: "mytaskapp-react.appspot.com",
    messagingSenderId: "938749492861",
    appId: "1:938749492861:web:25abafbd52af679bfc3b14",
    measurementId: "G-0N2251MYEW"
  };

  const app = initializeApp(firebaseConfig);

  export const db = getFirestore(app);

  export const addTaskToFirestore = async (task) => {
    try {
        const docInsert = await addDoc(collection(db, "tasks" ), task);
        console.log('Documento inserido com sucesso: ', docInsert.id);
    } catch (error) {
        console.error("Erro ao adicionar ao documento: " + error)
    }
  }

  export const getTaskFromFirestore = async () => {
   const query = await getDocs(collection(db, 'tasks'));
   return query.docs.map(doc => doc.data());
  }