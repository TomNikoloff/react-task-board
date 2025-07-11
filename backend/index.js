const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const db = new sqlite3.Database('./db.sqlite');

// ---- Setup tables if they dont exist ----
db.serialize(() => {
	db.run(`CREATE TABLE IF NOT EXISTS lists (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		name TEXT NOT NULL
	)`);

	db.run(`CREATE TABLE IF NOT EXISTS tasks (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		list_id INTEGER,
		name TEXT,
		description TEXT,
		deadline TEXT,
		completed INTEGER DEFAULT 0,
		overdue_notified INTEGER DEFAULT 0,
		FOREIGN KEY(list_id) REFERENCES lists(id)
	)`);
});

// ---- LIST ENDPOINTS ----

// Get all lists
app.get('/lists', (req, res) => {
	db.all('SELECT * FROM lists', (err, rows) => {
		if (err) return res.status(500).json({ error: err.message });
		res.json(rows);
	});
});

// Create a list
app.post('/lists', (req, res) => {
	const { name } = req.body;
	if (!name) return res.status(400).json({ error: "Name is required" });
	db.run('INSERT INTO lists (name) VALUES (?)', [name], function(err) {
		if (err) return res.status(500).json({ error: err.message });
		res.json({ id: this.lastID, name });
	});
});

// Delete a list (and its tasks)
app.delete('/lists/:id', (req, res) => {
	const id = req.params.id;
	db.run('DELETE FROM tasks WHERE list_id = ?', [id], function() {
		db.run('DELETE FROM lists WHERE id = ?', [id], function(err) {
			if (err) return res.status(500).json({ error: err.message });
			res.json({ success: true });
		});
	});
});

// ---- TASK ENDPOINTS ----

// Get tasks for a list
app.get('/tasks', (req, res) => {
	const list_id = req.query.list_id;
	db.all('SELECT * FROM tasks WHERE list_id = ?', [list_id], (err, rows) => {
		if (err) return res.status(500).json({ error: err.message });
		res.json(rows);
	});
});

// Create a task
app.post('/tasks', (req, res) => {
	const { list_id, name, description, deadline } = req.body;
	if (!list_id || !name) return res.status(400).json({ error: "List and name required" });
	db.run(
		'INSERT INTO tasks (list_id, name, description, deadline) VALUES (?, ?, ?, ?)',
		[list_id, name, description, deadline],
		function(err) {
			if (err) return res.status(500).json({ error: err.message });
			res.json({ id: this.lastID, list_id, name, description, deadline, completed: 0 });
		}
	);
});

// Edit a task (including moving to new list and mark complete)
app.put('/tasks/:id', (req, res) => {
	const id = req.params.id;
	const { name, description, deadline, completed, list_id } = req.body;
	db.run(
		'UPDATE tasks SET name = ?, description = ?, deadline = ?, completed = ?, list_id = ? WHERE id = ?',
		[name, description, deadline, completed ? 1 : 0, list_id, id],
		function(err) {
			if (err) return res.status(500).json({ error: err.message });
			// Mock "email" if marking as completed
			if (completed) {
				console.log(`Email: Task "${name}" (ID: ${id}) marked as completed at ${new Date().toISOString()}`);
			}
			res.json({ success: true });
		}
	);
});

// Delete a task
app.delete('/tasks/:id', (req, res) => {
	const id = req.params.id;
	db.run('DELETE FROM tasks WHERE id = ?', [id], function(err) {
		if (err) return res.status(500).json({ error: err.message });
		res.json({ success: true });
	});
});

// ---- OVERDUE TASK CHECKER ----
// Check every minute for overdue, incomplete tasks and log "emails"
setInterval(() => {
	db.all(
		'SELECT * FROM tasks WHERE completed = 0 AND deadline IS NOT NULL AND datetime(deadline) < datetime("now") AND overdue_notified = 0',
		(err, rows) => {
			if (!err && rows.length) {
				rows.forEach(task => {
					console.log(`Email: Task "${task.name}" (ID: ${task.id}) is overdue as of ${task.deadline}`);
					db.run('UPDATE tasks SET overdue_notified = 1 WHERE id = ?', [task.id]);
				});
			}
		}
	);
}, 60 * 1000);


app.listen(4000, () => {
	console.log('Server listening on port 4000');
});
