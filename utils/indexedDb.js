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
        const db = await openIndexedDB();
        const transaction = db.transaction(['tasks'], 'readwrite');
        const store = transaction.objectStore('tasks');

        if (!task.id) {
            task.id = Date.now();
        }

        task.synced = navigator.onLine;

        return new Promise((resolve, reject) => {
            const request = store.put(task); 

            request.onsuccess = () => {
                resolve(); 
            };

            request.onerror = (event) => {
                console.error(`Erro ao adicionar tarefa ao armazenamento local: ${event.target.errorCode}`);
                reject(`Erro ao adicionar tarefa: ${event.target.errorCode}`);
            };
        });
    } catch (error) {
        console.error('Erro no armazenamento local:', error);
        throw new Error(`Erro ao adicionar tarefa no armazenamento local: ${error}`);
    }
};

export const getTasks = async () => {
    try {
        const db = await openIndexedDB();
        const transaction = db.transaction(['tasks'], 'readonly');
        const store = transaction.objectStore('tasks');

        return new Promise((resolve, reject) => {
            const request = store.getAll(); 

            request.onsuccess = (event) => {
                resolve(event.target.result);
            };

            request.onerror = (event) => {
                reject(`Erro ao buscar tarefas no armazenamento local: ${event.target.errorCode}`);
            };
        });
    } catch (error) {
        console.error('Erro ao obter tarefas do armazenamento local:', error);
        throw new Error(`Erro ao obter tarefas do armazenamento local: ${error}`);
    }
};