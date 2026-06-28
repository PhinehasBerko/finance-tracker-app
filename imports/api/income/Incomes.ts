import { Mongo } from "meteor/mongo";
import  SimpleSchema from "simpl-schema";
import "meteor/aldeed:collection2";

export interface IncomeDoc {
    _id?: string;
    userId: string; 
    amount: number;
    source: 'salary'| 'freelance'| 'gift'| 'parent'| 'other';
    description?: string;
    account_id: string;
    date: Date;
    is_recurring: boolean;
    createdAt: Date;
    updatedAt?: Date;

}
export const IncomeCollection = new Mongo.Collection<IncomeDoc>("income");

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
        allowedValues: ['salary', 'freelance', 'gift', 'parent','other'],
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
    createdAt: { type: Date },
    updatedAt: { type: Date, optional: true },

});

IncomeCollection.attachSchema(incomeSchema);