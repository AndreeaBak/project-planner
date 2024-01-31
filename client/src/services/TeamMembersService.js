import axios from 'axios';

const apiUrl = 'http://localhost:3000/api/teamMembers';

export default {
  getTeamMembers() {
    return axios.get(apiUrl);
  },
  getTeamMember(id) {
    return axios.get(`${apiUrl}/${id}`);
  },
  addTeamMember(projectId, newTeamMember) {
    return axios.post(`${apiUrl}/${projectId}/teamMembers`, newTeamMember);
  },
  editTeamMember(projectId, id, updatedTeamMember) {
    return axios.put(`${apiUrl}/${projectId}/teamMembers/${id}`, updatedTeamMember);
  },
  deleteTeamMember(projectId, id) {
    return axios.delete(`${apiUrl}/${projectId}/teamMembers/${id}`);
  },
};
