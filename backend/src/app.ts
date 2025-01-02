import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import incomeRoutes from './routes/income.routes';
import expensesRoutes from './routes/expenses.routes';
import connect  from './services/mongoose';

dotenv.config()

const app = express();

// connect to mongodb
connect();

// middleware
app.use(express.json());
app.use(cors())

// routes
app.use('/api/v1/',incomeRoutes)
app.use('/api/v1/',expensesRoutes)



app.get("/",(req,res)=>{
    res.send("Hello Expenditure App")
})
const PORT = process.env.PORT ||5000;

app.listen(PORT,()=>{
    console.log(`Server running on http://localhost:${PORT} 🚀🚀✔`)
})
