import React from "react";
import Header from "../../components/Header";
import AuthService from "../../services/AuthService";

export default function Dashboard() {
  const Auth = new AuthService();
  return (
    <div>
      <Header auth={Auth} />
      <h1 style={{ textAlign: "center" }}>
        404
        <br />
        Not Found
      </h1>
      ;
    </div>
  );
}
