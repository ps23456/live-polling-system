import { Routes, Route, Navigate } from 'react-router-dom';
import RoleSelectScreen from './screens/RoleSelectScreen';
import TeacherQuestionSetupScreen from './screens/teacher/TeacherQuestionSetupScreen';
import TeacherLivePollScreen from './screens/teacher/TeacherLivePollScreen';
import TeacherHistoryScreen from './screens/teacher/TeacherHistoryScreen';
import StudentNameScreen from './screens/student/StudentNameScreen';
import StudentWaitingScreen from './screens/student/StudentWaitingScreen';
import StudentQuestionScreen from './screens/student/StudentQuestionScreen';
import StudentResultsScreen from './screens/student/StudentResultsScreen';
import StudentKickedScreen from './screens/student/StudentKickedScreen';

function App() {
  return (
    <Routes>
      <Route path="/" element={<RoleSelectScreen />} />

      {/* Teacher flow */}
      <Route path="/teacher/start" element={<TeacherQuestionSetupScreen />} />
      <Route path="/teacher/live" element={<TeacherLivePollScreen />} />
      <Route path="/teacher/history" element={<TeacherHistoryScreen />} />

      {/* Student flow */}
      <Route path="/student/name" element={<StudentNameScreen />} />
      <Route path="/student/waiting" element={<StudentWaitingScreen />} />
      <Route path="/student/question" element={<StudentQuestionScreen />} />
      <Route path="/student/results" element={<StudentResultsScreen />} />
      <Route path="/student/kicked" element={<StudentKickedScreen />} />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;


