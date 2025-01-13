import { useUser } from "@clerk/clerk-react";
import FinancialRecordForm from "./Financial-record-form";
import FinancialRecordList from "./Financial-record-list";
import { useFinancialRecords } from "../../../context/financial-record-context";
import { useMemo } from "react";


const Dashboard = () => {

  const { user } = useUser();
  const {record} = useFinancialRecords();

  const totalMonthly = useMemo(() =>{
    let totalAmount = 0;
    record.forEach((record) =>{
      totalAmount += record.amount
    })
    return totalAmount
  },[record])

  return (
    <div className="dashboard-container">
      <h1>Welcome {user?.firstName || "Guest"}!, Here Are Your Finances</h1>
      <FinancialRecordForm />
      <div>Total Monthly: GHS: {totalMonthly}</div>
      <FinancialRecordList />
    </div>
  );
};

export default Dashboard;
