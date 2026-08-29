import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Projects() {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [principalInvestigator, setPrincipalInvestigator] = useState('');
  const [membersInput, setMembersInput] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const token = localStorage.getItem('token');

  const fetchProjects = async () => {
    try {
      const res = await axios.get('https://research-lab-platform-ae4k.onrender.com/api/projects');
      setProjects(res.data);
    } catch (err) {
      setError('Failed to load projects');
    }
  };

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }
    fetchProjects();
    // eslint-disable-next-line
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      const members = membersInput
        .split(',')
        .map((m) => m.trim())
        .filter((m) => m.length > 0);

      await axios.post(
        'https://research-lab-platform-ae4k.onrender.com/api/projects',
        { name, description, principalInvestigator, members },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setSuccess('Project created successfully!');
      setName('');
      setDescription('');
      setPrincipalInvestigator('');
      setMembersInput('');
      fetchProjects();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create project');
    }
  };

  return (
        <div style={{ maxWidth: '1000px', margin: '40px auto', background: 'white', borderRadius: '16px', padding: '30px', boxShadow: '0 8px 30px rgba(0,0,0,0.2)' }}>
      <button onClick={() => navigate('/dashboard')} style={{ marginBottom: '20px' }}>
        ← Back to Dashboard
      </button>

      <h1>Projects</h1>

      <form onSubmit={handleSubmit} style={{ marginBottom: '30px', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
        <input
          placeholder="Project Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          style={{ padding: '8px' }}
        />
        <input
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          style={{ padding: '8px', minWidth: '200px' }}
        />
        <input
          placeholder="Principal Investigator"
          value={principalInvestigator}
          onChange={(e) => setPrincipalInvestigator(e.target.value)}
          required
          style={{ padding: '8px' }}
        />
        <input
          placeholder="Members (comma separated)"
          value={membersInput}
          onChange={(e) => setMembersInput(e.target.value)}
          style={{ padding: '8px', minWidth: '200px' }}
        />
        <button type="submit" style={{ padding: '8px 16px' }}>Create Project</button>
      </form>

      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}

      <table border="1" cellPadding="10" style={{ borderCollapse: 'collapse', width: '100%' }}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Description</th>
            <th>PI</th>
            <th>Members</th>
          </tr>
        </thead>
        <tbody>
          {projects.map((p) => (
            <tr key={p._id}>
              <td>{p.name}</td>
              <td>{p.description}</td>
              <td>{p.principalInvestigator}</td>
              <td>{p.members?.join(', ')}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Projects;