import { apiRequest } from './apiService'; 

export const authService = {
  async login(credentials: any) {
    const res = await apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    return res.json();
  },
  
  async register(data: any) {
    const res = await apiRequest('/auth/signup', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return res.json();
  }
};