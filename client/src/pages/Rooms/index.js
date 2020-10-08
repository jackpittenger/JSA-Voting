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
    width: "100%",
    margin: "unset",
    justifyContent: "center",
  },
  gridItem: {
    flexGrow: "unset",
    maxWidth: "100%",
  },
  item: {
    maxWidth: "90%",
    width: "30em",
    height: "10em",
    padding: "1.2em",
    margin: "1%",
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
      .catch((err) => console.error(err));
  }, [page]);

  return (
    <div>
      <Header auth={Auth} />
      <Grid container spacing={3} className={classes.grid}>
        {rooms === []
          ? null
          : rooms.map((v, i) => {
              return (
                <Paper className={classes.item}>
                  <Grid container spacing={2}>
                    <Grid
                      item
                      xs
                      container
                      direction="column"
                      key={i}
                      spacing={2}
                    >
                      <Grid item>
                        <Typography gutterBottom variant="subtitle1">
                          {v.id}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          ID: {v._id}
                        </Typography>
                        <Typography variant="subtitle1">
                          <span style={{ color: "green" }}>{v.yea}</span>-
                          <span style={{ color: "grey" }}>{v.abs}</span>-
                          <span style={{ color: "red" }}>{v.nay}</span>
                        </Typography>
                      </Grid>
                    </Grid>
                    <Grid item>
                      <Typography variant="subtitle1">$19.00</Typography>
                    </Grid>
                  </Grid>
                </Paper>
              );
            })}
      </Grid>
    </div>
  );
}
