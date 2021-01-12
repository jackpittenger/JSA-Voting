import React from "react";

import Layout from "../../layout";

import AuthService from "../../services/AuthService";

type Props = {
  auth: AuthService;
};

export default function NotFound(props: Props) {
  return (
    <Layout auth={props.auth}>
      <h1 style={{ textAlign: "center" }}>
        404
        <br />
        Not Found
      </h1>
    </Layout>
  );
}
