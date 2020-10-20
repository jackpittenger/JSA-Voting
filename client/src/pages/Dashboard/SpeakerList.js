import React, { useState } from "react";
import makeStyles from "@material-ui/core/styles/makeStyles";

import TextField from "@material-ui/core/TextField";
import IconButton from "@material-ui/core/IconButton";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import ListItemText from "@material-ui/core/ListItemText";
import Avatar from "@material-ui/core/Avatar";

import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";
import DeleteIcon from "@material-ui/icons/Delete";

const useStyles = makeStyles(() => ({
  list: {
    backgroundColor: "#fafafa",
    margin: "1% auto auto auto",
    width: "30em",
  },
}));

export default function SpeakerList(props) {
  const classes = useStyles();
  const [speaker, setSpeaker] = useState("");

  function addSpeaker() {
    props.auth.fetch(
      "/api/add_speaker",
      { method: "POST", body: JSON.stringify({ name: speaker }) },
      (res, status) => {
        if (status >= 400) {
          props.createError(status, res.error);
        } else {
          props.setRoom({
            ...props.room,
            speakers: props.room.speakers.push(speaker),
          });
          setSpeaker("");
        }
      }
    );
  }
  return (
    <div>
      <h4>Speaker list:</h4>
      <TextField
        id="speaker"
        label="Speaker Name"
        value={speaker}
        onChange={(e) => setSpeaker(e.target.value)}
      />
      <IconButton onClick={addSpeaker}>
        <AddCircleOutlineIcon color="primary" />
      </IconButton>
      <List className={classes.list}>
        {props.room.speakers != null
          ? props.room.speakers.map((speaker, i) => {
              return (
                <ListItem key={i}>
                  <ListItemAvatar>
                    <Avatar />
                  </ListItemAvatar>
                  <ListItemText primary={speaker} />
                  <ListItemSecondaryAction>
                    <IconButton edge="end">
                      <DeleteIcon />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              );
            })
          : null}
      </List>
    </div>
  );
}
