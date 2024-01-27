<template>
  <header>
    <nav>
      <router-link to="/">Projects</router-link>
      <router-link to="/teamMembers">Team Members</router-link>
      <router-link v-if="!isAuthenticated" to="/login">Login</router-link>
      <button v-if="isAuthenticated" @click="logout" class="logout-btn">Logout</button>
    </nav>
  </header>
</template>

<script>
export default {
  computed: {
    isAuthenticated() {
      return this.$store.getters.isAuthenticated;
    },
  },
  methods: {
    logout() {
      this.$store.dispatch('logout');
      this.$router.push('/');
    },
  },
};
</script>

<style scoped>
header {
  background-color: #c0e9e7;
  color: #fff;
  padding: 10px;
}

nav {
  display: flex;
  justify-content: space-around;
}

router-link {
  color: #fff;
  text-decoration: none;
  padding: 5px;
}

router-link:hover {
  text-decoration: underline;
}

.logout-btn {
  background-color: #c0e9e7;
  color: #000;
  font-weight: bold;
  font-size: 18px;
  border: none;
  padding: 0px 20px;
  border-radius: 4px;
  cursor: pointer;
}
</style>
