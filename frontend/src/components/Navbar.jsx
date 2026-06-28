import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';
import { FaShoppingCart, FaUser, FaSignOutAlt, FaMugHot } from 'react-icons/fa';

export default function Navbar() {
    const { user, logout } = useContext(AuthContext);
    const { cart } = useContext(CartContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <nav className="bg-chai-dark text-white shadow-lg sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex items-center">
                        <Link to="/" className="flex items-center gap-2 text-2xl font-bold text-chai-orange">
                            <FaMugHot className="text-3xl" />
                            <span>B.Tech Chai Wala</span>
                        </Link>
                    </div>
                    
                    <div className="flex items-center space-x-6">
                        <Link to="/" className="hover:text-chai-orange transition-colors">Home</Link>
                        <Link to="/menu" className="hover:text-chai-orange transition-colors">Menu</Link>
                        
                        {user && user.role !== 'admin' && (
                            <Link to="/cart" className="relative hover:text-chai-orange transition-colors">
                                <FaShoppingCart className="text-xl" />
                                {cart.length > 0 && (
                                    <span className="absolute -top-2 -right-2 bg-chai-orange text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                                        {cart.length}
                                    </span>
                                )}
                            </Link>
                        )}

                        {user ? (
                            <div className="flex items-center space-x-4">
                                <Link to={user.role === 'admin' ? '/admin' : '/dashboard'} className="hover:text-chai-orange transition-colors">
                                    <FaUser className="text-xl" />
                                </Link>
                                <button onClick={handleLogout} className="hover:text-red-500 transition-colors">
                                    <FaSignOutAlt className="text-xl" />
                                </button>
                            </div>
                        ) : (
                            <div className="space-x-4">
                                <Link to="/login" className="bg-transparent border border-chai-orange text-chai-orange hover:bg-chai-orange hover:text-white px-4 py-2 rounded transition-colors">Login</Link>
                                <Link to="/register" className="bg-chai-orange text-white hover:bg-orange-600 px-4 py-2 rounded transition-colors">Register</Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}
