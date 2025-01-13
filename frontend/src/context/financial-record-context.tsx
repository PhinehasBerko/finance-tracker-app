import { useUser } from "@clerk/clerk-react";
import  React, { createContext, useContext, useEffect, useState } from "react";


export interface FinancialRecord {
    _id?: string;
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
    updateRecord: (id: string, newRecord: FinancialRecord) => void
    deleteRecord:(id:string) =>void
}
export const FinancialRecordsContext = createContext<FinancialRecordContextType | undefined>(undefined);

export const FinancialRecordsProvider = ({children}:{children: React.ReactNode}) =>{
   const [record, setRecords] = useState<FinancialRecord[]>([])
   const {user} = useUser()
  
   useEffect(()=>{
       const fetchRecords = async() =>{
        const response = await fetch(`http://localhost:8000/api/v1/financialByUserId/${user?.id ?? ""}`)
        if(response.ok){
            const record = await response.json()
            console.log(record)
            setRecords(record)
        }
       }
    fetchRecords()
   },[user?.id])

    const addRecord = async (record: FinancialRecord) => {
        try {
             const response = await fetch(
                 "http://localhost:8000/api/v1/finance",
                 {
                     method: "POST",
                     body: JSON.stringify(record),
                     headers: {
                         "Content-Type": "application/json",
                     },
                 }
             );
     
             if (response.ok) {
                 const newRecord = await response.json();
                 setRecords((prev) => [...prev, newRecord]);
             } else {
                 // Handle non-2xx status codes
                 console.error(`HTTP error! Status: ${response.status}`);
                 return {
                     status: response.status,
                     body: `Request failed with status ${response.status}`,
                 };
             }
         } catch (error) {
             console.error("Error occurred during fetch:", error);
             return {
                 status: 500,
                 body: "Internal Server Error",
             };
         }
    };
    const updateRecord = async (id:string,newRecord: FinancialRecord) => {
            try {
             
             const response = await fetch(
                 `http://localhost:8000/api/v1/financeByUserId/${id}`,
                 {
                     method: "PATCH",
                     body: JSON.stringify(newRecord),
                     headers: {
                         "Content-Type": "application/json",
                     },
                 }
             );
     
             if (response.ok) {
                 const newRecord = await response.json();
                 setRecords((prev) => prev.map((record)=>{
                    if(record?._id === id){
                        return newRecord
                    }else return record
                 }));
             } else {
                 // Handle non-2xx status codes
                 console.error(`HTTP error! Status: ${response.status}`);
                 return {
                     status: response.status,
                     body: `Request failed with status ${response.status}`,
                 };
             }
         } catch (error) {
             console.error("Error occurred during fetch:", error);
             return {
                 status: 500,
                 body: "Internal Server Error",
             };
         }
    };

    const deleteRecord = async(id: string)=>{
        try {
            if(!id) return
           const response = await fetch(`http://localhost:8000/api/v1/financeByUserId/${id}`,{
                method: "DELETE"    
            })
            
            if (response.ok) {
                const deletedRecord = await response.json();
                setRecords((prev) => prev.filter((record) => record._id !==deletedRecord?._id))
                 
             } else {
                 // Handle non-2xx status codes
                 console.error(`HTTP error! Status: ${response.status}`);
                 return {
                     status: response.status,
                     body: `Request failed with status ${response.status}`,
                 };
        }}catch(error) {
            console.log(error)
        }
    
    }   
   return<FinancialRecordsContext.Provider value={{record,addRecord, updateRecord,deleteRecord}}>
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