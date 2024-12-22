const express = require('express');
const router = express.Router();
const Project = require('../models/Project');

// Get all projects
router.get('/', async (req, res) => {
  try {
    const projects = await Project.find().sort({ createdAt: -1 });
    console.log('Fetched projects:', projects);
    res.json(projects);
  } catch (error) {
    console.error('Error getting projects:', error);
    res.status(500).json({ message: error.message });
  }
});

// Create a new project
router.post('/', async (req, res) => {
  try {
    const { name } = req.body;
    
    // Check if project with same name exists
    const existingProject = await Project.findOne({ name });
    if (existingProject) {
      return res.status(400).json({ message: 'A project with this name already exists' });
    }

    // Create a new project with empty arrays for items
    const project = new Project({
      name,
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
    });

    const savedProject = await project.save();
    console.log('Created new project:', savedProject);
    res.status(201).json(savedProject);
  } catch (error) {
    console.error('Error creating project:', error);
    res.status(500).json({ message: error.message });
  }
});

// Add a task to a project
router.post('/:projectId/tasks', async (req, res) => {
  try {
    console.log('Adding task to project:', req.params.projectId);
    console.log('Task data:', req.body);

    const project = await Project.findById(req.params.projectId);
    if (!project) {
      console.log('Project not found:', req.params.projectId);
      return res.status(404).json({ message: 'Project not found' });
    }

    const { title, startDate, deadline, status } = req.body;
    
    // Create and add the task using the model method
    const task = project.addTask(status, {
      title,
      startDate,
      deadline,
      status
    });

    // Save the project after adding the task
    await project.save();

    console.log('Added new task:', task);
    res.json(project);
  } catch (error) {
    console.error('Error adding task:', error);
    res.status(400).json({ message: error.message });
  }
});

// Update project columns (for drag and drop)
router.put('/:projectId/columns', async (req, res) => {
  try {
    console.log('Updating columns for project:', req.params.projectId);
    console.log('New columns data:', req.body.columns);

    const project = await Project.findById(req.params.projectId);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    project.columns = req.body.columns;
    project.markModified('columns');
    
    const updatedProject = await project.save();
    console.log('Updated project columns:', updatedProject);
    res.json(updatedProject);
  } catch (error) {
    console.error('Error updating columns:', error);
    res.status(400).json({ message: error.message });
  }
});

// Update a task in a project
router.put('/:projectId/tasks/:taskId', async (req, res) => {
  try {
    console.log('Updating task with data:', {
      projectId: req.params.projectId,
      taskId: req.params.taskId,
      body: req.body
    });

    const project = await Project.findById(req.params.projectId);
    if (!project) {
      console.error('Project not found:', req.params.projectId);
      return res.status(404).json({ message: 'Project not found' });
    }

    try {
      // Update the task using the model method
      const updatedTask = project.updateTask(req.params.taskId, {
        title: req.body.title,
        startDate: req.body.startDate,
        deadline: req.body.deadline,
        status: req.body.status
      });

      // Mark columns as modified to ensure MongoDB updates them
      project.markModified('columns');
      
      // Save the project
      await project.save();
      console.log('Project saved successfully');

      // Send the response
      res.json(project);
    } catch (error) {
      console.error('Error in task update:', error);
      res.status(400).json({ message: error.message });
    }
  } catch (error) {
    console.error('Error updating task:', error);
    res.status(500).json({ message: 'Server error while updating task' });
  }
});

// Delete a project
router.delete('/:projectId', async (req, res) => {
  try {
    console.log('Deleting project:', req.params.projectId);
    const project = await Project.findByIdAndDelete(req.params.projectId);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    console.log('Project deleted successfully');
    res.json({ message: 'Project deleted successfully' });
  } catch (error) {
    console.error('Error deleting project:', error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
