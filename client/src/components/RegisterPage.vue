<template>
  <div class="register-container">
    <h2>Register</h2>
    <form @submit.prevent="register" class="register-form">
      <label>Email:</label>
      <input v-model="email" type="email" required />
      <br />
      <label>Password:</label>
      <input v-model="password" type="password" required />
      <span v-if="password && password.length < 8" class="error"
        >Password must be at least 8 characters long.</span
      >
      <br />
      <h3>
        Already have an account? <router-link to="/login">Login</router-link>
      </h3>
      <button type="submit" class="register-btn">Register</button>
    </form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      email: "",
      password: "",
    };
  },
  methods: {
    async register() {
      try {
        await this.$axios.post("/register", {
          email: this.email,
          password: this.password,
        });

        this.$router.push("/login");
      } catch (error) {
        console.error("Registration failed:", error);
      }
    },
  },
};
</script>

<style scoped>
.register-container {
  max-width: 400px;
  margin: 0 auto;
  text-align: center;
}

.register-form {
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 16px;
  margin-top: 20px;
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

.register-btn {
  background-color: #4caf50;
  color: #fff;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
}

.error {
  color: red;
  font-size: 14px;
  margin-top: 5px;
}

@media only screen and (max-width: 600px) {
  .register-container {
    margin: 50px auto;
    padding: 20px;
    width: 80%;
    max-width: 500px;
    border: 1px solid #ccc;
    border-radius: 10px;
    background-color: #f9f9f9;
  }

  .register-form {
    margin-top: 20px;
  }

  .register-form label {
    display: block;
    margin-bottom: 5px;
    font-weight: bold;
  }

  .register-form input[type="email"],
  .register-form input[type="password"] {
    width: 100%;
    padding: 10px;
    margin-bottom: 15px;
    border: 1px solid #ccc;
    border-radius: 5px;
  }

  .register-form .error {
    color: red;
  }

  .register-form h3 {
    margin-top: 15px;
    font-size: 16px;
  }

  .register-form button {
    width: 100%;
    padding: 10px;
    border: none;
    border-radius: 5px;
    background-color: #007bff;
    color: #fff;
    font-size: 16px;
    cursor: pointer;
  }

  .register-form button:hover {
    background-color: #0056b3;
  }
}
</style>
