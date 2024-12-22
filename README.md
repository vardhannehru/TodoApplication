# Task Board Application

A full-stack task management application built with React and Node.js that allows users to organize and track projects and tasks across different stages. The application features a modern, intuitive interface with drag-and-drop functionality for easy task management.

## Features

- **Project Management**
  - Create and manage multiple projects
  - View all tasks organized by project
  - Add and edit project details

- **Task Management**
  - Create, edit, and delete tasks
  - Drag and drop tasks between status columns
  - Set task priorities and due dates
  - Add detailed descriptions to tasks

- **Status Tracking**
  - Four status columns: To Do, In Progress, In Review, and Completed
  - Visual representation of task progress
  - Easy status updates through drag-and-drop

- **Modern UI/UX**
  - Material-UI components for a clean, professional look
  - Responsive design that works on all devices
  - Intuitive drag-and-drop interface
  - Modal forms for task and project management

## Tech Stack

### Frontend
- React.js
- Material-UI (@mui/material, @mui/icons-material)
- React Beautiful DND for drag-and-drop functionality
- Axios for API requests
- React DatePicker for date selection
- Emotion for styled components

### Backend
- Node.js
- Express.js
- MongoDB for database
- Mongoose for database modeling

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB installed and running locally
- Git

### Installation

1. Clone the repository
```bash
git clone https://github.com/vardhannehru/TodoApplication.git
cd TodoApplication
```

2. Install frontend dependencies
```bash
npm install
```

3. Install backend dependencies
```bash
cd backend
npm install
```

4. Set up environment variables
Create a `.env` file in the backend directory with:
```
MONGODB_URI=your_mongodb_connection_string
PORT=5000
```

### Running the Application

1. Start the backend server
```bash
cd backend
npm start
```

2. In a new terminal, start the frontend
```bash
cd ..  # Go back to root directory
npm start
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
task-board/
├── backend/
│   ├── models/          # Database models
│   ├── routes/          # API routes
│   ├── db.js           # Database connection
│   └── server.js       # Express server setup
├── src/
│   ├── components/     # React components
│   ├── App.js         # Main application component
│   └── styles.css     # Global styles
└── public/            # Static files
```

## API Endpoints

- `GET /api/projects` - Get all projects
- `POST /api/projects` - Create a new project
- `PUT /api/projects/:id` - Update a project
- `DELETE /api/projects/:id` - Delete a project
- `GET /api/projects/:id/tasks` - Get tasks for a project
- `POST /api/projects/:id/tasks` - Add a task to a project
- `PUT /api/tasks/:id` - Update a task
- `DELETE /api/tasks/:id` - Delete a task

## Contributing

Feel free to submit issues and enhancement requests!
