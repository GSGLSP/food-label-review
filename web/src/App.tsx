import { Routes, Route, Navigate } from 'react-router-dom';
import { useState } from 'react';
import Layout from './components/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import LabelUpload from './pages/LabelUpload';
import ReviewList from './pages/ReviewList';
import ReviewDetail from './pages/ReviewDetail';
import ReportList from './pages/ReportList';

function App() {
  const [user, setUser] = useState<{ username: string; realName: string; role: string } | null>(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });

  if (!user) return <Login onLogin={(u) => { setUser(u); localStorage.setItem('user', JSON.stringify(u)); }} />;

  return (
    <Layout user={user} onLogout={() => { setUser(null); localStorage.removeItem('user'); }}>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<Dashboard user={user} />} />
        <Route path="/labels/upload" element={<LabelUpload username={user.username} realName={user.realName} role={user.role} />} />
        <Route path="/reviews" element={<ReviewList />} />
        <Route path="/reviews/:id" element={<ReviewDetail />} />
        <Route path="/reports" element={<ReportList />} />
      </Routes>
    </Layout>
  );
}

export default App;
