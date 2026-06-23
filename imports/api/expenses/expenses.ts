import { Mongo } from "meteor/mongo";
import SimpleSchema from "simpl-schema";
import { MeteorIdRegEx } from "../income/IncomeCollection";
import "meteor/aldeed:collection2"; // This package is required for schema validation to work with Mongo.Collection

export const ExpensesCollection = new Mongo.Collection("expenses");

export const expensesSchema = new SimpleSchema({
    userId: {
        type: String,
        regEx: MeteorIdRegEx,
    },
    shoppingListItemId: {
        type: String,
        regEx: MeteorIdRegEx,
        optional: true
    },
    amount: {
        type: Number,
        min: 0.01,
    },
    quantity: {
        type: SimpleSchema.Integer,
        min: 1,
        defaultValue: 1
    },
    date: { 
        type: Date,
        defaultValue: new Date(),
    },
    category: {
        type: String,
        optional: true,
    }

})

 ExpensesCollection.attachSchema(expensesSchema);