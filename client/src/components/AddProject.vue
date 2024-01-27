<template>
  <div>
    <h2>Add a new project</h2>
    <form @submit.prevent="addProject">
      <label for="name">Project name:</label>
      <input type="text" id="name" v-model="newProject.name" required>

      <label for="description">Description:</label>
      <textarea id="description" v-model="newProject.description" required></textarea>

       <label for="date">Date:</label>
      <input type="date" id="date" v-model="newProject.date" required>


      <button type="submit">Add</button>
    </form>
  </div>
</template>

<script>
import ProjectService from '../services/ProjectService';

export default {
  data() {
    return {
      newProject: {
        name: '',
        description: '',
      },
    };
  },
  methods: {
    addProject() {
      ProjectService.addProject(this.newProject)
        .then(response => {
          console.log(response.data.message);
          this.newProject = {
            name: '',
            description: '',
            date:'',
          };
        })
        .catch(error => {
          console.error('Eroare la adăugarea proiectului:', error);
        });
    },
  },
};
</script>

<style scoped>

</style>