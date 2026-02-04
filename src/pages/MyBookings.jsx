import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Clock, MapPin, Ticket, Download, Trash2, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const MyBookings = () => {
  const navigate = useNavigate();
  const { currentUser, userData } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  // Check if user is logged in
  useEffect(() => {
    if (!currentUser) {
      navigate('/login', { state: { from: '/my-bookings' } });
    } else {
      // Fetch bookings from Firebase or use mock data
      fetchBookings();
    }
  }, [currentUser, navigate]);

  const fetchBookings = async () => {
    setLoading(true);
    // TODO: Fetch bookings from Firebase for currentUser.uid
    // For now, using mock data
    const mockBookings = [
      {
        id: 'BK123456',
        movieTitle: 'The Wrecking Crew',
        theatre: 'Grand Cinema',
        date: '2024-01-20',
        time: '02:00 PM',
        seats: ['A1', 'A2', 'A3'],
        total: 41.47,
        status: 'confirmed',
        moviePoster: '/gbVwHl4YPSq6BcC92TQpe7qUTh6.jpg'
      },
      {
        id: 'BK123457',
        movieTitle: 'Greenland 2: Migration',
        theatre: 'IMAX Arena',
        date: '2024-01-21',
        time: '08:00 PM',
        seats: ['B5', 'B6'],
        total: 28.48,
        status: 'confirmed',
        moviePoster: '/1mF4othta76CEXcL1YFInYudQ7K.jpg'
      }
    ];

    setTimeout(() => {
      setBookings(mockBookings);
      setLoading(false);
    }, 1000);
  };

  const handleCancelBooking = (bookingId) => {
    if (window.confirm('Are you sure you want to cancel this booking?')) {
      // TODO: Update booking status in Firebase
      setBookings(bookings.filter(booking => booking.id !== bookingId));
    }
  };

  const handleDownloadTicket = (booking) => {
    // TODO: Generate PDF ticket
    alert(`Ticket for ${booking.movieTitle} downloaded!`);
  };

  // Show loading or redirect if not logged in
  if (!currentUser) {
    return null; // Will redirect in useEffect
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 bg-gradient-to-b from-gray-900 to-black">
      <div className="container mx-auto px-4">
        {/* User Info Header */}
        <div className="flex items-center space-x-4 mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-red-600 rounded-full flex items-center justify-center">
            <User className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white">My Bookings</h1>
            <p className="text-gray-400">
              Welcome back, {userData?.name || currentUser.email}
            </p>
          </div>
        </div>

        {bookings.length === 0 ? (
          <div className="text-center py-16">
            <Ticket className="w-24 h-24 text-gray-600 mx-auto mb-6" />
            <h2 className="text-2xl text-gray-400 mb-4">No bookings yet</h2>
            <p className="text-gray-500 mb-8">Book your first movie ticket and it will appear here</p>
            <button
              onClick={() => navigate('/movies')}
              className="px-8 py-3 bg-gradient-to-r from-red-600 to-purple-600 hover:from-red-500 hover:to-purple-500 rounded-lg text-white font-semibold transition-all duration-300"
            >
              Browse Movies
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {bookings.map(booking => (
              <div key={booking.id} className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700 hover:border-purple-700 transition-all duration-300">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-white mb-1">{booking.movieTitle}</h3>
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 text-xs rounded ${booking.status === 'confirmed' ? 'bg-green-900/30 text-green-400' : 'bg-yellow-900/30 text-yellow-400'}`}>
                        {booking.status.toUpperCase()}
                      </span>
                      <span className="text-gray-400 text-sm">ID: {booking.id}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleCancelBooking(booking.id)}
                    className="text-red-400 hover:text-red-300 p-2 hover:bg-red-900/20 rounded-lg transition-colors"
                    title="Cancel Booking"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-4 mb-6">
                  <div className="flex items-center space-x-3">
                    <MapPin className="w-5 h-5 text-purple-400" />
                    <div>
                      <p className="text-white font-medium">{booking.theatre}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-5 h-5 text-purple-400" />
                      <span className="text-white">{booking.date}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="w-5 h-5 text-purple-400" />
                      <span className="text-white">{booking.time}</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-gray-300 mb-2">Selected Seats:</p>
                    <div className="flex flex-wrap gap-2">
                      {booking.seats.map(seat => (
                        <span key={seat} className="px-3 py-1 bg-purple-900/30 text-purple-300 text-sm rounded">
                          {seat}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-6 border-t border-gray-700">
                  <div>
                    <p className="text-gray-400 text-sm">Total Amount</p>
                    <p className="text-2xl font-bold text-white">${booking.total.toFixed(2)}</p>
                  </div>
                  <button
                    onClick={() => handleDownloadTicket(booking)}
                    className="flex items-center space-x-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg text-white transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download Ticket</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyBookings;