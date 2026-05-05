const express = require('express');
const Project = require('../models/project');
const { authenticateUser } = require('../middleware/auth');

const router = express.Router();

router.get('/projects', authenticateUser, (req, res) => {
  const projects = Project.getAll();
  res.render('projects/list', { projects });
});

router.get('/project/new', authenticateUser, (req, res) => {
  res.render('projects/form', { project: null });
});

router.post('/project', authenticateUser, (req, res) => {
  const project = Project.create({
    projectName: req.body.projectName,
    description: req.body.description,
    deadline: req.body.deadline,
    status: req.body.status,
    teamMembers: req.body.teamMembers,
    createdBy: req.user.id
  });

  res.redirect(`/projects/${project.id}`);
});

router.get('/projects/:id', authenticateUser, (req, res) => {
  const project = Project.findById(req.params.id);
  if (!project) {
    return res.send('Project not found');
  }
  res.render('projects/view', { project });
});

router.get('/projects/:id/edit', authenticateUser, (req, res) => {
  const project = Project.findById(req.params.id);
  if (!project) {
    return res.send('Project not found');
  }
  res.render('projects/form', { project });
});

router.put('/projects/:id', authenticateUser, (req, res) => {
  Project.update(req.params.id, {
    description: req.body.description,
    deadline: req.body.deadline,
    status: req.body.status,
    teamMembers: req.body.teamMembers
  });
  res.json({ success: true });
});

router.delete('/projects/:id', authenticateUser, (req, res) => {
  Project.delete(req.params.id);
  res.json({ success: true });
});

module.exports = router;
