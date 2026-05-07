import { Link, useNavigate } from 'react-router-dom';
import { Home, LogOut, User } from 'lucide-react';

const Navbar = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || 'null');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const dashboardPath =
    user?.role === 'ADMIN' || user?.role === 'OWNER'
      ? '/admin'
      : user?.role === 'STUDENT'
        ? '/student/search'
        : '/tenant';

  return (
    <nav className="navbar">
      <div className="container nav-content">
        <Link to="/" className="logo">
          <Home className="primary-icon" />
          <span>RentEase</span>
        </Link>
        
        <div className="nav-links">
          {user ? (
            <>
              <Link to={dashboardPath} className="nav-link">
                Dashboard
              </Link>
              <div className="user-profile">
                <User size={18} />
                <span>{user.name}</span>
                <button onClick={handleLogout} className="logout-btn">
                  <LogOut size={18} />
                </button>
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link">Login</Link>
              <Link to="/student/login" className="nav-link">Student Login</Link>
              <Link to="/register" className="btn btn-primary">Get Started</Link>
            </>
          )}
        </div>
      </div>
      
      <style>{`
        .navbar {
          height: 70px;
          background: white;
          border-bottom: 1px solid var(--border);
          display: flex;
          align-items: center;
          position: sticky;
          top: 0;
          z-index: 100;
        }
        .nav-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
          width: 100%;
        }
        .logo {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 1.5rem;
          font-weight: 700;
          color: var(--primary);
        }
        .nav-links {
          display: flex;
          align-items: center;
          gap: 2rem;
        }
        .nav-link {
          font-weight: 500;
          color: var(--text-muted);
          transition: color 0.2s;
        }
        .nav-link:hover {
          color: var(--primary);
        }
        .user-profile {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.5rem 1rem;
          background: var(--bg-main);
          border-radius: 2rem;
        }
        .logout-btn {
          background: none;
          color: var(--text-muted);
          display: flex;
          align-items: center;
        }
        .logout-btn:hover {
          color: var(--error);
        }
      `}</style>
    </nav>
  );
};

export default Navbar;
