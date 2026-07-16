import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaBox, FaShoppingCart, FaUsers, FaTags, FaCopyright, FaTicketAlt, FaImage, FaComments } from 'react-icons/fa';
import api from '../../utils/api';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    totalUsers: 0,
    totalProducts: 0,
    pendingOrders: 0,
    deliveredOrders: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [ordersRes, usersRes, productsRes] = await Promise.all([
        api.get('/orders'),
        api.get('/users'),
        api.get('/products')
      ]);

      // Safely extract arrays from API responses
      const ordersArray = Array.isArray(ordersRes.data.data) 
        ? ordersRes.data.data 
        : (Array.isArray(ordersRes.data) ? ordersRes.data : []);
      
      const usersArray = Array.isArray(usersRes.data.data) 
        ? usersRes.data.data 
        : (Array.isArray(usersRes.data) ? usersRes.data : []);
      
      const productsArray = Array.isArray(productsRes.data.data) 
        ? productsRes.data.data 
        : (Array.isArray(productsRes.data) ? productsRes.data : []);

      const totalRevenue = ordersArray
        .filter(o => o.orderStatus !== 'Cancelled')
        .reduce((sum, order) => sum + (order.totalPrice || 0), 0);
      const pendingOrders = ordersArray.filter(o => o.orderStatus === 'Pending').length;
      const deliveredOrders = ordersArray.filter(o => o.orderStatus === 'Delivered').length;

      setStats({
        totalOrders: ordersArray.length,
        totalRevenue,
        totalUsers: usersArray.length,
        totalProducts: productsArray.length,
        pendingOrders,
        deliveredOrders
      });
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch stats:', error);
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm opacity-90 mb-2">Total Orders</h3>
              <p className="text-3xl font-bold">{loading ? '...' : stats.totalOrders}</p>
              <p className="text-xs mt-2 opacity-75">{stats.pendingOrders} pending</p>
            </div>
            <FaShoppingCart className="text-5xl opacity-30" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg shadow-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm opacity-90 mb-2">Total Revenue</h3>
              <p className="text-3xl font-bold">৳{loading ? '...' : stats.totalRevenue.toFixed(0)}</p>
              <p className="text-xs mt-2 opacity-75">{stats.deliveredOrders} delivered</p>
            </div>
            <FaShoppingCart className="text-5xl opacity-30" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg shadow-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm opacity-90 mb-2">Total Users</h3>
              <p className="text-3xl font-bold">{loading ? '...' : stats.totalUsers}</p>
              <p className="text-xs mt-2 opacity-75">Registered customers</p>
            </div>
            <FaUsers className="text-5xl opacity-30" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-pink-500 to-pink-600 rounded-lg shadow-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm opacity-90 mb-2">Total Products</h3>
              <p className="text-3xl font-bold">{loading ? '...' : stats.totalProducts}</p>
              <p className="text-xs mt-2 opacity-75">In inventory</p>
            </div>
            <FaBox className="text-5xl opacity-30" />
          </div>
        </div>
      </div>

      <h2 className="text-2xl font-bold mb-4">Quick Actions</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Link to="/admin/products" className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
          <FaBox className="text-4xl text-primary-500 mb-4" />
          <h3 className="text-xl font-bold">Products</h3>
          <p className="text-gray-600">Manage products</p>
        </Link>

        <Link to="/admin/orders" className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
          <FaShoppingCart className="text-4xl text-primary-500 mb-4" />
          <h3 className="text-xl font-bold">Orders</h3>
          <p className="text-gray-600">Manage orders</p>
        </Link>

        <Link to="/admin/users" className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
          <FaUsers className="text-4xl text-primary-500 mb-4" />
          <h3 className="text-xl font-bold">Users</h3>
          <p className="text-gray-600">Manage users</p>
        </Link>

        <Link to="/admin/categories" className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
          <FaTags className="text-4xl text-primary-500 mb-4" />
          <h3 className="text-xl font-bold">Categories</h3>
          <p className="text-gray-600">Manage categories</p>
        </Link>

        <Link to="/admin/brands" className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
          <FaCopyright className="text-4xl text-primary-500 mb-4" />
          <h3 className="text-xl font-bold">Brands</h3>
          <p className="text-gray-600">Manage brands</p>
        </Link>

        <Link to="/admin/coupons" className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
          <FaTicketAlt className="text-4xl text-primary-500 mb-4" />
          <h3 className="text-xl font-bold">Coupons</h3>
          <p className="text-gray-600">Manage coupons</p>
        </Link>

        <Link to="/admin/banners" className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
          <FaImage className="text-4xl text-primary-500 mb-4" />
          <h3 className="text-xl font-bold">Banners</h3>
          <p className="text-gray-600">Manage advertisements</p>
        </Link>

        <Link to="/admin/testimonials" className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
          <FaComments className="text-4xl text-primary-500 mb-4" />
          <h3 className="text-xl font-bold">Testimonials</h3>
          <p className="text-gray-600">Manage customer feedback</p>
        </Link>
      </div>
    </div>
  );
};

export default AdminDashboard;
