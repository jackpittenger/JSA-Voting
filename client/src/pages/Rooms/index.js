import React, { useState } from "react";

import Header from "../../components/Header";
import NavigationHeader from "./NavigationHeader";
import Card from "./Card";
import List from "./List";
import AuthService from "../../services/AuthService";

export default function Room() {
  const Auth = new AuthService();
  const [rooms, setRooms] = useState([]);
  const [view, setView] = useState("card");

  return (
    <div>
      <Header auth={Auth} />
      <br />
      <NavigationHeader setRooms={setRooms} view={view} setView={setView} />
      {view === "card" ? <Card rooms={rooms} /> : <List rooms={rooms} />}
    </div>
  );
}
