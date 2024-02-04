<template>
  <div class="team-members-page">
    <h2 class="page-title">Team Members</h2>

    <button @click="sortAlphabetically" class="sort-btn">A-Z</button>
    <button @click="sortReverseAlphabetically" class="sort-btn">Z-A</button>

    <div class="team-members-container">
      <div v-for="(member) in displayedMembers" :key="member.id" class="team-member-card">
        <div class="member-info">
          <h3>{{ member.name }}</h3>
          <p>function: {{ member.function }}</p>
          <p class="email">email: {{ member.email }}</p>
          <router-link v-if="member.projectName" :to="{ name: 'project-details', params: { id: member.projectId } }" class="project-link">
            project: {{ member.projectName }}
          </router-link>
        </div>

        <div class="member-actions" v-if="isAuthenticated">
          <button @click="deleteMember(member.projectId, member.id)" class="delete-btn">Delete</button>
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
          <input v-model="editMemberData.function" required id="edit-function" />
          <label for="edit-email">Email:</label>
          <input v-model="editMemberData.email" required id="edit-email" />
          <div class="buttons">
            <button type="submit" class="update-btn">Update</button>
            <button @click="closeEditPopup" class="cancel-btn">Cancel</button>
          </div>
        </form>
      </div>
    </div>

    <div class="pagination">
      <button :disabled="currentPage === 1" @click="prevPage" class="pagination-btn">Previous</button>
      <span class="pagination-current">{{ currentPage }}</span>
      <button :disabled="currentPage === totalPages" @click="nextPage" class="pagination-btn">Next</button>
    </div>
  </div>
</template>

<script>
import TeamMembersService from "../services/TeamMembersService";

export default {
  data() {
    return {
      teamMembers: [],
      showEditPopup: false,
      editMemberData: {
        id: null,
        name: "",
        function: "",
        email: "",
      },
      currentPage: 1,
    };
  },
  computed: {
    isAuthenticated() {
      return this.$store.getters.isAuthenticated;
    },
    totalPages() {
      return Math.ceil(this.teamMembers.length / this.membersPerPage);
    },
    displayedMembers() {
      const start = (this.currentPage - 1) * this.membersPerPage;
      const end = start + this.membersPerPage;
      return this.teamMembers.slice(start, end);
    },
    membersPerPage() {
      return window.innerWidth < 768 ? 4 : 9;
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
        this.showEditPopup = true;

        const member = this.teamMembers.find((member) => member.id === id);

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
        await TeamMembersService.editTeamMember(
          this.editMemberData.projectId,
          this.editMemberData.id,
          this.editMemberData
        );

        this.showEditPopup = false;

        this.fetchTeamMembers();
      } catch (error) {
        console.error("Error updating team member:", error);
      }
    },
    closeEditPopup() {
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
    sortAlphabetically() {
      this.teamMembers.sort((a, b) => {
        return a.name.localeCompare(b.name);
      });
    },
    sortReverseAlphabetically() {
      this.teamMembers.sort((a, b) => {
        return b.name.localeCompare(a.name);
      });
    },
    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage++;
      }
    },
    prevPage() {
      if (this.currentPage > 1) {
        this.currentPage--;
      }
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

.sort-btn {
  background-color: #4caf50;
  border: none;
  color: white;
  padding: 10px 20px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  margin: 4px 2px;
  cursor: pointer;
  border-radius: 8px;
}

.sort-btn:hover,
.sort-btn:active {
  background-color: #45a049;
  font-weight: bold;
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
  padding: 50px;
  padding-top: 40px;
  padding-right: 55px;
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

.pagination {
  margin-top: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.pagination-btn {
  padding: 8px 16px;
  margin: 0 5px;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.pagination-btn:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.pagination-current {
  margin: 0 10px;
  font-weight: bold;
  font-size: 1.1rem;
}

@media only screen and (max-width: 600px) {

.team-members-page {
  margin: 5px auto;
  padding: 20px;
  width: 80%;
  max-width: 600px; 
}

.page-title {
  font-size: 24px;
  margin-bottom: 20px;
}


.team-members-container {
  display: flex;
  flex-wrap: wrap;
}

.team-member-card {
  width: calc(100% - 10px); 
  margin-bottom: 20px;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

.member-info h3 {
  margin-bottom: 10px;
}

.member-info p {
  margin-bottom: 5px;
}

.email {
  font-style: italic;
}

.member-actions {
  display: flex;
  justify-content: flex-end;
}

.popup {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
}

.popup-content {
  background-color: #fff;
  padding: 20px;
  border-radius: 5px;
  width: 80%; 
  max-width: 400px; 
}

.popup-content h2 {
  margin-bottom: 10px;
}

.edit-form {
  margin-top: 20px;
}

.edit-form label {
  display: block;
  margin-bottom: 5px;
}

.edit-form input {
  width: 60%;
  padding: 10px;
  padding-right: 2px;
  border: 1px solid #ccc;
  border-radius: 5px;
  margin-bottom: 10px;
  
}

.buttons {
  display: flex;
  justify-content: flex-end;
}

.update-btn,
.cancel-btn {
  padding: 10px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.update-btn {
  background-color: #007bff;
  color: #fff;
  margin-right: 10px;
}

.cancel-btn {
  background-color: #dc3545;
  color: #fff;
}

@media only screen and (min-width: 601px) and (max-width: 1024px) {
  .team-members-page {
    max-width: 600px;
  }

  .popup-content {
    width: 70%; 
    max-width: 600px; 
  }
}

}
</style>
