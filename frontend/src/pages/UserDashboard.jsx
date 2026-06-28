import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';

export default function UserDashboard() {
    const { user } = useContext(AuthContext);
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const res = await api.get('/orders/myorders');
                setOrders(res.data);
            } catch (err) {
                console.error(err);
            }
        };
        fetchOrders();
    }, []);

    const handleCancel = async (id) => {
        if(window.confirm('Are you sure you want to cancel this order?')) {
            try {
                await api.put(`/orders/${id}/cancel`);
                setOrders(orders.map(o => o.id === id ? { ...o, status: 'Cancelled' } : o));
            } catch (err) {
                alert(err.response?.data?.error || 'Failed to cancel order');
            }
        }
    };

    return (
        <div className="min-h-screen bg-chai-cream py-10 px-4 sm:px-6 lg:px-8">
            <div className="max-w-5xl mx-auto">
                <h1 className="text-3xl font-bold text-chai-dark mb-8">My Dashboard</h1>
                <div className="bg-white rounded-xl shadow p-6 mb-8">
                    <h2 className="text-2xl font-bold mb-2">Welcome, {user?.name}</h2>
                    <p className="text-gray-600">Email: {user?.email}</p>
                    <p className="text-gray-600">Mobile: {user?.mobile}</p>
                </div>

                <h2 className="text-2xl font-bold text-chai-dark mb-4">My Orders</h2>
                {orders.length === 0 ? (
                    <div className="bg-white p-6 rounded-xl shadow text-center text-gray-500">
                        You have not placed any orders yet.
                    </div>
                ) : (
                    <div className="space-y-4">
                        {orders.map(order => (
                            <div key={order.id} className="bg-white p-6 rounded-xl shadow">
                                <div className="flex flex-col sm:flex-row justify-between border-b pb-4 mb-4">
                                    <div>
                                        <p className="font-bold text-lg">Order #{order.id}</p>
                                        <p className="text-sm text-gray-500">{new Date(order.created_at).toLocaleString()}</p>
                                    </div>
                                    <div className="text-right mt-2 sm:mt-0">
                                        <span className={`px-3 py-1 rounded-full text-sm font-semibold 
                                            ${order.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' : 
                                              order.status === 'Cancelled' ? 'bg-red-100 text-red-800' : 
                                              order.status === 'Delivered' ? 'bg-green-100 text-green-800' : 
                                              'bg-blue-100 text-blue-800'}`}>
                                            {order.status}
                                        </span>
                                        <p className="font-bold mt-2">Total: ₹{order.total_amount}</p>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    {order.items.map(item => (
                                        <div key={item.id} className="flex justify-between text-sm">
                                            <span>{item.quantity} x {item.name}</span>
                                            <span>₹{item.price * item.quantity}</span>
                                        </div>
                                    ))}
                                </div>
                                {order.status === 'Pending' && (
                                    <div className="mt-4 pt-4 border-t text-right">
                                        <button 
                                            onClick={() => handleCancel(order.id)}
                                            className="text-red-500 hover:text-red-700 text-sm font-bold border border-red-500 px-4 py-1 rounded hover:bg-red-50"
                                        >
                                            Cancel Order
                                        </button>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
