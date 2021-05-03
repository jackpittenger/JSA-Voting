import React from "react";

import withDialog from "./withDialog";
import ErrorPopup from "./ErrorPopup";

import ButtonTextSingleInput from "./ButtonTextSingleInput";

import type AuthService from "services/AuthService";

type Props = {
  auth: AuthService;
  createError: Function;
  createDialog: Function;
  type: string;
};

function CreateUser(props: Props) {
  function givePin(result: { token: string; pin: number }, status: number) {
    if (status >= 400)
      return props.createError(status, "Failed creating a new user");
    props.createDialog(
      "Created a new " + props.type + " user " + result.token,
      "Pin: " + result.pin
    );
  }

  return (
    <div>
      <ButtonTextSingleInput
        auth={props.auth}
        route="/api/account"
        method="POST"
        returnFunction={givePin}
        label="Token"
        text={"Create a new " + props.type}
        fieldName="token"
        additionalBody={{ type: props.type }}
        minLength={5}
        maxLength={24}
      />
    </div>
  );
}

export default withDialog(ErrorPopup(CreateUser));
