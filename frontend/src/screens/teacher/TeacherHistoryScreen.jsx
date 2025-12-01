import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import ChatBubble from '../../components/ChatBubble';
import { useSocket } from '../../socketContext';

function TeacherHistoryScreen() {
  const { pollHistory } = useSocket();
  const navigate = useNavigate();
  const items = useMemo(() => pollHistory || [], [pollHistory]);

  return (
    <div className="page">
      <div className="history-header">
        <button className="secondary-button view-history-button" onClick={() => navigate('/teacher/live')}>
          ← Back to Live
        </button>
      </div>

      <h1 className="page-title">
        View <span>Poll History</span>
      </h1>

      {items.length === 0 ? (
        <p className="waiting-text">No previous polls yet.</p>
      ) : (
        <div className="history-list">
          {items.map((poll, index) => {
            const totalVotes = Object.values(poll.results || {}).reduce((sum, v) => sum + v, 0) || 1;
            const highest = Math.max(...Object.values(poll.results || { 0: 0 }));
            return (
              <div key={poll.id || index} className="history-item">
                <div className="history-question-label">Question {index + 1}</div>
                <div className="question-card small">
                  <div className="question-card-header">
                    <span>{poll.text}</span>
                  </div>
                  <div className="question-card-body">
                    <div className="option-list">
                      {poll.options?.map((opt, idx) => {
                        const count = poll.results?.[idx] || 0;
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
              </div>
            );
          })}
        </div>
      )}

      <ChatBubble role="teacher" displayName="Teacher" />
    </div>
  );
}

export default TeacherHistoryScreen;


