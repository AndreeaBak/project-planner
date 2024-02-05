import { createRouter, createWebHistory } from "vue-router";
import Login from "../components/LoginPage.vue";
import Register from "../components/RegisterPage.vue";
import ProjectsList from "../components/ProjectsList.vue";
import ProjectDetails from "../components/ProjectDetails.vue";
import TeamMembers from "../components/TeamMembers.vue";

const routes = [
  {
    path: "/",
    name: "home",
    component: ProjectsList,
  },
  {
    path: "/login",
    name: "login",
    component: Login,
  },
  {
    path: "/register",
    name: "register",
    component: Register,
  },
  {
    path: "/project/:id",
    component: ProjectDetails,
    name: "project-details",
  },
  {
    path: "/teamMembers",
    component: TeamMembers,
    name: "team-members",
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
