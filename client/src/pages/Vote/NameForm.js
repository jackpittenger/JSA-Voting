import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import axios from "axios";

import Button from "@material-ui/core/Button";
import FormControl from "@material-ui/core/FormControl";
import TextField from "@material-ui/core/TextField";

import ErrorPopup from "../../components/ErrorPopup";

const useStyles = makeStyles(() => ({
  form: {
    paddingTop: 35,
    maxWidth: "100%",
  },
  formControl: {
    maxWidth: "85%",
    padding: 7,
  },
  resize: {
    fontSize: "1.3em",
  },
  resizeLabel: {
    fontSize: "1.3em",
  },
  button: {
    fontSize: "1.2em",
    marginTop: 5,
  },
}));

function NameForm(props) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [school, setSchool] = useState("");
  const [code, setCode] = useState("");
  const [buttonValid, setButtonValid] = useState(false);
  const [codeValid, setCodeValid] = useState(false);

  const classes = useStyles();

  useEffect(() => {
    setCodeValid(code.length === 0 || /^\d{7}$/.test(code));
  }, [code]);

  useEffect(() => {
    setButtonValid(
      firstName.length !== 0 &&
        lastName.length !== 0 &&
        school.length !== 0 &&
        code.length !== 0 &&
        codeValid
    );
  }, [firstName, lastName, school, code, codeValid]);

  function submitCode() {
    axios
      .post("/api/auth_code", {
        first_name: firstName,
        code: code,
        last_name: lastName,
        school: school,
      })
      .then((res) => {
        props.auth.setToken(res.data.token);
        props.setIsTokenVoter(true);
      })
      .catch((err) => {
        props.createError(err.response.status, err.response.data.error);
      });
  }

  return (
    <form className={classes.form}>
      <div>
        <FormControl className={classes.formControl}>
          <TextField
            name="first_name"
            id="select-first-name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            label="First Name"
            variant="outlined"
            InputProps={{
              classes: {
                root: classes.resize,
              },
            }}
            InputLabelProps={{
              classes: {
                root: classes.resizeLabel,
              },
            }}
          />
        </FormControl>
        <FormControl className={classes.formControl}>
          <TextField
            name="last_name"
            id="select-last-name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            label="Last Name"
            variant="outlined"
            InputProps={{
              classes: {
                root: classes.resize,
              },
            }}
            InputLabelProps={{
              classes: {
                root: classes.resizeLabel,
              },
            }}
          ></TextField>
        </FormControl>
      </div>
      <div>
        <FormControl className={classes.formControl}>
          <TextField
            name="school"
            id="school"
            value={school}
            onChange={(e) => setSchool(e.target.value)}
            label="School"
            variant="outlined"
            InputProps={{
              classes: {
                root: classes.resize,
              },
            }}
            InputLabelProps={{
              classes: {
                root: classes.resizeLabel,
              },
            }}
          ></TextField>
        </FormControl>
      </div>
      <div>
        <FormControl className={classes.formControl}>
          <TextField
            name="code"
            id="code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            label="Code"
            variant="outlined"
            InputProps={{
              classes: {
                root: classes.resize,
              },
            }}
            InputLabelProps={{
              classes: {
                root: classes.resizeLabel,
              },
            }}
            error={!codeValid}
          ></TextField>
        </FormControl>
      </div>
      <div>
        <Button
          className={classes.button}
          variant="contained"
          color="primary"
          onClick={submitCode}
          disabled={!buttonValid}
        >
          Next
        </Button>
      </div>
    </form>
  );
}

export default ErrorPopup(NameForm);
