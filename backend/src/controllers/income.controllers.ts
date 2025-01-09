// import express ,{Request, Response} from 'express';
// import prisma from '../services/prisma.services';

//  const addIncome = async(req:Request,res:Response) =>{
//     try {
//         const {title, amount, description, category,date} = req.body
//         // validation
//         if(!title ||!amount || !description ||!category ||!date){
//             return res.status(400).json({message:"All fields are required"})
//         }
//         if(amount<= 0 || amount === undefined){
//             return res.status(400).json({message:"Amount must be a positive"})
//         }
        
//         const createIncome = await prisma.income.create({
//             data:{
//                 amount,
//                 title,
//                 category,
//                 date,
//                 description
//             }   
//         })
//         res.status(201).json({message:createIncome})
//     } catch (error: any) {
//         console.log(error)
//         res.status(500).json({message:"Server Error"})
//     }
// }

// const getIncome = async(req:Request, res:Response) =>{
//     try {
//         const income = (await ( prisma.income.findMany())).sort().reverse()

//         res.status(200).send(income)
//     } catch (error: any) {
//         console.log(error)
//         res.status(500).json({message:"Server Error"})
//     }
// }
// const deleteIncome = async(req:Request,res:Response) =>{
//     const {id} = req.params
//     try {
//         await prisma.income.delete({where:{id}})
//         res.status(200).json({message:"Income deleted"})
//     } catch (error: any) {
//         console.log(error)
//         res.status(500).json({message:"Server Error"})
//     }
// }
// export  {addIncome, getIncome, deleteIncome}