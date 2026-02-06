import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../config/Firebase";
import MovieCard from "../components/MovieCard";
import { Loader, Filter, X } from "lucide-react";
import { useSearchParams, useNavigate } from "react-router-dom";

const Movies = () => {
  const [movies, setMovies] = useState([]);
  const [filteredMovies, setFilteredMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const category = searchParams.get('category');

  useEffect(() => {
    fetchMovies();
  }, []);

  useEffect(() => {
    if (movies.length > 0 && category) {
      const filtered = movies.filter(movie =>
        movie.genre?.includes(category)
      );
      setFilteredMovies(filtered);
    } else {
      setFilteredMovies(movies);
    }
  }, [category, movies]);

  const fetchMovies = async () => {
    try {
      const snapshot = await getDocs(collection(db, "movies"));
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setMovies(data);
      setFilteredMovies(data);
    } catch (err) {
      console.error("Error fetching movies:", err);
    } finally {
      setLoading(false);
    }
  };

  const clearFilter = () => {
    setSearchParams({});
  };

  const goToCategories = () => {
    navigate('/categories');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader className="animate-spin h-12 w-12 text-purple-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        {/* Header with Filter Indicator */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <div>
              <h1 className="text-4xl font-bold">
                {category ? `${category} Movies` : "All Movies"}
              </h1>
              <p className="text-gray-400 mt-2">
                {category
                  ? `Showing ${filteredMovies.length} movie${filteredMovies.length !== 1 ? 's' : ''} in ${category}`
                  : `Browse our collection of ${movies.length} movies`
                }
              </p>
            </div>

            <div className="flex gap-3">
              {category && (
                <button
                  onClick={clearFilter}
                  className="px-4 py-2 bg-gray-800 text-gray-300 rounded-lg hover:bg-gray-700 transition flex items-center gap-2"
                >
                  <X size={18} />
                  Clear Filter
                </button>
              )}
              <button
                onClick={goToCategories}
                className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition flex items-center gap-2"
              >
                <Filter size={18} />
                Browse Categories
              </button>
            </div>
          </div>

          {/* Active Filter Badge */}
          {category && (
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-full mb-6">
              <span className="text-sm">Active Filter:</span>
              <span className="font-semibold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                {category}
              </span>
            </div>
          )}
        </div>

        {/* Movies Grid */}
        {filteredMovies.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredMovies.map(movie => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-gray-800/30 rounded-2xl">
            <div className="inline-block p-4 bg-gray-800 rounded-full mb-4">
              <Filter size={48} className="text-gray-400" />
            </div>
            <h3 className="text-2xl font-semibold mb-2">
              No Movies Found
            </h3>
            <p className="text-gray-400 mb-6">
              {category
                ? `No movies found in "${category}" category`
                : "No movies available in the database"
              }
            </p>
            {category ? (
              <button
                onClick={clearFilter}
                className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full font-semibold hover:from-purple-700 hover:to-pink-700 transition"
              >
                View All Movies
              </button>
            ) : (
              <button
                onClick={goToCategories}
                className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full font-semibold hover:from-purple-700 hover:to-pink-700 transition"
              >
                Browse Categories
              </button>
            )}
          </div>
        )}

        {/* Back to Categories Link */}
        <div className="mt-12 pt-8 border-t border-gray-800 text-center">
          <button
            onClick={goToCategories}
            className="text-purple-400 hover:text-purple-300 transition flex items-center justify-center gap-2 mx-auto"
          >
            <Filter size={18} />
            Explore more categories
          </button>
        </div>
      </div>
    </div>
  );
};

export default Movies;