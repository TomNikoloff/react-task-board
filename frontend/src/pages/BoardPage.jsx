// src/pages/BoardPage.jsx

import { useState, useEffect, useRef } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';

import { useLists } from '../contexts/ListsContext';
import { useTasks } from "../contexts/TasksContext";

import Header from '../components/Header';
import Modal from '../components/Modal';
import ListColumn from '../components/ListColumn';
import AddTaskForm from '../components/AddTaskForm';

const BoardPage = () => {
	const { lists, loading, addList, deleteList } = useLists();
	const { tasks, fetchTasksForList, addTask, updateTask, deleteTask } = useTasks();

	const [isAddListModalOpen, setAddListModalOpen] = useState(false);
	const [newListName, setNewListName] = useState("");
	const [addTaskForList, setAddTaskForList] = useState(null);
	const [editTask, setEditTask] = useState(null);
	const [taskForm, setTaskForm] = useState({ name: '', description: '', deadline: '' });
	const [selectedTasks, setSelectedTasks] = useState({});
	const [listDropdownOpen, setListDropdownOpen] = useState(null);
	const dropdownRefs = useRef({});

	const [taskFormError, setTaskFormError] = useState("");

	const [deleteListId, setDeleteListId] = useState(null);

	// Fetch tasks for all lists when lists change
	useEffect(() => {
		lists.forEach(list => fetchTasksForList(list.id));
	}, [lists, fetchTasksForList]);

	// Dropdown click-outside handler
	useEffect(() => {
		if (listDropdownOpen === null) return;
		const handleClickOutside = (event) => {
			const ref = dropdownRefs.current[listDropdownOpen];
			if (ref && !ref.contains(event.target)) {
				setListDropdownOpen(null);
			}
		};
		document.addEventListener('mousedown', handleClickOutside);
		return () => document.removeEventListener('mousedown', handleClickOutside);
	}, [listDropdownOpen]);

	const handleAddList = async () => {
		if (!newListName.trim()) return;
		await addList(newListName);
		setNewListName('');
		setAddListModalOpen(false);
	};

	const handleDeleteList = async (listId) => {
		await deleteList(listId);
		setSelectedTasks(prev => {
			const updated = { ...prev };
			delete updated[listId];
			return updated;
		});
	};

	const handleAddTaskModalOpen = (listId) => {
		setAddTaskForList(listId);
		setTaskForm({ name: '', description: '', deadline: '' });
	};

	const handleAddTask = async () => {
		if (!taskForm.name.trim()) {
			setTaskFormError("Task name is required.");
			return;
		}
		setTaskFormError("");
		await addTask(addTaskForList, taskForm);
		setAddTaskForList(null);
		setTaskForm({ name: '', description: '', deadline: '' });
	};

	const handleEditTask = async (listId, taskId, form) => {
		if (!form.name.trim()) {
			setTaskFormError("Task name is required.");
			return;
		}
		setTaskFormError("");
		await updateTask(listId, taskId, {
			...form,
			list_id: listId
		});
		setEditTask(null);
		setTaskForm({ name: '', description: '', deadline: '' });
	};

	const handleDeleteTask = async (listId, taskId) => {
		await deleteTask(listId, taskId);
	};

	const handleCompleteTask = async (listId, taskId) => {
		const task = tasks[listId].find(t => t.id === taskId);
		await updateTask(listId, taskId, {
			...task,
			completed: true
		});
	};

	const handleMarkIncompleteTask = async (listId, taskId) => {
		const task = tasks[listId].find(t => t.id === taskId);
		await updateTask(listId, taskId, { ...task, completed: false });
	};

	const handleMoveSelectedTasks = async (fromListId, toListId) => {
		const tasksToMove = (tasks[fromListId] || []).filter(task =>
			(selectedTasks[fromListId] || []).includes(task.id)
		);
		if (!tasksToMove.length) return;
		for (const task of tasksToMove) {
			await updateTask(fromListId, task.id, { ...task, list_id: toListId });
			await fetchTasksForList(toListId);
		}
		await fetchTasksForList(fromListId);
		setSelectedTasks(prev => ({ ...prev, [fromListId]: [] }));
	};

	const handleDeleteSelectedTasks = async (listId) => {
		for (const taskId of (selectedTasks[listId] || [])) {
			await deleteTask(listId, taskId);
		}
		setSelectedTasks(prev => ({ ...prev, [listId]: [] }));
	};

	return (
		<>
			<div className="h-screen flex flex-col overflow-hidden">
				<Header onAddList={() => setAddListModalOpen(true)} />
				<div className="flex flex-1 overflow-x-auto bg-blue-400 py-4 px-2">
					<DragDropContext
						onDragEnd={async result => {
							const { source, destination } = result;
							if (!destination) return;
							const fromListId = Number(source.droppableId);
							const toListId = Number(destination.droppableId);
							if (fromListId === toListId && source.index === destination.index) return;
							const movedTask = tasks[fromListId][source.index];

							await updateTask(fromListId, movedTask.id, { ...movedTask, list_id: toListId });

							// Immediately fetch tasks for both lists to update state
							await fetchTasksForList(fromListId);
							await fetchTasksForList(toListId);
						}}
					>
						<div className="flex flex-nowrap h-full">
							{lists.map(list => (
								<ListColumn
									key={list.id}
									list={list}
									tasks={tasks[list.id] || []}
									onAddTaskModalOpen={handleAddTaskModalOpen}
									onEditTask={(listId, task) => {
										setEditTask({ listId, task });
										setTaskForm({
											name: task.name,
											description: task.description,
											deadline: task.deadline || ''
										});
									}}
									onDeleteTask={handleDeleteTask}
									onCompleteTask={handleCompleteTask}
									onMarkIncompleteTask={handleMarkIncompleteTask}
									selectedTasks={selectedTasks}
									setSelectedTasks={setSelectedTasks}
									listDropdownOpen={listDropdownOpen}
									setListDropdownOpen={setListDropdownOpen}
									dropdownRefs={dropdownRefs}
									setDeleteListId={setDeleteListId}
									handleMoveSelectedTasks={handleMoveSelectedTasks}
									handleDeleteSelectedTasks={handleDeleteSelectedTasks}
									lists={lists}
								/>
							))}
						</div>
					</DragDropContext>
				</div>
			</div>
			
			{isAddListModalOpen && (
				<Modal
					title="Add New List"
					onClose={() => setAddListModalOpen(false)}
					onSave={handleAddList}
				>
					<div className='form-horizontal'>
						<div className='w-full'>
							<label className='block text-sm font-medium mb-1 form-label'>
								List Name
								<span className="ml-1 text-red-500">*</span>
							</label>
							<div className='form-controls'>
								<input
									className="border rounded p-2 w-full"
									type="text"
									value={newListName}
									onChange={e => setNewListName(e.target.value)}
									autoFocus
								/>
							</div>
						</div>
					</div>
				</Modal>
			)}

			{addTaskForList && (
				<Modal
					title="Add New Task"
					onClose={() => { setAddTaskForList(null); setTaskFormError(""); }}
					onSave={handleAddTask}
				>
					<AddTaskForm taskForm={taskForm} setTaskForm={setTaskForm} error={taskFormError} />
				</Modal>
			)}

			{editTask && (
				<Modal
					title="Edit Task"
					onClose={() => { setEditTask(null); setTaskFormError(""); }}
					onSave={() => handleEditTask(editTask.listId, editTask.task.id, taskForm)}
				>
					<AddTaskForm taskForm={taskForm} setTaskForm={setTaskForm} error={taskFormError} />
				</Modal>
			)}

			{deleteListId && (
				<Modal
					title="Delete List"
					onClose={() => setDeleteListId(null)}
					onSave={async () => {
						await handleDeleteList(deleteListId);
						setDeleteListId(null);
					}}
				>
					<p>
						Are you sure you want to <span className="font-semibold text-red-600">delete this list</span> and all its tasks? This action cannot be undone.
					</p>
				</Modal>
			)}

		</>
	);
};

export default BoardPage;
