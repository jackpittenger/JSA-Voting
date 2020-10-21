import React, { useState, useEffect } from "react";
import makeStyles from "@material-ui/core/styles/makeStyles";
import history from "../../services/history";

import FormLabel from "@material-ui/core/FormLabel";
import FormControl from "@material-ui/core/FormControl";
import Button from "@material-ui/core/Button";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import ListItemText from "@material-ui/core/ListItemText";
import Avatar from "@material-ui/core/Avatar";

import ErrorPopup from "../../components/ErrorPopup";

const useStyles = makeStyles(() => ({
  list: {
    backgroundColor: "#fafafa",
    margin: "1% auto 1% auto",
    width: "30em",
  },
}));

function SpeakerForm(props) {
  const [speaker, setSpeaker] = useState(null);
  const [speakers, setSpeakers] = useState(null);
  const createError = props.createError;
  const setIsTokenVoter = props.setIsTokenVoter;
  const classes = useStyles();

  useEffect(() => {
    props.auth.fetch("/api/get_speakers", { method: "GET" }, (res, status) => {
      if (status >= 400) createError(status, res.error);
      else {
        if (res.speakers.length === 0) {
          props.auth.logout();
          setIsTokenVoter(false);
          history.push("/");
        } else {
          setSpeakers(res.speakers);
        }
      }
    });
  }, [props.auth, createError, setIsTokenVoter]);

  function submit() {
    props.auth.fetch(
      "/api/speaker_vote",
      { method: "POST", body: JSON.stringify({ name: speaker }) },
      processReturn
    );
  }

  function processReturn(res, status) {
    if (status >= 400) {
      props.createError(status, res.error);
    } else {
      props.auth.logout();
      props.setIsTokenVoter(false);
      history.push("/");
    }
  }

  return (
    <form style={{ paddingTop: 15 }}>
      <div>
        <FormControl>
          <FormLabel>Vote for Best Speaker</FormLabel>
          <List className={classes.list}>
            {speakers != null
              ? speakers.map((v, i) => {
                  return (
                    <ListItem
                      style={{
                        backgroundColor: speaker === v ? "#39ACE3" : "#fafafa",
                      }}
                      button={true}
                      onClick={() => setSpeaker(v)}
                      key={i}
                    >
                      <ListItemAvatar>
                        <Avatar />
                      </ListItemAvatar>
                      <ListItemText primary={v} />
                      <ListItemSecondaryAction></ListItemSecondaryAction>
                    </ListItem>
                  );
                })
              : null}
          </List>
        </FormControl>
        <div>
          <Button variant="contained" color="primary" onClick={submit}>
            Submit
          </Button>
        </div>
      </div>
    </form>
  );
}

export default ErrorPopup(SpeakerForm);
