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

import type AuthService from "services/AuthService";
import type { Room } from "types/roomDashboard";

const useStyles = makeStyles(() => ({
  list: {
    margin: "1% auto auto auto",
    backgroundColor: "#fafafa",
    width: "30em",
  },
}));

type Props = {
  auth: AuthService;
  room: Room;
  createError: Function;
  setRoom: Function;
};

export default function SpeakerList(props: Props) {
  const classes = useStyles();
  const [speaker, setSpeaker] = useState("");

  function addSpeaker() {
    props.auth.fetch(
      "/api/room/speaker",
      {
        method: "POST",
        body: JSON.stringify({ id: props.room.id, name: speaker }),
      },
      (res: { error: string }, status: number) => {
        if (status >= 400) {
          props.createError(status, res.error);
        } else {
          props.setRoom({
            ...props.room,
            speakers: props.room.speakers
              ? props.room.speakers.concat(speaker)
              : [speaker],
          });
          setSpeaker("");
        }
      }
    );
  }

  function removeSpeaker(speaker: string) {
    props.auth.fetch(
      "/api/room/speaker",
      {
        method: "DELETE",
        body: JSON.stringify({ id: props.room.id, name: speaker }),
      },
      (res: { error: string }, status: number) => {
        if (status >= 400) {
          props.createError(status, res.error);
        } else {
          props.setRoom({
            ...props.room,
            speakers: props.room.speakers.filter((e) => e !== speaker),
          });
          setSpeaker("");
        }
      }
    );
  }

  function renderSpeakers() {
    const speakerVoters = props.room.Voter.filter(
      (e) => e.speaker != null && props.room.speakers.indexOf(e.speaker) !== -1
    ).length;
    return props.room.speakers.map((speaker, i) =>
      renderSpeaker(speakerVoters, speaker, i)
    );
  }

  function renderSpeaker(speakerVoters: number, speaker: string, i: number) {
    const len = props.room.Voter.filter((e) => e.speaker === speaker).length;
    const votes = len === 0 ? 0 : (len / speakerVoters) * 100;
    return (
      <ListItem
        style={{
          background:
            "linear-gradient(to right, #39ACE3 " + votes + "%, #fafafa 0%)",
        }}
        key={i}
      >
        <ListItemAvatar>
          <Avatar />
        </ListItemAvatar>
        <ListItemText primary={speaker} />
        <ListItemSecondaryAction>
          <IconButton onClick={() => removeSpeaker(speaker)} edge="end">
            <DeleteIcon />
          </IconButton>
        </ListItemSecondaryAction>
      </ListItem>
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
        {props.room.speakers != null && renderSpeakers()}
      </List>
    </div>
  );
}
