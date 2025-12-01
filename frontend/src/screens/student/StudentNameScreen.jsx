import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSocket } from '../../socketContext';

function StudentNameScreen() {
  const navigate = useNavigate();
  const { socket, setKicked } = useSocket();
  const [name, setName] = useState(() => localStorage.getItem('studentDisplayName') || 'Rahul Bajaj');

  const handleContinue = () => {
    const displayName = name.trim();
    if (!displayName) return;

    const sessionId = `${Date.now()}-${Math.floor(Math.random() * 100000)}`;
    localStorage.setItem('studentDisplayName', displayName);
    localStorage.setItem('studentSessionId', sessionId);
    setKicked(false);

    if (socket) {
      socket.emit('register-student', { name: displayName, sessionId });
    }

    navigate('/student/waiting');
  };

  return (
    <div className="page">
      <div className="badge">Intervue Poll</div>
      <h1 className="page-title">
        Let’s <span>Get Started</span>
      </h1>
      <p className="page-subtitle">
        If you’re a student, you’ll be able to submit your answers, participate in live polls, and see how your
        responses compare with your classmates.
      </p>

      <div className="field-group narrow">
        <label className="field-label">Enter your Name</label>
        <input
          className="text-input"
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="Enter your name"
        />
      </div>

      <button className="primary-button large" onClick={handleContinue}>
        Continue
      </button>
    </div>
  );
}

export default StudentNameScreen;


