import React, { useState } from "react";

import ErrorPopup from "../../components/ErrorPopup";

import RadioGroup from "@material-ui/core/RadioGroup";
import FormControl from "@material-ui/core/FormControl";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Radio from "@material-ui/core/Radio";
import Button from "@material-ui/core/Button";

function SubmitForm(props) {
  const [vote, setVote] = useState(null);
  function submit() {
    props.auth.fetch(
      "/api/submit_form",
      { method: "POST", body: JSON.stringify({ vote: vote }) },
      processReturn
    );
  }

  function processReturn(res, status) {
    if (status >= 400) {
      props.createError(status, res.error);
    } else {
      props.setVoted(true);
    }
  }

  return (
    <form style={{ paddingTop: 15 }}>
      <h1 style={{ marginTop: "0", fontFamily: "Muli", color: "#333" }}>
        SUBMIT YOUR VOTE
      </h1>
      <h3 style={{ color: "#333" }}>
        Your moderator will open voting at the end
      </h3>
      <div>
        <FormControl>
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

export default ErrorPopup(SubmitForm);
