'use client'

import { createContext, useContext, useState, useEffect } from "react";
import { addTask, getTasks } from "../utils/indexedDb"
import { addTaskToFirestore, getTaskFromFirestore } from "@/utils/firebase";

const TaskContext = createContext();

//React Hook
export const useTaskContext = () => {
    return useContext(TaskContext);
}

export const TaskProvider = ({ children }) => {
    const [tasks, setTasks] = useState([]);

    useEffect(() => {
        const loadTasks = async () => {

            try {

            const tasksFromDB = await getTasks();
            if(navigator.onLine){
                const tasksFromFirestore = await getTaskFromFirestore();

                const tasksMap = new Map();

                tasksFromDB.forEach(task => tasksMap.set(task.id, task));
                tasksFromFirestore.forEach(task => tasksMap.set(task.id, task));
                const mergedTasks = Array.from(tasksMap.values());

                setTasks(mergedTasks);

                await Promise.all(mergedTasks.map(task => addTask(task)));
            
            } else {
                setTasks(tasksFromDB);
            }
            
        } catch (error) {
            console.error("Erro ao carregar e mesclar tarefas: " + error);
        }

           

            
        };
        loadTasks();
    }, [])

    const addNewTask = async (task) => {

        try {
            if(navigator.onLine){
                await  addTaskToFirestore(task);
            } else {
                await addTask(task); 
            }
            
        } catch (error) {
            console.error("Erro ao adicionar nova tarefa: " + error);
        }

         
        // const tasksFromDB = await getTasks();
        // setTasks(tasksFromDB);

    }

    return(
        <TaskContext.Provider value = {{ tasks, addNewTask }}>
            {children}
        </TaskContext.Provider>
    )
}