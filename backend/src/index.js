const express = require('express');
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);

app.use(cors());
app.use(express.json());

const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

// In-memory state for a single poll session (can be expanded later)
let currentQuestion = null;
let pollResults = {};
let participants = {};
let answeredStudents = {};
let pollHistory = [];

io.on('connection', socket => {
  console.log('Client connected', socket.id);

  socket.on('register-student', payload => {
    const studentName =
      typeof payload === 'string'
        ? payload
        : payload?.name || payload?.displayName || 'Student';

    participants[socket.id] = { id: socket.id, name: studentName };
    io.emit('participants-updated', Object.values(participants));
  });

  socket.on('teacher-ask-question', payload => {
    // store previous question snapshot in history
    if (currentQuestion) {
      pollHistory.push({
        id: currentQuestion.id,
        text: currentQuestion.text,
        options: currentQuestion.options,
        results: { ...pollResults }
      });
      io.emit('poll-history', pollHistory);
    }

    // reset state for next question
    currentQuestion = {
      id: Date.now(),
      ...payload
    };
    pollResults = {};
    answeredStudents = {};
    io.emit('new-question', currentQuestion);
  });

  socket.on('student-answer', ({ optionId }) => {
    if (!currentQuestion) return;
    if (answeredStudents[socket.id]) return; // prevent multiple answers

    answeredStudents[socket.id] = true;
    pollResults[optionId] = (pollResults[optionId] || 0) + 1;
    io.emit('poll-results', {
      results: pollResults,
      totalAnswers: Object.keys(answeredStudents).length,
      totalParticipants: Object.keys(participants).length
    });
  });

  socket.on('chat-message', msg => {
    io.emit('chat-message', msg);
  });

  socket.on('kick-student', socketId => {
    const target = io.sockets.sockets.get(socketId);
    if (target) {
      target.emit('kicked-out');
      target.disconnect(true);
    }
  });

  socket.on('disconnect', () => {
    delete participants[socket.id];
    io.emit('participants-updated', Object.values(participants));
    console.log('Client disconnected', socket.id);
  });

  // send existing history on connect
  socket.emit('poll-history', pollHistory);
});

app.get('/', (req, res) => {
  res.send('Live Polling backend is running.');
});

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});


