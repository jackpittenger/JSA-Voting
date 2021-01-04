import React, { useState, useEffect } from "react";

import NavigationHeader from "./NavigationHeader";
import Card from "./Card";
import List from "./List";

import type AuthService from "../../services/AuthService";

type Props = {
  auth: AuthService;
};

export default function Room(props: Props) {
  const [rooms, setRooms] = useState([]);
  const [view, setView] = useState("card");
  const [maxPages, setMaxPages] = useState(1);
  const [page, setPage] = useState(0);

  useEffect(() => {
    props.auth.fetch(
      "/api/page/" + page,
      { method: "GET" },
      (res: any, status: number) => {
        if (status >= 400) return console.error(res.error);
        setRooms(res.res);
      }
    );
    props.auth.fetch(
      "/api/total_pages",
      { method: "GET" },
      (res: any, status: number) => {
        if (status >= 400) return console.error(res.error);
        setMaxPages(res.count);
      }
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  return (
    <div>
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
