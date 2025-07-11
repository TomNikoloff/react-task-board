// src/contexts/TasksContext.jsx

import { createContext, useContext, useState, useCallback } from "react";
import * as tasksApi from "../api/tasks";

const TasksContext = createContext();

export function TasksProvider({ children }) {
	const [tasks, setTasks] = useState({});
	const [loading, setLoading] = useState(false);

	// Fetch all tasks for a given list
	const fetchTasksForList = useCallback(async (listId) => {
		setLoading(true);
		const result = await tasksApi.fetchTasks(listId);
		setTasks(prev => ({ ...prev, [listId]: result }));
		setLoading(false);
	}, []);

	const addTask = async (listId, data) => {
		const newTask = await tasksApi.addTask({ ...data, list_id: listId });
		setTasks(prev => ({
			...prev,
			[listId]: [...(prev[listId] || []), newTask]
		}));
	};

	const updateTask = async (listId, taskId, data) => {
		const updatedTask = await tasksApi.updateTask(taskId, data);
		setTasks(prev => ({
			...prev,
			[listId]: prev[listId].map(task =>
				task.id === taskId ? { ...task, ...data } : task
			)
		}));
	};

	const deleteTask = async (listId, taskId) => {
		await tasksApi.deleteTask(taskId);
		setTasks(prev => ({
			...prev,
			[listId]: prev[listId].filter(task => task.id !== taskId)
		}));
	};

	// Optionally: batch move or delete functions

	return (
		<TasksContext.Provider value={{
			tasks, loading,
			fetchTasksForList,
			addTask,
			updateTask,
			deleteTask
		}}>
			{children}
		</TasksContext.Provider>
	);
}

// Custom hook
export const useTasks = () => useContext(TasksContext);
