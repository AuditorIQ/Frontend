import React from "react";
import SignIn from "./SignIn";
import { Suspense } from "react";

type Props = {};

const Page = (props: Props) => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SignIn />
    </Suspense>
  );
};

export default Page;
