const express = require('express');
const router = express.Router();
const admin = require('firebase-admin');

const db = admin.firestore();

router.get('/', async (req, res) => {
  try {
    const usersSnapshot = await db.collection('users').doc('users-demo').get();
    const usersData = usersSnapshot.data().users;
    res.json({ users: usersData });
  } catch (error) {
    console.error('Unable to retrieve users:', error);
    res.status(500).json({ message: 'Unable to retrieve users' });
  }
});

module.exports = router;