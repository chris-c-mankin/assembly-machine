import * as React from "react";
import * as ReactDOM from "react-dom/client";
import { Assembly } from "./app/assembly";
const Index = () => {
  return <Assembly />;
};
const root = ReactDOM.createRoot(document.getElementById("app")!);
root.render(
  <React.StrictMode>
    <Index />
  </React.StrictMode>
);
