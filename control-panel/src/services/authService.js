import axios from 'axios';

const API_URL = "http://java_app:8080/api/v1";

const authService = {
  login: (username, password) => {
    return axios.post(`${API_URL}/auth`, { username, password });
  },

  register: (username, password) => {
    return axios.post(`${API_URL}/registration`, { username, password });
  },

  logout: () => {
    return axios.post(`${API_URL}/logout`).finally(() => {
        authService.setToken(null);
    });
  },

  setToken: (token) => {
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common["Authorization"];
    }
  },
};

export default authService;
