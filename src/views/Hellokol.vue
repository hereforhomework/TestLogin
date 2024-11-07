<template>
    <div>
      <h1 v-if="user">Hello {{ user.name }}</h1>
      <p v-if="user">Email: {{ user.email }}</p>
      <p v-if="user">User Type: {{ user.userType }}</p>
      <button v-if="user" @click="logout">Logout</button>
      
      <!-- Placeholder text if the user is not loaded -->
      <div v-if="user === null">
        <h1>Loading your information...</h1>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  import axios from 'axios';
  import { useRouter } from 'vue-router';
  
  const user = ref(null);
  const router = useRouter();
  
  // Fetch the session data on mount to display user information
  onMounted(async () => {
    try {
      const response = await axios.get('http://localhost:3000/check-session', {
        withCredentials: true
      });
      user.value = response.data.user;
    } catch (error) {
      console.error('User not logged in:', error.response?.data?.error || error.message);
    }
  });
  
  // Logout function
  const logout = async () => {
    try {
      const response = await axios.post('http://localhost:3000/logout', {}, {
        withCredentials: true
      });
      console.log(response.data.message);
      router.push('/login');  // Redirect to login page after logout
    } catch (error) {
      console.error('Logout failed:', error.response?.data?.error || error.message);
    }
  };
  </script>
  