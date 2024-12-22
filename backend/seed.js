const mongoose = require('mongoose');
const Project = require('./models/Project');
require('dotenv').config();

const sampleProjects = [
  {
    name: 'Website Redesign',
    columns: {
      'column-1': {
        id: 'column-1',
        title: 'To Do',
        statusClass: 'status-todo',
        items: [
          {
            id: '1',
            name: 'Design Homepage',
            startDate: '22/12/2024',
            deadline: '25/12/2024'
          },
          {
            id: '2',
            name: 'Create Wireframes',
            startDate: '23/12/2024',
            deadline: '26/12/2024'
          }
        ]
      },
      'column-2': {
        id: 'column-2',
        title: 'In Progress',
        statusClass: 'status-progress',
        items: [
          {
            id: '3',
            name: 'Setup Development Environment',
            startDate: '21/12/2024',
            deadline: '22/12/2024'
          }
        ]
      },
      'column-3': {
        id: 'column-3',
        title: 'In Review',
        statusClass: 'status-review',
        items: []
      },
      'column-4': {
        id: 'column-4',
        title: 'Completed',
        statusClass: 'status-completed',
        items: []
      }
    }
  },
  {
    name: 'Mobile App Development',
    columns: {
      'column-1': {
        id: 'column-1',
        title: 'To Do',
        statusClass: 'status-todo',
        items: [
          {
            id: '4',
            name: 'User Authentication',
            startDate: '23/12/2024',
            deadline: '27/12/2024'
          }
        ]
      },
      'column-2': {
        id: 'column-2',
        title: 'In Progress',
        statusClass: 'status-progress',
        items: []
      },
      'column-3': {
        id: 'column-3',
        title: 'In Review',
        statusClass: 'status-review',
        items: []
      },
      'column-4': {
        id: 'column-4',
        title: 'Completed',
        statusClass: 'status-completed',
        items: [
          {
            id: '5',
            name: 'Project Setup',
            startDate: '21/12/2024',
            deadline: '21/12/2024'
          }
        ]
      }
    }
  }
];

async function seedDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await Project.deleteMany({});
    console.log('Cleared existing projects');

    // Insert sample projects
    await Project.insertMany(sampleProjects);
    console.log('Sample projects inserted successfully');

    console.log('Database seeded successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();
