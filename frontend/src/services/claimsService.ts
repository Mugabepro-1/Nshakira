import api from './api';

export interface ClaimData {
  description: string;
}

export interface PaginationParams {
  page: number;
  size: number;
  status?: string;
}

const claimsService = {
  // Claim a lost item
  claimLostItem: async (itemId: string, claimData: ClaimData) => {
    const response = await api.post(`/claims/lost/${itemId}`, claimData);
    return response.data;
  },

  // Claim a found item
  claimFoundItem: async (itemId: string, claimData: ClaimData) => {
    const response = await api.post(`/claims/found/${itemId}`, claimData);
    return response.data;
  },

  // Get all claims (admin)
  getAllClaims: async (params: PaginationParams) => {
    const response = await api.get('/claims', { params });
    return response.data;
  },

  // Approve a claim (admin)
  approveClaim: async (id: string) => {
    const response = await api.put(`/claims/approve/${id}`);
    return response.data;
  },

  // Reject a claim (admin)
  rejectClaim: async (id: string) => {
    const response = await api.put(`/claims/reject/${id}`);
    return response.data;
  },

  // Get claims submitted by current user
  getUserClaims: async () => {
    const response = await api.get('/claims/user');
    return response.data;
  },

  // Download PDF of approved claims (admin)
  downloadApprovedClaimsPDF: async () => {
    const response = await api.get('/claims/approved/pdf', {
      responseType: 'blob',
    });
    return response.data;
  },
};

export default claimsService;