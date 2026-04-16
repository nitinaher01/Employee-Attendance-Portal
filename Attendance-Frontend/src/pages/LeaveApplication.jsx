import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './LeaveApplication.css';

function LeaveApplication() {
  // Form State
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [leaveType, setLeaveType] = useState('Sick');
  const [reason, setReason] = useState('');
  
  // History State
  const [leaveHistory, setLeaveHistory] = useState([]);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  
  const navigate = useNavigate();

  // Load history when page opens
  useEffect(() => {
    fetchLeaveHistory();
  }, []);

  const fetchLeaveHistory = async () => {
    const token = localStorage.getItem('token');
    if (!token) return navigate('/login');

    try {
      const response = await axios.get('http://localhost:5000/api/leaves', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setLeaveHistory(response.data);
    } catch (err) {
      if (err.response?.status === 401 || err.response?.status === 403) {
        localStorage.removeItem('token');
        navigate('/login');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    
    const token = localStorage.getItem('token');

    try {
      // Send the 4 required fields to the backend
      console.log("FRONTEND SENDING:", { start_date: startDate, end_date: endDate, type: leaveType, reason: reason });
      await axios.post('http://localhost:5000/api/leaves', {
        start_date: startDate,
        end_date: endDate,
        type: leaveType,
        reason: reason
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setMessage('Leave application submitted successfully!');
      
      // Clear the form
      setStartDate('');
      setEndDate('');
      setLeaveType('Sick');
      setReason('');
      
      // Refresh the table to show the new pending request
      fetchLeaveHistory();

    } catch (err) {
      console.error("THE REAL ERROR IS:", err);
      if (err.response?.status === 401 || err.response?.status === 403) {
        localStorage.removeItem('token');
        navigate('/login');
      } else {
        setError(err.response?.data?.message || 'Failed to submit leave request.');
      }
    }
  };

  return (
    <div className="leave-container">
      
      {/* SECTION 1: The Form */}
      <div className="leave-card">
        <div className="nav-bar">
          <h2>Apply for Leave</h2>
          <div>
            <Link to="/dashboard" className="nav-link" style={{ marginRight: '15px' }}>Dashboard</Link>
            <Link to="/timesheet" className="nav-link">Timesheet</Link>
          </div>
        </div>

        {message && <p style={{ color: 'green', fontWeight: 'bold' }}>{message}</p>}
        {error && <p style={{ color: 'red', fontWeight: 'bold' }}>{error}</p>}

        <form className="leave-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Start Date</label>
            <input type="date" className="leave-input" value={startDate} onChange={(e) => setStartDate(e.target.value)} required />
          </div>
          
          <div className="form-group">
            <label>End Date</label>
            <input type="date" className="leave-input" value={endDate} onChange={(e) => setEndDate(e.target.value)} required />
          </div>

          <div className="form-group full-width">
            <label>Leave Type</label>
            <select className="leave-select" value={leaveType} onChange={(e) => setLeaveType(e.target.value)}>
              <option value="Sick">Sick Leave</option>
              <option value="Casual">Casual Leave</option>
              <option value="Earned">Earned Leave</option>
            </select>
          </div>

          <div className="form-group full-width">
            <label>Reason</label>
            <textarea 
              className="leave-textarea" 
              placeholder="Please explain why you need this leave..."
              value={reason} 
              onChange={(e) => setReason(e.target.value)} 
              required 
            />
          </div>

          <button type="submit" className="btn-submit">Submit Application</button>
        </form>
      </div>

      {/* SECTION 2: The History Table */}
      <div className="leave-card">
        <h2>My Leave History</h2>
        <table className="leave-table">
          <thead>
            <tr>
              <th>Start Date</th>
              <th>End Date</th>
              <th>Type</th>
              <th>Reason</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {leaveHistory.length === 0 ? (
              <tr>
                <td colSpan="5" style={{ textAlign: 'center' }}>No leave requests found.</td>
              </tr>
            ) : (
              leaveHistory.map((leave) => (
                <tr key={leave.id}>
                  <td>{leave.start_date}</td>
                  <td>{leave.end_date}</td>
                  <td>{leave.type}</td>
                  <td>{leave.reason}</td>
                  <td className={`status-${leave.status}`}>{leave.status || 'Pending'}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

    </div>
  );
}

export default LeaveApplication;