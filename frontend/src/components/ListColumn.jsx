// src/components/ListColumn.jsx

import { Droppable, Draggable } from '@hello-pangea/dnd';
import TaskCard from './TaskCard';

const ListColumn = ({
	list,
	tasks = [],
	onAddTaskModalOpen,
	onEditTask,
	onDeleteTask,
	setDeleteListId,
	onCompleteTask,
	onMarkIncompleteTask,
	selectedTasks,
	setSelectedTasks,
	handleMoveSelectedTasks,
	handleDeleteSelectedTasks,
	lists
}) => {
	const listId = list.id;

	return (
		<Droppable droppableId={String(listId)} key={listId}>
			{provided => (
				<div
					ref={provided.innerRef}
					{...provided.droppableProps}
					className="px-2 min-w-[250px] max-w-[400px] w-full"
				>
					<div className="bg-gray-100 rounded-xl shadow-xl py-2 px-2 min-w-[250px] max-w-[400px] w-full flex flex-col">
						<div className="mb-2">
							<div className="flex justify-between items-center p-2">
								<h2 className="font-semibold text-xl pl-2">{list.name}</h2>
								<div className='relative flex items-center gap-2'>

									<button
										className="text-red-500 hover:text-red-400 text-lg cursor-pointer"
										onClick={() => setDeleteListId(listId)}
										title="Delete"
									>
										<i className="bi bi-x text-4xl" />
									</button>
								</div>
							</div>
							{(selectedTasks[listId]?.length > 0) && (
								<div className="flex items-center justify-between border-b border-blue-500 rounded-t px-2 py-1 mb-2">
									<span className="text-sm font-medium text-blue-500">
										{selectedTasks[listId].length} selected
									</span>
									<div className="flex gap-2">
										<button
											className="flex items-center gap-1 px-2 py-1 rounded hover:bg-red-100 text-red-500"
											onClick={() => handleDeleteSelectedTasks(listId)}
											title="Delete selected"
										>
											<i className="bi bi-trash" />
											Delete
										</button>
										{lists.length > 1 && (
											<select
												className="px-2 py-1 rounded border"
												defaultValue=""
												onChange={e => {
												const destinationId = e.target.value;
													if (destinationId) {
														handleMoveSelectedTasks(listId, Number(destinationId));
													}
												}}
											>
												<option value="">Move to…</option>
												{lists
													.filter(l => l.id !== listId)
													.map(l => (
														<option key={l.id} value={l.id}>{l.name}</option>
												))}
											</select>
										)}
									</div>
								</div>
							)}
						</div>
						<div className="flex flex-col gap-2">
							{tasks.map((task, idx) => (
								<Draggable key={task.id} draggableId={String(task.id)} index={idx}>
									{provided => (
										<div
											ref={provided.innerRef}
											{...provided.draggableProps}
											{...provided.dragHandleProps}
										>
											<TaskCard
												task={task}
												onEdit={() => onEditTask(listId, task)}
												onDelete={() => onDeleteTask(listId, task.id)}
												onComplete={() => onCompleteTask(listId, task.id)}
												onMarkIncomplete={() => onMarkIncompleteTask(list.id, task.id)}
												selected={selectedTasks[listId]?.includes(task.id) || false}
												onSelect={checked => {
													setSelectedTasks(prev => {
														const prevSelected = prev[listId] || [];
														return {
															...prev,
															[listId]: checked
																? [...prevSelected, task.id]
																: prevSelected.filter(id => id !== task.id)
														};
													});
												}}
											/>
										</div>
									)}
								</Draggable>
							))}
							{provided.placeholder}
						</div>
						<div className='flex items-center gap-2 w-full mt-2'>
							<button
								type="button"
								className="flex items-center gap-2 font-medium hover:bg-gray-300 w-100 p-2 rounded-xl text-lg cursor-pointer"
								onClick={() => onAddTaskModalOpen(listId)}
							>
								<i className="text-3xl bi bi-plus"></i>
								<span className="mt-0.5">Add a task</span>
							</button>
						</div>
					</div>
				</div>
			)}
		</Droppable>
	);
};

export default ListColumn;
