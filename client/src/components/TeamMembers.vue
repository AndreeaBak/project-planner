<template>
  <div class="team-members-page">
    <h2 class="page-title">Team Members</h2>

    <label for="sortDirection" class="sort-label">Sort by Project Name:</label>
    <select
      id="sortDirection"
      v-model="sortDirection"
      @change="sortMembers"
      class="sort-select"
    >
      <option value="asc">Ascending</option>
      <option value="desc">Descending</option>
    </select>

    <div class="team-members-container">
      <div
        v-for="member in teamMembers"
        :key="member.id"
        class="team-member-card"
      >
        <div class="member-info">
          <h3>{{ member.name }}</h3>
          <p>function: {{ member.function }}</p>
          <p class="email">email: {{ member.email }}</p>
          <h3>project: {{ member.projectName }}</h3>
        </div>

        <div class="member-actions" v-if="isAuthenticated">
          <button @click="deleteMember(member.id)" class="delete-btn">
            Delete
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import TeamMembersService from "../services/TeamMembersService";
import ProjectService from "../services/ProjectService";

export default {
  data() {
    return {
      teamMembers: [],
      projectDetails: [],
      sortDirection: "asc",
      projectId: null
    };
  },
  computed: {
    isAuthenticated() {
      return this.$store.getters.isAuthenticated;
    },
    sortedMembers() {
      return this.teamMembers.slice().sort((a, b) => {
        const result = a.projectName.localeCompare(b.projectName);
        return this.sortDirection === "asc" ? result : -result;
      });
    },
  },
  created() {
    this.fetchTeamMembers();
  },
  methods: {
    async fetchProjectDetails(id) {
      try {
        const response = await ProjectService.getProject(id);
        const projectData = response.data;

        this.projectId = response.data.id;

        this.projectDetails = projectData;

      } catch (error) {
        console.error("Error fetching projects:", error);
      }
    },

    async fetchTeamMembers() {
      try {
        const response = await TeamMembersService.getTeamMembers();
        this.teamMembers = response.data;
      } catch (error) {
        console.error("Error fetching team members:", error);
      }
    },

    async deleteMember(teamMemberId) {
  try {
    this.fetchProjectDetails();
    if (!this.projectDetails.id) {
      console.error("Project ID is not available.");
      return;
    }
    await TeamMembersService.deleteTeamMember(this.projectDetails.id, teamMemberId);
    this.teamMembers = this.teamMembers.filter(
      (member) => member.id !== teamMemberId
    );
  } catch (error) {
    console.error("Error deleting team member:", error);
  }
},


    sortMembers() {
      this.sortedMembers;
    },
  },
};
</script>

<style scoped>
.team-members-page {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.page-title {
  color: #333;
  font-size: 28px;
  margin-bottom: 20px;
}

.sort-label {
  margin-right: 10px;
}

.sort-select {
  padding: 8px;
}

.team-members-container {
  display: flex;
  flex-wrap: wrap;
}

.team-member-card {
  background-color: #f7f7f7;
  border: 1px solid #ddd;
  border-radius: 8px;
  margin: 10px;
  padding: 15px;
  width: calc(33.33% - 20px);
  box-sizing: border-box;
  position: relative;
}

.member-info {
  margin-bottom: 40px;
}

.member-info h3 {
  font-size: 18px;
  margin-bottom: 5px;
}

.email {
  color: #555;
}

.project-name {
  font-weight: bold;
}

.member-actions {
  position: absolute;
  bottom: 10px;
  right: 10px;
}

a.project-link {
  text-decoration: none;
  font-weight: bold;
  color: black;
}

.edit-btn,
.delete-btn {
  background-color: #3498db;
  color: #fff;
  border: none;
  padding: 8px 12px;
  border-radius: 4px;
  cursor: pointer;
  margin-right: 5px;
}

.delete-btn {
  background-color: #ff6961;
}

.edit-btn:hover,
.delete-btn:hover {
  background-color: #2c3e50;
}

a.project-link:hover {
  text-decoration: none;
  font-weight: bold;
  color: black;
  font-size: 17px;
}
</style>
