import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../config/Firebase";
import { Film, Loader, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Category = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    // Category styling config
    const categoryConfig = {
        Action: { emoji: "⚡", color: "bg-red-500/20", border: "border-red-500" },
        Adventure: { emoji: "🏔️", color: "bg-green-500/20", border: "border-green-500" },
        Comedy: { emoji: "😂", color: "bg-yellow-500/20", border: "border-yellow-500" },
        Drama: { emoji: "🎭", color: "bg-purple-500/20", border: "border-purple-500" },
        Horror: { emoji: "👻", color: "bg-gray-500/20", border: "border-gray-500" },
        Romance: { emoji: "💖", color: "bg-pink-500/20", border: "border-pink-500" },
        "Sci-Fi": { emoji: "🚀", color: "bg-blue-500/20", border: "border-blue-500" },
        Thriller: { emoji: "🔪", color: "bg-orange-500/20", border: "border-orange-500" },
        Crime: { emoji: "🕵️", color: "bg-indigo-500/20", border: "border-indigo-500" },
        Fantasy: { emoji: "🧙", color: "bg-teal-500/20", border: "border-teal-500" },
        Animation: { emoji: "🎬", color: "bg-cyan-500/20", border: "border-cyan-500" },
    };

    useEffect(() => {
        fetchMovies();
    }, []);

    const fetchMovies = async () => {
        try {
            const snapshot = await getDocs(collection(db, "movies"));
            const data = snapshot.docs.map(doc => doc.data());

            // Extract unique genres from movies
            const genreSet = new Set();
            data.forEach(movie => {
                if (movie.genre && Array.isArray(movie.genre)) {
                    movie.genre.forEach(g => genreSet.add(g));
                }
            });

            setCategories([...genreSet]);
        } catch (err) {
            console.error("Error fetching categories:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleCategoryClick = (category) => {
        // Navigate to movies page with category as query parameter
        navigate(`/movies?category=${encodeURIComponent(category)}`);
    };

    const handleViewAllMovies = () => {
        navigate('/movies');
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader className="animate-spin h-12 w-12 text-purple-500" />
            </div>
        );
    }

    return (
        <div className="min-h-screen py-8 bg-gradient-to-b from-gray-900 to-black">
            <div className="container mx-auto px-4">
                {/* Header */}
                <div className="text-center mb-12">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl mb-6 shadow-lg">
                        <Film size={40} className="text-white" />
                    </div>
                    <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                        Browse Categories
                    </h1>
                    <p className="text-gray-400 mt-3 text-lg">
                        Select a genre to explore movies
                    </p>

                    {/* View All Movies Button */}
                    <button
                        onClick={handleViewAllMovies}
                        className="mt-6 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full font-semibold hover:from-purple-700 hover:to-pink-700 transition-all duration-300 flex items-center justify-center gap-2 mx-auto"
                    >
                        View All Movies <ArrowRight size={20} />
                    </button>
                </div>

                {/* Categories Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 mb-8">
                    {categories.map(category => {
                        const config = categoryConfig[category] || { emoji: "🎬", color: "bg-gray-500/20", border: "border-gray-500" };

                        return (
                            <button
                                key={category}
                                onClick={() => handleCategoryClick(category)}
                                className={`group relative p-6 rounded-2xl border-2 transition-all duration-300 hover:scale-105 hover:shadow-2xl ${config.color} ${config.border}`}
                            >
                                {/* Hover effect overlay */}
                                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                                {/* Emoji */}
                                <div className="text-5xl mb-4 transform group-hover:scale-110 transition-transform duration-300">
                                    {config.emoji}
                                </div>

                                {/* Category Name */}
                                <p className="font-bold text-lg">{category}</p>

                                {/* Arrow indicator */}
                                <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:translate-x-2">
                                    <ArrowRight size={20} className="text-white" />
                                </div>
                            </button>
                        );
                    })}
                </div>

                {/* Stats */}
                <div className="mt-12 pt-8 border-t border-gray-800">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="text-center p-6 bg-gray-800/50 rounded-2xl">
                            <div className="text-3xl font-bold text-purple-400">{categories.length}</div>
                            <div className="text-gray-400">Categories</div>
                        </div>
                        <div className="text-center p-6 bg-gray-800/50 rounded-2xl">
                            <div className="text-3xl font-bold text-pink-400">2</div>
                            <div className="text-gray-400">Movies in Database</div>
                        </div>
                        <div className="text-center p-6 bg-gray-800/50 rounded-2xl">
                            <div className="text-3xl font-bold text-blue-400">4</div>
                            <div className="text-gray-400">Unique Genres</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Category;