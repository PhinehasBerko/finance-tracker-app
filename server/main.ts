import { Meteor } from "meteor/meteor";

import "./../imports/api/register-collections";
import '/imports/api/income/methods';
import '/imports/api/expenses/methods';
import 'imports/api/expenses/publications';
import '/imports/api/income/publications';

Meteor.startup(async() => {
    console.log("server running")
})