import { useMemo, useState } from 'react';
import { useSocket } from '../socketContext';

function ChatBubble({ role = 'student', displayName = 'Student' }) {
  const { socket, chatMessages, participants } = useSocket();
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('chat');
  const [message, setMessage] = useState('');

  const isTeacher = role === 'teacher';
  const participantList = useMemo(() => participants || [], [participants]);

  const handleSend = event => {
    event?.preventDefault();
    if (!socket) return;
    const trimmed = message.trim();
    if (!trimmed) return;

    socket.emit('chat-message', {
      sender: displayName,
      role,
      text: trimmed,
      timestamp: new Date().toISOString()
    });
    setMessage('');
  };

  const handleKick = participantId => {
    if (!socket || !isTeacher) return;
    socket.emit('kick-student', participantId);
  };

  return (
    <>
      {open && (
        <div className="chat-popup">
          <div className="chat-popup-header">
            <button
              type="button"
              className={`chat-tab ${activeTab === 'chat' ? 'chat-tab-active' : ''}`}
              onClick={() => setActiveTab('chat')}
            >
              Chat
            </button>
            <button
              type="button"
              className={`chat-tab ${activeTab === 'participants' ? 'chat-tab-active' : ''}`}
              onClick={() => setActiveTab('participants')}
            >
              Participants
            </button>
          </div>

          {activeTab === 'chat' ? (
            <div className="chat-popup-body">
              <div className="chat-messages">
                {chatMessages.length === 0 && <p className="chat-empty">No messages yet.</p>}
                {chatMessages.map((msg, index) => (
                  <div
                    key={`${msg.timestamp}-${index}`}
                    className={`chat-message ${msg.role === 'teacher' ? 'chat-message-teacher' : 'chat-message-student'}`}
                  >
                    <span className="chat-sender">{msg.sender}</span>
                    <span className="chat-text">{msg.text}</span>
                  </div>
                ))}
              </div>
              <form className="chat-input-row" onSubmit={handleSend}>
                <input
                  type="text"
                  className="chat-input"
                  placeholder="Type a message..."
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                />
                <button type="submit" className="chat-send-button" disabled={!message.trim() || !socket}>
                  Send
                </button>
              </form>
            </div>
          ) : (
            <div className="chat-popup-body participants-body">
              <div className="participants-header">
                <span>Name</span>
                {isTeacher && <span>Action</span>}
              </div>
              {participantList.length === 0 ? (
                <p className="chat-empty">No participants yet.</p>
              ) : (
                <div className="participants-list">
                  {participantList.map(p => (
                    <div key={p.id} className="participant-row">
                      <div className="participant-info">
                        <span className="participant-name">{p.name}</span>
                      </div>
                      {isTeacher && (
                        <button type="button" className="kick-button" onClick={() => handleKick(p.id)}>
                          Kick out
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}
      <button className="chat-fab" onClick={() => setOpen(v => !v)}>
        💬
      </button>
    </>
  );
}

export default ChatBubble;
