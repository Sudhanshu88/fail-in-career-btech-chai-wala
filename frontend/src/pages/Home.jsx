import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

export default function Home() {
    const [featured, setFeatured] = useState([]);

    useEffect(() => {
        // Fetch some products for featured section
        const fetchFeatured = async () => {
            try {
                const res = await api.get('/products');
                // just take first 4 for featured
                setFeatured(res.data.slice(0, 4));
            } catch (err) {
                console.error(err);
            }
        };
        fetchFeatured();
    }, []);

    return (
        <div className="bg-chai-cream min-h-screen">
            {/* Hero Section */}
            <div className="relative bg-chai-dark text-white overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 flex flex-col md:flex-row items-center">
                    <div className="md:w-1/2 z-10">
                        <h1 className="text-5xl font-extrabold tracking-tight mb-4 text-chai-orange">
                            Fail In Career<br/><span className="text-white">B.Tech Chai Wala</span>
                        </h1>
                        <p className="text-xl mb-8 text-gray-300">
                            From engineering dropouts to brewing the perfect cup of success. Experience the finest chai and snacks in town.
                        </p>
                        <Link to="/menu" className="inline-block bg-chai-orange text-white font-bold py-3 px-8 rounded-full hover:bg-orange-600 transition-transform transform hover:scale-105 shadow-lg">
                            Explore Menu
                        </Link>
                    </div>
                    <div className="md:w-1/2 mt-12 md:mt-0 relative">
                        {/* A decorative element representing chai */}
                        <div className="w-64 h-64 md:w-96 md:h-96 mx-auto bg-gradient-to-tr from-chai-orange to-yellow-500 rounded-full flex items-center justify-center animate-pulse shadow-[0_0_50px_rgba(230,81,0,0.5)]">
                            <span className="text-8xl">☕</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Why Choose Us */}
            <div className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h2 className="text-3xl font-bold text-center text-chai-dark mb-12">Why Choose Us?</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                    <div className="p-6 bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow">
                        <div className="text-4xl mb-4">🌿</div>
                        <h3 className="text-xl font-bold mb-2 text-chai-dark">Premium Ingredients</h3>
                        <p className="text-gray-600">We source only the finest tea leaves and authentic spices.</p>
                    </div>
                    <div className="p-6 bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow">
                        <div className="text-4xl mb-4">👨‍🍳</div>
                        <h3 className="text-xl font-bold mb-2 text-chai-dark">Expertly Brewed</h3>
                        <p className="text-gray-600">Our secret recipe guarantees a perfect cup every single time.</p>
                    </div>
                    <div className="p-6 bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow">
                        <div className="text-4xl mb-4">🚀</div>
                        <h3 className="text-xl font-bold mb-2 text-chai-dark">Fast Delivery</h3>
                        <p className="text-gray-600">Hot chai and fresh snacks delivered straight to your door.</p>
                    </div>
                </div>
            </div>

            {/* Featured Products */}
            <div className="bg-white py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-3xl font-bold text-center text-chai-dark mb-12">Featured Items</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                        {featured.map(item => (
                            <div key={item.id} className="bg-chai-cream rounded-lg overflow-hidden shadow hover:shadow-lg transition-shadow">
                                <div className="h-48 bg-gray-200 flex items-center justify-center text-gray-500">
                                    {item.image_url ? <img src={item.image_url.startsWith('http') ? item.image_url : `http://localhost:5000${item.image_url}`} alt={item.name} className="w-full h-full object-cover" /> : 'No Image'}
                                </div>
                                <div className="p-4">
                                    <h3 className="font-bold text-lg mb-1">{item.name}</h3>
                                    <p className="text-chai-orange font-semibold">₹{item.price}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="text-center mt-10">
                        <Link to="/menu" className="text-chai-orange font-bold hover:underline">View Full Menu &rarr;</Link>
                    </div>
                </div>
            </div>

            {/* Testimonials */}
            <div className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <h2 className="text-3xl font-bold text-chai-dark mb-12">What Our Customers Say</h2>
                <div className="flex flex-col md:flex-row gap-8 justify-center">
                    <div className="bg-white p-6 rounded-lg shadow-md md:w-1/3 italic text-gray-700 relative">
                        "The best masala chai I've ever had! It completely changed my morning routine."
                        <div className="mt-4 font-bold text-chai-dark not-italic">- Rahul S.</div>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-md md:w-1/3 italic text-gray-700 relative">
                        "Amazing samosas and green tea. The delivery was super fast and everything was hot."
                        <div className="mt-4 font-bold text-chai-dark not-italic">- Priya M.</div>
                    </div>
                </div>
            </div>
        </div>
    );
}
