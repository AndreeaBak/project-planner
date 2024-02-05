<template>
  <div class="login-container">
    <h2>Login</h2>
    <form @submit.prevent="login" class="login-form">
      <label>Email:</label>
      <input v-model="email" type="email" required />
      <br />
      <label>Password:</label>
      <input v-model="password" type="password" required />
      <br />
      <span v-if="userNotFound" class="error"
        >Invalid email address or password.</span
      >
      <h3>
        Don't have an account?
        <router-link to="/register">Register</router-link>
      </h3>
      <button type="submit" class="login-btn">Login</button>
    </form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      email: "",
      password: "",
      userNotFound: false,
    };
  },
  methods: {
    async login() {
      try {
        const response = await this.$axios.post("/login", {
          email: this.email,
          password: this.password,
        });

        this.userNotFound = false;

        const token = response.data.token;

        this.$store.dispatch("login", token);
        localStorage.setItem("token", token);

        this.$router.push("/");
      } catch (error) {
        this.userNotFound = true;
        console.error("Login failed:", error);
      }
    },
  },
};
</script>

<style scoped>
.login-container {
  max-width: 400px;
  margin: 0 auto;
  text-align: center;
}

.login-form {
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 16px;
  margin-top: 20px;
}

@media only screen and (min-width: 601px) and (max-width: 1024px) {
  .login-form {
    padding: 12px;
  }
}

@media only screen and (max-width: 600px) {

.login-container {
  margin: 50px auto;
  padding: 20px;
  width: 80%;
  max-width: 500px;
  border: 1px solid #ccc;
  border-radius: 10px;
  background-color: #f9f9f9;
}

.login-form {
  margin-top: 20px;
}

.login-form label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}

.login-form input[type="email"],
.login-form input[type="password"] {
  width: 100%;
  padding: 10px;
  margin-bottom: 15px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

.login-form .error {
  color: red;
}

.login-form h3 {
  margin-top: 15px;
  font-size: 16px;
}

.login-form button {
  width: 100%;
  padding: 10px;
  border: none;
  border-radius: 5px;
  background-color: #007bff;
  color: #fff;
  font-size: 16px;
  cursor: pointer;
}

.login-form button:hover {
  background-color: #0056b3;
}

}

@media only screen and (min-width: 601px) and (max-width: 1024px) {
  .login-form {
    padding: 12px;
  }
}

.error {
  color: #ff6961;
  font-weight: bold;
}

label {
  display: block;
  margin-bottom: 8px;
  font-weight: bold;
}

input {
  width: 100%;
  padding: 8px;
  margin-bottom: 16px;
  box-sizing: border-box;
}

.login-btn {
  background-color: #4caf50;
  color: #fff;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
}
</style>
