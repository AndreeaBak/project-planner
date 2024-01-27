import axios from 'axios';

const apiUrl = 'http://localhost:3000/api/projects'; 

export default {
  getProjects() {
    return axios.get(apiUrl);
  },
  getProject(id){
    return axios.get(`${apiUrl}/${id}`)
  },
  addProject(newProject) {
    return axios.post(apiUrl, newProject);
  },
  editProject(id, editedProject) {
    return axios.put(`${apiUrl}/${id}`, editedProject);
  },
  deleteProject(id) {
    return axios.delete(`${apiUrl}/${id}`);
  },
};
