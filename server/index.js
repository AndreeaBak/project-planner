const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const admin = require('firebase-admin');

const port = 3000;

const serviceAccount = require('./project-planner-e362b-firebase-adminsdk-cinue-d354a843b0.json'); 

const app = express();

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

console.log('Firebase initialized successfully!');

const projectsRoutes = require('./routes/projects.js');
const teamMembersRoutes = require('./routes/teamMembers.js');
const usersRoutes = require('./routes/users.js');

app.use(cors());
app.use(bodyParser.json());

const db = admin.firestore();

//Routes
app.use('/api/users', usersRoutes);
app.use('/api/projects', projectsRoutes);
app.use('/api/teamMembers', teamMembersRoutes);

//Start server
app.listen(port, () => {
  console.log(`Server listen on port ${port}`);
});


