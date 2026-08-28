import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Equipment() {
  const navigate = useNavigate();
  const [equipmentList, setEquipmentList] = useState([]);
  const [name, setName] = useState('');
  const [type, setType] = useState('');
  const [location, setLocation] = useState('');
  const [error, setError] = useState('');

  const token = localStorage.getItem('token');

  const fetchEquipment = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/equipment');
      setEquipmentList(res.data);
    } catch (err) {
      setError('Failed to load equipment');
    }
  };

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }
    fetchEquipment();
    // eslint-disable-next-line
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await axios.post(
        'http://localhost:5000/api/equipment',
        { name, type, location },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setName('');
      setType('');
      setLocation('');
      fetchEquipment(); // refresh the list
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to add equipment');
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/equipment/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchEquipment();
    } catch (err) {
      setError('Failed to delete equipment');
    }
  };

  return (
        <div style={{ maxWidth: '1000px', margin: '40px auto', background: 'white', borderRadius: '16px', padding: '30px', boxShadow: '0 8px 30px rgba(0,0,0,0.2)' }}>
      <button onClick={() => navigate('/dashboard')} style={{ marginBottom: '20px' }}>
        ← Back to Dashboard
      </button>

      <h1>Equipment</h1>

      <form onSubmit={handleSubmit} style={{ marginBottom: '30px', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
        <input
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          style={{ padding: '8px' }}
        />
        <input
          placeholder="Type"
          value={type}
          onChange={(e) => setType(e.target.value)}
          required
          style={{ padding: '8px' }}
        />
        <input
          placeholder="Location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          style={{ padding: '8px' }}
        />
        <button type="submit" style={{ padding: '8px 16px' }}>Add Equipment</button>
      </form>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      <table border="1" cellPadding="10" style={{ borderCollapse: 'collapse', width: '100%' }}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Type</th>
            <th>Status</th>
            <th>Location</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {equipmentList.map((item) => (
            <tr key={item._id}>
              <td>{item.name}</td>
              <td>{item.type}</td>
              <td>{item.status}</td>
              <td>{item.location}</td>
              <td>
                <button onClick={() => handleDelete(item._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Equipment;