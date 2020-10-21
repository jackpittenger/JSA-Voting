import React, { useState } from "react";
import "./App.css";

import Header from "../../components/Header";
import NameForm from "./NameForm";
import SpeakerForm from "./SpeakerForm";
import SubmitForm from "./SubmitForm";
import AuthService from "../../services/AuthService";

export default function Vote() {
  const Auth = new AuthService();
  const [isTokenVoter, setIsTokenVoter] = useState(Auth.setIsTokenVoter);
  const [voted, setVoted] = useState(false);
  return (
    <div className="App">
      <Header auth={Auth} />
      {isTokenVoter ? (
        !voted ? (
          <SubmitForm
            setIsTokenVoter={setIsTokenVoter}
            setVoted={setVoted}
            auth={Auth}
          />
        ) : (
          <SpeakerForm
            setIsTokenVoter={setIsTokenVoter}
            setVoted={setVoted}
            auth={Auth}
          />
        )
      ) : (
        <NameForm setIsTokenVoter={setIsTokenVoter} auth={Auth} />
      )}
    </div>
  );
}
