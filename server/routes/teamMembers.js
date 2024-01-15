const express = require('express');
const router = express.Router();
const admin = require('firebase-admin');
const verifyToken = require('../middleware/authMiddleware.js')

const db = admin.firestore();

router.get('/', async (req, res) => {
  try {
    const teamSnapshot = await db.collection('team').get();
    const team = [];
    teamSnapshot.forEach((doc) => {
      team.push({
        id: doc.id,
        ...doc.data()
      });
    });
    res.json(team);
  } catch (error) {
    console.error('Error getting team:', error);
    res.status(500).send('Internal Server Error');
  }
});

router.get('/:id', async (req, res) => {
  try {
    const teamId = req.params.id;
    const teamDoc = await db.collection('team').doc(teamId).get();

    if (!teamDoc.exists) {
      return res.status(404).send('Team not found');
    }

    const teamData = {
      id: teamDoc.id,
      ...teamDoc.data()
    };

    res.json(teamData);
  } catch (error) {
    console.error('Error getting Team by ID:', error);
    res.status(500).send('Internal Server Error');
  }
});

router.post('/', verifyToken, async(req,res)=> {
  try{
    let docRef=db.collection('team').doc();

    await docRef.set({
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      email: req.body.email
    })

    res.json({message: 'Team added successfully'});

  } catch(error){
    console.error('Unable to push new Team:', error);
    res.status(500).send('Unable to push new Team.');
  }
})

router.put('/:id', verifyToken, async(req,res)=> {
  try{
    const id = req.params.id;
    let docRef = db.collection('team').doc(id);

    await docRef.update({
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      email: req.body.email
    })

  } catch(error){
    console.error('Unable to update the Team:', error);
    res.status(500).send('Unable to update the Team.');
  }
})

router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const teamId = req.params.id;
    const teamDoc = db.collection('team').doc(teamId);
    const snapshot = await teamDoc.get();

    if (!snapshot.exists) {
      return res.status(404).send('Team not found');
    }

    await teamDoc.delete();
    res.send('Team deleted successfully');
  } catch (error) {
    console.error('Error deleting Team:', error);
    res.status(500).send('Internal Server Error');
  }
});

module.exports = router;