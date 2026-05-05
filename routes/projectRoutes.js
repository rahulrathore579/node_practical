const express = require('express');
const { body, validationResult } = require('express-validator');
const Project = require('../models/project');
const { authenticateUser } = require('../middleware/auth');

const router = express.Router();

// GET all projects
router.get('/projects', authenticateUser, (req, res) => {
  const projects = Project.getAll();
  res.render('projects/list', { 
    projects,
    user: req.user
  });
});

// GET new project form
router.get('/project/new', authenticateUser, (req, res) => {
  res.render('projects/form', { 
    project: null,
    user: req.user
  });
});

// POST create new project
router.post('/project',
  authenticateUser,
  [
    body('projectName').trim().notEmpty().withMessage('Project name is required'),
    body('description').trim().notEmpty().withMessage('Description is required'),
    body('deadline').notEmpty().isISO8601().withMessage('Valid deadline date is required'),
    body('status').isIn(['Planning', 'In Progress', 'Completed']).withMessage('Invalid status')
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.render('projects/form', { 
        project: req.body,
        errors: errors.array(),
        user: req.user
      });
    }

    const project = Project.create({
      projectName: req.body.projectName,
      description: req.body.description,
      deadline: req.body.deadline,
      status: req.body.status,
      teamMembers: req.body.teamMembers,
      createdBy: req.user.id
    });

    res.redirect(`/projects/${project.id}`);
  }
);

// GET project details
router.get('/projects/:id', authenticateUser, (req, res) => {
  const project = Project.findById(req.params.id);
  
  if (!project) {
    return res.status(404).send('Project not found');
  }

  res.render('projects/view', { 
    project,
    user: req.user
  });
});

// GET edit project form
router.get('/projects/:id/edit', authenticateUser, (req, res) => {
  const project = Project.findById(req.params.id);
  
  if (!project) {
    return res.status(404).send('Project not found');
  }

  res.render('projects/form', { 
    project,
    user: req.user
  });
});

// PUT update project
router.put('/projects/:id',
  authenticateUser,
  [
    body('description').trim().notEmpty().withMessage('Description is required'),
    body('deadline').notEmpty().isISO8601().withMessage('Valid deadline date is required'),
    body('status').isIn(['Planning', 'In Progress', 'Completed']).withMessage('Invalid status')
  ],
  (req, res) => {
    const project = Project.findById(req.params.id);
    
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false, 
        errors: errors.array()
      });
    }

    const result = Project.update(req.params.id, {
      description: req.body.description,
      deadline: req.body.deadline,
      status: req.body.status,
      teamMembers: req.body.teamMembers
    });

    if (!result.success) {
      return res.status(400).json(result);
    }

    res.json({ success: true, message: 'Project updated successfully' });
  }
);

// DELETE project
router.delete('/projects/:id', authenticateUser, (req, res) => {
  const result = Project.delete(req.params.id);
  
  if (!result.success) {
    return res.status(404).json(result);
  }

  res.json({ success: true, message: 'Project deleted successfully' });
});

module.exports = router;
