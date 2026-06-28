import React, { useEffect, useState, useContext } from 'react';
import api from '../services/api';
import { CartContext } from '../context/CartContext';

export default function Menu() {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [activeCategory, setActiveCategory] = useState('All');
    const [searchTerm, setSearchTerm] = useState('');
    const { addToCart } = useContext(CartContext);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const prodRes = await api.get('/products');
                const catRes = await api.get('/products/categories');
                setProducts(prodRes.data);
                setCategories(catRes.data);
            } catch (err) {
                console.error(err);
            }
        };
        fetchData();
    }, []);

    const filteredProducts = products.filter(p => {
        const matchesCategory = activeCategory === 'All' || p.category_name === activeCategory;
        const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    return (
        <div className="bg-chai-cream min-h-screen py-10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h1 className="text-4xl font-bold text-center text-chai-dark mb-10">Our Menu</h1>
                
                {/* Search and Filter */}
                <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                    <div className="flex space-x-2 overflow-x-auto w-full md:w-auto pb-2">
                        <button 
                            onClick={() => setActiveCategory('All')}
                            className={`px-4 py-2 rounded-full whitespace-nowrap transition-colors ${activeCategory === 'All' ? 'bg-chai-orange text-white' : 'bg-white text-chai-dark hover:bg-gray-100'}`}
                        >
                            All
                        </button>
                        {categories.map(c => (
                            <button 
                                key={c.id} 
                                onClick={() => setActiveCategory(c.name)}
                                className={`px-4 py-2 rounded-full whitespace-nowrap transition-colors ${activeCategory === c.name ? 'bg-chai-orange text-white' : 'bg-white text-chai-dark hover:bg-gray-100'}`}
                            >
                                {c.name}
                            </button>
                        ))}
                    </div>
                    <div className="w-full md:w-64">
                        <input 
                            type="text" 
                            placeholder="Search..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full px-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-chai-orange"
                        />
                    </div>
                </div>

                {/* Product Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {filteredProducts.map(product => (
                        <div key={product.id} className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-shadow group flex flex-col">
                            <div className="h-48 bg-gray-100 overflow-hidden relative">
                                {product.image_url ? (
                                    <img src={product.image_url.startsWith('http') ? product.image_url : `http://localhost:5000${product.image_url}`} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-400">No Image</div>
                                )}
                                {!product.is_available && (
                                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center text-white font-bold">
                                        Sold Out
                                    </div>
                                )}
                            </div>
                            <div className="p-4 flex-grow flex flex-col justify-between">
                                <div>
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className="font-bold text-lg text-chai-dark">{product.name}</h3>
                                        <span className="text-chai-orange font-bold text-lg">₹{product.price}</span>
                                    </div>
                                    <p className="text-gray-500 text-sm mb-4 line-clamp-2">{product.description}</p>
                                </div>
                                <button 
                                    disabled={!product.is_available}
                                    onClick={() => addToCart(product.id)}
                                    className={`w-full py-2 rounded-lg font-semibold transition-colors ${product.is_available ? 'bg-chai-dark text-white hover:bg-chai-orange' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
                                >
                                    Add to Cart
                                </button>
                            </div>
                        </div>
                    ))}
                    {filteredProducts.length === 0 && (
                        <div className="col-span-full text-center py-10 text-gray-500">
                            No items found.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
