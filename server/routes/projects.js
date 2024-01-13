const express = require('express');
const router = express.Router();
const admin = require('firebase-admin');

const db = admin.firestore();

router.get('/', async (req, res) => {
  try {
    const snapshot = await db.collection('projects').doc('projects-demo').get();
    const projects = snapshot.data().projects;
    res.json(projects);

  } catch (error) {
    console.error('Unable to retrieve projects:', error);
    res.status(500).send('Unable to retrieve projects.');
  }
})

router.post('/', async(req,res)=> {
  try{
    const newProject = req.body;
    const snapshot = await db.collection('projects').doc('projects-demo').get();
    const projects = snapshot.data().projects;
    projects.push(newProject);
    await db.collection('projects').doc('projects-demo').set({projects});
    res.json({message: 'Project added successfully'});

  } catch(error){
    console.error('Unable to push new project:', error);
    res.status(500).send('Unable to push new project.');
  }
})

router.put('/:id', async(req,res)=> {
  try{
    const {id} = req.params;
    const updatedProject = req.body;
    const snapshot = await db.collection('projects').doc('projects-demo').get();
    const projects = snapshot.data().projects;
    const index = projects.findIndex((p) => p.id === id);
    projects[index] = updatedProject;
    await db.collection('projects').doc('projects-demo').set({projects});
    res.json({message: 'Project updated successfully'});

  } catch(error){
    console.error('Unable to update the project:', error);
    res.status(500).send('Unable to update the project.');
  }
})

router.delete('/:id', async(req,res)=> {
  try {
    const {id} = req.params;
    const snapshot = await db.collection('projects').doc('projects-demo').get();
    const projects = snapshot.data().projects;
    const filteredProjects = projects.filter((p) => p.id !== id);
    await db.collection('projects').doc('projects-demo').set({projects: filteredProjects});
    res.json({ message: 'Project deleted successfully' });
  } catch (error){
    console.error('Unable to delete the project:', error);
    res.status(500).send('Unable to delete the project.');
  }
})

module.exports = router;