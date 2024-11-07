<template>
  <form @submit.prevent="register">
    <div>
      <label for="userType">User Type:</label>
      <select v-model="userType" required>
        <option value="kol">KOL</option>
        <option value="brand">Brand</option>
      </select>
    </div>

    <div>
      <label for="name">Name:</label>
      <input type="text" v-model="name" required placeholder="Enter your name" />
    </div>

    <div>
      <label for="email">Email:</label>
      <input type="email" v-model="email" required placeholder="Enter your email" />
    </div>

    <div>
      <label for="password">Password:</label>
      <input type="password" v-model="password" required placeholder="Enter your password" />
    </div>

    <button type="submit">Register</button>
  </form>
</template>

<script>
export default {
  data() {
    return {
      userType: '',
      name: '',
      email: '',
      password: ''
    };
  },
  methods: {
    async register() {
      try {
        const response = await fetch('http://localhost:3000/signup', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            userType: this.userType,
            name: this.name,
            email: this.email,
            password: this.password
          })
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        console.log(data);
        this.$router.push('/login');
      } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
      }
    }
  }
};
</script>
