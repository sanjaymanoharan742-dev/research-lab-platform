import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Dashboard() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');

    if (!token) {
      navigate('/login');
      return;
    }

    setUser(JSON.parse(storedUser));
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  if (!user) return null;

  return (
        <div style={{ maxWidth: '900px', margin: '40px auto', background: 'white', borderRadius: '16px', padding: '30px', boxShadow: '0 8px 30px rgba(0,0,0,0.2)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>Research Lab Dashboard</h1>
        <button onClick={handleLogout} style={{ padding: '8px 16px' }}>
          Logout
        </button>
      </div>
      <p>Welcome, <strong>{user.name}</strong> ({user.role})</p>

      <div style={{ marginTop: '30px', display: 'flex', gap: '20px' }}>
                <div
          onClick={() => navigate('/equipment')}
          style={{ background: '#f0f2ff', border: '1px solid #d8dcff', padding: '20px', borderRadius: '12px', width: '200px', cursor: 'pointer', transition: 'transform 0.15s' }}
        >
          <h3>Equipment</h3>
          <p>View and manage lab equipment</p>
        </div>
                <div
          onClick={() => navigate('/bookings')}
          style={{ border: '1px solid #ccc', padding: '20px', borderRadius: '8px', width: '200px', cursor: 'pointer' }}
        >
          <h3>Bookings</h3>
          <p>Schedule experiment time slots</p>
        </div>
                <div
          onClick={() => navigate('/projects')}
          style={{ border: '1px solid #ccc', padding: '20px', borderRadius: '8px', width: '200px', cursor: 'pointer' }}
        >
          <h3>Projects</h3>
          <p>Collaborate with your team</p>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;