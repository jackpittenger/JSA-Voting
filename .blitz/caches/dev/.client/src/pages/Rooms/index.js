import React, { useState, useEffect } from "react";

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
    Auth.fetch("/api/page/" + page, { method: "GET" }, (res, status) => {
      if (status >= 400) return console.error(res.error);
      setRooms(res.res);
    });
    Auth.fetch("/api/total_pages", { method: "GET" }, (res, status) => {
      if (status >= 400) return console.error(res.error);
      setMaxPages(res.count);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

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
        <div>
          <br />
          <List
            rooms={rooms}
            page={page}
            maxPages={maxPages}
            setPage={setPage}
          />
          <br />
        </div>
      )}
    </div>
  );
}
