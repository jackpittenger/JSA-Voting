import { useState } from "react";
import Link from "next/link";

import LoginForm from "../auth/components/LoginForm";

import AppBar from "@material-ui/core/AppBar";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";

const Header = () => {
  const [loginOpen, setLoginOpen] = useState(false);

  return (
    <div>
      <AppBar position="static">
        <Toolbar>
          <Grid justify="space-between" container spacing={4}>
            <Grid item>
              <Button>
                <Link href="/">
                  <Typography variant="h6" color="secondary">
                    JSA Voting
                  </Typography>
                </Link>
              </Button>
            </Grid>
            <Grid item>
              <div style={{ float: "right" }}>
                <Button onClick={() => setLoginOpen(true)} color="secondary">
                  <Typography variant="h6">Login</Typography>
                </Button>
              </div>
            </Grid>
          </Grid>
        </Toolbar>
      </AppBar>
      {loginOpen ? <LoginForm closePopup={() => setLoginOpen(false)} /> : null}
    </div>
  );
};

export default Header;
