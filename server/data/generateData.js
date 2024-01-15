const admin = require('firebase-admin');
const Chance = require('chance');
const serviceAccount = require('../project-planner-e362b-firebase-adminsdk-cinue-d354a843b0.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();
const chance = new Chance();

// Generare projects
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

// Generare members
const generateTeamMembers = (nrMembrii) => {
  const teamMembers = [];
  for (let i = 0; i < nrMembrii; i++) {
    const membru = {
      firstname: chance.first(),
      lastname: chance.last(),
      email: chance.email(),
    };
    teamMembers.push(membru);
  }
  return teamMembers;
};

// Generare users
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

// Adaugă date în Firestore
const addData = async () => {
  const nrProiecte = 5;
  const nrMembrii = 20;
  const nrUtilizatori = 5;

  const projects = generateProjects(nrProiecte);
  const teamMembers = generateTeamMembers(nrMembrii);
  const users = generateUsers(nrUtilizatori);

  const projectsCollectionRef = db.collection('projects');
  projects.forEach(async (project) => {
    const projectDocRef = projectsCollectionRef.doc(); 
    await projectDocRef.set(project);
  });

  const teamMembersCollectionRef = db.collection('team');
  teamMembers.forEach(async (teamMember) => {
    const teamMemberDocRef = teamMembersCollectionRef.doc();
    await teamMemberDocRef.set(teamMember);
  });

  const usersCollectionRef = db.collection('users');
  users.forEach(async (user) => {
    const userDocRef = usersCollectionRef.doc();
    await userDocRef.set(user);
  });

  console.log('Data generated and added successfully.');
};

addData();
