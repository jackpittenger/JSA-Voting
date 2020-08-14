import React, { useState } from "react";

import Header from "../../components/Header";
import AuthService from "../../services/AuthService";

export default function Room() {
  const Auth = new AuthService();
  return (
    <div>
      <Header auth={Auth} />
    </div>
  );
}
