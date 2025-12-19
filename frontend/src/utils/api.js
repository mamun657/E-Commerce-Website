// Centralized API base URL helper
// Uses VITE_API_URL when provided, otherwise falls back to localhost:5000
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default API_URL;
