import React, { useEffect, useState } from "react";

import type AuthService from "services/AuthService";

type Props = {
  auth: AuthService;
  updateRoom: Function;
};

function SelectRoom(props: Props) {
  const [selectableRooms, setSelectableRooms] = useState([]);
  useEffect(() => {}, []);
  return <div>{selectableRooms.map(() => "hi")}</div>;
}

export default SelectRoom;
