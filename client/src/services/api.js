import axios from 'axios';

const API_URL = 'http://localhost:5001/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Room API calls
export const roomAPI = {
  // Get all rooms with optional query parameters
  getRooms: (params = {}) => {
    return api.get('/rooms', { params });
  },

  // Get a specific room by ID
  getRoom: (id) => {
    return api.get(`/rooms/${id}`);
  },

  // Create a new room
  createRoom: (roomData) => {
    return api.post('/rooms', roomData);
  },

  // Update a room
  updateRoom: (id, roomData) => {
    return api.put(`/rooms/${id}`, roomData);
  },

  // Delete a room
  deleteRoom: (id) => {
    return api.delete(`/rooms/${id}`);
  },
};

export default api;
