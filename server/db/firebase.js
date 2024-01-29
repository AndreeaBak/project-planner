const admin = require("firebase-admin");

const serviceAccount = require("../project-planner-e362b-firebase-adminsdk-cinue-d354a843b0.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

console.log("Firebase initialized successfully!");

const db = admin.firestore();

module.exports = { db };
