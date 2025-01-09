
// import express ,{Request, Response} from 'express';
// import prisma from '../services/prisma.services';

//  const addExpense = async(req:Request,res:Response) =>{
//     try {
//         const {title, amount, description, category,date} = req.body
//         // validation
//         if(!title ||!amount || !description ||!category ||!date){
//             return res.status(400).json({message:"All fields are required"})
//         }
//         if(amount<= 0 || amount === undefined){
//             return res.status(400).json({message:"Amount must be a positive"})
//         }
        
//         const createExpense = await prisma.expense.create({
//             data:{
//                 amount,
//                 title,
//                 category,
//                 date,
//                 description
//             }   
//         })
//         res.status(201).json({message:createExpense})
//     } catch (error: any) {
//         console.log(error)
//         res.status(500).json({message:"Server Error"})
//     }
// }

// const getExpense = async(req:Request, res:Response) =>{
//     try {
//         const expenses = (await ( prisma.expense.findMany())).sort().reverse()

//         res.status(200).send(expenses)
//     } catch (error: any) {
//         console.log(error)
//         res.status(500).json({message:"Server Error"})
//     }
// }
// const deleteExpense = async(req:Request,res:Response) =>{
//     const {id} = req.params
//     try {
//         await prisma.expense.delete({where:{id}})
//         res.status(200).json({message:"Expenses deleted"})
//     } catch (error: any) {
//         console.log(error)
//         res.status(500).json({message:"Server Error"})
//     }
// }
// export  {addExpense, getExpense, deleteExpense}