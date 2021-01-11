import React, { useEffect, useState } from "react";
import "./App.css";

import NameForm from "./NameForm";
import SpeakerForm from "./SpeakerForm";
import SubmitForm from "./SubmitForm";

import type AuthService from "../../services/AuthService";

type Props = {
  auth: AuthService;
  location: any;
  history: any;
};

export default function Vote(props: Props) {
  const [isTokenVoter, setIsTokenVoter] = useState(props.auth.isTokenVoter());
  const [voted, setVoted] = useState(false);
  useEffect(
    function () {
      const arr = props.location.pathname.split("/");
      const name = arr[arr.length - 1];
      if (name === "") return props.history.push("/404");
      props.auth.fetch("/api/convention/name/" + name, {}, function (
        res: any,
        status: number
      ) {
        if (status > 299) return props.history.push("/404");
        console.log(res);
      });
    },
    [props.auth, props.location.pathname, props.history]
  );
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
