import React, { useState } from "react";
import FormLabel from "@material-ui/core/FormLabel";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControl from "@material-ui/core/FormControl";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Radio from "@material-ui/core/Radio";
import Button from "@material-ui/core/Button";
import history from "../../services/history";
import ErrorPopup from "../../components/ErrorPopup";

export default function SubmitForm(props) {
  const [vote, setVote] = useState(null);
  const [error, setError] = useState({
    open: false,
    statusCode: "",
    errorMessage: "",
  });
  function submit() {
    props.auth.fetch(
      "/api/submit_form",
      { method: "POST", body: JSON.stringify({ vote: vote }) },
      processReturn
    );
  }

  function processReturn(res, status) {
    if (status === 455) {
      setError({
        open: true,
        statusCode: status,
        errorMessage: res.error,
      });
    } else {
      props.auth.logout();
      props.setIsTokenVoter(false);
      history.push("/");
    }
  }

  return (
    <form style={{ paddingTop: 15 }}>
      <div>
        {error.open ? (
          <ErrorPopup
            closeError={setError}
            status_code={error.statusCode}
            error_message={error.errorMessage}
          />
        ) : null}
        <FormControl>
          <FormLabel>Vote</FormLabel>
          <RadioGroup
            name="vote"
            value={vote}
            onChange={(e) => setVote(e.target.value)}
          >
            <FormControlLabel value="yea" control={<Radio />} label="Yea" />
            <FormControlLabel value="nay" control={<Radio />} label="Nay" />
            <FormControlLabel
              value="abstain"
              control={<Radio />}
              label="Abstain"
            />
          </RadioGroup>
        </FormControl>
        <div>
          <Button variant="contained" color="primary" onClick={submit}>
            Submit
          </Button>
        </div>
      </div>
    </form>
  );
}
