import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const res = await api.post('/auth/login', { email, password });
            login(res.data.token, res.data.user);
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.error || 'Login failed');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-chai-cream py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-lg">
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-extrabold text-chai-dark">User Login</h2>
                    <p className="mt-2 text-sm text-gray-600">
                        Don't have an account? <Link to="/register" className="text-chai-orange hover:underline">Register</Link>
                    </p>
                </div>
                {error && <div className="mb-4 text-red-600 bg-red-100 p-3 rounded">{error}</div>}
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Email Address</label>
                        <input type="email" required value={email} onChange={(e)=>setEmail(e.target.value)} className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-chai-orange focus:border-chai-orange" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Password</label>
                        <input type="password" required value={password} onChange={(e)=>setPassword(e.target.value)} className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-chai-orange focus:border-chai-orange" />
                    </div>
                    <button type="submit" className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-white bg-chai-orange hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-chai-orange font-medium">
                        Sign In
                    </button>
                </form>
                <div className="mt-4 text-center text-sm">
                    <Link to="/admin/login" className="text-gray-500 hover:text-chai-dark transition-colors">Admin Login</Link>
                </div>
            </div>
        </div>
    );
}
