import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, MapPin, Calendar, Clock, Star } from 'lucide-react';
import MovieCard from '../components/MovieCard';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../config/Firebase';

const Home = () => {
    const [carouselIndex, setCarouselIndex] = useState(0);
    const [popularMovies, setPopularMovies] = useState([]);
    const [loading, setLoading] = useState(true);

    const carouselItems = [
        {
            image: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80",
            title: "Immerse Yourself in Cinematic Magic",
            subtitle: "Experience movies like never before"
        },
        {
            image: "https://images.unsplash.com/photo-1489599809516-9827b6d1cf13?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80",
            title: "Blockbuster Premieres Every Week",
            subtitle: "Be the first to watch new releases"
        },
        {
            image: "https://images.unsplash.com/photo-1574267432553-4b4628081c31?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80",
            title: "Premium Theater Experience",
            subtitle: "Dolby Atmos • IMAX • 4K Projection"
        }
    ];

    const fetchPopularMovies = useCallback(async () => {
        try {
            setLoading(true);
            // Fetch from Firebase instead of TMDB API
            const moviesRef = collection(db, 'movies');
            const q = query(moviesRef, where('status', '==', 'now_showing'));

            const snapshot = await getDocs(q);
            const moviesData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));

            // Sort by rating and limit to 8
            const popularMovies = moviesData
                .sort((a, b) => (b.rating || 0) - (a.rating || 0))
                .slice(0, 8);

            setPopularMovies(popularMovies);
        } catch (error) {
            console.error('Error fetching movies from Firebase:', error);
            // Fallback to empty array
            setPopularMovies([]);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchPopularMovies();
    }, [fetchPopularMovies]);

    const nextCarousel = () => {
        setCarouselIndex((prevIndex) =>
            prevIndex === carouselItems.length - 1 ? 0 : prevIndex + 1
        );
    };

    const prevCarousel = () => {
        setCarouselIndex((prevIndex) =>
            prevIndex === 0 ? carouselItems.length - 1 : prevIndex - 1
        );
    };

    // Auto rotate carousel
    useEffect(() => {
        const interval = setInterval(nextCarousel, 5000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="min-h-screen">
            {/* Hero Section with Carousel */}
            <section className="relative h-[70vh] overflow-hidden">
                {carouselItems.map((item, index) => (
                    <div
                        key={index}
                        className={`absolute inset-0 transition-opacity duration-1000 ${index === carouselIndex ? 'opacity-100' : 'opacity-0'
                            }`}
                    >
                        <div
                            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                            style={{ backgroundImage: `url(${item.image})` }}
                        >
                            <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/80 to-transparent"></div>
                            <div className="absolute inset-0 bg-gradient-to-r from-gray-900/90 to-transparent"></div>
                        </div>

                        <div className="relative h-full flex items-center">
                            <div className="container mx-auto px-4">
                                <div className="max-w-2xl">
                                    <h1 className="text-5xl md:text-7xl font-bold mb-4 bg-gradient-to-r from-white via-purple-200 to-white bg-clip-text text-transparent">
                                        {item.title}
                                    </h1>
                                    <p className="text-xl text-gray-300 mb-8">{item.subtitle}</p>

                                    <div className="flex space-x-4">
                                        <Link
                                            to="/movies"
                                            className="px-8 py-3 bg-gradient-to-r from-red-600 to-purple-600 hover:from-red-500 hover:to-purple-500 rounded-lg text-white font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-purple-500/25"
                                        >
                                            Book Now
                                        </Link>
                                        <button className="px-8 py-3 bg-gray-800/70 hover:bg-gray-700/70 backdrop-blur-sm rounded-lg text-white font-semibold border border-purple-700/50 transition-all duration-300 flex items-center space-x-2">
                                            <MapPin className="w-5 h-5" />
                                            <span>See Locations</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}

                {/* Carousel Controls */}
                <button
                    onClick={prevCarousel}
                    className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-gray-900/70 hover:bg-gray-800/70 backdrop-blur-sm border border-purple-700/30 transition-all duration-300"
                >
                    <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                    onClick={nextCarousel}
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-gray-900/70 hover:bg-gray-800/70 backdrop-blur-sm border border-purple-700/30 transition-all duration-300"
                >
                    <ChevronRight className="w-6 h-6" />
                </button>

                {/* Carousel Indicators */}
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex space-x-3">
                    {carouselItems.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => setCarouselIndex(index)}
                            className={`w-3 h-3 rounded-full transition-all duration-300 ${index === carouselIndex
                                ? 'bg-purple-500 w-8'
                                : 'bg-gray-600 hover:bg-gray-500'
                                }`}
                        />
                    ))}
                </div>
            </section>

            {/* Now Showing Info */}
            <section className="py-8 bg-gradient-to-b from-transparent to-gray-900/50">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-gray-800/40 backdrop-blur-sm rounded-xl p-6 border border-purple-700/30 hover:border-purple-500/50 transition-all duration-300">
                            <div className="flex items-center space-x-4">
                                <div className="p-3 bg-purple-900/50 rounded-lg">
                                    <Calendar className="w-8 h-8 text-purple-400" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-semibold text-white">Daily Shows</h3>
                                    <p className="text-gray-400">Multiple shows from 10 AM to 12 AM</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-gray-800/40 backdrop-blur-sm rounded-xl p-6 border border-purple-700/30 hover:border-purple-500/50 transition-all duration-300">
                            <div className="flex items-center space-x-4">
                                <div className="p-3 bg-red-900/50 rounded-lg">
                                    <Clock className="w-8 h-8 text-red-400" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-semibold text-white">Early Bird Offers</h3>
                                    <p className="text-gray-400">50% off on morning shows</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-gray-800/40 backdrop-blur-sm rounded-xl p-6 border border-purple-700/30 hover:border-purple-500/50 transition-all duration-300">
                            <div className="flex items-center space-x-4">
                                <div className="p-3 bg-yellow-900/50 rounded-lg">
                                    <Star className="w-8 h-8 text-yellow-400" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-semibold text-white">Premium Experience</h3>
                                    <p className="text-gray-400">Dolby Atmos & IMAX theaters</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Popular Movies Section */}
            <section className="py-16">
                <div className="container mx-auto px-4">
                    <div className="flex justify-between items-center mb-10">
                        <div>
                            <h2 className="text-4xl font-bold mb-2 bg-gradient-to-r from-white to-purple-300 bg-clip-text text-transparent">
                                Popular Movies
                            </h2>
                            <p className="text-gray-400">Currently trending in theaters</p>
                        </div>
                        <Link
                            to="/movies"
                            className="px-6 py-2 border border-purple-600 text-purple-400 hover:bg-purple-600 hover:text-white rounded-lg transition-all duration-300"
                        >
                            View All
                        </Link>
                    </div>

                    {loading ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            {[...Array(8)].map((_, index) => (
                                <div key={index} className="animate-pulse">
                                    <div className="bg-gray-800 rounded-xl h-80"></div>
                                </div>
                            ))}
                        </div>
                    ) : popularMovies.length === 0 ? (
                        <div className="text-center py-12">
                            <p className="text-gray-400 text-lg">No movies found. Make sure Firebase has movies with "now_showing" status.</p>
                            <button
                                onClick={fetchPopularMovies}
                                className="mt-4 px-6 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg"
                            >
                                Try Again
                            </button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            {popularMovies.map((movie) => (
                                <MovieCard key={movie.id} movie={movie} />
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 bg-gradient-to-r from-gray-900 via-purple-900/20 to-gray-900">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-5xl font-bold mb-6 bg-gradient-to-r from-red-500 via-purple-500 to-red-500 bg-clip-text text-transparent">
                        Ready for an Unforgettable Experience?
                    </h2>
                    <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto">
                        Book your tickets now and enjoy the magic of cinema with premium comforts and exclusive offers.
                    </p>
                    <Link
                        to="/movies"
                        className="inline-flex items-center px-10 py-4 bg-gradient-to-r from-red-600 to-purple-600 hover:from-red-500 hover:to-purple-500 rounded-xl text-white font-bold text-lg transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-purple-500/30"
                    >
                        Explore Movies
                        <ChevronRight className="ml-2 w-6 h-6" />
                    </Link>
                </div>
            </section>
        </div>
    );
};

export default Home;