const express = require("express");
const router = express.Router();
const admin = require("firebase-admin");
const { verifyToken } = require("../middleware/authMiddleware.js");

const db = admin.firestore();

router.get("/", async (req, res) => {
  try {
    const projectsSnapshot = await db.collection("projects").get();
    const team = [];
    const promises = [];

    projectsSnapshot.forEach((projectDoc) => {
      const teamMembersRef = projectDoc.ref.collection("teamMembers");

      promises.push(
        teamMembersRef.get().then((teamMembersSnapshot) => {
          teamMembersSnapshot.forEach((teamMemberDoc) => {
            team.push({
              projectId: projectDoc.id,
              teamMemberId: teamMemberDoc.id,
              ...teamMemberDoc.data(),
            });
          });
        })
      );
    });

    await Promise.all(promises);

    res.json(team);
  } catch (error) {
    console.error("Error getting team members:", error);
    res.status(500).send("Internal Server Error");
  }
});

router.get("/:projectId/teamMembers", async (req, res) => {
  try {
    const projectId = req.params.projectId;
    const projectRef = db.collection("projects").doc(projectId);
    const teamMembersRef = projectRef.collection("teamMembers");

    const teamMembersSnapshot = await teamMembersRef.get();
    const promises = [];

    teamMembersSnapshot.forEach((teamMemberDoc) => {
      const teamMemberData = {
        projectId: projectId,
        teamMemberId: teamMemberDoc.id,
        ...teamMemberDoc.data(),
      };
      promises.push(teamMemberData);
    });

    const team = await Promise.all(promises);

    res.json(team);
  } catch (error) {
    console.error("Error getting team members for project:", error);
    res.status(500).send("Internal Server Error");
  }
});

router.get("/:teamMemberId", async (req, res) => {
  try {
    const teamMemberId = req.params.teamMemberId;
    const projectsSnapshot = await db.collection("projects").get();

    let teamMemberData = null;
    const promises = [];

    projectsSnapshot.forEach((projectDoc) => {
      const teamMemberRef = projectDoc.ref
        .collection("teamMembers")
        .doc(teamMemberId);

      promises.push(
        teamMemberRef.get().then((teamMemberDoc) => {
          if (teamMemberDoc.exists) {
            teamMemberData = {
              projectId: projectDoc.id,
              teamMemberId: teamMemberDoc.id,
              ...teamMemberDoc.data(),
            };
          }
        })
      );
    });

    await Promise.all(promises);

    if (teamMemberData) {
      res.json(teamMemberData);
    } else {
      res.status(404).json({ message: "Team member not found" });
    }
  } catch (error) {
    console.error("Error getting team member by ID:", error);
    res.status(500).send("Internal Server Error");
  }
});

router.post("/:projectId/teamMembers", verifyToken, async (req, res) => {
  try {
    const projectId = req.params.projectId;
    const projectRef = db.collection("projects").doc(projectId);
    const projectDoc = await projectRef.get();
    const projectName = projectDoc.data().name;

    const teamMembersData = Array.isArray(req.body) ? req.body : [req.body];

    const teamMembersPromises = teamMembersData.map(async (teamMember) => {
      if (!teamMember.name || !teamMember.function || !teamMember.email) {
        return res
          .status(400)
          .json({ message: "Team member must contain all required data." });
      }

      const teamMemberData = {
        ...teamMember,
        projectId: projectId,
        projectName: projectName,
      };

      const docRef = await projectRef
        .collection("teamMembers")
        .add(teamMemberData);

      const memberId = docRef.id;

      projectDoc.ref.update({
        [`teamMembers.${memberId}`]: teamMemberData,
      });

      return memberId;
    });

    const teamMembersIds = await Promise.all(teamMembersPromises);

    res.json({
      message: "Team members added successfully",
      ids: teamMembersIds,
    });
  } catch (error) {
    console.error("Unable to add new team members to project:", error);
    res.status(500).send("Unable to add new team members to project.");
  }
});

router.put(
  "/:projectId/teamMembers/:teamMemberId",
  verifyToken,
  async (req, res) => {
    try {
      const projectId = req.params.projectId;
      const teamMemberId = req.params.teamMemberId;
      const projectRef = db.collection("projects").doc(projectId);
      const teamMemberRef = projectRef
        .collection("teamMembers")
        .doc(teamMemberId);

      const teamMemberDoc = await teamMemberRef.get();
      if (!teamMemberDoc.exists) {
        return res
          .status(404)
          .json({ message: "Team member not found in project" });
      }

      await teamMemberRef.update(req.body);

      res.json({ message: "Team member updated successfully" });
    } catch (error) {
      console.error("Error updating team member:", error);
      res.status(500).send("Internal Server Error");
    }
  }
);

router.delete(
  "/:projectId/teamMembers/:teamMemberId",
  verifyToken,
  async (req, res) => {
    try {
      const projectId = req.params.projectId;
      const teamMemberId = req.params.teamMemberId;
      const projectRef = db.collection("projects").doc(projectId);
      const teamMemberRef = projectRef
        .collection("teamMembers")
        .doc(teamMemberId);

      const teamMemberDoc = await teamMemberRef.get();
      if (!teamMemberDoc.exists) {
        return res
          .status(404)
          .json({ message: "Team member not found in project" });
      }

      await teamMemberRef.delete();

      res.json({ message: "Team member deleted successfully" });
    } catch (error) {
      console.error("Error deleting team member:", error);
      res.status(500).send("Internal Server Error");
    }
  }
);

module.exports = router;
