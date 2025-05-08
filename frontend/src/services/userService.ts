import api from './api';

export interface PaginationParams {
  page: number;
  size: number;
  sort?: string;
  search?: string;
}

const userService = {
  // Get all users (admin only)
  getUsers: async (params: PaginationParams) => {
    const response = await api.get('/users', { params });
    return response.data;
  },

  // Get user by ID (admin only)
  getUserById: async (id: string) => {
    const response = await api.get(`/users/${id}`);
    return response.data;
  },

  // Disable user (admin only)
  disableUser: async (id: string) => {
    const response = await api.put(`/users/${id}/disable`);
    return response.data;
  },

  // Enable user (admin only)
  enableUser: async (id: string) => {
    const response = await api.put(`/users/${id}/enable`);
    return response.data;
  },

  // Get dashboard stats (admin only)
  getDashboardStats: async () => {
    const response = await api.get('/users/dashboard-stats');
    return response.data;
  },
};

export default userService;