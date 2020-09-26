import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import axios from "axios";

import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";

import Header from "../../components/Header";
import AuthService from "../../services/AuthService";

const useStyles = makeStyles(() => ({
  grid: {
    margin: 10,
    justifyContent: "center",
  },
  gridItem: {
    flexGrow: "unset",
  },
  item: {
    width: "30em",
    height: "10em",
    padding: "1.2em",
  },
}));

export default function Room() {
  const Auth = new AuthService();
  const [page, setPage] = useState(0);
  const [rooms, setRooms] = useState([]);
  const classes = useStyles();

  useEffect(() => {
    axios
      .get("/api/page/" + page)
      .then((res) => setRooms((r) => r.concat(res.data.res)))
      .catch((err) => console.error("1" + err));
  }, [page]);

  return (
    <div>
      <Header auth={Auth} />
      <Grid container spacing={3} className={classes.grid}>
        {rooms === []
          ? null
          : rooms.map((v, i) => {
              return (
                <Grid item xs key={i} className={classes.gridItem}>
                  <Paper className={classes.item}>
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
  );
}
