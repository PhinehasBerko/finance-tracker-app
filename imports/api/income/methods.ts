import { Meteor } from "meteor/meteor";
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { IncomeCollection, incomeSchema } from "./Incomes";
import SimpleSchema from "simpl-schema";

const insertIncomeSchema = incomeSchema.omit('userId','createdAt', 'updatedAt');

export const insertIncome = new ValidatedMethod({
    name: 'income.insert',
    validate: insertIncomeSchema.validator(),
    async run({ amount, source, date, description, account_id, is_recurring= false}) {

        if (!this.userId) throw new Meteor.Error('not-authorized');

        return IncomeCollection.insertAsync({
            userId: this.userId,
            amount,
            date,
            source,
            account_id,
            is_recurring,
            description,
            createdAt: new Date(),

        });
        
    },
});

const updateIncomeSchema = incomeSchema
.omit('userId','createdAt', 'updatedAt')
.extend({
    incomeId: { type: String },
});
export const updateIncome = new ValidatedMethod({
    name: 'income.update',
    validate: updateIncomeSchema.validator(),
    async run({incomeId, amount, source, date, description, account_id, }) {

        if(!this.userId) throw new Meteor.Error("not-authorized");

        const existing = IncomeCollection.findOne(incomeId);
        if (!existing) {
        throw new Meteor.Error('not-found', 'Income entry not found.');
        }
        if (existing.userId !== this.userId) {
        throw new Meteor.Error('not-authorized', 'You cannot edit this income entry.');
        }

        return IncomeCollection.updateAsync('incomeId',{
           $set: {   
                amount,
                source,
                date,
                description,
                account_id,
                updatedAt: new Date(),
                userId: this.userId
            }
        })
    },
});


export const removeIncome = new ValidatedMethod({
    name: 'income.remove',
    validate: new SimpleSchema({
        incomeId: {type: String},
    }).validator(),
    async run({incomeId}) {

        if(!this.userId) {
            throw new Meteor.Error("not-authorized", "You must be logged-in before operation allowed");
        }

        const existingRecord = IncomeCollection.findOne(incomeId);

        if(!existingRecord) throw new Meteor.Error("not-found", "income record not found");

        return IncomeCollection.remove(incomeId);
    }
})