import React, { useState } from "react";
import "./App.css";

import Header from "../../components/Header";
import NameForm from "./NameForm";
import SubmitForm from "./SubmitForm";
import AuthService from "../../services/AuthService";

export default function Vote() {
  const Auth = new AuthService();
  const [isTokenVoter, setIsTokenVoter] = useState(Auth.setIsTokenVoter);
  return (
    <div className="App">
      <Header auth={Auth} />
      {isTokenVoter ? (
        <SubmitForm auth={Auth} />
      ) : (
        <NameForm setIsTokenVoter={setIsTokenVoter} auth={Auth} />
      )}
    </div>
  );
}
