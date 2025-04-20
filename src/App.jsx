import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Upload from './pages/Upload';
import Guess from './pages/Guess';
import Header from './components/Header';

export default function App() {
  return (
    <>
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/upload" element={<Upload />} />
          <Route path="/guess" element={<Guess />} />
          <Route path="/admin" element={<div>Admin Tools (coming soon)</div>} />
          <Route path="/login" element={<div>Login Seite (coming soon)</div>} />
        </Routes>
      </main>
    </>
  );
}