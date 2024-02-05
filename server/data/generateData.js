const Chance = require("chance");
const firebase = require("firebase/app");
require("firebase/firestore");
const { db } = require("../db/firebase.js");

const chance = new Chance();

const functions = [
  "Developer",
  "Product manager",
  "Team leader",
  "Architect",
  "Business analyst",
  "Product manager",
  "QA engineer",
  "Tester",
  "Scrum master",
];

const generateProjects = (nrProiecte) => {
  const projects = [];
  for (let i = 0; i < nrProiecte; i++) {
    const projectId = chance.guid();
    const project = {
      projectId: projectId,
      name: chance.company(),
      description: chance.sentence(),
      startDate: chance.date({ string: true, american: false }),
      teamMembers: {},
    };
    projects.push(project);
  }
  return projects;
};

const generateTeamMembers = (nrMembrii, projects) => {
  const teamMembers = {};
  for (let i = 0; i < nrMembrii; i++) {
    const project = chance.pickone(projects);
    const memberId = chance.guid();
    const memberFunction = chance.pickone(functions);
    const teamMember = {
      id: memberId,
      name: `${chance.first()} ${chance.last()}`,
      function: memberFunction,
      email: chance.email(),
      projectId: project.projectId,
      projectName: project.name,
    };
    project.teamMembers[memberId] = teamMember;
    teamMembers[memberId] = teamMember;
  }
  return teamMembers;
};


const generateUsers = (nrUtilizatori) => {
  const users = [];
  for (let i = 0; i < nrUtilizatori; i++) {
    const user = {
      email: chance.email(),
      password: "parolaSecreta",
    };
    users.push(user);
  }
  return users;
};

const addData = async () => {
  const nrProiecte = 5;
  const nrMembrii = 20;
  const nrUtilizatori = 5;

  const projects = generateProjects(nrProiecte);
  const teamMembers = generateTeamMembers(nrMembrii, projects);
  const users = generateUsers(nrUtilizatori);

  const projectsCollectionRef = db.collection("projects");
  const usersCollectionRef = db.collection("users");

  const projectsPromises = projects.map(async (project) => {
    const projectDocRef = await db.collection("projects").doc(project.projectId).set(project);
    const teamMembersCollectionRef = db.collection("projects").doc(project.projectId).collection("teamMembers");
  
    await Promise.all(
        Object.entries(project.teamMembers).map(async ([teamMemberId, teamMemberData]) => {
            const teamMemberRef = teamMembersCollectionRef.doc(teamMemberId);
            await teamMemberRef.set(teamMemberData);
        })
    );
});


  const usersPromises = users.map(async (user) => {
    await db.collection("users").add(user);
  });

  await Promise.all([...projectsPromises, ...usersPromises]);
  console.log("Data added successfully");
};


addData();
