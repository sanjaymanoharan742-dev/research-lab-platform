import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Bookings() {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [equipmentList, setEquipmentList] = useState([]);

  const [equipment, setEquipment] = useState('');
  const [researcherName, setResearcherName] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [purpose, setPurpose] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const token = localStorage.getItem('token');

  const fetchBookings = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/bookings');
      setBookings(res.data);
    } catch (err) {
      setError('Failed to load bookings');
    }
  };

  const fetchEquipmentList = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/equipment');
      setEquipmentList(res.data);
    } catch (err) {
      setError('Failed to load equipment list');
    }
  };

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }
    fetchBookings();
    fetchEquipmentList();
    // eslint-disable-next-line
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      await axios.post(
        'http://localhost:5000/api/bookings',
        {
          equipment,
          researcherName,
          startTime,
          endTime,
          purpose
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSuccess('Booking created successfully!');
      setEquipment('');
      setResearcherName('');
      setStartTime('');
      setEndTime('');
      setPurpose('');
      fetchBookings();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create booking');
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/bookings/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchBookings();
    } catch (err) {
      setError('Failed to delete booking');
    }
  };

  return (
       <div style={{ maxWidth: '1000px', margin: '40px auto', background: 'white', borderRadius: '16px', padding: '30px', boxShadow: '0 8px 30px rgba(0,0,0,0.2)' }}>
      <button onClick={() => navigate('/dashboard')} style={{ marginBottom: '20px' }}>
        ← Back to Dashboard
      </button>

      <h1>Bookings</h1>

      <form onSubmit={handleSubmit} style={{ marginBottom: '30px', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
        <select
          value={equipment}
          onChange={(e) => setEquipment(e.target.value)}
          required
          style={{ padding: '8px' }}
        >
          <option value="">Select Equipment</option>
          {equipmentList.map((item) => (
            <option key={item._id} value={item._id}>{item.name}</option>
          ))}
        </select>

        <input
          placeholder="Researcher Name"
          value={researcherName}
          onChange={(e) => setResearcherName(e.target.value)}
          required
          style={{ padding: '8px' }}
        />

        <input
          type="datetime-local"
          value={startTime}
          onChange={(e) => setStartTime(e.target.value)}
          required
          style={{ padding: '8px' }}
        />

        <input
          type="datetime-local"
          value={endTime}
          onChange={(e) => setEndTime(e.target.value)}
          required
          style={{ padding: '8px' }}
        />

        <input
          placeholder="Purpose"
          value={purpose}
          onChange={(e) => setPurpose(e.target.value)}
          style={{ padding: '8px' }}
        />

        <button type="submit" style={{ padding: '8px 16px' }}>Create Booking</button>
      </form>

      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}

      <table border="1" cellPadding="10" style={{ borderCollapse: 'collapse', width: '100%' }}>
        <thead>
          <tr>
            <th>Equipment</th>
            <th>Researcher</th>
            <th>Start</th>
            <th>End</th>
            <th>Purpose</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map((b) => (
            <tr key={b._id}>
              <td>{b.equipment?.name || 'Unknown'}</td>
              <td>{b.researcherName}</td>
              <td>{new Date(b.startTime).toLocaleString()}</td>
              <td>{new Date(b.endTime).toLocaleString()}</td>
              <td>{b.purpose}</td>
              <td>{b.status}</td>
              <td>
                <button onClick={() => handleDelete(b._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Bookings;