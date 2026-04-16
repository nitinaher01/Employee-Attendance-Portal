import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Dashboard.css';

function Dashboard() {
  const [status, setStatus] = useState('Loading...');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  // This runs automatically when the page loads
  useEffect(() => {
    fetchTodayStatus();
  }, []);

  const fetchTodayStatus = async () => {
    const token = localStorage.getItem('token');
    
    // If there is no token, kick them to login
    if (!token) {
      navigate('/login');
      return;
    }

    try {
      // Fetch attendance records to figure out today's status
      const response = await axios.get('http://localhost:5000/api/attendance', {
        headers: { Authorization: `Bearer ${token}` }
      });

      const records = response.data;
      const today = new Date().toISOString().split('T')[0];
      
      // Look for a record that matches today's date
      const todaysRecord = records.find(record => record.date === today);

      if (!todaysRecord) {
        setStatus('Not Checked In');
      } else if (todaysRecord && !todaysRecord.check_out_time) {
        setStatus('Checked In');
      } else {
        setStatus('Checked Out');
      }
    } catch (err) {
      // HARD REQUIREMENT: If token is expired (401), redirect to login
      if (err.response?.status === 401 || err.response?.status === 403) {
        localStorage.removeItem('token');
        navigate('/login');
      } else {
        setMessage('Error fetching status.');
      }
    }
  };

  const handleAction = async (actionType) => {
    const token = localStorage.getItem('token');
    setMessage('');

    try {
     const endpoint = actionType === 'checkin' ? '/api/attendance/checkin' : '/api/attendance/checkout';
      
      const response = await axios.post(`http://localhost:5000${endpoint}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setMessage(response.data.message);
      fetchTodayStatus(); // Refresh the status badge
      
    } catch (err) {
      if (err.response?.status === 401 || err.response?.status === 403) {
        localStorage.removeItem('token');
        navigate('/login');
      } else {
        setMessage(err.response?.data?.message || `Error during ${actionType}.`);
      }
    }
  };

  // Determine which CSS class to use for the badge
  const getStatusClass = () => {
    if (status === 'Not Checked In') return 'status-not-checked-in';
    if (status === 'Checked In') return 'status-checked-in';
    if (status === 'Checked Out') return 'status-checked-out';
    return '';
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-card">
        <h2>Employee Dashboard</h2>
        
        <div>
          <span className={`status-badge ${getStatusClass()}`}>
            Status: {status}
          </span>
        </div>

        {/* Show Check-in button if they haven't checked in yet */}
        {status === 'Not Checked In' && (
          <button className="action-button btn-checkin" onClick={() => handleAction('checkin')}>
            Check In for the Day
          </button>
        )}

        {/* Show Check-out button if they are currently checked in */}
        {status === 'Checked In' && (
          <button className="action-button btn-checkout" onClick={() => handleAction('checkout')}>
            Check Out
          </button>
        )}

        {/* If they are checked out, show a disabled button (constraint: 1 check-in per day) */}
        {status === 'Checked Out' && (
          <button className="action-button btn-disabled" disabled>
            Shift Completed
          </button>
        )}

        {message && <div className="message">{message}</div>}
      </div>
    </div>
  );
}

export default Dashboard;