const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const admin = require('firebase-admin');

const serviceAccount = require('./project-planner-e362b-firebase-adminsdk-cinue-d354a843b0.json'); 

const app = express();

app.use(cors());
app.use(bodyParser.json());

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

//Routes
app.get('api/projects', async (req, res) => {
  const projects = []
  res.json(projects)
})

app.get('api/team-members', async (req, res) => {
  const projects = []
  res.json(projects)
})

app.post('api/projects', async(req,res)=> {
  res.json({message:'Project added successfully'})
})

app.put('api/projects/:id', async(req,res)=> {
  res.json({message:'Project added successfully'})
})

app.delete('api/projects/:id', async(req,res)=> {
  res.json({message:'Project added successfully'})
})

//Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server listen on port ${PORT}`);
});


