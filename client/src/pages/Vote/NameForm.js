import React, { useState } from "react";
import axios from "axios";
import Button from "@material-ui/core/Button";
import FormControl from "@material-ui/core/FormControl";
import TextField from "@material-ui/core/TextField";
import ErrorPopup from "../../services/ErrorPopup";

export default function NameForm(props) {
  const [firstName, setFirstName] = useState("");
  const [code, setCode] = useState("");
  const [lastName, setLastName] = useState("");
  const [school, setSchool] = useState("");
  const [error, setError] = useState({
    open: false,
    statusCode: "",
    errorMessage: "",
  });

  function submitCode() {
    axios
      .post("/api/auth_code", {
        first_name: firstName,
        code: code,
        last_name: lastName,
        school: school,
      })
      .then((res) => props.change(res))
      .catch((err) => {
        setError({
          open: true,
          statusCode: err.response.status,
          errorMessage: err.response.data.error,
        });
      });
  }

  return (
    <form style={{ paddingTop: 15 }}>
      {error.open ? (
        <ErrorPopup
          closeError={setError}
          status_code={error.statusCode}
          error_message={error.errorMessage}
        />
      ) : null}
      <div>
        <FormControl style={{ width: 200, paddingTop: 15 }}>
          <TextField
            name="first_name"
            id="select-first-name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            label="First Name"
            variant="outlined"
          />
        </FormControl>
        <FormControl style={{ width: 200, paddingTop: 15 }}>
          <TextField
            name="last_name"
            id="select-last-name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            label="Last Name"
            variant="outlined"
          ></TextField>
        </FormControl>
      </div>
      <div>
        <FormControl style={{ width: 200, paddingTop: 15 }}>
          <TextField
            name="school"
            id="school"
            value={school}
            onChange={(e) => setSchool(e.target.value)}
            label="School"
            variant="outlined"
          ></TextField>
        </FormControl>
      </div>
      <div>
        <FormControl style={{ width: 200, paddingTop: 15 }}>
          <TextField
            name="code"
            id="code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            label="Code"
            variant="outlined"
          ></TextField>
        </FormControl>
      </div>
      <div>
        <Button variant="contained" color="primary" onClick={submitCode}>
          Next
        </Button>
      </div>
    </form>
  );
}
