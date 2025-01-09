import FinancialRecordModel from "../schema/financial-record";
import { NextFunction, Request, Response } from 'express';

const financeByUserId  = async (req: Request, res: Response, next:NextFunction): Promise<any> => {
    try {
        const userId = req.params.userId;
        const finance = await FinancialRecordModel.find({ userId });
        if (finance.length === 0) {
            return res.status(404).json({ message: 'No Record found for the user' });
        }
        return {
            status: 200,
            data: finance,
        }
        
    } catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ message: error.message });
        } else {
            res.status(500).json({ message: 'An unknown error occurred' });
        }
        next(error)
    }
}

const finance = async (req: Request, res: Response): Promise<any> => {
    try {
        const finance = new  FinancialRecordModel(req.body);

        await finance.save();

        return res.status(201).json({ message: 'Record created successfully', data: finance });
    } catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ message: error.message });
        } else {
            res.status(500).json({ message: 'An unknown error occurred' });
        }
    }
}

const updateFinanceByUserId = async (req: Request, res: Response): Promise<any> => {
    try {
        const userId = req.params.userId;
        const newRecord = req.body;
        const finance = await FinancialRecordModel.findOneAndUpdate({userId, newRecord}, { new: true });
        if (!finance) {
            return res.status(404).json({ message: 'Record not found' });
        }
        await finance.save();
        return res.status(200).json({ message: 'Record updated successfully', data: finance });
        }catch (error){
            if (error instanceof Error) {
                res.status(500).json({ message: error.message });
            } else {
                res.status(500).json({ message: 'An unknown error occurred' });
            }
        } 
    }

const deleteFinanceByUserId = async (req: Request, res: Response): Promise<any> => { 
    try {
        const userId = req.params.userId;
        const finance = await FinancialRecordModel.findOneAndDelete({ userId });
        if (!finance) {
            return res.status(404).json({ message: 'Record not found' });
        }
        return res.status(200).json({ message: 'Record deleted successfully' });
    } catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ message: error.message });
        } else {
            res.status(500).json({ message: 'An unknown error occurred' });
        }
    }
}

const allFinance = async(req:Request, res:Response):Promise<any> =>{
    try {
        const response = await FinancialRecordModel.find()
        if(response){
            
            res.status(200).json({response: response})
           
        }else{
            
            res.status(404).json("Sorry no data was found")
            
        }
        return
    } catch (error: any) {

        console.log(error.message)
    }
}
export { financeByUserId, finance, updateFinanceByUserId, deleteFinanceByUserId,allFinance };