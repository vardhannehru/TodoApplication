import React, { useState, useEffect } from 'react';
import './EditTaskModal.css';

const EditTaskModal = ({ isOpen, onClose, onEditTask, task }) => {
  const [taskTitle, setTaskTitle] = useState('');
  const [startDate, setStartDate] = useState('');
  const [deadline, setDeadline] = useState('');
  const [status, setStatus] = useState('');
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (task && isOpen) {
      setTaskTitle(task.title || '');
      setStartDate(task.startDate || '');
      setDeadline(task.deadline || '');
      setStatus(task.status || 'todo');
      setErrors({});
    }
  }, [task, isOpen]);

  const validateForm = () => {
    const newErrors = {};
    
    if (!taskTitle.trim()) {
      newErrors.taskTitle = 'Please fill the task title';
    }
    
    if (!startDate) {
      newErrors.startDate = 'Please fill the start date';
    }
    
    if (!deadline) {
      newErrors.deadline = 'Please fill the deadline date';
    } else if (startDate && new Date(deadline) < new Date(startDate)) {
      newErrors.deadline = 'Deadline cannot be earlier than start date';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      console.log('Submitting task update:', {
        id: task.id,
        title: taskTitle,
        startDate,
        deadline,
        status
      });

      onEditTask({
        id: task.id,
        title: taskTitle,
        startDate,
        deadline,
        status
      });
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>Edit task</h2>
          <button type="button" className="close-button" onClick={onClose}>×</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-group">
              <label>Name of the Task</label>
              <input
                type="text"
                value={taskTitle}
                onChange={(e) => setTaskTitle(e.target.value)}
                placeholder="Enter task title"
              />
              {errors.taskTitle && <div className="error-message">{errors.taskTitle}</div>}
            </div>

            <div className="date-inputs">
              <div className="form-group">
                <label>Start date</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
                {errors.startDate && <div className="error-message">{errors.startDate}</div>}
              </div>

              <div className="form-group">
                <label>Deadline</label>
                <input
                  type="date"
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                  min={startDate}
                />
                {errors.deadline && <div className="error-message">{errors.deadline}</div>}
              </div>
            </div>

            <div className="form-group">
              <label>Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="todo">To Do</option>
                <option value="progress">In Progress</option>
                <option value="review">Review</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="cancel-button" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="save-button">
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditTaskModal;
