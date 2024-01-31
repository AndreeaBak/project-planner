<template>
  <div class="projects-container">
    <h2>Projects List</h2>
    <ul>
      <li v-for="project in projects" :key="project.id" class="project-item">
        <div class="project-info">
          <router-link
            v-if="project.id"
            :to="{ name: 'project-details', params: { id: project.id } }"
            class="project-link"
          >
            {{ project.name }}
          </router-link>
        </div>
        <div class="buttons-container">
          <button
            v-if="isAuthenticated"
            @click="deleteProject(project.id)"
            class="delete-btn"
          >
            Delete
          </button>
        </div>
      </li>
    </ul>
    <form
      v-if="isAuthenticated"
      @submit.prevent="addProject"
      class="add-form"
    >
      <div class="form-group">
        <label for="projectName">Project Name:</label>
        <input
          v-model="newProject.name"
          type="text"
          id="projectName"
          required
          class="name-input"
        />
      </div>

      <div class="form-group">
        <label for="projectDescription">Description:</label>
        <input
          v-model="newProject.description"
          id="projectDescription"
          required
          class="desc-input"
        />
      </div>

      <div class="form-group">
        <label for="projectStartDate">Start Date:</label>
        <input
          v-model="newProject.startDate"
          type="date"
          id="projectStartDate"
          required
        />
      </div>

      <button type="submit" class="add-btn">Add New Project</button>
    </form>

  </div>
</template>

<script>
import ProjectService from "../services/ProjectService";

export default {
  data() {
    return {
      projects: [],
      newProject: {
        name: "",
        description: "",
        startDate: null,
      },
      
    };
  },
  computed: {
    isAuthenticated() {
      return this.$store.getters.isAuthenticated;
    },
  },
  mounted() {
    this.loadProjects();
  },
  methods: {
    async loadProjects() {
      try {
        const response = await ProjectService.getProjects();
        this.projects = response.data;
      } catch (error) {
        console.error("Error fetching projects:", error);
      }
    },

    async deleteProject(id) {
      try {
        await ProjectService.deleteProject(id);
        this.projects = this.projects.filter((project) => project.id !== id);
        console.log(id);
      } catch (error) {
        console.error("Error deleting project:", error);
      }
    },

    async addProject() {
      try {
        const response = await ProjectService.addProject(this.newProject);
        this.projects.push(response.data);
        this.resetNewProject();
        this.loadProjects();
      } catch (error) {
        console.error("Error adding project:", error);
      }
    },

    resetNewProject() {
      this.newProject = {
        name: "",
        description: "",
        startDate: null,
      };
    },
  },
};
</script>

<style scoped>
.projects-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

h2 {
  color: #333;
  font-size: 28px;
  margin-bottom: 20px;
}

ul {
  list-style: none;
  padding: 0;
}

.project-item {
  border: 1px solid #ddd;
  border-radius: 8px;
  margin-bottom: 10px;
  padding: 15px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.project-info {
  flex: 1;
}

.project-link {
  text-decoration: none;
  color: #0d0e0e;
  font-weight: bold;
  font-size: 16px;
}

.project-link:hover {
  font-size: 20px;
}

.buttons-container {
  display: flex;
  gap: 10px;
}

.edit-btn,
.delete-btn {
  background-color: #3498db;
  color: #fff;
  border: none;
  padding: 8px 12px;
  border-radius: 4px;
  cursor: pointer;
}

.delete-btn {
  background-color: #ff6961;
}

.edit-btn:hover,
.delete-btn:hover {
  background-color: #2c3e50;
}

.add-form {
  margin-top: 20px;
  display: flex;
  flex-wrap: wrap;
}

.form-group {
  margin-right: 10px;
  margin-bottom: 15px;
}

label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
  color: #555;
}

input {
  width: 200px;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.add-btn {
  background-color: #2ecc71;
  color: #fff;
  border: none;
  padding: 10px 15px;
  border-radius: 4px;
  cursor: pointer;
}

.add-btn:hover {
  background-color: #27ae60;
}

.name-input,
.desc-input,
.date-input {
  margin-bottom: 15px;
}

@media only screen and (max-width: 600px) {

.projects-container {
  margin: 5px auto;
  padding: 20px;
  width: 80%;
  max-width: 500px;
}

.projects-container h2 {
  font-size: 24px;
  margin-bottom: 20px;
}

.project-item {
  margin-bottom: 20px;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

.project-link {
  color: black;
  text-decoration: none;
}

.project-link:hover {
  text-decoration: underline;
}

.buttons-container {
  display: flex;
  justify-content: flex-end;
}

.delete-btn {
  background-color: #dc3545;
  color: #fff;
  border: none;
  border-radius: 5px;
  padding: 5px 10px;
  margin-left: 10px;
  cursor: pointer;
}

.delete-btn:hover {
  background-color: #c82333;
}

.add-form {
  margin: 0 auto;
  max-width: 400px; 
}

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  font-weight: bold;
}

.name-input,
.desc-input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

.add-btn {
  width: 100%;
  padding: 10px;
  border: none;
  border-radius: 5px;
  background-color: #007bff;
  color: #fff;
  font-size: 16px;
  cursor: pointer;
}

.add-btn:hover {
  background-color: #0056b3;
}

}
</style>

