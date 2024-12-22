const mongoose = require('mongoose');

// Define task schema without any unique constraints
const taskSchema = new mongoose.Schema({
  id: {
    type: String,
    sparse: true  // This allows multiple null values
  },
  title: String,
  startDate: String,
  deadline: String,
  status: String
}, { _id: false });  // Disable _id for subdocuments

// Define column schema
const columnSchema = new mongoose.Schema({
  id: String,
  title: String,
  statusClass: String,
  items: {
    type: [taskSchema],
    default: [],
  }
}, { _id: false });  // Disable _id for subdocuments

const projectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  columns: {
    todo: {
      type: columnSchema,
      default: () => ({
        id: 'todo',
        title: 'To Do',
        statusClass: 'status-todo',
        items: []
      })
    },
    progress: {
      type: columnSchema,
      default: () => ({
        id: 'progress',
        title: 'In Progress',
        statusClass: 'status-progress',
        items: []
      })
    },
    review: {
      type: columnSchema,
      default: () => ({
        id: 'review',
        title: 'Review',
        statusClass: 'status-review',
        items: []
      })
    },
    completed: {
      type: columnSchema,
      default: () => ({
        id: 'completed',
        title: 'Completed',
        statusClass: 'status-completed',
        items: []
      })
    }
  }
}, { 
  timestamps: true,
  versionKey: false 
});

// Pre-save middleware to ensure items arrays exist
projectSchema.pre('save', function(next) {
  const columns = ['todo', 'progress', 'review', 'completed'];
  columns.forEach(columnId => {
    if (!this.columns[columnId]) {
      this.columns[columnId] = {
        id: columnId,
        title: columnId === 'todo' ? 'To Do' :
               columnId === 'progress' ? 'In Progress' :
               columnId === 'review' ? 'Review' : 'Completed',
        statusClass: `status-${columnId}`,
        items: []
      };
    }
    if (!this.columns[columnId].items) {
      this.columns[columnId].items = [];
    }
  });
  next();
});

// Method to add a task
projectSchema.methods.addTask = function(columnId, taskData) {
  const task = {
    id: Date.now().toString(),
    ...taskData,
    status: columnId
  };

  if (!this.columns[columnId]) {
    this.columns[columnId] = {
      id: columnId,
      title: columnId === 'todo' ? 'To Do' :
             columnId === 'progress' ? 'In Progress' :
             columnId === 'review' ? 'Review' : 'Completed',
      statusClass: `status-${columnId}`,
      items: []
    };
  }

  if (!this.columns[columnId].items) {
    this.columns[columnId].items = [];
  }

  this.columns[columnId].items.push(task);
  return task;
};

// Method to update a task
projectSchema.methods.updateTask = function(taskId, updatedData) {
  let taskFound = false;
  let updatedTask = null;

  // Search for the task in all columns
  const columnIds = ['todo', 'progress', 'review', 'completed'];
  
  for (const columnId of columnIds) {
    const column = this.columns[columnId];
    if (!column || !column.items) continue;

    const taskIndex = column.items.findIndex(task => task.id === taskId);
    if (taskIndex !== -1) {
      taskFound = true;
      // Found the task
      const task = column.items[taskIndex];
      
      // Remove from current column
      column.items.splice(taskIndex, 1);
      
      // Update task data
      updatedTask = {
        ...task,
        ...updatedData,
        id: taskId // Ensure ID remains unchanged
      };
      
      // Get target column based on new status
      const targetColumnId = updatedData.status || columnId;
      
      // Initialize target column if needed
      if (!this.columns[targetColumnId]) {
        this.columns[targetColumnId] = {
          id: targetColumnId,
          title: targetColumnId === 'todo' ? 'To Do' :
                targetColumnId === 'progress' ? 'In Progress' :
                targetColumnId === 'review' ? 'Review' : 'Completed',
          statusClass: `status-${targetColumnId}`,
          items: []
        };
      }
      
      // Add to target column
      if (!this.columns[targetColumnId].items) {
        this.columns[targetColumnId].items = [];
      }
      
      this.columns[targetColumnId].items.push(updatedTask);
      break;
    }
  }

  if (!taskFound) {
    throw new Error('Task not found');
  }

  return updatedTask;
};

// Remove any existing indexes on connection
mongoose.connection.on('open', async () => {
  try {
    await mongoose.connection.collection('projects').dropIndexes();
  } catch (err) {
    console.log('No indexes to drop');
  }
});

const Project = mongoose.model('Project', projectSchema, 'projects');
module.exports = Project;
