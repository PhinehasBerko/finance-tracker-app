import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import TrackerApp from "./TrackerApp";
// import App from "./App.tsx";
// import { ClerkProvider } from "@clerk/clerk-react";

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing VITE_CLERK_PUBLISHABLE_KEY");
}
ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <TrackerApp />
    {/* <ClerkProvider publishableKey={PUBLISHABLE_KEY}> */}
      {/* <App /> */}
    {/* </ClerkProvider> */}
  </React.StrictMode>
);
