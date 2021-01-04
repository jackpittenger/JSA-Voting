import React, { useState, useEffect } from "react";

import history from "../../services/history";

import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";

import type AuthService from "../../services/AuthService";

type Convention = {
  name: string;
  createdAt: Date;
  roomsOpen: Boolean;
};

type Props = {
  auth: AuthService;
};

function Convention(props: Props) {
  const [conventions, setConventions] = useState([]);
  useEffect(
    function () {
      props.auth.fetch("/api/convention/list", {}, function (res: any) {
        setConventions(res.conventions);
      });
    },
    [props.auth]
  );
  return (
    <div>
      <h1 style={{ textAlign: "center" }}>
        Welcome JSAer{" "}
        <span role="img" aria-label="Wave">
          👋
        </span>
      </h1>
      <p>Select your convention below!</p>
      <hr />
      {conventions.length > 0 ? (
        <Grid
          container
          spacing={2}
          style={{ width: "100%", margin: "unset", justifyContent: "center" }}
        >
          {conventions.map((v: Convention, i: number) => (
            <Grid item key={i}>
              <Paper>
                <Button
                  style={{ textTransform: "none" }}
                  onClick={() => history.push("/convention/" + v.name)}
                >
                  {v.name}
                </Button>
              </Paper>
            </Grid>
          ))}
        </Grid>
      ) : (
        <div>No active conventions!</div>
      )}
    </div>
  );
}

export default Convention;
