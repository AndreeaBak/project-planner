const admin = require('firebase-admin');
const Chance = require('chance');
const serviceAccount = require('./project-planner-e362b-firebase-adminsdk-cinue-d354a843b0.json'); 

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

//Adauga date in Firestore
const addData = async () => {
  const nrProiecte = 10; 
  const nrMembrii = 50; 

  const projects = generateProjects(nrProiecte);
  const teamMembers = generateTeamMembers(nrMembrii);

  // Adăugarea datelor în Firestore
  await db.collection('projects').doc('projects-demo').set({ projects });
  await db.collection('team').doc('team-demo').set({ teamMembers });

  console.log('Data generated and added successfully.');
};

addData();
