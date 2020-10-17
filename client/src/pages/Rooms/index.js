import React, { useState, useEffect } from "react";
import axios from "axios";

import Header from "../../components/Header";
import NavigationHeader from "./NavigationHeader";
import Card from "./Card";
import List from "./List";
import AuthService from "../../services/AuthService";

export default function Room() {
  const Auth = new AuthService();
  const [rooms, setRooms] = useState([]);
  const [view, setView] = useState("card");
  const [maxPages, setMaxPages] = useState(1);
  const [page, setPage] = useState(0);

  useEffect(() => {
    axios
      .get("/api/page/" + page)
      .then((res) => setRooms(res.data.res))
      .catch((err) => console.error(err));
    axios
      .get("/api/total_pages")
      .then((res) => setMaxPages(res.data.count))
      .catch((err) => console.error(err));
  }, [page, setMaxPages, setRooms]);

  return (
    <div>
      <Header auth={Auth} />
      <br />
      <NavigationHeader
        view={view}
        setView={setView}
        page={page}
        setPage={setPage}
        maxPages={maxPages}
        setMaxPages={setMaxPages}
        setRooms={setRooms}
      />
      {view === "card" ? (
        <Card rooms={rooms} />
      ) : (
        <List rooms={rooms} page={page} maxPages={maxPages} setPage={setPage} />
      )}
    </div>
  );
}
