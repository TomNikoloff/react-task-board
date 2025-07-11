// src/contexts/ListsContext.jsx

import { createContext, useContext, useEffect, useState } from "react";
import * as listsApi from "../api/lists";

const ListsContext = createContext();

export function ListsProvider({ children }) {
	const [lists, setLists] = useState([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		listsApi.fetchLists().then(data => {
			setLists(data);
			setLoading(false);
		});
	}, []);

	const addList = async (name) => {
		const newList = await listsApi.addList(name);
		setLists(prev => [...prev, newList]);
	};

	const deleteList = async (id) => {
		await listsApi.deleteList(id);
		setLists(prev => prev.filter(l => l.id !== id));
	};

	return (
		<ListsContext.Provider value={{ lists, loading, addList, deleteList }}>
			{children}
		</ListsContext.Provider>
	);
}

// Custom hook for easy usage
export const useLists = () => useContext(ListsContext);
