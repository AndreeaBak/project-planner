const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { db } = require("./db/firebase.js");

const port = 3000;

const app = express();

const projectsRoutes = require("./routes/projects.js");
const teamMembersRoutes = require("./routes/teamMembers.js");
const authRoutes = require("./routes/auth.js");

app.use(cors());
app.use(bodyParser.json());

app.use("/", authRoutes);
app.use("/api/projects", projectsRoutes);
app.use("/api/teamMembers", teamMembersRoutes);

app.listen(port, () => {
  console.log(`Server listen on port ${port}`);
});
