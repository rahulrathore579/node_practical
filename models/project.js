const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const DATA_FILE = path.join(__dirname, '../data/projects.json');

const Project = {
  // Initialize data file if it doesn't exist
  init() {
    if (!fs.existsSync(DATA_FILE)) {
      fs.writeFileSync(DATA_FILE, JSON.stringify([], null, 2));
    }
  },

  // Create a new project
  create(projectData) {
    this.init();
    const projects = this.getAll();

    const newProject = {
      id: uuidv4(),
      projectName: projectData.projectName,
      description: projectData.description,
      deadline: projectData.deadline,
      status: projectData.status,
      teamMembers: projectData.teamMembers ? projectData.teamMembers.split(',').map(m => m.trim()) : [],
      createdBy: projectData.createdBy,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    projects.push(newProject);
    fs.writeFileSync(DATA_FILE, JSON.stringify(projects, null, 2));
    
    return newProject;
  },

  // Get all projects
  getAll() {
    this.init();
    if (!fs.existsSync(DATA_FILE)) {
      return [];
    }
    return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
  },

  // Get project by ID
  findById(id) {
    return this.getAll().find(p => p.id === id);
  },

  // Update project (except projectName)
  update(id, projectData) {
    this.init();
    const projects = this.getAll();
    const index = projects.findIndex(p => p.id === id);

    if (index === -1) {
      return { success: false, message: 'Project not found' };
    }

    const existingProject = projects[index];

    // Only allow updating specific fields (not projectName)
    projects[index] = {
      ...existingProject,
      description: projectData.description,
      deadline: projectData.deadline,
      status: projectData.status,
      teamMembers: projectData.teamMembers ? projectData.teamMembers.split(',').map(m => m.trim()) : [],
      updatedAt: new Date().toISOString()
    };

    fs.writeFileSync(DATA_FILE, JSON.stringify(projects, null, 2));
    
    return { success: true, project: projects[index] };
  },

  // Delete project
  delete(id) {
    this.init();
    const projects = this.getAll();
    const filteredProjects = projects.filter(p => p.id !== id);

    if (filteredProjects.length === projects.length) {
      return { success: false, message: 'Project not found' };
    }

    fs.writeFileSync(DATA_FILE, JSON.stringify(filteredProjects, null, 2));
    
    return { success: true };
  }
};

module.exports = Project;
