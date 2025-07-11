// src/components/TaskCard.jsx
import { useState, useRef, useEffect } from "react";

const TaskCard = ({
	task,
	onEdit,
	onDelete,
	onComplete,
	onMarkIncomplete,
    selected,
    onSelect
}) => {

	const dropdownRef = useRef(null);

	const isOverdue = task.deadline && !task.completed && new Date(task.deadline) < new Date();

	const [openDropdown, setOpenDropdown] = useState(false);
	const handleDropdownToggle = () => {
        openDropdown ? setOpenDropdown(false) : setOpenDropdown(true);
    };

	// Close the dropdown menu when the user clicks outside of it
	useEffect(() => {
		if (!openDropdown) return;
		const handleClickOutside = (event) => {
			if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
				setOpenDropdown(false);
			}
		};
		document.addEventListener('mousedown', handleClickOutside);
		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, [openDropdown]);

	return (
		<div
			className={`bg-white rounded-xl shadow-md mb-2 p-3 flex flex-col gap-1 group  
				${task.completed ? 'border border-green-400' : ''}
				${isOverdue ? 'border-2 border-red-500' : ''}
			`}
		>
			<div className="flex justify-between items-center">
				<span className={`font-semibold text-base ${task.completed ? 'opacity-60 line-through' : ''}`}>
					{task.name}
				</span>
				<div className="flex gap-4">

                    {/* <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
                        <button
                            className="text-lg"
                            onClick={() => onEdit(task)}
                            title="Edit"
                        >
                            <i className="bi bi-pencil" />
                        </button>
                        <button
                            className="text-red-500 hover:text-red-700 text-lg"
                            onClick={() => onDelete(task)}
                            title="Delete"
                        >
                            <i className="bi bi-trash" />
                        </button>
                        {!task.completed && (
                            <button
                                className="text-green-500 hover:text-green-700 text-lg"
                                onClick={() => onComplete(task)}
                                title="Complete"
                            >
                                <i className="bi bi-check2" />
                            </button>
                        )}
                    </div> */}
                    <input
                        type="checkbox"
                        checked={selected}
                        onChange={e => onSelect(e.target.checked)}
                    />
					<div className="relative">
						<button
							type="button"
							className="mb-0.5 cursor-pointer"
							onClick={() => handleDropdownToggle()}
						>
							<i className="text-2xl bi bi-three-dots"></i>
						</button>
						{openDropdown && (
							<div 
								ref={dropdownRef}
								className="absolute right-0 mt-2 w-50 bg-white border border-gray-200 rounded-xl shadow-lg z-50 animate-fade-in"
							>
								<button
									className="w-full text-left px-4 py-2 hover:bg-indigo-50 text-gray-700 cursor-pointer rounded-t-xl flex gap-2"
									onClick={() => { onEdit(task); setOpenDropdown(false); }}
									title="Edit"
								>
									<i className="bi bi-pencil" />
									Edit Task
								</button>
								<button
									className=" w-full text-left px-4 py-2 hover:bg-indigo-50 cursor-pointer flex gap-2"
									onClick={() => { onDelete(task); setOpenDropdown(false); }}
									title="Delete"
								>
									<i className="bi bi-trash text-red-500 hover:text-red-700" />
									Delete Task
								</button>
								{task.completed ? (
									<button
										className="w-full text-left px-4 py-2 hover:bg-indigo-50 cursor-pointer rounded-b-xl flex gap-2 items-center"
										onClick={() => onMarkIncomplete(task)}
										title="Mark as Incomplete"
									>
										<i className="bi bi-arrow-counterclockwise text-blue-500" />
										<span>Mark as Incomplete</span>
									</button>
								) : (
									<button
										className="w-full text-left px-4 py-2 hover:bg-indigo-50 cursor-pointer rounded-b-xl flex gap-2 items-center"
										onClick={() => onComplete(task)}
										title="Complete"
									>
										<i className="bi bi-check2 text-green-500" />
										<span>Mark as Complete</span>
									</button>
								)}
							</div>
						)}
					</div>
				</div>
			</div>
            {(task.description || task.deadline) ? (
                <hr className="border-gray-200"/>
            ) : ('')}
			{task.description && (
				<div className={`text-sm text-gray-700 ${task.completed ? 'opacity-60 line-through' : ''}`}>
					{task.description}
				</div>
			)}
			{task.deadline && (
				<div className="flex justify-between items-center gap-2 mt-1">
					<span className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full bg-gray-100">
						<i className="bi bi-clock" />
						<span className={isOverdue ? "text-red-500 font-semibold" : "text-gray-500"}>
							Due: {
								// Format YYYY-MM-DD to DD/MM/YYYY
								(() => {
									const [y, m, d] = task.deadline.split('-');
									return `${d}/${m}/${y}`;
								})()
							}
						</span>
					</span>
					{isOverdue && (
						<span className="text-xs text-red-600 font-bold bg-red-50 px-2 py-0.5 rounded-full ml-2">
							Overdue
						</span>
					)}
				</div>
			)}
		</div>
	);
};

export default TaskCard;
