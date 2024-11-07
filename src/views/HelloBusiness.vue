<template>
  <div>
    <h1 v-if="user">Hello {{ user.name }}</h1>
    <p v-if="user">Email: {{ user.email }}</p>
    <p v-if="user">User Type: {{ user.userType }}</p>
    <button v-if="user" @click="logout">Logout</button>

    <!-- Show login prompt if no user data is loaded -->
    <h1 v-if="user === null">Loading...</h1>
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
    user.value = response.data.user; // Set user data if logged in
  } catch (error) {
    console.error('User not logged in:', error.response?.data?.error || error.message);
    user.value = false; // Set to false to show login prompt
  }
});

// Logout function
const logout = async () => {
  try {
    const response = await axios.post('http://localhost:3000/logout', {}, {
      withCredentials: true
    });
    console.log(response.data.message);
    user.value = false; // Reset user data after logout
    router.push('/login');  // Redirect to login page after logout
  } catch (error) {
    console.error('Logout failed:', error.response?.data?.error || error.message);
  }
};
</script>
