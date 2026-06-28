import { Meteor } from "meteor/meteor";
import { IncomeCollection } from "./Incomes";


Meteor.publish('income.inRange', function(startDate: Date, endDate: Date){
    if(!this.userId) {
        return this.ready()
    }

    return IncomeCollection.find({
        userId: this.userId,
        date: { $gte: startDate, $lte: endDate}
    })
 });