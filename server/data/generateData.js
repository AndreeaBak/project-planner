const admin = require('firebase-admin');
const Chance = require('chance');
const serviceAccount = require('../project-planner-e362b-firebase-adminsdk-cinue-d354a843b0.json'); 

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();
const chance = new Chance();

//Generare proiecte
const generateProjects = (nrProiecte) => {
  const projects = [];
  for (let i = 0; i < nrProiecte; i++) {
    const project = {
      name: chance.company(),
      description: chance.sentence(),
      startDate: chance.date({ string: true, american: false }),
    };
    projects.push(project);
  }
  return projects;
};

//Generare membrii
const generateTeamMembers = (nrMembrii) => {
  const teamMembers = [];
  for (let i = 0; i < nrMembrii; i++) {
    const membru = {
      fistname: chance.first(),
      lastname: chance.last(),
      email: chance.email(),
    };
    teamMembers.push(membru);
  }
  return teamMembers;
};

//Generare useri
const generateUsers = (nrUtilizatori) => {
  const users = [];
  for (let i = 0; i < nrUtilizatori; i++) {
    const user = {
      email: chance.email(),
      password: 'parolaSecreta',
    };
    users.push(user);
  }
  return users;
};

//Adauga date in Firestore
const addData = async () => {
  const nrProiecte = 10; 
  const nrMembrii = 50; 
  const nrUtilizatori = 5;

  const projects = generateProjects(nrProiecte);
  const teamMembers = generateTeamMembers(nrMembrii);
  const users = generateUsers(nrUtilizatori);

  await db.collection('projects').doc('projects-demo').set({ projects });
  await db.collection('team').doc('team-demo').set({ teamMembers });
  await db.collection('users').doc('users-demo').set({ users });

  console.log('Data generated and added successfully.');
};

addData();
