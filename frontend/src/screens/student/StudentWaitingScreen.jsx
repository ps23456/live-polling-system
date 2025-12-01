import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ChatBubble from '../../components/ChatBubble';
import { useSocket } from '../../socketContext';

function StudentWaitingScreen() {
  const navigate = useNavigate();
  const { currentQuestion, kicked } = useSocket();
  const studentDisplayName = localStorage.getItem('studentDisplayName') || 'Student';

  useEffect(() => {
    if (currentQuestion) {
      navigate('/student/question');
    }
  }, [currentQuestion, navigate]);

  useEffect(() => {
    if (kicked) {
      navigate('/student/kicked');
    }
  }, [kicked, navigate]);

  return (
    <div className="page">
      <div className="badge">Intervue Poll</div>
      <div className="loader-circle" />
      <p className="waiting-text">Wait for the teacher to ask questions..</p>
      <ChatBubble displayName={studentDisplayName} />
    </div>
  );
}

export default StudentWaitingScreen;


