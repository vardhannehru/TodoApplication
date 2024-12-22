# Task Board Application

A Kanban-style task management application built with the MERN stack (MongoDB, Express.js, React, Node.js). The application allows users to manage tasks across different status columns with a drag-and-drop interface.

## Core Features

- **Task Management**
  - Create tasks with title and description
  - Drag and drop tasks between status columns
  - Edit existing tasks
  - Delete tasks when completed

- **Project Organization**
  - Create multiple projects
  - Switch between different projects
  - Each project has its own task board

- **Status Columns**
  - To Do: Tasks that need to be started
  - In Progress: Tasks currently being worked on
  - Review: Tasks ready for review
  - Completed: Finished tasks

## Technology Stack

### Frontend
- React 18
- react-beautiful-dnd for drag-and-drop functionality
- Material-UI components and icons
- Axios for API communication
- CSS for custom styling

### Backend
- Node.js with Express
- MongoDB for data storage
- Mongoose for data modeling
- Morgan for request logging
- CORS enabled for frontend communication

## Project Setup

### Prerequisites
- Node.js
- MongoDB running locally on port 27017

### Installation Steps

1. Clone the repository
```bash
git clone https://github.com/vardhannehru/TodoApplication.git
cd TodoApplication
```

2. Install dependencies
```bash
# Install frontend dependencies
npm install

# Install backend dependencies
cd backend
npm install
```

3. Start MongoDB
Make sure MongoDB is running on your system (default port: 27017)

4. Start the application

In the backend directory:
```bash
npm start
```

In a new terminal, in the project root:
```bash
npm start
```

The application will be available at [http://localhost:3000](http://localhost:3000)

## Project Structure

```
task-board/
├── backend/
│   ├── models/          # MongoDB schemas
│   ├── routes/          # API endpoints
│   ├── server.js        # Express server configuration
│   └── db.js           # Database connection
├── src/
│   ├── components/      # React components
│   │   ├── AddTaskModal.js
│   │   ├── EditTaskModal.js
│   │   ├── Column.js
│   │   └── TaskCard.js
│   ├── App.js          # Main application logic
│   ├── App.css         # Main styles
│   └── styles.css      # Additional styles
└── public/             # Static assets
```

## Available API Routes

- `GET /api/projects` - Fetch all projects
- `POST /api/projects` - Create a new project
- `GET /api/projects/:id` - Get a specific project
- `PUT /api/projects/:id` - Update project tasks/columns
- `DELETE /api/projects/:id` - Delete a project

## Local Development

The application uses:
- Frontend: Port 3000 (React development server)
- Backend: Port 5000 (Express server)
- Database: Port 27017 (MongoDB)

## Known Limitations

- No user authentication system
- Local MongoDB instance required
- Single board view only
- No task filtering or search functionality

## Browser Support

Tested and working on:
- Google Chrome
- Mozilla Firefox
- Microsoft Edge
