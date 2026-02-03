import React, { useState, useEffect } from 'react';
import MovieCard from '../components/MovieCard';
import { Filter, Search, Loader } from 'lucide-react';

const API_KEY = '80d491707d8cf7b38aa19c7ccab0952f';

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
      let url;

      if (selectedGenre) {
        url = `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&with_genres=${selectedGenre}&sort_by=popularity.desc`;
      } else {
        url = `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&sort_by=popularity.desc`;
      }

      const response = await fetch(url);
      const data = await response.json();
      setMovies(data.results || []);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching movies:', error);
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
                <option value="28">Action</option>
                <option value="12">Adventure</option>
                <option value="35">Comedy</option>
                <option value="18">Drama</option>
                <option value="27">Horror</option>
                <option value="10749">Romance</option>
                <option value="878">Science Fiction</option>
                <option value="53">Thriller</option>
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