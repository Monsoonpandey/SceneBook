import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';
import Navbar from './pages/Navbar';
import Footer from './pages/Footer';
import Home from './pages/Home';
import Movies from './pages/Movies';
import MovieDetails from './pages/MovieDetails';
import Login from './pages/Login';
import Register from './pages/Register';
import MyBookings from './pages/MyBookings';
import Admin from './pages/Admin';
import MovieDashboard from './pages/MovieDashboard';
import Users from './pages/Users';
import './App.css';
import { useEffect } from 'react';
import { seedFirestore } from './seed/seedData';
import Book from './pages/Book';
import Confirmation from './pages/Confirmation';

function App() {
  useEffect(() => {
    seedFirestore();
  }, []);
  return (
    <AuthProvider>
      <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-900 to-black text-white">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/movies" element={<Movies />} />
            <Route path="/movie/:id" element={<MovieDetails />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/book" element={<Book />} />
            <Route path="/confirmation" element={<Confirmation />} />
            <Route path="/my-bookings" element={<MyBookings />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/admin/movies" element={<MovieDashboard />} />
            <Route path="/admin/users" element={<Users />} />

  
          </Routes>
        </main>
        <Footer />
      </div>
    </AuthProvider>
  );
}

export default App;
