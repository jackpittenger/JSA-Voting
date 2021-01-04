import React from "react";

import type AuthService from "../../services/AuthService";

type Props = {
  auth: AuthService;
};

function Convention(props: Props) {
  return (
    <div>
      <p>Hello</p>
    </div>
  );
}

export default Convention;
