import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Timesheet.css';

function Timesheet() {
  const [records, setRecords] = useState([]);
  const [error, setError] = useState('');
  // 1. Add state for the date range filters 
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchTimesheet();
  }, []);

  // Updated to accept optional start/end dates for filtering
  const fetchTimesheet = async (start = '', end = '') => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    try {
      // 2. Pass dates as query parameters to the backend 
      const url = `http://localhost:5000/api/attendance?startDate=${start}&endDate=${end}`;
      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setRecords(response.data);
      setError(''); // Clear error on success
    } catch (err) {
      if (err.response?.status === 401 || err.response?.status === 403) {
        localStorage.removeItem('token');
        navigate('/login');
      } else {
        setError('Failed to fetch timesheet records.');
      }
    }
  };

  // 3. New function to trigger the filter when the button is clicked
  const handleFilter = () => {
    fetchTimesheet(startDate, endDate);
  };

  const formatTime = (isoString) => {
    if (!isoString) return null;
    return new Date(isoString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const calculateHours = (checkIn, checkOut) => {
    if (!checkIn || !checkOut) return '-';
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const diff = (end - start) / (1000 * 60 * 60);
    return diff > 0 ? diff.toFixed(2) + ' hrs' : '-';
  };

  return (
    <div className="timesheet-container">
      <div className="timesheet-card">
        
        <div className="nav-bar">
          <h2>My Timesheet</h2>
          <div>
            <Link to="/dashboard" className="nav-link" style={{ marginRight: '15px' }}>Dashboard</Link>
            <Link to="/leaves" className="nav-link">Apply Leave</Link>
          </div>
        </div>

        {/* 4. Filter UI Section: Placed above the table as per requirement  */}
        <div className="filter-section" style={{ marginBottom: '20px', display: 'flex', gap: '10px', alignItems: 'center' }}>
          <div>
            <label>From: </label>
            <input 
              type="date" 
              value={startDate} 
              onChange={(e) => setStartDate(e.target.value)} 
            />
          </div>
          <div>
            <label>To: </label>
            <input 
              type="date" 
              value={endDate} 
              onChange={(e) => setEndDate(e.target.value)} 
            />
          </div>
          <button onClick={handleFilter} className="filter-button">
            Filter Records
          </button>
          <button onClick={() => { setStartDate(''); setEndDate(''); fetchTimesheet(); }} className="clear-button">
            Clear
          </button>
        </div>

        {error && <p style={{ color: 'red' }}>{error}</p>}

        <table className="timesheet-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Check-in Time</th>
              <th>Check-out Time</th>
              <th>Total Hours</th>
            </tr>
          </thead>
          <tbody>
            {records.length === 0 ? (
              <tr>
                <td colSpan="4" style={{ textAlign: 'center' }}>No attendance records found.</td>
              </tr>
            ) : (
              records.map((record) => (
                <tr key={record.id}>
                  <td>{record.date}</td>
                  <td>{formatTime(record.check_in_time) || '-'}</td>
                  <td>{formatTime(record.check_out_time) || 'Working...'}</td>
                  <td>{calculateHours(record.check_in_time, record.check_out_time)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Timesheet;