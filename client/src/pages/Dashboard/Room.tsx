import React, { useState, useEffect } from "react";

import openRoomSocket from "services/api";

import ErrorPopup from "components/ErrorPopup";
import RoomTable from "components/RoomTable";
import SelectRoom from "components/SelectRoom";
import SpeakerList from "components/SpeakerList";

import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";

import type AuthService from "services/AuthService";
import type { Room, Voter } from "types/roomDashboard";

type Props = {
  auth: AuthService;
  createError: Function;
};

function RoomDashboard(props: Props) {
  // Room
  const [id, setId] = useState(-1);
  const [voters, setVoters] = useState(new Array<Voter>());
  const [accessCode, setAccessCode] = useState("");
  const [open, setOpen] = useState(false);
  const [votingOpen, setVotingOpen] = useState(false);
  const [byline, setByline] = useState("");
  // eslint-disable-next-line
  const [conventionId, setConventionId] = useState(-1);
  const [speakers, setSpeakers] = useState(new Array<string>());

  const [loading, setLoading] = useState(true);
  const [delay, setDelay] = useState(0);

  useEffect(() => {
    if (props.auth.loggedIn() && id !== -1) {
      // Subscribe to room updates
      const io = openRoomSocket(props.auth.getToken(), id);

      io.on("new_voter", (data: Voter) => {
        setVoters((v) => v.concat([data]));
      });

      io.on("voter_voted", (data: { id: string; vote: string }) => {
        setVoters((varr) => {
          const v: number | undefined = varr.findIndex(
            (v: Voter) => v.id === data.id
          );
          if (v !== -1) {
            varr[v].vote = data.vote;
          }
          return [...varr];
        });
      });

      return () => {
        io.disconnect();
      };
    }
  }, [props.auth, id]);

  function updateRoom(id: string) {
    props.auth.fetch("/api/room/id/" + id, {}, function (
      res: Room,
      status: number
    ) {
      if (status >= 400) {
        //@ts-ignore
        props.createError(status, res.error);
      } else {
        setId(res.id);
        setVoters(res.Voter);
        setAccessCode(res.accessCode);
        setOpen(res.open);
        setVotingOpen(res.votingOpen);
        setByline(res.byline);
        setConventionId(res.conventionId);
        setSpeakers(res.speakers);
        setLoading(false);
      }
    });
  }

  function handleByline(value: string) {
    clearTimeout(delay);
    setByline(value);
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
      { method: "DELETE", body: JSON.stringify({ id: id }) },
      (res: { error: string }, status: number) => {
        if (status >= 400) {
          props.createError(status, res.error);
        } else {
          resetRoom();
        }
      }
    );
  }

  function resetRoom() {
    setLoading(true);
    setId(-1);
    setVoters(new Array<Voter>());
    setAccessCode("");
    setOpen(false);
    setVotingOpen(false);
    setByline("");
    setConventionId(-1);
    setSpeakers(new Array<string>());
  }

  function toggleRoom() {
    props.auth.fetch(
      "/api/room/toggle/open",
      { method: "PATCH", body: JSON.stringify({ id: id }) },
      function (res: { error: string }, status: number) {
        if (status >= 400) {
          props.createError(status, res.error);
        } else setOpen(!open);
      }
    );
  }

  function toggleVoting() {
    props.auth.fetch(
      "/api/room/toggle/voting",
      { method: "PATCH", body: JSON.stringify({ id: id }) },
      function (res: { error: string }, status: number) {
        if (status >= 400) {
          props.createError(status, res.error);
        } else setVotingOpen(!votingOpen);
      }
    );
  }

  function renderVotes() {
    let arr = [0, 0, 0];
    for (let i = 0; i < voters.length; i++) {
      if (voters[i].vote === "YEA") arr[0]++;
      if (voters[i].vote === "ABS") arr[1]++;
      if (voters[i].vote === "NAY") arr[2]++;
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
      { method: "PATCH", body: JSON.stringify({ id: id }) },
      function (res: { error: string }, status: number) {
        if (status >= 400) {
          props.createError(status, res.error);
        } else {
          setLoading(true);
          resetRoom();
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
          id: id,
          voterId: id,
        }),
      },
      (res: { success: boolean; error: string }, status: number) => {
        if (status >= 400) {
          props.createError(status, res.error);
        } else {
          if (res.success) {
            let arr = voters.filter((val) => {
              return val.id !== id;
            });
            setVoters(arr);
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
          <h3>{id}</h3>
          <div>Code: {accessCode}</div>
          <TextField
            id="byline"
            label="Byline"
            multiline
            rowsMax={3}
            value={byline}
            onChange={(e) => handleByline(e.target.value)}
            error={byline.length > 120}
            helperText="Maxmimum of 120 characters"
            style={{ width: "25em" }}
          />
          <br />
          <br />
          <Button onClick={toggleRoom} color="primary">
            {open === false ? "Open Room" : "Close Room"}
          </Button>
          <Button onClick={toggleVoting} color="default">
            {votingOpen === false ? "Open for Voting" : "Close Voting"}
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
            id={id}
            speakers={speakers}
            voters={voters}
            setSpeakers={setSpeakers}
          />
          <h4 style={{ marginTop: ".5em" }}>{renderVotes()}</h4>
          <RoomTable Voter={voters} deleteUser={deleteUser} />
        </div>
      )}
    </div>
  );
}

export default ErrorPopup(RoomDashboard);
