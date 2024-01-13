const express = require('express');
const router = express.Router();
const admin = require('firebase-admin');

const db = admin.firestore();

router.get('/', async (req, res) => {
  try {
    const snapshot = await db.collection('team').doc('team-demo').get();
    const teamMembers = snapshot.data().teamMembers;
    res.json(teamMembers);

  } catch (error) {
    console.error('Unable to retrieve team members:', error);
    res.status(500).send('Unable to retrieve team members.');
  }
})

router.post('/', async(req,res)=> {
  try{
    const newTeamMember = req.body;
    const snapshot = await db.collection('team').doc('team-demo').get();
    const teamMembers = snapshot.data().teamMembers;
    teamMembers.push(newTeamMember);
    await db.collection('team').doc('team-demo').set({teamMembers});
    res.json({message: 'Team member added successfully'});

  } catch(error){
    console.error('Unable to push new team member:', error);
    res.status(500).send('Unable to push new team member.');
  }
})

router.put('/:id', async(req,res)=> {
  try{
    const {id} = req.params;
    const updatedTeam = req.body;
    const snapshot = await db.collection('team').doc('team-demo').get();
    const teamMembers = snapshot.data().teamMembers;
    const index = teamMembers.findIndex((p) => p.id === id);
    teamMembers[index] = updatedTeam;
    await db.collection('team').doc('team-demo').set({teamMembers});
    res.json({message: 'Team member updated successfully'});

  } catch(error){
    console.error('Unable to update the team member:', error);
    res.status(500).send('Unable to update the team member.');
  }
})

router.delete('/:id', async(req,res)=> {
  try {
    const {id} = req.params;
    const snapshot = await db.collection('team').doc('team-demo').get();
    const teamMembers = snapshot.data().teamMembers;
    const filteredTeam = teamMembers.filter((p) => p.id !== id);
    await db.collection('team').doc('team-demo').set({teamMembers: filteredTeam});
    res.json({ message: 'Team member deleted successfully' });
  } catch (error){
    console.error('Unable to delete the team member:', error);
    res.status(500).send('Unable to delete the team member.');
  }
})

module.exports = router;