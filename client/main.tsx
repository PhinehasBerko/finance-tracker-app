import React from "react";
import { Meteor } from "meteor/meteor"
import {createRoot } from "react-dom/client";
import { App } from "../imports/ui/App";
import './main'
import '/imports/api/income/methods';

Meteor.startup(() => {
  const container = document.getElementById("react-target");
  if (!container) {
    throw new Error("Failed to find the root element with id 'react-target'");
  }

  const root = createRoot(container);
 
    root.render(<App />);

});