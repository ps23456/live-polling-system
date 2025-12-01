import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ChatBubble from '../../components/ChatBubble';
import { useSocket } from '../../socketContext';

function StudentQuestionScreen() {
  const navigate = useNavigate();
  const { socket, currentQuestion, kicked } = useSocket();
  const [selectedOption, setSelectedOption] = useState(null);
  const [secondsLeft, setSecondsLeft] = useState(60);
  const duration = currentQuestion?.duration || 60;
  const studentDisplayName = localStorage.getItem('studentDisplayName') || 'Student';

  useEffect(() => {
    // If this question was already answered in this tab, go straight to results
    if (currentQuestion) {
      const answeredId = localStorage.getItem('answeredQuestionId');
      if (answeredId && Number(answeredId) === currentQuestion.id) {
        navigate('/student/results');
        return;
      }
    }

    setSecondsLeft(duration);
    const timer = setInterval(() => {
      setSecondsLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          navigate('/student/results');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [duration, navigate]);

  useEffect(() => {
    if (kicked) {
      navigate('/student/kicked');
    }
  }, [kicked, navigate]);

  if (!currentQuestion) {
    navigate('/student/waiting');
    return null;
  }

  const handleSubmit = () => {
    if (!socket || selectedOption == null) return;
    socket.emit('student-answer', { optionId: selectedOption });
    // Remember that this question has been answered in this tab
    if (currentQuestion?.id) {
      localStorage.setItem('answeredQuestionId', String(currentQuestion.id));
    }
    navigate('/student/results');
  };

  const formattedTime = `00:${secondsLeft.toString().padStart(2, '0')}`;

  return (
    <div className="page">
      <div className="question-header-row">
        <span className="question-count">Question 1</span>
        <span className="question-timer">
          ⏱ <span className="question-timer-value">{formattedTime}</span>
        </span>
      </div>

      <div className="question-card">
        <div className="question-card-header">
          <span>{currentQuestion.text}</span>
        </div>
        <div className="question-card-body">
          <div className="option-list">
            {currentQuestion.options?.map((opt, idx) => (
              <button
                key={idx}
                className={`option-pill ${selectedOption === idx ? 'option-pill-active' : ''}`}
                onClick={() => setSelectedOption(idx)}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>
      </div>

      <button className="primary-button large" onClick={handleSubmit}>
        Submit
      </button>

      <ChatBubble displayName={studentDisplayName} />
    </div>
  );
}

export default StudentQuestionScreen;


