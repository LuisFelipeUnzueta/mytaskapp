const { addTaskToFirestore } = require("@/utils/firebase");

const CACHE_NAME = 'static-cache-1';
const CACHE_ASSETS = [
    '/icons/144x144.png',
    '/icons/192x192.png',
    '/icons/512x512.png'
]

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(CACHE_ASSETS)
                .catch((error) => {
                    console.error("Falha ao adicionar os recursos ao cache: " + error)
                });
        })
    );
});

self.addEventListener('sync', (event) => {
    if(event.tag === 'sync-tasks') {
        event.waitUntil(syncTasksWithFirebase());
    }
});

async function syncTasksWithFirebase() {
    const tasks = await getTasksFromIndexedDb();
    for( const task of tasks) {
        await addTaskToFirestore(task);
    }
}

async function getTasksFromIndexedDb() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open('tasks-db', 1);

        request.onsuccess = (event) => {
            const db = event.target.result;
            const transaction = db.transaction(['task'], 'readonly');
            const store = transaction.objectStore('tasks');
            const getAllRequest = store.getAll();

            getAllRequest.onsuccess = () => resolve(getAllRequest.result);
            getAllRequest.onerror = () => reject('Erro ao obter tarefas gravadas localmente.')
        };

        request.onerror = () => reject('Erro ao abrir banco local.')
    })
}