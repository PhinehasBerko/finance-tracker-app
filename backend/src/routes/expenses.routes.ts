import Router from 'express';
import {addExpense,deleteExpense,getExpense}  from '../controllers/expense.controllers';
// import FinancialRecordModel from '../schema/financial-record';


const router = Router()

router.post("/add-expense",addExpense)
router.get("/get-expense",getExpense)
router.delete("/delete-expense/:id",deleteExpense)


export default router;