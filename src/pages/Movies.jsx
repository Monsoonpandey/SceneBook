import React, { useState, useEffect } from 'react';
import MovieCard from '../components/MovieCard';
import { Filter, Search, Loader } from 'lucide-react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../config/Firebase';

const Movies = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('');

  useEffect(() => {
    fetchMovies();
  }, [selectedGenre]);

  const fetchMovies = async () => {
    try {
      setLoading(true);
      const moviesRef = collection(db, 'movies');

      const snapshot = await getDocs(moviesRef);
      const moviesData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      // Filter by genre if selected
      let filtered = moviesData;
      if (selectedGenre) {
        filtered = moviesData.filter(movie =>
          movie.genre && movie.genre.includes(selectedGenre)
        );
      }

      setMovies(filtered);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching movies from Firebase:', error);
      setLoading(false);
    }
  };

  const filteredMovies = movies.filter(movie =>
    movie.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        <div className="mb-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Browse Movies</h1>
          <p className="text-gray-400 text-lg">Discover and book your favorite movies</p>
        </div>

        {/* Search and Filter */}
        <div className="mb-8 bg-gray-800/50 rounded-xl p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search movies..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-gray-900 border border-gray-700 rounded-lg focus:outline-none focus:border-purple-500"
              />
            </div>

            <div className="flex items-center space-x-2">
              <Filter size={20} className="text-gray-400" />
              <select
                value={selectedGenre}
                onChange={(e) => setSelectedGenre(e.target.value)}
                className="bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:border-purple-500"
              >
                <option value="">All Genres</option>
                <option value="Action">Action</option>
                <option value="Adventure">Adventure</option>
                <option value="Comedy">Comedy</option>
                <option value="Drama">Drama</option>
                <option value="Horror">Horror</option>
                <option value="Romance">Romance</option>
                <option value="Sci-Fi">Sci-Fi</option>
                <option value="Thriller">Thriller</option>
                <option value="Crime">Crime</option>
                <option value="History">History</option>
              </select>
            </div>
          </div>
        </div>

        {/* Movies Grid */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Loader className="animate-spin h-12 w-12 text-purple-500" />
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {filteredMovies.map((movie) => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </div>

            {filteredMovies.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-400 text-lg">No movies found. Try a different search.</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Movies;