import { useState } from 'react';
import axios from 'axios';
import {Link, useNavigate } from 'react-router-dom';

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const res = await axios.post('https://research-lab-platform-ae4k.onrender.com/api/auth/login', {
        email,
        password
      });

      // Save token and user info in browser storage
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));

            navigate('/dashboard');
      // Later we'll redirect to a dashboard page here
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed');
    }
  };

  return (
        <div style={{ maxWidth: '400px', margin: '100px auto', background: 'white', borderRadius: '16px', padding: '40px', boxShadow: '0 8px 30px rgba(0,0,0,0.2)' }}>
      <h2>Research Lab Login</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '10px' }}>
          <label>Email</label><br />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ width: '100%', padding: '8px' }}
          />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label>Password</label><br />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ width: '100%', padding: '8px' }}
          />
        </div>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <button type="submit" style={{ padding: '10px 20px' }}>
          Login
        </button>
      </form>
            <p style={{ marginTop: '15px' }}>
        Don't have an account? <Link to="/register">Register here</Link>
      </p>
    </div>
  );
}

export default Login;