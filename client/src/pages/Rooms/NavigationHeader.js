import React, { useState, useEffect } from "react";
import makeStyles from "@material-ui/core/styles/makeStyles";
import axios from "axios";

import Grid from "@material-ui/core/Grid";
import IconButton from "@material-ui/core/IconButton";
import Button from "@material-ui/core/Button";

import NavigateBeforeIcon from "@material-ui/icons/NavigateBefore";
import NavigateNextIcon from "@material-ui/icons/NavigateNext";

const useStyles = makeStyles(() => ({
  pageNumber: {
    alignItems: "center",
    display: "flex",
  },
  navigationGrid: {
    display: "flex",
    flexWrap: "wrap",
  },
  navigationPannel: {
    margin: 0,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
  },
}));

export default function NavigationHeader(props) {
  const [maxPages, setMaxPages] = useState(1);
  const [page, setPage] = useState(1);
  const classes = useStyles();
  const setRooms = props.setRooms;
  useEffect(() => {
    axios
      .get("/api/page/" + page)
      .then((res) => setRooms(res.data.res))
      .catch((err) => console.error(err));
    axios
      .get("/api/max_pages")
      .then((res) => setMaxPages(res.data.count))
      .catch((err) => console.error(err));
  }, [page, setRooms]);

  return (
    <Grid className={classes.navigationPannel} spacing={2} container>
      <Grid item>
        <Grid style={{ justifyContent: "center" }} container>
          <Grid style={{ paddingRight: 15 }} item>
            <Button
              color={props.view === "card" ? "primary" : "default"}
              variant={props.view === "card" ? "outlined" : "text"}
              onClick={() => props.setView("card")}
            >
              Card View
            </Button>
          </Grid>
          <Grid style={{ paddingRight: 15 }} item>
            <Button
              color={props.view === "list" ? "primary" : "default"}
              variant={props.view === "list" ? "outlined" : "text"}
              onClick={() => props.setView("list")}
            >
              List View
            </Button>
          </Grid>
        </Grid>
      </Grid>
      {props.view === "card" ? (
        <Grid item className={classes.navigationGrid}>
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
      ) : null}
    </Grid>
  );
}
