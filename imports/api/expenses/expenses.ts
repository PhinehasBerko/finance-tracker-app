import { Mongo } from "meteor/mongo";
import SimpleSchema from "simpl-schema";
import { MeteorIdRegEx } from "../income/Incomes";
import "meteor/aldeed:collection2"; // This package is required for schema validation to work with Mongo.Collection

export const ExpensesCollection = new Mongo.Collection("expenses");

export const expensesSchema = new SimpleSchema({
    userId: {
        type: String,
        regEx: MeteorIdRegEx,
    },
    receiptId: {
        type: String,
        regEx: MeteorIdRegEx,
    },
    shoppingListItemId: {
        type: String,
        regEx: MeteorIdRegEx,
        optional: true
    },
    itemName: {
        type: String
    },
    price: {
        type: Number,
        min: 0.01,
    },
    quantity: {
        type: SimpleSchema.Integer,
        min: 1,
        defaultValue: 1
    },
    category: {
        type: String,
        optional: true,
    },
    createdAt: { 
        type: Date,
        defaultValue: new Date(),
    },
    updatedAt: { 
        type: Date,
        defaultValue: new Date(),
    },

})

 ExpensesCollection.attachSchema(expensesSchema);