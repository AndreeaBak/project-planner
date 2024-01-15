const express = require('express');
const router = express.Router();
const admin = require('firebase-admin');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const db = admin.firestore();

router.post('/register', async(req,res) => {
  try {
    const {email, password} = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    
    let docRef=db.collection('users').doc();

    await docRef.set({
      email: email,
      password: hashedPassword,
    })

    res.json({message: 'User added successfully'});

  } catch(error){
    console.error('Unable to add new user:', error);
    res.status(500).send('Unable to add new user.');
  }
});

router.post('/login', async(req, res)=>{
  const { email, password } = req.body;

  try {
    const docRef = db.collection('users');
    const userQuery = await docRef.where('email', '==', email).get();

    if (userQuery.empty) {
      return res.status(401).json({ error: 'Authentication failed' });
    }

    const user = userQuery.docs[0].data();

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ error: 'Authentication failed' });
    }

    const token = jwt.sign({ userId: user.email }, 'secret-key', {
      expiresIn: '24h',
    });

    res.status(200).json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Login failed' });
  }

})

module.exports = router;