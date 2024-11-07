<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';

const email = ref('');
const password = ref('');
const router = useRouter();

// Check if the user is already logged in by checking the session
const checkSession = async () => {
  try {
    const response = await axios.get('http://localhost:3000/check-session', {
      withCredentials: true  // Ensure cookies are sent
    });
    console.log('Logged in user:', response.data.user);
    // Redirect based on user type from session data
    if (response.data.user.userType === 'kol') {
      router.push('/hellokol');
    } else if (response.data.user.userType === 'brand') {
      router.push('/hellobusiness');
    }
  } catch (error) {
    console.log('No active session:', error.response?.data?.error);
  }
};

onMounted(() => {
  checkSession();
});

// Login method
const login = async () => {
  try {
    const response = await axios.post('http://localhost:3000/login', {
      email: email.value,
      password: password.value
    }, { withCredentials: true }); // Ensure cookies are sent
    console.log('Login successful:', response.data.message);
    await checkSession();
  } catch (error) {
    console.error(error.response?.data?.error || 'An error occurred');
  }
};
</script>

<template>
  <form @submit.prevent="login">
    <div>
      <label for="email">Email:</label>
      <input type="email" v-model="email" id="email" required placeholder="Enter your email" />
    </div>

    <div>
      <label for="password">Password:</label>
      <input type="password" v-model="password" id="password" required placeholder="Enter your password" />
    </div>

    <button type="submit">Login</button>
  </form>
</template>
