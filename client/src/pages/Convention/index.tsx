import React, { useState, useEffect } from "react";

import Layout from "layout";

import history from "services/history";

import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";

import { makeStyles } from "@material-ui/core";
import Skeleton from "@material-ui/lab/Skeleton";

import type AuthService from "services/AuthService";

type Convention = {
  name: string;
  createdAt: Date;
  roomsOpen: Boolean;
};

type Props = {
  auth: AuthService;
};

const useStyles = makeStyles({
  card: {},
  media: {
    height: "18em",
    width: "32em",
  },
});

function Convention(props: Props) {
  const classes = useStyles();

  const [conventions, setConventions] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(
    function () {
      props.auth.fetch("/api/convention/list", {}, function (res: any) {
        setConventions(res.conventions);
        setLoading(false);
      });
    },
    [props.auth]
  );
  return (
    <Layout auth={props.auth}>
      <h1 style={{ textAlign: "center" }}>
        Welcome JSAer{" "}
        <span role="img" aria-label="Wave">
          👋
        </span>
      </h1>
      <p>Select your convention below!</p>
      <hr />
      <Grid
        container
        spacing={2}
        style={{ width: "100%", margin: "unset", justifyContent: "center" }}
      >
        {loading ? (
          <Grid item key={0}>
            <Card className={classes.card}>
              <CardActionArea>
                <CardMedia className={classes.media}>
                  <Skeleton variant="rect" height="100%" animation="wave" />
                </CardMedia>
                <CardContent>
                  <Typography gutterBottom variant="h5" component="h2">
                    <Skeleton animation="wave" />
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ) : (
          conventions.map((v: Convention, i: number) => (
            <Grid item key={i}>
              <Card className={classes.card}>
                <CardActionArea
                  onClick={(_e) => history.push("/convention/" + v.name)}
                >
                  <CardMedia
                    className={classes.media}
                    image="https://www.inklingsnews.com/wp-content/uploads/2015/01/congress-julia-schorr.jpg"
                  />
                  <CardContent>
                    <Typography gutterBottom variant="h5" component="h2">
                      {v.name}
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
          ))
        )}
      </Grid>
    </Layout>
  );
}

export default Convention;
