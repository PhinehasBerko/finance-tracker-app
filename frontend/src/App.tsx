import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Dashboard from "./Components/pages/DashBoard/Dashboard";
import Auth from "./Components/pages/Auth/Auth";
import { FinancialRecordsProvider } from "./context/financial-record-context";
import { SignedIn,  UserButton } from "@clerk/clerk-react";

function App() {
  return (
    <Router>
      <div className="app-container">
        <div className="navbar">
          <Link  to ={"/"}> Dashboard </Link>
          <SignedIn>
            <UserButton/>
          </SignedIn>
        </div>
        <Routes>
          <Route path="/" element={<FinancialRecordsProvider><Dashboard /> </FinancialRecordsProvider>} />
          <Route path="/auth" element={<Auth />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
