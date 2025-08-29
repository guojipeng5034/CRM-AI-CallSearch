// src/store/user.ts
import { defineStore } from 'pinia';
import { ref } from 'vue';
// import { useRouter } from 'vue-router'; // 1. REMOVE this line
import router from '@/router'; // 2. IMPORT the router instance directly

export const useUserStore = defineStore('user', () => {
  // const router = useRouter(); // 3. REMOVE this line

  // State
  const token = ref(localStorage.getItem('token') || '');
  const username = ref(localStorage.getItem('username') || '');

  // Getters
  const isAuthenticated = (): boolean => !!token.value;

  // Actions
  async function login(loginForm: { username: string; password: string }) {
    console.log('Attempting login (from Pinia Store):', loginForm);
    await new Promise(resolve => setTimeout(resolve, 1000));

    if (loginForm.username === 'admin' && loginForm.password === '123456') {
      const mockToken = 'mock-jwt-token-string';
      const mockUsername = 'admin';

      token.value = mockToken;
      username.value = mockUsername;

      localStorage.setItem('token', mockToken);
      localStorage.setItem('username', mockUsername);
      
      return Promise.resolve();
    } else {
      return Promise.reject(new Error('Username or password incorrect'));
    }
  }

  function logout() {
    token.value = '';
    username.value = '';

    localStorage.removeItem('token');
    localStorage.removeItem('username');

    // 4. Now this redirect will work correctly
    router.push('/login');
  }

  return { token, username, isAuthenticated, login, logout };
});