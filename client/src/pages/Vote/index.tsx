import React, { useEffect, useState } from "react";
import "./App.css";

import Layout from "layout";

import { useStateContext } from "routes/state";
import { ActionType } from "routes/reducer";

import NameForm from "./NameForm";
import SpeakerForm from "./SpeakerForm";
import VoteForm from "./VoteForm";

import type AuthService from "services/AuthService";

type Props = {
  auth: AuthService;
  location: any;
  history: any;
};

export default function Vote(props: Props) {
  const [isTokenVoter, setIsTokenVoter] = useState(props.auth.isTokenVoter());
  const [voted, setVoted] = useState(false);

  const { dispatch } = useStateContext();

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
        // @ts-ignore
        dispatch({
          type: res.convention.roomsOpen
            ? ActionType.ROOMS_OPEN
            : ActionType.ROOMS_CLOSED,
        });
      });
    },
    [props.auth, props.location.pathname, props.history, dispatch]
  );
  return (
    <Layout auth={props.auth}>
      {isTokenVoter ? (
        !voted ? (
          <VoteForm
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
    </Layout>
  );
}
