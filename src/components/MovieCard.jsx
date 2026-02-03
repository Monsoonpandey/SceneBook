import React from 'react';
import { Link } from 'react-router-dom';
import { Star, Calendar, Clock } from 'lucide-react';

const MovieCard = ({ movie }) => {
    const imageUrl = movie.poster_path
        ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
        : 'https://via.placeholder.com/500x750?text=No+Image';

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('en-US', options);
    };

    return (
        <div className="group relative overflow-hidden rounded-2xl bg-gray-800/50 backdrop-blur-sm border border-gray-700 hover:border-purple-600 transition-all duration-500 hover:scale-[1.03] hover:shadow-2xl hover:shadow-purple-900/30">
            {/* Movie Poster */}
            <div className="relative h-64 overflow-hidden">
                <img
                    src={imageUrl}
                    alt={movie.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent"></div>

                {/* Rating Badge */}
                <div className="absolute top-3 right-3 bg-gray-900/80 backdrop-blur-sm px-3 py-1 rounded-full flex items-center space-x-1">
                    <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                    <span className="text-white font-semibold">{movie.vote_average.toFixed(1)}</span>
                </div>
            </div>

            {/* Movie Info */}
            <div className="p-4">
                <h3 className="text-lg font-bold text-white mb-2 line-clamp-1 group-hover:text-purple-300 transition-colors duration-300">
                    {movie.title}
                </h3>

                <div className="flex items-center justify-between text-sm text-gray-400 mb-3">
                    <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4" />
                        <span>{formatDate(movie.release_date)}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Clock className="w-4 h-4" />
                        <span>2h 15m</span>
                    </div>
                </div>

                <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                    {movie.overview || 'No description available.'}
                </p>

                <div className="flex justify-between items-center">
                    <div className="flex flex-wrap gap-2">
                        {movie.genre_ids?.slice(0, 2).map((genreId) => (
                            <span
                                key={genreId}
                                className="px-3 py-1 bg-purple-900/30 text-purple-300 text-xs rounded-full border border-purple-700/50"
                            >
                                {getGenreName(genreId)}
                            </span>
                        ))}
                    </div>

                    <Link
                        to={`/movie/${movie.id}`}
                        className="px-4 py-2 bg-gradient-to-r from-red-600 to-purple-600 hover:from-red-500 hover:to-purple-500 rounded-lg text-white text-sm font-medium transition-all duration-300 transform hover:scale-105"
                    >
                        Details
                    </Link>
                </div>
            </div>
        </div>
    );
};

// Helper function for genre names
const getGenreName = (genreId) => {
    const genres = {
        28: 'Action',
        12: 'Adventure',
        16: 'Animation',
        35: 'Comedy',
        80: 'Crime',
        99: 'Documentary',
        18: 'Drama',
        10751: 'Family',
        14: 'Fantasy',
        36: 'History',
        27: 'Horror',
        10402: 'Music',
        9648: 'Mystery',
        10749: 'Romance',
        878: 'Sci-Fi',
        10770: 'TV Movie',
        53: 'Thriller',
        10752: 'War',
        37: 'Western'
    };
    return genres[genreId] || 'Movie';
};

export default MovieCard;