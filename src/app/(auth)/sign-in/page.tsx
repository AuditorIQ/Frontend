import React from "react";
import SignIn from "./SignIn";
import { Suspense } from "react";

type Props = {};

const page = (props: Props) => {
  return <Suspense fallback={<div>Loading...</div>}><SignIn /></Suspense>;
};

export default page;
