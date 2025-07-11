import { useState } from 'react'
import './App.css'

import BoardPage from './pages/BoardPage';
import { ListsProvider } from './contexts/ListsContext';
import { TasksProvider } from './contexts/TasksContext';

function App() {

	return (
		<>
			<ListsProvider>
				<TasksProvider>
					<BoardPage />
				</TasksProvider>
			</ListsProvider>
		</>
	)
}

export default App
