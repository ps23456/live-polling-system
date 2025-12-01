import { useNavigate } from 'react-router-dom';

function RoleSelectCard({ title, description }) {
  return (
    <div className="role-card">
      <h3 className="role-card-title">{title}</h3>
      <p className="role-card-description">{description}</p>
    </div>
  );
}

function RoleSelectScreen() {
  const navigate = useNavigate();

  return (
    <div className="page">
      <div className="badge">Intervue Poll</div>
      <h1 className="page-title">
        Welcome to the <span>Live Polling System</span>
      </h1>
      <p className="page-subtitle">
        Please select the role that best describes you to begin using the live polling system.
      </p>

      <div className="role-card-row">
        <button className="role-card-button" onClick={() => navigate('/student/name')}>
          <RoleSelectCard
            title="I’m a Student"
            description="Lorem ipsum is simply dummy text of the printing and typesetting industry."
          />
        </button>
        <button className="role-card-button" onClick={() => navigate('/teacher/start')}>
          <RoleSelectCard
            title="I’m a Teacher"
            description="Submit answers and view live poll results in real-time."
          />
        </button>
      </div>

      <button className="primary-button large">Continue</button>
    </div>
  );
}

export default RoleSelectScreen;


