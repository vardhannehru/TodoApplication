import React from 'react';
import { Droppable, Draggable } from 'react-beautiful-dnd';
import TaskCard from './TaskCard';
import './Column.css';

const Column = ({ column, tasks = [], onAddTask, onTaskClick }) => {
  if (!column) return null;

  const handleAddClick = () => {
    if (typeof onAddTask === 'function') {
      onAddTask(column.id);
    }
  };

  return (
    <div className={`column ${column.statusClass}`}>
      <div className="column-header">
        <h2 className="column-title">{column.title}</h2>
      </div>
      
      <Droppable droppableId={column.id}>
        {(provided) => (
          <div
            className="task-list"
            ref={provided.innerRef}
            {...provided.droppableProps}
          >
            {Array.isArray(tasks) && tasks.map((task, index) => (
              task && task.id ? (
                <Draggable
                  key={task.id}
                  draggableId={task.id}
                  index={index}
                >
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                    >
                      <TaskCard 
                        task={task} 
                        onEditTask={onTaskClick}
                      />
                    </div>
                  )}
                </Draggable>
              ) : null
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>

      <button className="add-task-button" onClick={handleAddClick}>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
        </svg>
        Add new
      </button>
    </div>
  );
};

export default Column;
