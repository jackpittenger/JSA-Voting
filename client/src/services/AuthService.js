import decode from "jwt-decode";
import axios from "axios";

export default class AuthService {
  constructor() {
    this.login = this.login.bind(this);
    this.getProfile = this.getProfile.bind(this);
  }

  login(token, pin) {
    return axios
      .post(`/api/login`, { token, pin })
      .then((res) => {
        this.setToken(res.data.token);
      })
      .catch((e) => console.error(e));
  }

  loggedIn() {
    const token = this.getToken();
    return !!token && !this.isTokenExpired(token);
  }

  isTokenExpired(token) {
    try {
      const decoded = decode(token);
      return decoded.exp < Date.now() / 1000;
    } catch (err) {
      return false;
    }
  }

  setToken(idToken) {
    localStorage.setItem("token", idToken);
  }

  getToken() {
    return localStorage.getItem("token");
  }

  logout() {
    localStorage.removeItem("token");
  }

  getProfile() {
    return decode(this.getToken());
  }

  fetch(url, options, callback) {
    const headers = {
      Accept: "application/json",
      "Content-Type": "application/json",
    };

    if (this.loggedIn()) {
      headers["Authorization"] = this.getToken();
    }

    return fetch(url, {
      headers,
      ...options,
    })
      .then(this._checkStatus)
      .then((response) => response.json())
      .then((ret) => {
        if (callback) callback(ret);
      });
  }

  _checkStatus(response) {
    if (response.status >= 200 && response.status < 300) {
      return response;
    } else {
      let error = new Error(response.statusText);
      error.response = response;
      throw error;
    }
  }
}
