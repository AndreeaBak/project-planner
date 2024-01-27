import axios from 'axios';

const apiUrl = 'http://localhost:3000/api/teamMembers';

export default {
  getTeamMembers() {
    return axios.get(apiUrl);
  },
  getTeamMember(id) {
    return axios.get(`${apiUrl}/${id}`);
  },
  addTeamMember(newTeamMember) {
    return axios.post(apiUrl, newTeamMember);
  },
  editTeamMember(id, updatedTeamMember) {
    return axios.put(`${apiUrl}/${id}`, updatedTeamMember);
  },
  deleteTeamMember(id) {
    return axios.delete(`${apiUrl}/${id}`);
  },
};
