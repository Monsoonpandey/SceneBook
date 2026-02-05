import React from 'react';
import { Link } from 'react-router-dom';
import { Star, Calendar, Clock } from 'lucide-react';

const MovieCard = ({ movie }) => {
    // Handle image URL - check if poster_path exists and is valid
    const getImageUrl = () => {
        if (movie.poster_path && movie.poster_path.startsWith('/')) {
            return `https://image.tmdb.org/t/p/w500${movie.poster_path}`;
        } else if (movie.poster_path) {
            return movie.poster_path; // Full URL already
        }
        // Fallback images based on movie title
        const fallbackImages = {
            'Inception': 'https://image.tmdb.org/t/p/w500/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg',
            'The Dark Knight': 'https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg',
            'Interstellar': 'https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg',
            'Avengers: Endgame': 'https://image.tmdb.org/t/p/w500/or06FN3Dka5tukK1e9sl16pB3iy.jpg',
            'Parasite': 'https://image.tmdb.org/t/p/w500/7IiTTgloJzvGI1TAYymCfbfl3vT.jpg',
            'Joker': 'https://image.tmdb.org/t/p/w500/udDclJoHjfjb8Ekgsd4FDteOkCU.jpg',
            'Dune': 'https://image.tmdb.org/t/p/w500/d5NXSklXo0qyIYkgV94XAgMIckC.jpg',
            'The Matrix': 'https://image.tmdb.org/t/p/w500/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg',
            'Titanic': 'https://image.tmdb.org/t/p/w500/9xjZS2rlVxm8SFx8kPC3aIGCOYQ.jpg',
            'Oppenheimer': 'https://image.tmdb.org/t/p/w500/8Gxv8gSFCU0XGDykEGv7zR1n8ua.jpg'
        };

        return fallbackImages[movie.title] || 'https://via.placeholder.com/500x750?text=No+Image';
    };

    const imageUrl = getImageUrl();

    const formatDate = (dateString) => {
        if (!dateString) return 'Coming Soon';
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
                    onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/500x750?text=No+Image';
                    }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent"></div>

                {/* Rating Badge */}
                <div className="absolute top-3 right-3 bg-gray-900/80 backdrop-blur-sm px-3 py-1 rounded-full flex items-center space-x-1">
                    <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                    <span className="text-white font-semibold">
                        {movie.rating?.toFixed(1) || 'N/A'}
                    </span>
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
                        <span>{movie.release_date ? formatDate(movie.release_date) : 'Coming Soon'}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Clock className="w-4 h-4" />
                        <span>{movie.duration ? `${Math.floor(movie.duration / 60)}h ${movie.duration % 60}m` : '2h 15m'}</span>
                    </div>
                </div>

                <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                    {movie.synopsis || movie.overview || 'No description available.'}
                </p>

                <div className="flex justify-between items-center">
                    <div className="flex flex-wrap gap-2">
                        {movie.genre?.slice(0, 2).map((genre, index) => (
                            <span
                                key={index}
                                className="px-3 py-1 bg-purple-900/30 text-purple-300 text-xs rounded-full border border-purple-700/50"
                            >
                                {genre}
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

export default MovieCard;