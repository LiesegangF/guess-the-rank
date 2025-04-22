import { Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import Home from './pages/Home';
import Upload from './pages/Upload';
import Guess from './pages/Guess';
import Profil from './pages/Profil';
import Login from './pages/Login';
import { AuthProvider, useAuth } from './auth/AuthContext';
import AdminTools from './pages/AdminTools';
import Leaderboard from "./pages/Leaderboard";


function ProtectedRoutes() {
  const { user } = useAuth();

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/upload" element={<Upload />} />
      <Route path="/guess" element={<Guess />} />
      <Route path="/login" element={<Login />} />
      <Route path="/profil" element={<Profil />} />
      <Route path="/leaderboard" element={<Leaderboard />} />
      <Route path="/admin" element={<AdminTools />} />
      <Route
        path="/admin"
        element={
          user ? (
            <div>Admin Tools (coming soon)</div>
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Header />
      <main>
        <ProtectedRoutes />
      </main>
    </AuthProvider>
  );
}
