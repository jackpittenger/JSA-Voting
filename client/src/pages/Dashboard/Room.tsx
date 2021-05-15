import React, { useState, useEffect } from "react";

import openSoc from "services/api";

import ErrorPopup from "components/ErrorPopup";
import RoomTable from "components/RoomTable";
import SpeakerList from "components/SpeakerList";

import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import CircularProgress from "@material-ui/core/CircularProgress";

import type AuthService from "services/AuthService";
import type { Room, Voter } from "types/roomDashboard";
import SelectRoom from "components/SelectRoom";

type Props = {
  auth: AuthService;
  createError: Function;
};

function RoomDashboard(props: Props) {
  const baseRoom: Room = {
    id: -1,
    Voter: [],
    accessCode: "",
    open: false,
    votingOpen: false,
    byline: "",
    conventionId: -1,
    speakers: [],
  };
  const [loading, setLoading] = useState(true);
  const [room, setRoom] = useState(baseRoom);
  const [delay, setDelay] = useState(0);

  useEffect(() => {
    if (props.auth.loggedIn()) {
      const io = openSoc(props.auth.getToken());
      io.on("newuser", (data: Voter) =>
        setRoom({ ...room, Voter: [...room.Voter, data] })
      );
      io.on("vote", (data: Voter) => {
        let users = room.Voter;
        let result = users.find((o, i) => {
          if (o.id === data.id) {
            users[i].vote = data.vote;
            if (data.speaker) users[i].speaker = data.speaker;
            return true;
          }
          return false;
        });
        if (!result) {
          setRoom({
            ...room,
            Voter: [
              ...room.Voter,
              {
                id: data.id,
                firstName: data.firstName,
                lastName: data.lastName,
                school: data.school,
                vote: data.vote,
                speaker: "",
              },
            ],
          });
        }
        setRoom({ ...room, Voter: users });
      });
      return () => {
        io.disconnect();
      };
    }
  }, [props.auth, room]);

  function updateRoom(id: string) {
    props.auth.fetch("/api/room/id/" + id, {}, function (
      res: Room,
      status: number
    ) {
      if (status >= 400) {
        //@ts-ignore
        props.createError(status, res.error);
      } else {
        setRoom(res);
        setLoading(false);
      }
    });
  }

  function handleByline(value: string) {
    clearTimeout(delay);
    setRoom({ ...room, byline: value });
    if (value.length <= 120)
      setDelay(
        window.setTimeout(() => {
          fetchByline(value);
        }, 2000)
      );
  }

  function fetchByline(value: string) {
    props.auth.fetch(
      "/api/room_byline",
      { method: "PATCH", body: JSON.stringify({ byline: value }) },
      function (res: { error: string }, status: number) {
        if (status >= 400) {
          props.createError(status, res.error);
        }
      }
    );
  }

  function deleteRoom() {
    props.auth.fetch(
      "/api/room",
      { method: "DELETE", body: JSON.stringify({ id: room.id }) },
      (res: { error: string }, status: number) => {
        if (status >= 400) {
          props.createError(status, res.error);
        } else {
          setLoading(true);
          setRoom(baseRoom);
        }
      }
    );
  }

  function toggleRoom() {
    props.auth.fetch(
      "/api/room/toggle/open",
      { method: "PATCH", body: JSON.stringify({ id: room.id }) },
      function (res: { error: string }, status: number) {
        if (status >= 400) {
          props.createError(status, res.error);
        } else setRoom({ ...room, open: !room.open });
      }
    );
  }

  function toggleVoting() {
    props.auth.fetch(
      "/api/room/toggle/voting",
      { method: "PATCH", body: JSON.stringify({ id: room.id }) },
      function (res: { error: string }, status: number) {
        if (status >= 400) {
          props.createError(status, res.error);
        } else setRoom({ ...room, votingOpen: !room.votingOpen });
      }
    );
  }

  function renderVotes() {
    let arr = [0, 0, 0];
    for (let i = 0; i < room.Voter.length; i++) {
      if (room.Voter[i].vote === "YEA") arr[0]++;
      if (room.Voter[i].vote === "ABS") arr[1]++;
      if (room.Voter[i].vote === "NAY") arr[2]++;
    }
    return (
      <div>
        <span style={{ color: "green" }}>{arr[0]}</span> /{" "}
        <span style={{ color: "grey" }}>{arr[1]}</span> /{" "}
        <span style={{ color: "red" }}>{arr[2]}</span>
      </div>
    );
  }

  function closeRoom() {
    props.auth.fetch(
      "/api/room/conclude",
      { method: "PATCH", body: JSON.stringify({ id: room.id }) },
      function (res: { error: string }, status: number) {
        if (status >= 400) {
          props.createError(status, res.error);
        } else {
          setLoading(true);
          setRoom(baseRoom);
        }
      }
    );
  }

  function deleteUser(id: string) {
    props.auth.fetch(
      "/api/voter",
      {
        method: "DELETE",
        body: JSON.stringify({
          id: room.id,
          voterId: id,
        }),
      },
      (res: { success: boolean; error: string }, status: number) => {
        if (status >= 400) {
          props.createError(status, res.error);
        } else {
          if (res.success) {
            let arr = room.Voter.filter((val) => {
              return val.id !== id;
            });
            setRoom({ ...room, Voter: arr });
          }
        }
      }
    );
  }

  return (
    <div>
      <SelectRoom auth={props.auth} updateRoom={updateRoom} />
      {loading ? (
        <div></div>
      ) : (
        <div>
          <h3>{room.id}</h3>
          <div>Code: {room.accessCode}</div>
          <TextField
            id="byline"
            label="Byline"
            multiline
            rowsMax={3}
            value={room.byline}
            onChange={(e) => handleByline(e.target.value)}
            error={room.byline.length > 120}
            helperText="Maxmimum of 120 characters"
            style={{ width: "25em" }}
          />
          <br />
          <br />
          <Button onClick={toggleRoom} color="primary">
            {room.open === false ? "Open Room" : "Close Room"}
          </Button>
          <Button onClick={toggleVoting} color="default">
            {room.votingOpen === false ? "Open for Voting" : "Close Voting"}
          </Button>
          <Button onClick={deleteRoom} color="secondary">
            Delete Room
          </Button>
          <Button onClick={closeRoom} color="primary">
            Conclude
          </Button>
          <SpeakerList
            createError={props.createError}
            auth={props.auth}
            room={room}
            setRoom={setRoom}
          />
          <h4 style={{ marginTop: ".5em" }}>{renderVotes()}</h4>
          <RoomTable Voter={room.Voter} deleteUser={deleteUser} />
        </div>
      )}
    </div>
  );
}

export default ErrorPopup(RoomDashboard);
