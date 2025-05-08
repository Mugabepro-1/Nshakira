import api from './api';

export interface LostItemData {
  title: string;
  description: string;
  category: string;
  location: string;
  lostDate: string;
  contactInfo: string;
  image?: File | null;
}

export interface FoundItemData {
  title: string;
  description: string;
  category: string;
  location: string;
  foundDate: string;
  contactInfo: string;
  image?: File | null;
}

export interface PaginationParams {
  page: number;
  size: number;
  sort?: string;
  search?: string;
}

const itemsService = {
  // Lost Items
  reportLostItem: async (itemData: LostItemData) => {
    const formData = new FormData();
    Object.entries(itemData).forEach(([key, value]) => {
      if (key === 'image' && value) {
        formData.append('image', value);
      } else if (value !== null && value !== undefined) {
        formData.append(key, String(value));
      }
    });

    const response = await api.post('/lost/report', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  getLostItems: async (params: PaginationParams) => {
    const response = await api.get('/lost', { params });
    return response.data;
  },

  getLostItemById: async (id: string) => {
    const response = await api.get(`/lost/${id}`);
    return response.data;
  },

  getUserLostItems: async () => {
    const response = await api.get('/lost/user');
    return response.data;
  },

  // Found Items
  reportFoundItem: async (itemData: FoundItemData) => {
    const formData = new FormData();
    Object.entries(itemData).forEach(([key, value]) => {
      if (key === 'image' && value) {
        formData.append('image', value);
      } else if (value !== null && value !== undefined) {
        formData.append(key, String(value));
      }
    });

    const response = await api.post('/found/report', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  getFoundItems: async (params: PaginationParams) => {
    const response = await api.get('/found', { params });
    return response.data;
  },

  getFoundItemById: async (id: string) => {
    const response = await api.get(`/found/${id}`);
    return response.data;
  },

  getUserFoundItems: async () => {
    const response = await api.get('/found/user');
    return response.data;
  },
};

export default itemsService;