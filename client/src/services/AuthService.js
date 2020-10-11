import decode from "jwt-decode";
import axios from "axios";

export default class AuthService {
  constructor() {
    this.login = this.login.bind(this);
    this.getProfile = this.getProfile.bind(this);
  }

  login(token, pin) {
    return axios.post(`/api/login`, { token, pin }).then((res) => {
      this.setToken(res.data.token);
    });
  }

  loggedIn() {
    const token = this.getToken();
    return (
      !!token &&
      !this.isTokenExpired(token) &&
      "permission" in this.getProfile()
    );
  }

  isTokenExpired(token) {
    try {
      const decoded = decode(token);
      return decoded.exp < Date.now() / 1000;
    } catch (err) {
      return false;
    }
  }

  isTokenVoter() {
    const token = this.getToken();
    return (
      !!token &&
      !this.isTokenExpired(token) &&
      !("permission" in this.getProfile())
    );
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

    if (this.loggedIn() || this.isTokenVoter()) {
      headers["Authorization"] = this.getToken();
    }

    return fetch(url, {
      headers,
      ...options,
    })
      .then(async (response) => [await response.json(), response.status])
      .then((ret) => {
        if (callback) callback(ret[0], ret[1]);
      });
  }
}
