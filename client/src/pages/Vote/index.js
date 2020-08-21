import React from "react";
import "./App.css";

import Header from "../../components/Header";
import NameForm from "./NameForm";
import SubmitForm from "./SubmitForm";
import AuthService from "../../services/AuthService";

export default function Vote() {
  const Auth = new AuthService();
  return (
    <div className="App">
      <Header auth={Auth} />
      {Auth.isTokenVoter() ? <SubmitForm auth={Auth} /> : <NameForm />}
    </div>
  );
}
