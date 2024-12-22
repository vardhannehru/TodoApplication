import React, { useState, useEffect } from 'react';
import './AddTaskModal.css';

const AddTaskModal = ({ isOpen, onClose, onAddTask, initialStatus = 'todo' }) => {
  const [taskTitle, setTaskTitle] = useState('');
  const [startDate, setStartDate] = useState('');
  const [deadline, setDeadline] = useState('');
  const [status, setStatus] = useState(initialStatus);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isOpen) {
      setStatus(initialStatus);
    }
  }, [isOpen, initialStatus]);

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
    console.log('Form submitted with:', { taskTitle, startDate, deadline, status }); // Debug log
    
    if (validateForm()) {
      const task = {
        title: taskTitle,
        startDate,
        deadline,
        status
      };

      console.log('Calling onAddTask with:', status, task); // Debug log
      onAddTask(status, task);
      
      // Reset form
      setTaskTitle('');
      setStartDate('');
      setDeadline('');
      setStatus(initialStatus);
      setErrors({});
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>Add new task</h2>
          <button type="button" className="close-button" onClick={onClose}>×</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-group">
              <label>Task Title</label>
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
                <label>Start Date</label>
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
            <button type="submit" className="add-button">
              Add Task
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddTaskModal;
