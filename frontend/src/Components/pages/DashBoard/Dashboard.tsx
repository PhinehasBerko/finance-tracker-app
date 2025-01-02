import { useUser } from "@clerk/clerk-react";
import FinancialRecordForm from "./Financial-record-form";
import FinancialRecordList from "./Financial-record-list";
const Dashboard = () => {
  const { user } = useUser();
  return (
    <div className="dashboard-container">
      <h1>Welcome {user?.firstName || "Guest"}!, Here Are Your Finances</h1>
      <FinancialRecordForm />
      <FinancialRecordList />
    </div>
  );
};

export default Dashboard;
