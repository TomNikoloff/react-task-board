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
- **Responsive UI** (works on desktop and mobile)

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

