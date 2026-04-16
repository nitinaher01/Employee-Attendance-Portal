import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Import our pages (we will build these next!)
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import LeaveApplication from './pages/LeaveApplication';
import Timesheet from './pages/Timesheet';

function App() {
  return (
    <Router>
      <Routes>
        {/* Default route redirects to login */}
        <Route path="/" element={<Navigate to="/login" />} />
        
        {/* Our main application routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/leaves" element={<LeaveApplication />} />
        <Route path="/timesheet" element={<Timesheet />} />
      </Routes>
    </Router>
  );
}

export default App;