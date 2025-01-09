import express from 'express';
import {allFinance, deleteFinanceByUserId, finance, financeByUserId, updateFinanceByUserId } from '../controllers/financial-records.controller';

const router = express.Router();

router.post("/finance",finance)
router.get("/financeByUserId/:userId",financeByUserId)
router.get("/finance",allFinance)
router.patch("/update-financeByUserId/:userId",updateFinanceByUserId)
router.delete("/:userId",deleteFinanceByUserId)


export default router;