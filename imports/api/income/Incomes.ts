import { Mongo } from "meteor/mongo";
import  SimpleSchema from "simpl-schema";
import "meteor/aldeed:collection2";

export const IncomeCollection = new Mongo.Collection("income");

export const MeteorIdRegEx = /^[a-zA-Z0-9]{17}$/;

export const incomeSchema = new SimpleSchema({
    userId: { 
        type: String,
       regEx: MeteorIdRegEx,
     },
    amount: { 
        type: Number,
        min: 0.01 
    },
    account_id: { 
        type: String,
        regEx: MeteorIdRegEx,
        optional: true
    },
    source: {
        type: String,
        max: 100,
    },
    description: {
        type: String,
        optional: true,
        max: 500,
    },
    date: {
        type: Date,
        defaultValue: new Date()
    },
    is_recurring: {
        type: Boolean,
        defaultValue: false
    },

});

IncomeCollection.attachSchema(incomeSchema);