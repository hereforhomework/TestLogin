import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/Register.vue';
import LoginView from '../views/Login.vue';
import HelloKolView from '../views/Hellokol.vue';
import HelloBusinessView from '../views/HelloBusiness.vue';
import Error from '../views/Error.vue';
import axios from 'axios';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView,
    },
    {
      path: '/hellokol',
      name: 'hellokol',
      component: HelloKolView,
      meta: { requiresAuth: true }, // Mark as protected route
    },
    {
      path: '/hellobusiness',
      name: 'hellobusiness',
      component: HelloBusinessView,
      meta: { requiresAuth: true }, // Mark as protected route
    },
    {
      path: '/error',
      name: 'error',
      component: Error,
    },
  ],
});

// Navigation guard to protect routes
router.beforeEach(async (to, from, next) => {
  if (to.meta.requiresAuth) {
    try {
      const response = await axios.get('http://localhost:3000/check-session', {
        withCredentials: true,
      });
      const user = response.data.user;

      if (user) {
        // Check the route and user type to allow access
        if ((to.name === 'hellokol' && user.userType === 'kol') ||
            (to.name === 'hellobusiness' && user.userType === 'brand')) {
          next(); // Allow access if user type matches route
        } else {
          next('/'); // Redirect to home if user type doesn’t match
        }
      } else {
        next('/error'); // Redirect to login if no session
      }
    } catch (error) {
      console.error('No active session:', error.response?.data?.error);
      next('/error'); // Redirect to login if session check fails
    }
  } else {
    next(); // Proceed if route does not require auth
  }
});

export default router;
