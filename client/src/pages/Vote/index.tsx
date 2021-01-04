import React, { useState } from "react";
import "./App.css";

import NameForm from "./NameForm";
import SpeakerForm from "./SpeakerForm";
import SubmitForm from "./SubmitForm";

import type AuthService from "../../services/AuthService";

type Props = {
  auth: AuthService;
};

export default function Vote(props: Props) {
  const [isTokenVoter, setIsTokenVoter] = useState(props.auth.isTokenVoter());
  const [voted, setVoted] = useState(false);
  return (
    <div>
      {isTokenVoter ? (
        !voted ? (
          <SubmitForm
            setIsTokenVoter={setIsTokenVoter}
            setVoted={setVoted}
            auth={props.auth}
          />
        ) : (
          <SpeakerForm
            setIsTokenVoter={setIsTokenVoter}
            setVoted={setVoted}
            auth={props.auth}
          />
        )
      ) : (
        <NameForm setIsTokenVoter={setIsTokenVoter} auth={props.auth} />
      )}
    </div>
  );
}
