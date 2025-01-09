import  React, { createContext, useContext, useState } from "react";


export interface FinancialRecord {
    id?: string;
    userId: string;
    date: Date;
    description: string;
    amount: number;
    category: string;
    paymentMethod: string;
}
interface FinancialRecordContextType {
    record: FinancialRecord[];
    addRecord: (record: FinancialRecord) =>void;
    // updateRecord: (id: string, newRecord: FinancialRecord) => void
}
export const FinancialRecordsContext = createContext<FinancialRecordContextType | undefined>(undefined);

export const FinancialRecordsProvider = ({children}:{children: React.ReactNode}) =>{
    const [record, setRecords] = useState<FinancialRecord[]>([])
    const addRecord =async (record: FinancialRecord) => {
        const response = await fetch(
            "http://localhost:8000/api/v1/finance",
            {
                method:"POST",
                body:JSON.stringify(record)
            }
        )
        try {
            if(response.ok){
            const newRecord = await response.json();
            setRecords((prev) =>[...prev, newRecord])
        }
        } catch (error) {
            console.log(error)
            return{
                status: 500,
                body: "Internal Server error"
            }
        }
    }
    return <FinancialRecordsContext.Provider value={{record,addRecord}}>
        {children}
    </FinancialRecordsContext.Provider>
}

export const useFinancialRecords = () =>{
    const context = useContext<FinancialRecordContextType | undefined>(FinancialRecordsContext)
    if(!context){
        throw new Error("useFinancialRecords must be used within a FinancialRecordsProvider")
    }
    return context
}