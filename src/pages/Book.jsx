import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, Clock, MapPin, CreditCard } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import SeatMap from '../components/SeatMap';

const Book = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { currentUser } = useAuth();

    const { movie, theatre, showtime } = location.state || {};
    const [selectedSeats, setSelectedSeats] = useState([]);
    const [loading, setLoading] = useState(false);

    // Check if user is logged in
    useEffect(() => {
        if (!currentUser) {
            navigate('/login', { state: { from: '/book' } });
        }
    }, [currentUser, navigate]);

    // If no booking data, redirect to movies
    if (!currentUser || !movie || !theatre || !showtime) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl text-gray-400 mb-4">No booking information found</h2>
                    <button
                        onClick={() => navigate('/movies')}
                        className="px-6 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg"
                    >
                        Browse Movies
                    </button>
                </div>
            </div>
        );
    }

    const handleSeatSelect = (seatId) => {
        setSelectedSeats(prev => {
            if (prev.includes(seatId)) {
                return prev.filter(id => id !== seatId);
            } else {
                return [...prev, seatId];
            }
        });
    };

    const calculateTotal = () => {
        const seatPrice = 12.99; // Base price per seat
        return (selectedSeats.length * seatPrice).toFixed(2);
    };

    const handleConfirmBooking = async () => {
        if (selectedSeats.length === 0) {
            alert('Please select at least one seat');
            return;
        }

        setLoading(true);
        // TODO: Save booking to Firebase
        setTimeout(() => {
            setLoading(false);
            navigate('/confirmation', {
                state: {
                    movie,
                    theatre,
                    showtime,
                    seats: selectedSeats,
                    total: calculateTotal(),
                    bookingId: `BK${Date.now()}`,
                    user: currentUser.email
                }
            });
        }, 1500);
    };

    return (
        <div className="min-h-screen py-8 bg-gradient-to-b from-gray-900 to-black">
            <div className="container mx-auto px-4">
                {/* Back button */}
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center space-x-2 text-gray-400 hover:text-white mb-8 transition-colors"
                >
                    <ArrowLeft className="w-5 h-5" />
                    <span>Back to Movie</span>
                </button>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column: Booking Summary */}
                    <div className="lg:col-span-1">
                        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700 mb-6">
                            <h2 className="text-2xl font-bold text-white mb-6">Booking Summary</h2>

                            <div className="space-y-6">
                                {/* Movie Info */}
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-300 mb-2">Movie</h3>
                                    <div className="flex items-center space-x-4">
                                        <img
                                            src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
                                            alt={movie.title}
                                            className="w-16 h-24 rounded-lg object-cover"
                                        />
                                        <div>
                                            <h4 className="font-bold text-white">{movie.title}</h4>
                                            <p className="text-gray-400 text-sm">{movie.runtime} min</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Theatre Info */}
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-300 mb-2">Theatre</h3>
                                    <div className="space-y-2">
                                        <div className="flex items-center space-x-3">
                                            <MapPin className="w-5 h-5 text-purple-400" />
                                            <div>
                                                <p className="text-white font-medium">{theatre.name}</p>
                                                <p className="text-gray-400 text-sm">{theatre.location}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Showtime Info */}
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-300 mb-2">Showtime</h3>
                                    <div className="flex items-center space-x-4">
                                        <div className="flex items-center space-x-2">
                                            <Calendar className="w-5 h-5 text-purple-400" />
                                            <span className="text-white">{showtime.date}</span>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <Clock className="w-5 h-5 text-purple-400" />
                                            <span className="text-white">{showtime.time}</span>
                                        </div>
                                        {showtime.format && (
                                            <span className="px-2 py-1 bg-purple-900/30 text-purple-300 text-xs rounded">
                                                {showtime.format}
                                            </span>
                                        )}
                                    </div>
                                </div>

                                {/* Selected Seats */}
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-300 mb-2">Selected Seats</h3>
                                    {selectedSeats.length > 0 ? (
                                        <div className="flex flex-wrap gap-2">
                                            {selectedSeats.map(seat => (
                                                <span key={seat} className="px-3 py-1 bg-purple-900/30 text-purple-300 rounded">
                                                    {seat}
                                                </span>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-gray-400">No seats selected</p>
                                    )}
                                </div>

                                {/* Price Summary */}
                                <div className="pt-4 border-t border-gray-700">
                                    <div className="flex justify-between mb-2">
                                        <span className="text-gray-400">Seats ({selectedSeats.length})</span>
                                        <span className="text-white">${(selectedSeats.length * 12.99).toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between mb-2">
                                        <span className="text-gray-400">Service Fee</span>
                                        <span className="text-white">$2.50</span>
                                    </div>
                                    <div className="flex justify-between text-lg font-bold mt-4 pt-4 border-t border-gray-700">
                                        <span className="text-white">Total</span>
                                        <span className="text-white">${(parseFloat(calculateTotal()) + 2.50).toFixed(2)}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Seat Selection */}
                    <div className="lg:col-span-2">
                        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700">
                            <h2 className="text-2xl font-bold text-white mb-6">Select Your Seats</h2>

                            <div className="mb-8">
                                <SeatMap
                                    selectedSeats={selectedSeats}
                                    onSeatSelect={handleSeatSelect}
                                />
                            </div>

                            {/* Seat Legend */}
                            <div className="flex justify-center space-x-8 mb-8">
                                <div className="flex items-center space-x-2">
                                    <div className="w-6 h-6 bg-gray-800 border border-gray-700 rounded"></div>
                                    <span className="text-gray-400">Available</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <div className="w-6 h-6 bg-purple-900 border border-purple-500 rounded"></div>
                                    <span className="text-gray-400">Selected</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <div className="w-6 h-6 bg-gray-700 border border-gray-600 rounded"></div>
                                    <span className="text-gray-400">Booked</span>
                                </div>
                            </div>

                            {/* Confirm Button */}
                            <button
                                onClick={handleConfirmBooking}
                                disabled={selectedSeats.length === 0 || loading}
                                className={`w-full py-4 px-6 rounded-xl font-bold text-lg transition-all duration-300 flex items-center justify-center space-x-3 ${selectedSeats.length > 0
                                    ? 'bg-gradient-to-r from-red-600 to-purple-600 hover:from-red-500 hover:to-purple-500 text-white transform hover:scale-[1.02] shadow-lg hover:shadow-purple-500/25'
                                    : 'bg-gray-800 text-gray-500 cursor-not-allowed'
                                    }`}
                            >
                                <CreditCard className="w-6 h-6" />
                                <span>
                                    {loading ? 'Processing...' :
                                        selectedSeats.length > 0 ? `Confirm Booking - $${(parseFloat(calculateTotal()) + 2.50).toFixed(2)}` :
                                            'Select Seats to Continue'}
                                </span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Book;