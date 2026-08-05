import { STORAGE_KEYS } from '../constants/storage';

const authBaseUrl = import.meta.env.VITE_AUTH_BASE_URL || '/api';
const questionBaseUrl = import.meta.env.VITE_QUESTION_BASE_URL || '/api';

async function request(baseUrl, path, options = {}) {
  const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
  const headers = new Headers(options.headers || {});

  if (!headers.has('Content-Type') && options.body) {
    headers.set('Content-Type', 'application/json');
  }

  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const response = await fetch(`${baseUrl}${path}`, {
    ...options,
    headers,
  });

  const contentType = response.headers.get('content-type') || '';
  const isJson = contentType.includes('application/json');
  const data = isJson ? await response.json() : await response.text();

  if (!response.ok) {
    const message =
      typeof data === 'string'
        ? data
        : data?.message || data?.error || 'Request failed';

    throw new Error(message);
  }

  // Automatically unwrap ApiResponse<T>
  if (isJson && data?.success !== undefined) {
    if (!data.success) {
      throw new Error(data.message || 'Request failed');
    }

    return data.data;
  }

  return data;
}

export const authApi = {
  login(payload) {
    return request(authBaseUrl, '/auth/login', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  register(payload) {
    return request(authBaseUrl, '/auth/register', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  profile() {
    return request(authBaseUrl, '/user/profile');
  },
};

export const questionApi = {
  list({ cursor, pageSize = 8 } = {}) {
    const params = new URLSearchParams({
      pageSize: String(pageSize),
    });

    if (cursor) {
      params.set('cursor', cursor);
    }

    return request(questionBaseUrl, `/question/all?${params.toString()}`);
  },

  getById(id) {
    return request(questionBaseUrl, `/question/${id}`);
  },

  search({ searchTerm, pageNumber = 0, pageSize = 12 }) {
    const params = new URLSearchParams({
      searchTerm,
      pageNumber: String(pageNumber),
      pageSize: String(pageSize),
    });

    return request(
      questionBaseUrl,
      `/question/search?${params.toString()}`
    );
  },

  create(payload) {
    return request(questionBaseUrl, '/question/create', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  update(id, payload) {
    return request(questionBaseUrl, `/question/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
  },
};