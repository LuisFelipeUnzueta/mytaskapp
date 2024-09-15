import { openDB } from "idb";

const dbName = 'tasks-db';
 

export async function initDB() {
    return openDB(dbName, 1, {
        upgrade(db) {
            if(!db.objectStoreNames.contains('tasks')){
                db.createObjectStore('tasks', {keyPath: 'id', autoincrement: true})
            }
        }
    })
}

export async function addTask(task) {
    const db = await initDB();
    const tx = db.transaction('tasks', 'readwrite');
    const store = tx.objectStore('tasks');
    await store.add(task);
    await tx.done;
}

export async function getTasks() {
    const db = await initDB();
    const tx = db.transaction('tasks', 'readonly');
    const store = tx.objectStore('tasks');
    const allTasks = await store.getAll();
    await tx.done;
    return allTasks;
}