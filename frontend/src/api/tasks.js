// src/api/tasks.js
export async function fetchTasks(listId) {
	const res = await fetch(`http://localhost:4000/tasks?list_id=${listId}`);
	return res.json();
}

export async function addTask({ list_id, name, description, deadline }) {
	const res = await fetch('http://localhost:4000/tasks', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ list_id, name, description, deadline })
	});
	return res.json();
}

export async function updateTask(id, data) {
	const res = await fetch(`http://localhost:4000/tasks/${id}`, {
		method: 'PUT',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(data)
	});
	return res.json();
}

export async function deleteTask(id) {
	await fetch(`http://localhost:4000/tasks/${id}`, { method: 'DELETE' });
}
