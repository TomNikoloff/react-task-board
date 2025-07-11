// src/api/lists.js
export async function fetchLists() {
	const res = await fetch('http://localhost:4000/lists');
	return res.json();
}

export async function addList(name) {
	const res = await fetch('http://localhost:4000/lists', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ name })
	});
	return res.json();
}

export async function deleteList(id) {
	await fetch(`http://localhost:4000/lists/${id}`, { method: 'DELETE' });
}
