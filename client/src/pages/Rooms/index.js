import React, { useState, useEffect } from "react";
import axios from "axios";

import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";

import Header from "../../components/Header";
import AuthService from "../../services/AuthService";

export default function Room() {
  const Auth = new AuthService();
  const [page, setPage] = useState(0);
  const [rooms, setRooms] = useState([]);
  useEffect(() => {
    axios
      .get("/api/page/" + page)
      .then((res) => setRooms((r) => r.concat(res.data.res)))
      .catch((err) => console.error("1" + err));
  }, [page]);

  return (
    <div>
      <Header auth={Auth} />
      <div>
        <Grid container spacing={3}>
          {rooms === []
            ? null
            : rooms.map((v, i) => {
                return (
                  <Grid item xs key={i}>
                    <Paper>
                      <Typography gutterBottom variant="subtitle1">
                        {v.id}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        ID: {v._id}
                      </Typography>
                      <Typography variant="subtitle1">
                        {v.yea}-{v.abs}-{v.nay}
                      </Typography>
                    </Paper>
                  </Grid>
                );
              })}
        </Grid>
      </div>
    </div>
  );
}
