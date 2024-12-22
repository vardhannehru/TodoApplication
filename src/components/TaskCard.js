import React from 'react';
import './TaskCard.css';

const TaskCard = ({ task, onEditTask }) => {
  if (!task) return null;

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const handleClick = (e) => {
    e.stopPropagation(); // Prevent click from triggering drag
    if (onEditTask) {
      onEditTask(task);
    }
  };

  return (
    <div className="task-card" onClick={handleClick}>
      <h3 className="task-title">{task.title}</h3>
      <div className="task-dates">
        <div className="date-group">
          <span className="date-label">Start date</span>
          <span className="date-value">{formatDate(task.startDate)}</span>
        </div>
        <div className="date-group">
          <span className="date-label">Deadline</span>
          <span className="date-value">{formatDate(task.deadline)}</span>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
