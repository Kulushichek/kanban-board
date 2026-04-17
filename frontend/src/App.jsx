import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Boards from './pages/Boards';
import BoardPage from './pages/BoardPage';
import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <BrowserRouter>

      <Toaster position="top-center" reverseOrder={false} />
      <Routes>
        <Route path="/" element={<Boards />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route path="/board/:id" element={<BoardPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;