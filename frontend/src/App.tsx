import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./Components/pages/DashBoard/Dashboard";
import Auth from "./Components/pages/Auth/Auth";

function App() {
  return (
    <Router>
      <div className="app-container">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/auth" element={<Auth />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
