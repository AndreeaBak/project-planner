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
          <router-link
            v-if="member.projectName"
            :to="{ name: 'project-details', params: { id: member.projectId } }"
            class="project-link"
          >
            project: {{ member.projectName }}
          </router-link>
        </div>

        <div class="member-actions" v-if="isAuthenticated">
          <button
            @click="deleteMember(member.projectId, member.id)"
            class="delete-btn"
          >
            Delete
          </button>
          <button @click="editMember(member.id)" class="edit-btn">Edit</button>
        </div>
      </div>
    </div>
    <div v-if="showEditPopup && isAuthenticated" class="popup">
      <div class="popup-content">
        <h2>Edit Team Member</h2>
        <form @submit.prevent="updateMember" class="edit-form">
          <label for="edit-name">Name:</label>
          <input v-model="editMemberData.name" required id="edit-name" />
          <label for="edit-function">Function:</label>
          <input
            v-model="editMemberData.function"
            required
            id="edit-function"
          />
          <label for="edit-email">Email:</label>
          <input v-model="editMemberData.email" required id="edit-email" />
          <div class="buttons">
            <button type="submit" class="update-btn">Update</button>
            <button @click="closeEditPopup" class="cancel-btn">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import TeamMembersService from "../services/TeamMembersService";

export default {
  data() {
    return {
      teamMembers: [],
      sortDirection: "asc",
      showEditPopup: false,
      editMemberData: {
        id: null,
        name: "",
        function: "",
        email: "",
      },
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
    async fetchTeamMembers() {
      try {
        const response = await TeamMembersService.getTeamMembers();
        this.teamMembers = response.data;
      } catch (error) {
        console.error("Error fetching team members:", error);
      }
    },
    async editMember(id) {
      try {
        // Afișează pop-up-ul de editare
        this.showEditPopup = true;

        // Obține datele membrului echipei pentru editare
        const member = this.teamMembers.find((member) => member.id === id);

        // Populează datele membrului echipei în formularul de editare
        this.editMemberData = {
          id: member.id,
          name: member.name,
          function: member.function,
          email: member.email,
          projectId: member.projectId,
        };
      } catch (error) {
        console.error("Error editing team member:", error);
      }
    },
    async updateMember() {
      try {
        // Trimite datele actualizate către serviciul pentru actualizare
        await TeamMembersService.editTeamMember(
          this.editMemberData.projectId,
          this.editMemberData.id,
          this.editMemberData
        );

        // Închide pop-up-ul de editare
        this.showEditPopup = false;

        // Actualizează lista membrilor echipei pentru a reflecta modificările
        this.fetchTeamMembers();
      } catch (error) {
        console.error("Error updating team member:", error);
      }
    },
    closeEditPopup() {
      // Închide pop-up-ul de editare fără a face actualizări
      this.showEditPopup = false;
    },
    async deleteMember(projectId, id) {
      try {
        await TeamMembersService.deleteTeamMember(projectId, id);
        this.teamMembers = this.teamMembers.filter(
          (teamMembers) => teamMembers.id !== id
        );
      } catch (error) {
        console.log(id);
        console.error("Error deleting team members:", error);
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

a.project-link:hover {
  text-decoration: none;
  font-weight: bold;
  color: black;
  font-size: 17px;
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

.popup {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.popup-content {
  background-color: white;
  padding: 20px;
  border-radius: 5px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
}

.edit-form label {
  display: block;
  margin-bottom: 10px;
}

.edit-form input {
  width: 100%;
  padding: 8px;
  margin-bottom: 20px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

.buttons button {
  padding: 10px 20px;
  margin-right: 10px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.update-btn {
  background-color: #4caf50;
  color: white;
}

.cancel-btn {
  background-color: #f44336;
  color: white;
}
</style>
