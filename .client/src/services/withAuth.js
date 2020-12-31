import React, { useState, useEffect } from "react";
import AuthService from "./AuthService";
import history from "./history";

export default function withAuth(AuthComponent) {
  const Auth = new AuthService();
  return function AuthWrapped(props) {
    const [user, setUser] = useState(null);
    useEffect(() => {
      if (!Auth.loggedIn()) {
        history.replace("/");
      } else {
        try {
          setUser(Auth.getProfile());
        } catch (err) {
          Auth.logout();
          history.replace("/");
        }
      }
    }, []);

    if (user) {
      return <AuthComponent {...props} user={user} />;
    } else {
      return null;
    }
  };
}
