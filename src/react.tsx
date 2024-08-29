import * as React from "react";
import * as ReactDOM from "react-dom/client";
import { Assembly } from "./app";
import { ClientLoggerContextProvider } from "./features/client-logger/client-logger";

const root = ReactDOM.createRoot(document.getElementById("app")!);
root.render(
  <React.StrictMode>
    <ClientLoggerContextProvider>
      <Assembly />
    </ClientLoggerContextProvider>
  </React.StrictMode>
);
