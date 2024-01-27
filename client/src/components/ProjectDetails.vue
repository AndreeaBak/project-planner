<template>
  <div class="project-details-container">
    <h2 class="section-title">Project Details</h2>

    <div v-if="projectDetails" class="project-details">
      <div class="project-info">
        <h3>{{ projectDetails.name }}</h3>
        <p class="project-description">
          <strong>Description:</strong> {{ projectDetails.description }}
        </p>
        <p class="project-start-date">
          <strong>Start Date:</strong> {{ projectDetails.startDate }}
        </p>
      </div>

      <div class="team-section">
        <h3 class="section-title">Team Members</h3>
        <ul class="team-members-list">
          <h3 class="team-member-header">Name - Role - Email</h3>
          <li v-for="member in filteredTeamMembers" :key="member.id" class="team-member">
            {{ member.name }}  -  {{ member.function }}  -   {{ member.email }}
            <div class="action-buttons">
              <button v-if="isAuthenticated" @click="deleteTeamMember(member.id)" class="delete-btn">Delete</button>
            </div>
          </li>
        </ul>

        <form v-if="isAuthenticated" @submit.prevent="addTeamMember" class="add-member-form">
          <div class="form-row">
            <div class="form-group">
              <input placeholder="Name" v-model="newMember.name" type="text" id="newMemberName" required>
            </div>

            <div class="form-group">
              <input placeholder="Role" v-model="newMember.function" type="text" id="newMemberFunction" required>
            </div>

            <div class="form-group">
              <input placeholder="Email" v-model="newMember.email" type="email" id="newMemberEmail" required>
            </div>
          </div>
          <button type="submit" class="add-btn">Add</button>
        </form>

        <button v-if="isAuthenticated" @click="toggleEditForm" class="edit-btn">Edit Project</button>

        <form v-if="isEditing" @submit.prevent="editProject" class="edit-project-form">
          <div class="form-group">
            <label for="editProjectName">Name:</label>
            <input v-model="editedProject.name" type="text" id="editProjectName" required>
          </div>

          <div class="form-group">
            <label for="editProjectDescription">Description:</label>
            <input v-model="editedProject.description" id="editProjectDescription" required>
          </div>

          <div class="form-group">
            <label for="editProjectStartDate">Start Date:</label>
            <input v-model="editedProject.startDate" type="date" id="editProjectStartDate" required>
          </div>

          <button type="submit" class="add-btn">Save Changes</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import ProjectService from '../services/ProjectService';
import TeamMembersService from '../services/TeamMembersService';

export default {
  data() {
    return {
      projectDetails: null,
      teamMembers: [],
      newMember: {
        name: '',
        function: '',
        email: '',
      },
      isEditing: false,
      editedProject: {
        name: '',
        description: '',
        startDate: '',
      },
    };
  },
  computed: {
    filteredTeamMembers() {
          const projectId = this.$route.params.id;
          return this.teamMembers.filter(member => member.projectId === projectId);
    },

    isAuthenticated() {
      return this.$store.getters.isAuthenticated;
    },
  },

  created() {
    const projectId = this.$route.params.id;
    this.fetchProjectDetails(projectId);
    this.fetchTeamMembers();
  },
  methods: {
    toggleEditForm() {
      this.isEditing = !this.isEditing;
      this.editedProject = { ...this.projectDetails };
  },

    async fetchProjectDetails(id) {
      try {
        const response = await ProjectService.getProject(id);
        this.projectDetails = response.data;
      } catch (error) {
        console.error('Error fetching projects:', error);
      }
    },

    async editProject() {
      const projectId = this.$route.params.id;
      try {
        await ProjectService.editProject(projectId, this.editedProject);
        this.projectDetails = { ...this.editedProject };
        this.fetchProjectDetails(this.editedProject.id)
        this.isEditing = false; 
      } catch (error) {
        console.error('Error editing project:', error);
      }
    },

    async fetchTeamMembers() {
      try {
        const response = await TeamMembersService.getTeamMembers();
        this.teamMembers = response.data;
      } catch (error) {
        console.error('Error fetching team members:', error);
      }
    },

    async deleteTeamMember(id) {
      try {
        await TeamMembersService.deleteTeamMember(id);
        this.teamMembers = this.teamMembers.filter(teamMembers => teamMembers.id !== id);
      } catch (error) {
        console.error('Error deleting team members:', error);
      }
    },
    
     async addTeamMember() {
      try {
        const projectId = this.$route.params.id;
        const response = await TeamMembersService.addTeamMember({
          name: this.newMember.name,
          function: this.newMember.function,
          email: this.newMember.email,
          projectId: projectId
        });
        const newMember = response.data;
        this.teamMembers.push(newMember);
        this.newMember = {
          name: '',
          function: '',
          email: '',
        };
        
        this.fetchTeamMembers();

      } catch (error) {
        console.error('Error adding team member:', error);
      }
    },
  },
};
</script>

<style scoped>
.project-details-container {
  max-width: 600px;
  margin: 0 auto;
}

.section-title {
  color: #333;
  font-size: 24px;
  margin-bottom: 16px;
}

.project-details {
  background-color: #f7f7f7;
  padding: 20px;
  border-radius: 8px;
}

.project-info {
  margin-bottom: 20px;
}

.team-section {
  border-top: 1px solid #ddd;
  padding-top: 20px;
}

.team-members-list {
  list-style: none;
  padding: 0;
}

.team-member {
  margin-bottom: 8px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.team-member-header {
  font-weight: bold;
}

.action-buttons {
  display: flex;
  gap: 8px;
}

.add-member-form {
  margin-top: 20px;
}

label {
  display: block;
  margin-bottom: 8px;
  font-weight: bold;
}

input {
  width: 100%;
  padding: 6px;
  margin-bottom: 16px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.add-btn,
.edit-btn,
.delete-btn {
  background-color: #3498db;
  color: #fff;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
}

.edit-btn {
  margin-top: 5px;
}

.delete-btn {
background-color: #ff6961
}

.add-btn:hover,
.edit-btn:hover,
.delete-btn:hover {
  background-color: #2c3e50;
}

.form-row {
  display: flex;
  gap: 10px;
}

.form-group {
  flex: 1;
}


.add-member-form label,
.add-member-form input {
  width: auto; 
}
</style>
