import React, { useEffect, useState } from "react";

import type AuthService from "services/AuthService";

type RoomQueried = {
  name: string;
  accessCode: string;
};

type Props = {
  auth: AuthService;
  updateRoom: Function;
};

function SelectRoom(props: Props) {
  const defaultSelectable: RoomQueried[] = [];
  const [selectableRooms, setSelectableRooms] = useState(defaultSelectable);
  const [convention, setConvention] = useState(1);
  const [per, setPer] = useState(10);
  const [page, setPage] = useState(0);
  useEffect(() => {
    props.auth.fetch(
      "/api/room/list/" + convention + "/" + per + "/" + page,
      {
        method: "GET",
      },
      (result: RoomQueried[], status: number) => {
        if (status < 400) {
          setSelectableRooms(result);
        }
      }
    );
  }, [props.auth, per, convention, page]);
  return (
    <div>
      {selectableRooms.map((v, i) => (
        <div key={i}>
          {v.name} - {v.accessCode}
        </div>
      ))}
    </div>
  );
}

export default SelectRoom;
