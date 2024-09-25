import { openDB } from "idb";

const dbName = 'tasks-db';


export const openIndexedDb = () => {
    return new Promise((resolve, reject) => {

        const request = indexedDB.open(dbName, 1);

        request.onupgradeneeded = (event) => {
            const db = event.target.result;
            if (!db.objectStoreNames.contains('tasks')) {
                db.createObjectStore('tasks', { keyPath: "id" });
            }
        };

        request.onsuccess = (event) => {
            resolve(event.target.result);
        };

        request.onerror = (event) => {
            reject(`Erro ao abrir banco local: ${event.target.onerrorCode}`);
        };
    });
};

export const addTask = async (task) => {

    try {
        const db = await openIndexedDb();
        const transaction = db.transaction('tasks', 'readwrite');
        const store = transaction.objectStore('tasks');

        if(!task.id) {
            task.id = Date.now();
        }

        return new Promise((resolve, reject) => {
            const request = store.put(task);

            request.onsuccess = () => {
                resolve();
            }

            request.onerror = (event) => {
                console.error(`Erro ao adicionar tarefa ao db local: ${event.target.errorCode}`);
                reject(`Erro ao adicionar tarefa: ${event.target.errorCode}`);
            }
        })
    } catch (error) {
        console.error('Erro no db local:', error);
        throw new Error(`Erro ao adicionar tarefa no db local: ${error}`)
    }
}

export const getTasks = async (task) => {

    try {
        const db = await openIndexedDb();
        const transaction = db.transaction('tasks', 'readonly');
        const store = transaction.objectStore('tasks');

        return new Promise((resolve, reject) => {
            const request = store.getAll();

            request.onsuccess = () => {
                resolve();
            }

            request.onerror = (event) => {
                reject(`Erro ao buscar tarefas do IndexedDB: ${event.target.errorCode}`);
            };
        });
    } catch (error) {
        console.error('Erro ao obter tarefas do IndexedDB:', error);
        throw new Error(`Erro ao obter tarefas do IndexedDB: ${error}`);
    }
};