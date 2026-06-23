import { Mongo } from "meteor/mongo";
import SimpleSchema from "simpl-schema";
import { MeteorIdRegEx } from "../income/IncomeCollection";
import "meteor/aldeed:collection2";

export const ShoppingListCollection = new Mongo.Collection("shoppingList");

export const shopingListSchema = new SimpleSchema({
    userId: {
        type: String,
        regEx: MeteorIdRegEx,
    },
    itemName: {
        type: String,
        max: 150,
    },
    estimatedQuantity: {
        type: SimpleSchema.Integer,
        optional: true,
    },
    estimatedPrice: {
        type: Number,
        optional: true,
    },
    actualQuantity: {
        type: SimpleSchema.Integer,
        defaultValue: 1,
        optional: true,
    },
    actualPrice: {
        type: Number,
        min: 0,
        optional: true,
    },
    line_total: {
        type: Number,
        optional: true
    },
    store: {
        type: String,
    },
    status: {
        type: String,
        allowedValues: ['pending','purchased'],
        defaultValue: 'pending',
    },
    createdAt: {
        type: Date, 
        defaultValue: new Date(),
    }
})

ShoppingListCollection.attachSchema(shopingListSchema);