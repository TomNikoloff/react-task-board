// src/components/AddTaskForm.jsx

const AddTaskForm = ({ taskForm, setTaskForm, error }) => (
	<div className='form-horizontal'>
		<div className='w-full'>
			<label className='block text-sm font-medium mb-1 form-label'>
				Task Name
				<span className="ml-1 text-red-500">*</span>
			</label>
			<div className='form-controls'>
				{error && (
					<div className="text-xs text-red-600 mt-1">
						* Task name is required.
					</div>
				)}
				<input
					className={`border rounded p-2 w-full mb-2 ${error ? 'border-red-500' : ''}`}
					type="text"
					value={taskForm.name}
					onChange={e => setTaskForm(f => ({ ...f, name: e.target.value }))}
					autoFocus
				/>
			</div>
		</div>
		{/* ...description and deadline fields stay the same... */}
		<div className='w-full'>
			<label className='block text-sm font-medium mb-1 form-label'>
				Description
			</label>
			<div className='form-controls'>
				<textarea
					className="border rounded p-2 w-full mb-2"
					rows={3}
					value={taskForm.description}
					onChange={e => setTaskForm(f => ({ ...f, description: e.target.value }))}
				/>
			</div>
		</div>
		<div className='w-full'>
			<label className='block text-sm font-medium mb-1 form-label'>
				Deadline
			</label>
			<div className='form-controls'>
				<input
					className="border rounded p-2 w-full mb-2"
					type="date"
					value={taskForm.deadline}
					onChange={e => setTaskForm(f => ({ ...f, deadline: e.target.value }))}
				/>
			</div>
		</div>
	</div>
);

export default AddTaskForm;
