import React from "react";

import Header from "./Header";

import type AuthService from "services/AuthService";
import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
  auth: AuthService;
};

function Layout(props: Props) {
  return (
    <div className="App">
      <Header auth={props.auth} />
      {props.children}
    </div>
  );
}

export default Layout;
