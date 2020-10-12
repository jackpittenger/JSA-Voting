import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import axios from "axios";

import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";

import NavigateBeforeIcon from "@material-ui/icons/NavigateBefore";
import NavigateNextIcon from "@material-ui/icons/NavigateNext";

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
    flexBasis: "33%",
  },
  yea: {
    backgroundColor: "lightgreen",
  },
  nay: {
    backgroundColor: "#ffcccb",
  },
  abs: {
    backgroundColor: "lightgray",
  },
  pageNumber: {
    alignItems: "center",
    display: "flex",
  },
  navigationGrid: {
    width: "100%",
    justifyContent: "center",
  },
}));

export default function Room() {
  const Auth = new AuthService();
  const [page, setPage] = useState(1);
  const [maxPages, setMaxPages] = useState(1);
  const [rooms, setRooms] = useState([]);
  const classes = useStyles();

  useEffect(() => {
    axios
      .get("/api/page/" + page)
      .then((res) => setRooms(res.data.res))
      .catch((err) => console.error(err));
    axios
      .get("/api/max_pages")
      .then((res) => setMaxPages(res.data.count))
      .catch((err) => console.error(err));
  }, [page]);

  return (
    <div>
      <Header auth={Auth} />
      <br />
      <Grid
        style={{ margin: 0 }}
        className={classes.navigationGrid}
        container
        spacing={3}
      >
        <Grid item>
          <IconButton disabled={page === 1} onClick={() => setPage(page - 1)}>
            <NavigateBeforeIcon />
          </IconButton>
        </Grid>
        <Grid className={classes.pageNumber} item>
          Page {page}
        </Grid>
        <Grid item>
          <IconButton
            disabled={maxPages === page}
            onClick={() => setPage(page + 1)}
          >
            <NavigateNextIcon />
          </IconButton>
        </Grid>
      </Grid>
      <Grid container spacing={2} className={classes.grid}>
        {rooms === []
          ? null
          : rooms.map((v, i) => {
              return (
                <Paper key={i} className={classes.item}>
                  <Grid container spacing={2}>
                    <Grid item xs container direction="column" spacing={2}>
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
                        <Typography variant="body2">
                          <span style={{ fontSize: "1.2em" }}>
                            {v.byline ? (
                              v.byline
                            ) : (
                              <em style={{ color: "grey" }}>
                                No byline provided
                              </em>
                            )}
                          </span>
                        </Typography>
                      </Grid>
                    </Grid>
                    <Grid item>
                      <Typography variant="subtitle1">
                        {v.yea > v.nay ? (
                          <Button className={classes.yea} disableRipple>
                            YEA
                          </Button>
                        ) : v.nay > v.yea ? (
                          <Button className={classes.nay} disableRipple>
                            NAY
                          </Button>
                        ) : (
                          <Button className={classes.abs} disableRipple>
                            ABS
                          </Button>
                        )}
                      </Typography>
                    </Grid>
                  </Grid>
                </Paper>
              );
            })}
      </Grid>
    </div>
  );
}
