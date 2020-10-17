import React from "react";
import makeStyles from "@material-ui/core/styles/makeStyles";

import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";

const useStyles = makeStyles(() => ({
  grid: {
    width: "100%",
    margin: "unset",
    justifyContent: "center",
  },
  item: {
    maxWidth: "90%",
    width: "30em",
    height: "10em",
    padding: "1.2em",
    margin: "1%",
    wordBreak: "break-all",
  },
  yea: {
    backgroundColor: "lightgreen !important",
  },
  nay: {
    backgroundColor: "#ffcccb !important",
  },
  abs: {
    backgroundColor: "lightgray !important",
  },
}));

export default function Card(props) {
  const classes = useStyles();
  return (
    <Grid container spacing={2} className={classes.grid}>
      {props.rooms === []
        ? null
        : props.rooms.map((v, i) => {
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
                        <span style={{ fontSize: "1.1em" }}>
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
  );
}
