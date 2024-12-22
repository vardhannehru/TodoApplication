import React, { useState } from 'react';
import '../styles.css';

function AddProjectModal({ isOpen, onClose, onAdd }) {
  const [projectName, setProjectName] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!projectName.trim()) {
      setError('Please fill this required field');
      return;
    }

    onAdd(projectName.trim());
    setProjectName('');
    setError('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>Add new project</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className={`form-group ${error ? 'error' : ''}`}>
            <label>Project Name</label>
            <input
              type="text"
              placeholder="Enter project name"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
            />
            {error && <div className="error-message">{error}</div>}
          </div>

          <div className="modal-footer">
            <button type="button" className="btn-cancel" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-add">
              Add Project
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddProjectModal;
