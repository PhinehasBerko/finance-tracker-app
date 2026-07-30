import { Mongo } from "meteor/mongo";
import SimpleSchema from "simpl-schema";
import { MeteorIdRegEx } from "../income/Incomes";

// This package is required for schema validation to work with Mongo.Collection
import "meteor/aldeed:collection2/dynamic"; 

await Collection2.load();

export interface ExpensesDoc {
    _id?: string, 
    userId: string,
    receiptId: string,
    shoppingListItemId?: string,
    idempotencyKey: string,
    itemName: string,
    quantity: number,
    totalPrice?: number,
    unitPrice: number,
    cateory: string,
    updatedAt: Date,
    createdAt: Date,
    deletedAt: Date | null,
}
export const ExpensesCollection = new Mongo.Collection<ExpensesDoc>("expenses");

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
    idempotencyKey: {
        type: String,
        optional: true
    },
    itemName: {
        type: String
    },
    unitPrice: {
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