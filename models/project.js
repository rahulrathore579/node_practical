const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const DATA_FILE = path.join(__dirname, '../data/projects.json');

const Project = {
  init() {
    if (!fs.existsSync(DATA_FILE)) {
      fs.writeFileSync(DATA_FILE, JSON.stringify([], null, 2));
    }
  },

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

  getAll() {
    this.init();
    if (!fs.existsSync(DATA_FILE)) {
      return [];
    }
    return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
  },

  findById(id) {
    return this.getAll().find(p => p.id === id);
  },

  update(id, projectData) {
    this.init();
    const projects = this.getAll();
    const index = projects.findIndex(p => p.id === id);

    if (index === -1) {
      return { success: false };
    }

    const existingProject = projects[index];

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

  delete(id) {
    this.init();
    const projects = this.getAll();
    const filteredProjects = projects.filter(p => p.id !== id);

    if (filteredProjects.length === projects.length) {
      return { success: false };
    }

    fs.writeFileSync(DATA_FILE, JSON.stringify(filteredProjects, null, 2));
    
    return { success: true };
  }
};

module.exports = Project;
