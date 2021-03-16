import React from "react";

export default function Loadable({loading, error, children}) {
  console.log(loading, error);
  console.log(children)
  if (loading) return <div>loading</div>;
  if (error) return <div>error</div>;


  return children;
}
