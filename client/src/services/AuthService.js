import decode from 'jwt-decode';
export default class AuthService {

    constructor(domain) {
        this.domain = domain || 'http://localhost:3000';
        this.fetch = this.fetch.bind(this);
        this.login = this.login.bind(this);
        this.getProfile = this.getProfile.bind(this);
    }

    login(token, pin) {
        // Get a token from api server using the fetch api
        return this.fetch(`${this.domain}/api/login`, {
            method: 'POST',
            body: JSON.stringify({
                token,
                pin
            })
        }).then(res => {
            this.setToken(res.token); // Setting the token in localStorage
            return Promise.resolve(res);
        })
    }

    loggedIn() {
        const token = this.getToken();
        return !!token && !this.isTokenExpired(token);
    }

    isTokenExpired(token) {
        try {
            const decoded = decode(token);
            return decoded.exp < Date.now() / 1000;
        }
        catch (err) {
            return false;
        }
    }

    setToken(idToken) {
        // Saves user token to localStorage
        localStorage.setItem('token', idToken)
    }

    getToken() {
        // Retrieves the user token from localStorage
        return localStorage.getItem('token')
    }

    logout() {
        // Clear user token and profile data from localStorage
        localStorage.removeItem('token');
    }

    getProfile() {
        // Using jwt-decode npm package to decode the token
        return decode(this.getToken());
    }


    fetch(url, options, callback) {
        // performs api calls sending the required authentication headers
        const headers = {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        };

        // Setting Authorization header
        // Authorization: Bearer xxxxxxx.xxxxxxxx.xxxxxx
        if (this.loggedIn()) {
            headers['Authorization'] = this.getToken();
        }

        return fetch(url, {
            headers,
            ...options
        })
            .then(this._checkStatus)
            .then(response => response.json())
            .then(ret=>{
                if(callback) callback(ret)
            });
    }

    _checkStatus(response) {
        // raises an error in case response status is not a success
        if (response.status >= 200 && response.status < 300) { // Success status lies between 200 to 300
            return response
        } else {
            let error = new Error(response.statusText);
            error.response = response;
            throw error
        }
    }
}
