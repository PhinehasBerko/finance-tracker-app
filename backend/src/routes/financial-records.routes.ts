import express from 'express';
import {deleteFinanceByUserId, finance, financeByUserId, updateFinanceByUserId } from '../controllers/financial-records.controller';

const router = express.Router();

router.post("/",finance)
router.get("/financeByUserId/:userId",financeByUserId)
router.patch("/update-financeByUserId/:userId",updateFinanceByUserId)
router.delete("/:userId",deleteFinanceByUserId)


export default router;