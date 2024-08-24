import * as React from "react";
import * as ReactDOM from "react-dom/client";
const Index = () => {
  return <div>Hello React!</div>;
};
const root = ReactDOM.createRoot(document.getElementById("app"));
root.render(
  <React.StrictMode>
    <Index />
  </React.StrictMode>
);
