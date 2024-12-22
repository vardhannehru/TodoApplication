import React, { useState, useEffect } from 'react';
import { DragDropContext } from 'react-beautiful-dnd';
import axios from 'axios';
import Column from './components/Column';
import AddTaskModal from './components/AddTaskModal';
import EditTaskModal from './components/EditTaskModal';
import './App.css';

function App() {
  const [projects, setProjects] = useState({});
  const [activeProject, setActiveProject] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeColumn, setActiveColumn] = useState(null);
  const [projectName, setProjectName] = useState('');
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/projects');
      console.log('Fetched projects:', response.data);
      
      const projectsData = {};
      response.data.forEach(project => {
        projectsData[project._id] = {
          ...project,
          columns: {
            todo: {
              id: 'todo',
              title: 'To Do',
              statusClass: 'status-todo',
              items: project.columns?.todo?.items || []
            },
            progress: {
              id: 'progress',
              title: 'In Progress',
              statusClass: 'status-progress',
              items: project.columns?.progress?.items || []
            },
            review: {
              id: 'review',
              title: 'Review',
              statusClass: 'status-review',
              items: project.columns?.review?.items || []
            },
            completed: {
              id: 'completed',
              title: 'Completed',
              statusClass: 'status-completed',
              items: project.columns?.completed?.items || []
            }
          }
        };
      });
      
      console.log('Processed projects:', projectsData);
      setProjects(projectsData);
      if (response.data.length > 0 && !activeProject) {
        setActiveProject(response.data[0]._id);
      }
    } catch (error) {
      console.error('Error fetching projects:', error);
    }
  };

  const handleAddTask = async (columnId, task) => {
    if (!activeProject) return;

    try {
      console.log('Adding task:', { columnId, task });
      const response = await axios.post(`http://localhost:5000/api/projects/${activeProject}/tasks`, {
        title: task.title,
        startDate: task.startDate,
        deadline: task.deadline,
        status: columnId
      });
      
      console.log('Server response:', response.data);

      const updatedProject = {
        ...response.data,
        columns: {
          todo: {
            id: 'todo',
            title: 'To Do',
            statusClass: 'status-todo',
            items: response.data.columns?.todo?.items || []
          },
          progress: {
            id: 'progress',
            title: 'In Progress',
            statusClass: 'status-progress',
            items: response.data.columns?.progress?.items || []
          },
          review: {
            id: 'review',
            title: 'Review',
            statusClass: 'status-review',
            items: response.data.columns?.review?.items || []
          },
          completed: {
            id: 'completed',
            title: 'Completed',
            statusClass: 'status-completed',
            items: response.data.columns?.completed?.items || []
          }
        }
      };

      setProjects(prev => ({
        ...prev,
        [activeProject]: updatedProject
      }));
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };

  const handleEditTask = async (updatedTask) => {
    if (!activeProject) {
      console.error('No active project selected');
      return;
    }
    
    try {
      console.log('Updating task:', {
        projectId: activeProject,
        taskId: updatedTask.id,
        data: updatedTask
      });

      const taskData = {
        title: updatedTask.title,
        startDate: updatedTask.startDate,
        deadline: updatedTask.deadline,
        status: updatedTask.status
      };
      
      const response = await axios.put(
        `http://localhost:5000/api/projects/${activeProject}/tasks/${updatedTask.id}`,
        taskData
      );

      console.log('Server response:', response.data);

      if (response.data) {
        // Process the updated project data
        const updatedProject = {
          ...response.data,
          columns: {
            todo: {
              id: 'todo',
              title: 'To Do',
              statusClass: 'status-todo',
              items: response.data.columns?.todo?.items || []
            },
            progress: {
              id: 'progress',
              title: 'In Progress',
              statusClass: 'status-progress',
              items: response.data.columns?.progress?.items || []
            },
            review: {
              id: 'review',
              title: 'Review',
              statusClass: 'status-review',
              items: response.data.columns?.review?.items || []
            },
            completed: {
              id: 'completed',
              title: 'Completed',
              statusClass: 'status-completed',
              items: response.data.columns?.completed?.items || []
            }
          }
        };

        console.log('Processed project data:', updatedProject);

        // Update the projects state
        setProjects(prev => {
          const newState = {
            ...prev,
            [activeProject]: updatedProject
          };
          console.log('New projects state:', newState);
          return newState;
        });

        // Close the modal and clear selected task
        setIsEditModalOpen(false);
        setSelectedTask(null);
      } else {
        throw new Error('Invalid server response');
      }
    } catch (error) {
      console.error('Error updating task:', error);
      alert('Failed to update task. Please try again.');
    }
  };

  const handleTaskClick = (task) => {
    console.log('Task clicked:', task);
    setSelectedTask(task);
    setIsEditModalOpen(true);
  };

  const handleCreateProject = async (e) => {
    e.preventDefault();
    if (!projectName.trim()) {
      alert('Please enter a project name');
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/api/projects', {
        name: projectName
      });

      const newProject = {
        ...response.data,
        columns: {
          todo: {
            id: 'todo',
            title: 'To Do',
            statusClass: 'status-todo',
            items: []
          },
          progress: {
            id: 'progress',
            title: 'In Progress',
            statusClass: 'status-progress',
            items: []
          },
          review: {
            id: 'review',
            title: 'Review',
            statusClass: 'status-review',
            items: []
          },
          completed: {
            id: 'completed',
            title: 'Completed',
            statusClass: 'status-completed',
            items: []
          }
        }
      };

      setProjects(prev => ({
        ...prev,
        [response.data._id]: newProject
      }));

      // Set the new project as active
      setActiveProject(response.data._id);
      
      // Clear the input and close modal
      setProjectName('');
      setShowProjectModal(false);
    } catch (error) {
      console.error('Error creating project:', error);
      if (error.response?.data?.message) {
        alert(error.response.data.message);
      } else {
        alert('Failed to create project. Please try again.');
      }
    }
  };

  const handleOpenModal = (columnId) => {
    setActiveColumn(columnId);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setActiveColumn(null);
  };

  const onDragEnd = async (result) => {
    if (!result.destination || !activeProject) return;

    const { source, destination } = result;
    const currentProject = projects[activeProject];
    const currentColumns = { ...currentProject.columns };
    
    if (source.droppableId === destination.droppableId) {
      const column = currentColumns[source.droppableId];
      const items = Array.from(column.items);
      const [removed] = items.splice(source.index, 1);
      items.splice(destination.index, 0, removed);

      currentColumns[source.droppableId] = {
        ...column,
        items,
      };
    } else {
      const sourceColumn = currentColumns[source.droppableId];
      const destColumn = currentColumns[destination.droppableId];
      const sourceItems = Array.from(sourceColumn.items);
      const destItems = Array.from(destColumn.items);
      const [removed] = sourceItems.splice(source.index, 1);
      
      // Update the task's status to match the new column
      removed.status = destination.droppableId;
      
      destItems.splice(destination.index, 0, removed);

      currentColumns[source.droppableId] = {
        ...sourceColumn,
        items: sourceItems,
      };
      currentColumns[destination.droppableId] = {
        ...destColumn,
        items: destItems,
      };
    }

    try {
      const response = await axios.put(`http://localhost:5000/api/projects/${activeProject}/columns`, {
        columns: currentColumns
      });
      
      setProjects(prev => ({
        ...prev,
        [activeProject]: {
          ...prev[activeProject],
          columns: currentColumns
        }
      }));
    } catch (error) {
      console.error('Error updating columns:', error);
    }
  };

  const currentProject = activeProject ? projects[activeProject] : null;

  return (
    <div className="app">
      <div className="sidebar">
        <div className="task-boards-header">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
          </svg>
          <span className="task-boards-title">Task boards</span>
        </div>
        
        <ul className="project-list">
          {Object.values(projects).map(project => (
            <li
              key={project._id}
              className={`project-item ${project._id === activeProject ? 'active' : ''}`}
              onClick={() => setActiveProject(project._id)}
            >
              {project.name}
            </li>
          ))}
        </ul>
        
        <button className="add-new-project" onClick={() => setShowProjectModal(true)}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          Add new Project
        </button>
      </div>

      <div className="main-content">
        {currentProject && (
          <>
            <div className="project-header">
              <h1 className="project-title">{currentProject.name}</h1>
            </div>

            <DragDropContext onDragEnd={onDragEnd}>
              <div className="board">
                {Object.entries(currentProject.columns).map(([columnId, column]) => (
                  <Column
                    key={columnId}
                    column={column}
                    tasks={column.items}
                    onAddTask={() => handleOpenModal(columnId)}
                    onTaskClick={handleTaskClick}
                  />
                ))}
              </div>
            </DragDropContext>
          </>
        )}

        {showProjectModal && (
          <div className="modal-overlay">
            <div className="modal-content">
              <h2>Create New Project</h2>
              <form onSubmit={handleCreateProject}>
                <div className="form-group">
                  <label>Project Name</label>
                  <input
                    type="text"
                    value={projectName}
                    onChange={(e) => setProjectName(e.target.value)}
                    required
                  />
                </div>
                <div className="modal-actions">
                  <button type="button" onClick={() => setShowProjectModal(false)}>
                    Cancel
                  </button>
                  <button type="submit">Create Project</button>
                </div>
              </form>
            </div>
          </div>
        )}

        <AddTaskModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onAddTask={handleAddTask}
          activeColumn={activeColumn}
        />
        
        <EditTaskModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          onEditTask={handleEditTask}
          task={selectedTask}
        />
      </div>
    </div>
  );
}

export default App;
