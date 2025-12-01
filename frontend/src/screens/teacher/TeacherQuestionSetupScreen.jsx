import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSocket } from '../../socketContext';

function TeacherQuestionSetupScreen() {
  const navigate = useNavigate();
  const { socket } = useSocket();

  const [questionText, setQuestionText] = useState('Which planet is known as the Red Planet?');
  const [options, setOptions] = useState(['Mars', 'Venus', 'Jupiter', 'Saturn']);
  const [duration, setDuration] = useState(60);
  const [correctFlags, setCorrectFlags] = useState([true, false, false, false]);

  const handleOptionChange = (index, value) => {
    setOptions(prev => {
      const updated = [...prev];
      updated[index] = value;
      return updated;
    });
  };

  const handleAddOption = () => {
    setOptions(prev => [...prev, '']);
    setCorrectFlags(prev => [...prev, false]);
  };

  const handleDeleteOption = index => {
    setOptions(prev => prev.filter((_, i) => i !== index));
    setCorrectFlags(prev => prev.filter((_, i) => i !== index));
  };

  const handleCorrectToggle = (index, isCorrect) => {
    setCorrectFlags(prev => {
      const updated = [...prev];
      updated[index] = isCorrect;
      return updated;
    });
  };

  const handleAskQuestion = () => {
    if (!socket) return;
    const payload = {
      text: questionText,
      options: options.filter(Boolean),
      duration,
      correctFlags
    };
    socket.emit('teacher-ask-question', payload);
    navigate('/teacher/live');
  };

  return (
    <div className="page">
      <div className="badge">Intervue Poll</div>
      <h1 className="page-title">
        Let’s <span>Get Started</span>
      </h1>
      <p className="page-subtitle">
        You’ll have the ability to create and manage polls, ask questions, and monitor your students’ responses in
        real-time.
      </p>

      <div className="field-group full-width">
        <div className="field-row">
          <label className="field-label">Enter your question</label>
          <select
            className="select-timer top-right"
            value={duration}
            onChange={e => setDuration(Number(e.target.value))}
          >
            <option value={30}>30 seconds</option>
            <option value={60}>60 seconds</option>
            <option value={90}>90 seconds</option>
          </select>
        </div>
        <textarea
          className="text-area large"
          value={questionText}
          onChange={e => setQuestionText(e.target.value)}
        />
      </div>

      <div className="options-row">
        <div className="field-group full-width">
          <div className="options-header">
            <span className="field-label">Edit Options</span>
            <span className="field-label">Is it Correct?</span>
          </div>
          {options.map((opt, idx) => (
            <div key={idx} className="option-row-editor">
              <span className="option-index-badge">{idx + 1}</span>
              <input
                className="option-input"
                value={opt}
                onChange={e => handleOptionChange(idx, e.target.value)}
              />
              <button
                type="button"
                className="option-delete-button"
                onClick={() => handleDeleteOption(idx)}
                aria-label="Delete option"
              >
                ✕
              </button>
              <div className="option-radio-group">
                <label>
                  <input
                    type="radio"
                    name={`correct-${idx}`}
                    checked={correctFlags[idx]}
                    onChange={() => handleCorrectToggle(idx, true)}
                  />
                  <span>Yes</span>
                </label>
                <label>
                  <input
                    type="radio"
                    name={`correct-${idx}`}
                    checked={!correctFlags[idx]}
                    onChange={() => handleCorrectToggle(idx, false)}
                  />
                  <span>No</span>
                </label>
              </div>
            </div>
          ))}
          <button type="button" className="secondary-button add-option-button" onClick={handleAddOption}>
            + Add More option
          </button>
        </div>
      </div>

      <button className="primary-button large" onClick={handleAskQuestion}>
        Ask Question
      </button>
    </div>
  );
}

export default TeacherQuestionSetupScreen;


