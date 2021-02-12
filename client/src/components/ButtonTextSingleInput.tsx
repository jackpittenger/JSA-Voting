import React, { useState, useEffect } from "react";

import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";

import type AuthService from "../services/AuthService";

type Props = {
  auth: AuthService;
  route: String;
  method: String;
  returnFunction: Function;
  label: String;
  text: String;
  fieldName: string;
  additionalBody: {};
  minLength: number;
  maxLength: number;
};

function ButtonTextSingleInput(props: Props) {
  const [input, setInput] = useState("");
  const [inputValid, setInputValid] = useState(false);
  const [buttonValid, setButtonValid] = useState(false);

  useEffect(() => {
    setInputValid(
      input.length === 0 ||
        (input.length >= props.minLength && input.length <= props.maxLength)
    );
  }, [input, props.minLength, props.maxLength]);

  useEffect(() => {
    setButtonValid(input.length !== 0 && inputValid);
  }, [input, inputValid]);

  async function callServer() {
    props.auth.fetch(
      props.route,
      {
        method: props.method,
        body: JSON.stringify({
          [props.fieldName]: input,
          ...props.additionalBody,
        }),
      },
      (result: {}, status: number) => {
        if (status < 400) setInput("");
        props.returnFunction(result, status);
      }
    );
  }

  return (
    <div>
      <TextField
        name="input"
        id="input"
        label={props.label}
        type="text"
        onChange={(e) => setInput(e.target.value)}
        value={input}
        error={!inputValid}
        helperText={
          "Between " + props.minLength + "-" + props.maxLength + " characters"
        }
      />
      <Button disabled={!buttonValid} onClick={callServer} color="primary">
        {props.text}
      </Button>
    </div>
  );
}

export default ButtonTextSingleInput;
