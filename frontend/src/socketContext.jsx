import { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';

const SocketContext = createContext(null);

export function SocketProvider({ children }) {
  const [socket, setSocket] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [pollState, setPollState] = useState({
    results: {},
    totalAnswers: 0,
    totalParticipants: 0
  });
  const [participants, setParticipants] = useState([]);
  const [chatMessages, setChatMessages] = useState([]);
  const [kicked, setKicked] = useState(false);
  const [pollHistory, setPollHistory] = useState([]);

  useEffect(() => {
    const s = io('http://localhost:4000');
    setSocket(s);

    s.on('new-question', question => {
      setCurrentQuestion(question);
      setPollState(prev => ({ ...prev, results: {}, totalAnswers: 0 }));
      setKicked(false);
    });

    s.on('poll-results', state => {
      setPollState(state);
    });

    s.on('participants-updated', list => {
      setParticipants(list);
    });

    s.on('chat-message', message => {
      setChatMessages(prev => [...prev, message].slice(-50));
    });

    s.on('kicked-out', () => {
      setKicked(true);
    });

    s.on('poll-history', history => {
      setPollHistory(history || []);
    });

    return () => {
      s.disconnect();
    };
  }, []);

  const value = {
    socket,
    currentQuestion,
    setCurrentQuestion,
    pollState,
    setPollState,
    participants,
    chatMessages,
    kicked,
    setKicked,
    pollHistory
  };

  return <SocketContext.Provider value={value}>{children}</SocketContext.Provider>;
}

export function useSocket() {
  const ctx = useContext(SocketContext);
  if (!ctx) {
    throw new Error('useSocket must be used within SocketProvider');
  }
  return ctx;
}


