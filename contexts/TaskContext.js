'use client'

import { createContext, useContext, useState, useEffect } from "react";
import { addTask, getTasks } from "../utils/indexedDb"

const TaskContext = createContext();

//React Hook
export const useTaskContext = () => {
    return useContext(TaskContext);
}

export const TaskProvider = ({ children }) => {
    const [tasks, setTasks] = useState([]);

    useEffect(() => {
        const loadTasks = async () => {
            const tasksFromDB = await getTasks();
            setTasks(tasksFromDB);
        };
        loadTasks();
    }, [])

    const addNewTask = async (task) => {

        await addTask(task);
        const tasksFromDB = await getTasks();
        setTasks(tasksFromDB);

    }

    return(
        <TaskContext.Provider value = {{ tasks, addNewTask }}>
            {children}
        </TaskContext.Provider>
    )
}