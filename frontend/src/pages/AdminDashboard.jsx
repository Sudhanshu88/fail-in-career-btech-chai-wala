import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

export default function AdminDashboard() {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [stats, setStats] = useState({ users: 0, orders: 0, revenue: 0, feedback: 0, products: 0 });
    const [orders, setOrders] = useState([]);
    const [activeTab, setActiveTab] = useState('dashboard');

    useEffect(() => {
        if (!user || user.role !== 'admin') {
            navigate('/login');
            return;
        }
        
        const fetchStats = async () => {
            try {
                const res = await api.get('/misc/dashboard-stats');
                setStats(res.data);
            } catch (err) {
                console.error(err);
            }
        };

        const fetchOrders = async () => {
            try {
                const res = await api.get('/orders');
                setOrders(res.data);
            } catch (err) {
                console.error(err);
            }
        };

        fetchStats();
        fetchOrders();
    }, [user, navigate]);

    const handleStatusUpdate = async (id, status) => {
        try {
            await api.put(`/orders/${id}/status`, { status });
            setOrders(orders.map(o => o.id === id ? { ...o, status } : o));
        } catch (err) {
            alert('Failed to update status');
        }
    };

    return (
        <div className="min-h-screen flex bg-gray-100">
            {/* Sidebar */}
            <div className="w-64 bg-chai-dark text-white p-6 flex flex-col h-screen sticky top-0">
                <h2 className="text-2xl font-bold text-chai-orange mb-8">Admin Panel</h2>
                <nav className="space-y-4 flex-grow">
                    <button onClick={() => setActiveTab('dashboard')} className={`w-full text-left py-2 px-4 rounded ${activeTab==='dashboard' ? 'bg-chai-orange' : 'hover:bg-gray-700'}`}>Dashboard</button>
                    <button onClick={() => setActiveTab('orders')} className={`w-full text-left py-2 px-4 rounded ${activeTab==='orders' ? 'bg-chai-orange' : 'hover:bg-gray-700'}`}>Orders</button>
                    <button onClick={() => setActiveTab('products')} className={`w-full text-left py-2 px-4 rounded ${activeTab==='products' ? 'bg-chai-orange' : 'hover:bg-gray-700'}`}>Products (Manage via API)</button>
                </nav>
            </div>

            {/* Main Content */}
            <div className="flex-1 p-10 overflow-y-auto">
                {activeTab === 'dashboard' && (
                    <>
                        <h1 className="text-3xl font-bold mb-8 text-gray-800">Dashboard Overview</h1>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                            <div className="bg-white p-6 rounded-xl shadow border-l-4 border-blue-500">
                                <h3 className="text-gray-500 text-sm font-bold uppercase">Total Users</h3>
                                <p className="text-3xl font-bold text-gray-800">{stats.users}</p>
                            </div>
                            <div className="bg-white p-6 rounded-xl shadow border-l-4 border-green-500">
                                <h3 className="text-gray-500 text-sm font-bold uppercase">Total Revenue</h3>
                                <p className="text-3xl font-bold text-gray-800">₹{stats.revenue}</p>
                            </div>
                            <div className="bg-white p-6 rounded-xl shadow border-l-4 border-yellow-500">
                                <h3 className="text-gray-500 text-sm font-bold uppercase">Total Orders</h3>
                                <p className="text-3xl font-bold text-gray-800">{stats.orders}</p>
                            </div>
                            <div className="bg-white p-6 rounded-xl shadow border-l-4 border-orange-500">
                                <h3 className="text-gray-500 text-sm font-bold uppercase">Total Products</h3>
                                <p className="text-3xl font-bold text-gray-800">{stats.products}</p>
                            </div>
                            <div className="bg-white p-6 rounded-xl shadow border-l-4 border-red-500">
                                <h3 className="text-gray-500 text-sm font-bold uppercase">Feedback Received</h3>
                                <p className="text-3xl font-bold text-gray-800">{stats.feedback}</p>
                            </div>
                        </div>
                    </>
                )}

                {activeTab === 'orders' && (
                    <>
                        <h1 className="text-3xl font-bold mb-8 text-gray-800">Manage Orders</h1>
                        <div className="bg-white rounded-xl shadow overflow-hidden">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {orders.map(order => (
                                        <tr key={order.id}>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">#{order.id}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.user_name}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">₹{order.total_amount}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                                                    ${order.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' : 
                                                      order.status === 'Cancelled' ? 'bg-red-100 text-red-800' : 
                                                      order.status === 'Delivered' ? 'bg-green-100 text-green-800' : 
                                                      'bg-blue-100 text-blue-800'}`}>
                                                    {order.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                <select 
                                                    value={order.status}
                                                    onChange={(e) => handleStatusUpdate(order.id, e.target.value)}
                                                    className="border rounded px-2 py-1 focus:outline-none"
                                                >
                                                    <option value="Pending">Pending</option>
                                                    <option value="Accepted">Accepted</option>
                                                    <option value="Preparing">Preparing</option>
                                                    <option value="Ready">Ready</option>
                                                    <option value="Delivered">Delivered</option>
                                                    <option value="Rejected">Rejected</option>
                                                    <option value="Cancelled">Cancelled</option>
                                                </select>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </>
                )}

                {activeTab === 'products' && (
                    <div className="bg-white p-6 rounded-xl shadow">
                        <h2 className="text-xl font-bold mb-4">Product Management</h2>
                        <p className="text-gray-600">This module is connected via API. You can add more forms here to upload images and manage products using the `/api/products` endpoints with Admin privileges.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
