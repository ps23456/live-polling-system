import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ChatBubble from '../../components/ChatBubble';
import { useSocket } from '../../socketContext';

function StudentResultsScreen() {
  const navigate = useNavigate();
  const { currentQuestion, pollState, kicked } = useSocket();
  const studentDisplayName = localStorage.getItem('studentDisplayName') || 'Student';

  useEffect(() => {
    // when a new question arrives, go back to question screen
    if (currentQuestion && pollState.totalAnswers === 0) {
      navigate('/student/question');
    }
  }, [currentQuestion, pollState.totalAnswers, navigate]);

  useEffect(() => {
    if (kicked) {
      navigate('/student/kicked');
    }
  }, [kicked, navigate]);

  if (!currentQuestion) {
    navigate('/student/waiting');
    return null;
  }

  const totalVotes = Object.values(pollState.results || {}).reduce((sum, v) => sum + v, 0) || 1;
  const maxValue = Object.values(pollState.results || {}).reduce((max, value) => Math.max(max, value), 0);

  return (
    <div className="page">
      <div className="question-header-row">
        <span className="question-count">Question 1</span>
        <span className="question-timer">
          ⏱ <span className="question-timer-value">00:15</span>
        </span>
      </div>

      <div className="question-card">
        <div className="question-card-header">
          <span>{currentQuestion.text}</span>
        </div>
        <div className="question-card-body">
          <div className="option-list">
            {currentQuestion.options?.map((opt, idx) => {
              const count = pollState.results?.[idx] || 0;
              const percentage = Math.round((count / totalVotes) * 100);
              return (
                <div key={idx} className={`option-bar ${count === maxValue && maxValue > 0 ? 'option-bar-active' : ''}`}>
                  <span className="option-label">{opt}</span>
                  <span className="option-percentage">{percentage}%</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <p className="waiting-text">Wait for the teacher to ask a new question..</p>

      <ChatBubble displayName={studentDisplayName} />
    </div>
  );
}

export default StudentResultsScreen;


