import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CheckCircle, Calendar, Clock, MapPin, Ticket, Download, Home, Printer, Share2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Confirmation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  const {
    movie,
    theatre,
    showtime,
    seats,
    total,
    bookingId,
    user
  } = location.state || {};

  // Check if user is logged in
  useEffect(() => {
    if (!currentUser) {
      navigate('/login', { state: { from: '/confirmation' } });
    }
  }, [currentUser, navigate]);

  // If no booking data, redirect to movies
  if (!currentUser || !movie || !bookingId) {
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

  const handlePrintTicket = () => {
    window.print();
  };

  const handleDownloadTicket = () => {
    // TODO: Generate PDF ticket
    alert(`Ticket ${bookingId} downloaded as PDF!`);
  };

  const handleShareTicket = () => {
    if (navigator.share) {
      navigator.share({
        title: `Movie Ticket - ${movie.title}`,
        text: `I just booked tickets for ${movie.title} at ${theatre.name}!`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Booking link copied to clipboard!');
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Date not set';
    const options = { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  return (
    <div className="min-h-screen py-8 bg-gradient-to-b from-gray-900 to-black">
      <div className="container mx-auto px-4">
        {/* Success Message */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-green-600 to-emerald-500 rounded-full mb-6">
            <CheckCircle className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-3">Booking Confirmed!</h1>
          <p className="text-gray-400 text-lg">
            Your tickets have been successfully booked. Check your email for details.
          </p>
          <div className="mt-4">
            <span className="px-4 py-2 bg-gray-800 rounded-lg text-gray-300">
              Booking ID: <span className="font-mono font-bold text-white">{bookingId}</span>
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Ticket Details */}
          <div className="lg:col-span-2">
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-8 border border-gray-700 shadow-2xl">
              {/* Ticket Header */}
              <div className="flex justify-between items-center mb-8 pb-6 border-b border-gray-700">
                <div>
                  <h2 className="text-2xl font-bold text-white">E-Ticket</h2>
                  <p className="text-gray-400">Present this ticket at the theatre</p>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-400">Booked On</div>
                  <div className="text-white font-semibold">
                    {new Date().toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </div>
                </div>
              </div>

              {/* Movie & Showtime Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                <div>
                  <h3 className="text-lg font-semibold text-gray-300 mb-4">Movie Details</h3>
                  <div className="flex items-start space-x-4">
                    
                    <div>
                      <h4 className="text-xl font-bold text-white mb-1">{movie.title}</h4>
                      <p className="text-gray-400 text-sm">{movie.runtime || movie.duration} min</p>
                      <div className="flex flex-wrap gap-2 mt-3">
                        {seats.map(seat => (
                          <span key={seat} className="px-3 py-1 bg-purple-900/30 text-purple-300 text-sm rounded">
                            {seat}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-300 mb-4">Show Details</h3>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <MapPin className="w-5 h-5 text-purple-400" />
                      <div>
                        <p className="text-white font-medium">{theatre?.name || 'Theatre'}</p>
                        <p className="text-gray-400 text-sm">{theatre?.location || 'Location'}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Calendar className="w-5 h-5 text-purple-400" />
                      <div>
                        <p className="text-white font-medium">{showtime?.date ? formatDate(showtime.date) : 'Date'}</p>
                        <p className="text-gray-400 text-sm">Show Date</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Clock className="w-5 h-5 text-purple-400" />
                      <div>
                        <p className="text-white font-medium">{showtime?.time || 'Time'}</p>
                        <p className="text-gray-400 text-sm">Show Time</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Booking Summary */}
              <div className="bg-gray-800/50 rounded-xl p-6 mb-8">
                <h3 className="text-lg font-semibold text-gray-300 mb-4">Booking Summary</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Number of Tickets</span>
                    <span className="text-white font-medium">{seats?.length || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Seats</span>
                    <span className="text-white font-medium">
                      {seats?.join(', ') || 'No seats selected'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Ticket Price</span>
                    <span className="text-white font-medium">${total || '0.00'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Service Fee</span>
                    <span className="text-white font-medium">$2.50</span>
                  </div>
                  <div className="h-px bg-gray-700 my-3"></div>
                  <div className="flex justify-between text-xl font-bold">
                    <span className="text-white">Total Paid</span>
                    <span className="text-green-400">
                      ${(parseFloat(total || 0) + 2.50).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              {/* User Info */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-300 mb-4">Booked By</h3>
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-red-600 rounded-full flex items-center justify-center">
                    <Ticket className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-white font-medium">{currentUser?.email || user}</p>
                    <p className="text-gray-400 text-sm">Ticket sent to registered email</p>
                  </div>
                </div>
              </div>

              {/* Important Notes */}
              <div className="bg-yellow-900/20 border border-yellow-800 rounded-xl p-4">
                <h4 className="text-yellow-400 font-semibold mb-2">Important Information</h4>
                <ul className="text-yellow-300/80 text-sm space-y-1">
                  <li>• Arrive at least 30 minutes before showtime</li>
                  <li>• Present this e-ticket or booking ID at the counter</li>
                  <li>• Valid photo ID required for verification</li>
                  <li>• No refunds or cancellations 1 hour before showtime</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Right Column: Actions */}
          <div className="lg:col-span-1">
            <div className="space-y-6">
              {/* Action Buttons */}
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700">
                <h3 className="text-xl font-semibold text-white mb-6">Ticket Actions</h3>
                <div className="space-y-4">
                  <button
                    onClick={handleDownloadTicket}
                    className="w-full flex items-center justify-center space-x-3 px-6 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 rounded-xl text-white font-semibold transition-all duration-300 transform hover:scale-[1.02]"
                  >
                    <Download className="w-5 h-5" />
                    <span>Download Ticket (PDF)</span>
                  </button>

                  <button
                    onClick={handlePrintTicket}
                    className="w-full flex items-center justify-center space-x-3 px-6 py-4 bg-gray-700 hover:bg-gray-600 rounded-xl text-white font-semibold transition-all duration-300"
                  >
                    <Printer className="w-5 h-5" />
                    <span>Print Ticket</span>
                  </button>

                  <button
                    onClick={handleShareTicket}
                    className="w-full flex items-center justify-center space-x-3 px-6 py-4 bg-green-700 hover:bg-green-600 rounded-xl text-white font-semibold transition-all duration-300"
                  >
                    <Share2 className="w-5 h-5" />
                    <span>Share with Friends</span>
                  </button>
                </div>
              </div>

              {/* Next Steps */}
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700">
                <h3 className="text-xl font-semibold text-white mb-4">What's Next?</h3>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-white font-bold text-sm">1</span>
                    </div>
                    <div>
                      <p className="text-white font-medium">Check your email</p>
                      <p className="text-gray-400 text-sm">E-ticket sent to {currentUser?.email}</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-white font-bold text-sm">2</span>
                    </div>
                    <div>
                      <p className="text-white font-medium">Save this booking ID</p>
                      <p className="text-gray-400 text-sm">Keep {bookingId} for reference</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-white font-bold text-sm">3</span>
                    </div>
                    <div>
                      <p className="text-white font-medium">Enjoy the movie!</p>
                      <p className="text-gray-400 text-sm">Arrive early for the best seats</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Navigation Buttons */}
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700">
                <div className="space-y-4">
                  <button
                    onClick={() => navigate('/my-bookings')}
                    className="w-full flex items-center justify-center space-x-3 px-6 py-4 bg-purple-600 hover:bg-purple-700 rounded-xl text-white font-semibold transition-all duration-300"
                  >
                    <Ticket className="w-5 h-5" />
                    <span>View All Bookings</span>
                  </button>

                  <button
                    onClick={() => navigate('/movies')}
                    className="w-full flex items-center justify-center space-x-3 px-6 py-4 bg-gradient-to-r from-red-600 to-purple-600 hover:from-red-500 hover:to-purple-500 rounded-xl text-white font-semibold transition-all duration-300 transform hover:scale-[1.02]"
                  >
                    <Home className="w-5 h-5" />
                    <span>Back to Home</span>
                  </button>
                </div>
              </div>

              {/* QR Code Placeholder */}
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700 text-center">
                <h3 className="text-lg font-semibold text-white mb-4">Quick Scan QR</h3>
                <div className="bg-white p-4 rounded-lg inline-block">
                  <div className="w-32 h-32 bg-gray-300 flex items-center justify-center rounded">
                    <span className="text-gray-600 text-xs">QR Code for {bookingId}</span>
                  </div>
                </div>
                <p className="text-gray-400 text-sm mt-4">Scan at theatre entrance</p>
              </div>
            </div>
          </div>
        </div>

        {/* Print Styles */}
        <style>{`
                    @media print {
                        nav, footer, button, .no-print {
                            display: none !important;
                        }
                        body {
                            background: white !important;
                        }
                        .print-ticket {
                            border: 2px solid #000 !important;
                            padding: 20px !important;
                        }
                    }
                `}</style>
      </div>
    </div>
  );
};

export default Confirmation;