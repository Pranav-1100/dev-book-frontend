
// Generic API call function with authentication
const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://dev-book.trou.hackclub.app/api';

async function fetchAPI(endpoint, options = {}) {
  // Get token from localStorage
  const token = localStorage.getItem('auth_token');
  
  const defaultHeaders = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      ...options,
      headers: defaultHeaders,
    });

    // Handle authentication errors
    if (response.status === 401) {
      // Clear invalid token
      localStorage.removeItem('auth_token');
      throw new Error('Authentication required');
    }

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || `Request failed with status ${response.status}`);
    }

    return response.json();
  } catch (error) {
    console.error('API Error:', error);
    
    // Redirect to login if authentication error
    if (error.message === 'Authentication required' && typeof window !== 'undefined') {
      window.location.href = '/auth/login';
    }
    
    throw error;
  }
}

// Auth API calls
export const authAPI = {
  login: async (credentials) => {
    const response = await fetchAPI('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    
    if (response.token) {
      localStorage.setItem('auth_token', response.token);
    }
    
    return response;
  },

  register: async (userData) => {
    const response = await fetchAPI('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
    
    if (response.token) {
      localStorage.setItem('auth_token', response.token);
    }
    
    return response;
  },

  getProfile: () => fetchAPI('/auth/profile'),
};

// Chat API calls
export const chatAPI = {
  sendMessage: async (message) => {
    try {
      return await fetchAPI('/chat/message', {
        method: 'POST',
        body: JSON.stringify({
          message: message
        }),
      });
    } catch (error) {
      console.error('Chat API Error:', error);
      throw error;
    }
  },

  getHistory: () => fetchAPI('/chat/history'),

  deleteChat: (chatId) =>
    fetchAPI(`/chat/${chatId}`, {
      method: 'DELETE',
    }),
};

// Diagrams API calls
export const diagramAPI = {
  generate: (data) =>
    fetchAPI('/diagrams', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  getAll: () => fetchAPI('/diagrams'),

  getById: (id) => fetchAPI(`/diagrams/${id}`),

  delete: (id) =>
    fetchAPI(`/diagrams/${id}`, {
      method: 'DELETE',
    }),
};
  

// Books API calls
export const booksAPI = {
  getAll: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return fetchAPI(`/books${queryString ? `?${queryString}` : ''}`);
  },

  getById: (id) => 
    fetchAPI(`/books/${id}`),

  create: (bookData) =>
    fetchAPI('/books', {
      method: 'POST',
      body: JSON.stringify(bookData),
    }),

  addRating: (bookId, ratingData) =>
    fetchAPI(`/books/${bookId}/ratings`, {
      method: 'POST',
      body: JSON.stringify(ratingData),
    }),

  search: (query) =>
    fetchAPI(`/books/search/${encodeURIComponent(query)}`),

  getRecommendations: (niche, difficulty) => {
    const queryString = difficulty ? `?difficulty=${difficulty}` : '';
    return fetchAPI(`/books/recommend/${niche}${queryString}`);
  },
};
