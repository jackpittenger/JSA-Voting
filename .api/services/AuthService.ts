import decode from "jwt-decode";
import axios from "axios";

class AuthService {
  async login(token: string, pin: string) {
    return await axios
      .post("/api/account/login", { token, pin })
      .then((res) => {
        this.setToken(res.data.token);
      });
  }

  loggedIn() {
    const token = this.getToken();
    return (
      !!token &&
      !this.isTokenExpired(token) &&
      "permissions" in this.getProfile()
    );
  }

  isTokenExpired(token: string) {
    try {
      const decoded = decode(token);
      return decoded.exp < Date.now() / 1000;
    } catch (err) {
      return false;
    }
  }

  logout() {
    localStorage.removeItem("token");
  }

  getToken() {
    return localStorage.getItem("token");
  }

  getProfile() {
    return decode(this.getToken());
  }

  setToken(token: string) {
    localStorage.setItem("token", token);
  }
}

export default new AuthService();
