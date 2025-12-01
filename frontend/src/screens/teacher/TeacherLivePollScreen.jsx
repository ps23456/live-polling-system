import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import ChatBubble from '../../components/ChatBubble';
import { useSocket } from '../../socketContext';

function TeacherLivePollScreen() {
  const navigate = useNavigate();
  const { currentQuestion, pollState } = useSocket();

  const totalVotes = useMemo(
    () => Object.values(pollState.results || {}).reduce((sum, v) => sum + v, 0) || 1,
    [pollState.results]
  );

  if (!currentQuestion) {
    return (
      <div className="page">
        <p className="waiting-text">No question has been asked yet.</p>
      </div>
    );
  }

  const highest = Math.max(...Object.values(pollState.results || { 0: 0 }));
  const canAskNewQuestion =
    !currentQuestion ||
    pollState.totalParticipants === 0 ||
    pollState.totalAnswers >= pollState.totalParticipants;

  return (
    <div className="page">
      <div className="live-header">
        <button className="secondary-button view-history-button" onClick={() => navigate('/teacher/history')}>
          👁️ View Poll history
        </button>
      </div>
      <div className="question-card">
        <div className="question-card-header">
          <span>Question</span>
        </div>
        <div className="question-card-body">
          <p className="question-text">{currentQuestion.text}</p>
          <div className="option-list">
            {currentQuestion.options?.map((opt, idx) => {
              const count = pollState.results?.[idx] || 0;
              const percentage = Math.round((count / totalVotes) * 100);
              return (
                <div
                  key={idx}
                  className={`option-bar ${count === highest && highest > 0 ? 'option-bar-active' : ''}`}
                >
                  <span className="option-label">{opt}</span>
                  <span className="option-percentage">{percentage}%</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <button
        className="primary-button medium"
        disabled={!canAskNewQuestion}
        onClick={() => canAskNewQuestion && navigate('/teacher/start')}
      >
        + Ask a new question
      </button>

      <ChatBubble role="teacher" displayName="Teacher" />
    </div>
  );
}

export default TeacherLivePollScreen;


