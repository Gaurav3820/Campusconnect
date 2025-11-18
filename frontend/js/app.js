// frontend/js/app.js
const app = {
  BASE_URL: 'http://localhost:5000/api',
  tokenKey: 'campus_token',
  userKey: 'campus_user',
  user: null,
  // Initialize — check token and optionally fetch user info
  init: async function(){
    const token = localStorage.getItem(this.tokenKey);
    if (!token) { this.user = null; return; }
    // Basic decode of token payload (if backend provides user in token, otherwise call /me)
    try {
      // If backend supports /auth/me, call it. Otherwise the token includes only id.
      // For now, set a shallow user object from localStorage if present
      const stored = localStorage.getItem(this.userKey);
      this.user = stored ? JSON.parse(stored) : null;
    } catch(e){ this.user = null; }
  },

  setToken: function(token){
    localStorage.setItem(this.tokenKey, token);
  },
  setUser: function(user){
    this.user = user;
    localStorage.setItem(this.userKey, JSON.stringify(user));
  },
  logout: function(){
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userKey);
    this.user = null;
    location.href = 'login.html';
  },

  _authHeaders: function(){
    const t = localStorage.getItem(this.tokenKey);
    return t ? { 'Authorization': 'Bearer ' + t } : {};
  },

  apiGet: async function(path){
    const res = await fetch(this.BASE_URL + path, { headers: { ...this._authHeaders() } });
    return res.ok ? res.json() : Promise.reject(await res.text());
  },

  apiPost: async function(path, payload){
    const res = await fetch(this.BASE_URL + path, {
      method:'POST',
      headers: { 'Content-Type': 'application/json', ...this._authHeaders() },
      body: JSON.stringify(payload)
    });
    return res.ok ? res.json() : Promise.reject(await res.text());
  },

  // raw fetch helper for FormData or file uploads
  fetchRaw: function(path, options){
    // options: { method, body (FormData), headers? }
    return fetch(this.BASE_URL + path, {
      method: options.method || 'POST',
      body: options.body,
      headers: { ...this._authHeaders(), ...(options.headers || {}) }
    });
  }
};

// automatically expose app in browser
window.app = app;
