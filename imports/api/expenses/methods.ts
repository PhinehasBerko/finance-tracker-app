import { Meteor } from "meteor/meteor";
import { MongoInternals } from "meteor/mongo";
import { DDPRateLimiter } from "meteor/ddp-rate-limiter";
import { ExpensesCollection } from "./expenses";
import { ValidatedMethod } from "meteor/mdg:validated-method";
import { expensesSchema } from "./expenses";
import SimpleSchema from "simpl-schema";
import { Random } from "meteor/random";

const baseItemSchema = expensesSchema.omit(
    "userId", 
    "createdAt", 
    "updatedAt", 
    "receiptId",
);

const insertSchema  = new SimpleSchema({
        idempotencyKey: { type: String  },
        items: { type: Array, minCount: 1 },
        'items.$' : { type: baseItemSchema }
    });

const updatableFields = new SimpleSchema({     
        itemName: { type: String, optional: true },
        quantity: { type: Number, optional: true },
        unitPrice: { type: Number, optional: true },
        category: { type: String, optional: true }
    });
    
const updateSchema = new SimpleSchema({
    expenseId: { type: String },
    expectedUpdateAt: { type: Date },
    changes: { type: updatableFields }
});

const removeSchema = new SimpleSchema({
    expenseId: { type: String }
});

export const InsertExpenses = new ValidatedMethod({
    name: 'expenses.insert',
    validate: insertSchema.validator(),

    async run({ idempotencyKey, items }) {
        
        if (!this.userId) throw new Meteor.Error("not-authorized");
        
        const expense = await ExpensesCollection.findOneAsync({
            userId: this.userId, 
            idempotencyKey
        });
        if (expense) {
            return { success: true, receiptId: expense.receiptId, replayed: true };
        }
        const receiptId = Random.id();
        const now = new Date();
        const docs = items.map((item: any) => ({
            _id: Random.id(),
            userId: this.userId,
            receiptId,
            shoppingListItemId: item.shoppingListItemId || null,
            itemName: item.itemName,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            totalPrice: item.unitPrice * item.quantity,
            category: item.category,
            deletedAt: null,
            createdAt: now,
            updatedAt: now,
        }));

        const client = MongoInternals.defaultRemoteCollectionDriver().mongo.client;
        const session = client.startSession();
        try {
            await session.withTransaction( async () => {
                const rawCollection = ExpensesCollection.rawCollection();
                await rawCollection.insertMany(docs, { session } as any);
            })
        } finally {
            await session.endSession();
        }
        return { success: true, receiptId, replayed: false }
    }
});

DDPRateLimiter.addRule(
    { type: 'method', name: 'expenses.insert', userId: () => true },
    5,
    10_000
)
export const updateExpenses = new ValidatedMethod({
    name: "expenses.update",
    validate: updateSchema.validator(),
    async run({ expenseId, expectedUpdatedAt, changes }) {
        
        if (!this.userId) throw new Meteor.Error("not-authorized");

        const expense = await ExpensesCollection.findOneAsync({
            _id: expenseId,
            userId: this.userId,
            deletedAt: null,
        });

        if (!expense) {
            throw new Meteor.Error("not-found", "Expense not found or already removed");
        }
        if(expense.updatedAt.getTime() !== expectedUpdatedAt.getTime()) {
            throw new Meteor.Error(
                "conflict",
                "This expense was modified elsewhere. Refresh and try again."
            );
        }
        const unitPrice = changes.unitPrice ?? expense.unitPrice;
        const quantity = changes.quantity ?? expense.quantity;

        const expenseItem = await ExpensesCollection.updateAsync(
            {_id: expenseId, userId: this.userId}, 
            { $set: {
                ...changes,
                totalPrice: unitPrice * quantity, 
                updatedAt: new Date(),
                }
        });

        if (expenseItem === 0) {
            throw new Meteor.Error("not-found","Expense record not found")
        }
        return { success: true };
    }
});

DDPRateLimiter.addRule(
  { type: "method", name: "expenses.update", userId: () => true },
  10,
  10_000
);

export const removeExpenses = new ValidatedMethod({
    name: "expenses.remove",
    validate: removeSchema.validator(),

   async run(expenseId) {

    if (!this.userId) throw new Meteor.Error("not-authorized", "You are not allow to perform such operation");

    const expense = await ExpensesCollection.findOneAsync({ _id: expenseId, userId: this.userId});

    if (!expense) {
        throw new Meteor.Error("not-found", "This record is not available");
    }

    if(expense.deletedAt) {
        return { success: true, alreadyRemoved: true }
    }
    await ExpensesCollection.updateAsync(
        {_id: expenseId, userId: this.userId},
        { $set: { deletedAt: new Date(), updatedAt: new Date() }}
    );
    return { success: true, alreadyRemoved: false };
   }
});

DDPRateLimiter.addRule(
  { type: "method", name: "expenses.remove", userId: () => true },
  10,
  10_000
);