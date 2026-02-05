import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Calendar, Clock, Star, MapPin, Play, ChevronLeft, ChevronRight, Ticket, ChevronDown } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { collection, getDocs, query, where, doc, getDoc } from 'firebase/firestore';
import { db } from '../config/Firebase';

const MovieDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  const [movie, setMovie] = useState(null);
  const [theatres, setTheatres] = useState([]);
  const [selectedTheatre, setSelectedTheatre] = useState(null);
  const [allShowtimes, setAllShowtimes] = useState([]);
  const [filteredShowtimes, setFilteredShowtimes] = useState([]);
  const [selectedShowtime, setSelectedShowtime] = useState(null);
  const [loading, setLoading] = useState(true);
  const [trailerKey, setTrailerKey] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // Fetch movie details FROM FIREBASE
  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        setLoading(true);

        // 1. Fetch movie from Firebase
        const movieRef = doc(db, 'movies', id);
        const movieDoc = await getDoc(movieRef);

        if (movieDoc.exists()) {
          const movieData = { id: movieDoc.id, ...movieDoc.data() };
          setMovie(movieData);
          console.log("✅ Movie from Firebase:", movieData);

          // For trailers, you can add a trailer_key field to your movie data
          // Or use a hardcoded trailer for now
          if (movieData.title === "Inception") {
            setTrailerKey("YoHD9XEInc0"); // Inception trailer
          } else if (movieData.title === "The Dark Knight") {
            setTrailerKey("EXeTwQWrcwY"); // Dark Knight trailer
          } else if (movieData.title === "Interstellar") {
            setTrailerKey("zSWdZVtXT7E"); // Interstellar trailer
          } else if (movieData.title === "Avengers: Endgame") {
            setTrailerKey("TcMBFSGVi1c"); // Avengers trailer
          }
        } else {
          console.error('Movie not found in Firebase');
        }

        // 2. Fetch theatres and showtimes from Firebase
        await fetchTheatresAndShowtimes();

      } catch (error) {
        console.error('Error fetching movie details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMovieDetails();
  }, [id]);

  // Fetch theatres and showtimes
  const fetchTheatresAndShowtimes = async () => {
    try {
      // Fetch theatres from Firebase
      const theatresRef = collection(db, 'theatres');
      const theatresSnapshot = await getDocs(theatresRef);

      if (theatresSnapshot.empty) {
        console.warn("⚠️ No theatres found in Firebase!");
        const fallbackTheatres = [
          { id: 'theatre_1', name: 'Grand Cinema', location: 'Downtown', amenities: ["Dolby Atmos", "Recliner Seats"] },
          { id: 'theatre_2', name: 'City Plex', location: 'Mall Road', amenities: ["3D Projection", "VIP Lounge"] },
          { id: 'theatre_3', name: 'IMAX Arena', location: 'Tech Park', amenities: ["IMAX", "4K Laser"] },
        ];
        setTheatres(fallbackTheatres);
      } else {
        const theatresData = theatresSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        console.log("✅ Theatres from Firebase:", theatresData);
        setTheatres(theatresData);
      }

      // Fetch showtimes for THIS movie from Firebase
      const showtimesRef = collection(db, 'showtimes');
      const q = query(showtimesRef, where('movieId', '==', id));
      const showtimesSnapshot = await getDocs(q);

      if (showtimesSnapshot.empty) {
        console.warn(`⚠️ No showtimes in Firebase for movie: ${id}`);
        // Add mock showtimes for testing
        const mockShowtimes = [
          { id: 'show_1', movieId: id, theatreId: 'theatre_1', time: '10:30 AM', date: '2024-01-20', format: '2D' },
          { id: 'show_2', movieId: id, theatreId: 'theatre_1', time: '02:00 PM', date: '2024-01-20', format: '3D' },
          { id: 'show_3', movieId: id, theatreId: 'theatre_2', time: '06:30 PM', date: '2024-01-20', format: '2D' },
        ];
        setAllShowtimes(mockShowtimes);
      } else {
        const showtimesData = showtimesSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        console.log("✅ Showtimes from Firebase:", showtimesData);
        setAllShowtimes(showtimesData);
      }

    } catch (error) {
      console.error('❌ Firebase error:', error);
    }
  };

  const handleTheatreSelect = (theatreId) => {
    const theatre = theatres.find(t => t.id === theatreId);
    setSelectedTheatre(theatre);
    // Filter showtimes for this specific theatre
    const theatreShowtimes = allShowtimes.filter(show => show.theatreId === theatreId);
    setFilteredShowtimes(theatreShowtimes);
    setSelectedShowtime(null);
    setDropdownOpen(false);
  };

  const handleShowtimeSelect = (showtimeId) => {
    const showtime = filteredShowtimes.find(s => s.id === showtimeId);
    setSelectedShowtime(showtime);
  };

  const handleBookTickets = () => {
    if (!currentUser) {
      navigate('/login', { state: { from: `/movie/${id}` } });
      return;
    }

    if (!selectedTheatre || !selectedShowtime) {
      alert('Please select a theatre and showtime first');
      return;
    }

    // Navigate to booking page
    navigate('/book', {
      state: {
        movie: {
          id: movie.id,
          title: movie.title,
          poster_path: movie.poster_path,
          duration: movie.duration
        },
        theatre: selectedTheatre,
        showtime: selectedShowtime,
      }
    });
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return 'Date not set';
    try {
      const options = { weekday: 'short', month: 'short', day: 'numeric' };
      return new Date(dateString).toLocaleDateString('en-US', options);
    } catch {
      return dateString;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <h2 className="text-2xl text-gray-400">Movie not found</h2>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 bg-gradient-to-b from-gray-900 to-black">
      <div className="container mx-auto px-4">
        {/* Back button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center space-x-2 text-gray-400 hover:text-white mb-6 transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
          <span>Back to Movies</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column: Trailer and Movie Info */}
          <div className="space-y-6">
            {/* Trailer */}
            <div className="relative rounded-2xl overflow-hidden bg-gray-800/50 border border-gray-700">
              {trailerKey ? (
                <div className="aspect-video">
                  <iframe
                    src={`https://www.youtube.com/embed/${trailerKey}?autoplay=0&rel=0`}
                    title={`${movie.title} Trailer`}
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              ) : (
                <div className="aspect-video flex items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900">
                  <div className="text-center">
                    <Play className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                    <p className="text-gray-400">Trailer not available</p>
                  </div>
                </div>
              )}
            </div>

            {/* Movie Details */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700">
              <h1 className="text-3xl font-bold text-white mb-2">{movie.title}</h1>

              <div className="flex items-center space-x-4 mb-4">
                <div className="flex items-center space-x-1 bg-gray-900/50 px-3 py-1 rounded-full">
                  <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                  <span className="text-white font-semibold">
                    {movie.rating?.toFixed(1) || 'N/A'}/10
                  </span>
                </div>
                <div className="flex items-center space-x-1 text-gray-400">
                  <Calendar className="w-4 h-4" />
                  <span>{movie.release_date || 'Coming Soon'}</span>
                </div>
                <div className="flex items-center space-x-1 text-gray-400">
                  <Clock className="w-4 h-4" />
                  <span>{movie.duration ? `${movie.duration} min` : 'N/A'}</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mb-6">
                {movie.genre?.map((genre, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-purple-900/30 text-purple-300 text-sm rounded-full border border-purple-700/50"
                  >
                    {genre}
                  </span>
                ))}
              </div>

              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-white">Overview</h3>
                <p className="text-gray-300 leading-relaxed">{movie.synopsis || movie.overview || 'No description available.'}</p>
              </div>
            </div>
          </div>

          {/* Right Column: Booking Section */}
          <div className="space-y-6">
            {/* "Now Showing" Header */}
            <div className="text-center">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-white to-purple-300 bg-clip-text text-transparent">
                Now Showing
              </h2>
              <p className="text-gray-400 mt-2">Select your preferred theatre and showtime</p>
            </div>

            {/* Theatre Selection Box */}
            <div className="bg-gray-800/30 backdrop-blur-sm rounded-2xl p-6 border border-purple-700/50">
              <div className="space-y-6">
                {/* Step 1: Select Theatre */}
                <div>
                  <h3 className="text-xl font-semibold text-white mb-4">Select Theatre</h3>

                  {!selectedTheatre ? (
                    <div className="space-y-4">
                      {/* Dropdown button */}
                      <div className="relative">
                        <button
                          className="w-full p-4 bg-gray-800/50 border border-purple-600 rounded-xl text-white text-left flex items-center justify-between hover:bg-gray-700/50 transition-colors"
                          onClick={() => setDropdownOpen(!dropdownOpen)}
                        >
                          <span className="flex items-center">
                            <MapPin className="w-5 h-5 mr-3 text-purple-400" />
                            {theatres.length > 0 ? 'Choose a theatre...' : 'Loading theatres...'}
                          </span>
                          <ChevronDown className={`w-5 h-5 text-purple-400 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
                        </button>

                        {/* Dropdown menu */}
                        {dropdownOpen && theatres.length > 0 && (
                          <div className="absolute z-20 mt-2 w-full bg-gray-800 border border-gray-700 rounded-xl shadow-lg max-h-60 overflow-y-auto">
                            {theatres.map(theatre => (
                              <button
                                key={theatre.id}
                                onClick={() => handleTheatreSelect(theatre.id)}
                                className="w-full p-4 text-left text-gray-300 hover:bg-gray-700/50 hover:text-white transition-colors border-b border-gray-700 last:border-b-0 flex items-center justify-between"
                              >
                                <div>
                                  <div className="font-medium text-white">{theatre.name}</div>
                                  <div className="text-sm text-gray-400 flex items-center mt-1">
                                    <MapPin className="w-4 h-4 mr-1" />
                                    {theatre.location}
                                  </div>
                                </div>
                                <ChevronRight className="w-4 h-4 text-gray-500" />
                              </button>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Close dropdown when clicking outside */}
                      {dropdownOpen && (
                        <div
                          className="fixed inset-0 z-10"
                          onClick={() => setDropdownOpen(false)}
                        />
                      )}

                      {theatres.length === 0 && (
                        <div className="text-center p-4 bg-yellow-900/20 rounded-xl">
                          <p className="text-yellow-400">No theatres available. Check Firebase seeding.</p>
                        </div>
                      )}
                    </div>
                  ) : (
                    /* Showtime Selection Box */
                    <div className="space-y-6">
                      {/* Selected Theatre Header */}
                      <div className="bg-purple-900/20 rounded-xl p-4 border border-purple-700/50">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="text-lg font-semibold text-white">{selectedTheatre.name}</h4>
                            <p className="text-gray-400 text-sm">{selectedTheatre.location}</p>
                          </div>
                          <button
                            onClick={() => {
                              setSelectedTheatre(null);
                              setFilteredShowtimes([]);
                              setSelectedShowtime(null);
                            }}
                            className="text-purple-400 hover:text-purple-300 text-sm flex items-center space-x-1 transition-colors"
                          >
                            <ChevronLeft className="w-4 h-4" />
                            <span>Change Theatre</span>
                          </button>
                        </div>
                      </div>

                      {/* Showtimes */}
                      <div className="space-y-4">
                        <h5 className="font-semibold text-gray-300">Select Showtime</h5>
                        {filteredShowtimes.length === 0 ? (
                          <div className="text-center py-8 bg-gray-800/30 rounded-xl">
                            <p className="text-gray-400">No showtimes available for this theatre</p>
                          </div>
                        ) : (
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                            {filteredShowtimes.map(showtime => (
                              <button
                                key={showtime.id}
                                onClick={() => handleShowtimeSelect(showtime.id)}
                                className={`p-4 rounded-xl border transition-all duration-300 ${selectedShowtime?.id === showtime.id
                                  ? 'bg-purple-900/40 border-purple-500 text-white shadow-lg shadow-purple-900/20'
                                  : 'bg-gray-800/50 border-gray-700 hover:border-purple-500 text-gray-300 hover:text-white'
                                  }`}
                              >
                                <div className="font-bold text-lg">{showtime.time}</div>
                                <div className="text-sm text-gray-400 mt-1">
                                  {formatDate(showtime.date)}
                                </div>
                                {showtime.format && (
                                  <div className="text-xs mt-2 px-2 py-1 bg-gray-900/50 rounded-full inline-block">
                                    {showtime.format}
                                  </div>
                                )}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Book Button */}
                <div>
                  <button
                    onClick={handleBookTickets}
                    disabled={!selectedTheatre || !selectedShowtime}
                    className={`w-full py-4 px-6 rounded-xl font-bold text-lg transition-all duration-300 flex items-center justify-center space-x-3 ${selectedTheatre && selectedShowtime
                      ? 'bg-gradient-to-r from-red-600 to-purple-600 hover:from-red-500 hover:to-purple-500 text-white transform hover:scale-[1.02] shadow-lg hover:shadow-purple-500/25'
                      : 'bg-gray-800 text-gray-500 cursor-not-allowed'
                      }`}
                  >
                    <Ticket className="w-6 h-6" />
                    <span>
                      {!selectedTheatre ? 'Select a Theatre' :
                        !selectedShowtime ? 'Select a Showtime' :
                          selectedShowtime.format ? `Book ${selectedShowtime.format} Tickets` : 'Book Tickets Now'}
                    </span>
                  </button>
                </div>
              </div>
            </div>

            {/* Theatre Amenities Info */}
            {selectedTheatre && selectedTheatre.amenities && (
              <div className="bg-gray-800/30 backdrop-blur-sm rounded-2xl p-6 border border-gray-700">
                <h3 className="text-lg font-semibold text-white mb-4">Theatre Amenities</h3>
                <div className="grid grid-cols-2 gap-3">
                  {selectedTheatre.amenities.map((amenity, index) => (
                    <div key={index} className="flex items-center space-x-2 p-3 bg-gray-800/50 rounded-lg">
                      <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                      <span className="text-gray-300">{amenity}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieDetails;