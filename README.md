# React Task Board

A Trello-style Kanban board built with **React** (frontend), **Express** + **SQLite** (backend).

This project was created for a technical coding assessment and demonstrates full-stack web development skills: real-time UI, CRUD operations, drag-and-drop, and backend logic.

---

## Features

- **Create, edit, delete task lists** (columns)
- **Add, edit, delete, complete, and move tasks** (drag-and-drop)
- **Batch select, move, or delete tasks**
- **Tasks** have: name, description, and deadline (required: name)
- **Mark tasks as complete/incomplete**
- **Overdue/completed task "emails"** are mocked to the server console
- **Data persists** in a local SQLite database

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18+ recommended)
- npm

---

### Setup

#### 1. Clone the repository

```bash
git clone https://github.com/TomNikoloff/react-task-board.git
cd react-task-board
```

#### 2. Install dependencies
```bash
cd frontend
npm install
cd ../backend
npm install
```

#### 3.Start the backend server
```bash
cd backend
node index.js
```

#### 4.Start the frontend app
```bash
cd ../frontend
npm run dev
```

### API Endpoints

#### Lists

| Method | Endpoint     | Description                          |
|--------|--------------|--------------------------------------|
| GET    | `/lists`     | Get all lists                        |
| POST   | `/lists`     | Create new list (`{ name }`)         |
| DELETE | `/lists/:id` | Delete a list (and its tasks)        |

#### Tasks

| Method | Endpoint                   | Description                                                         |
|--------|----------------------------|----------------------------------------------------------------     |
| GET    | `/tasks?list_id=ID`        | Get all tasks for a list                                            |
| POST   | `/tasks`                   | Create task (`{ list_id, name, description, deadline }`)            |
| PUT    | `/tasks/:id`               | Update task (`{ name, description, deadline, completed, list_id }`) |
| DELETE | `/tasks/:id`               | Delete a task                                                       |

Note: “Emails” for completed or overdue tasks are logged to the backend console, not actually sent.

---

## Developer Notes

- Make sure the backend is running before starting the frontend!
- All persistent data is stored in backend/db.sqlite (ignored by git).
- The backend runs on port 4000 by default; the frontend is on 5173 (Vite default).
- API docs are included above for quick reference.