import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import { FaShoppingBag, FaEye, FaBox, FaTruck, FaCheckCircle } from 'react-icons/fa';
import { toast } from 'react-toastify';

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, pending, processing, shipped, delivered

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/orders/myorders');
      const ordersData = Array.isArray(data.data) ? data.data : (Array.isArray(data) ? data : []);
      setOrders(ordersData);
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error('Failed to fetch orders');
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const getImageUrl = (imageUrl) => {
    if (!imageUrl) return 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"%3E%3Crect fill="%23f0f0f0" width="100" height="100"/%3E%3Ctext x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="14" fill="%23999"%3ENo Image%3C/text%3E%3C/svg%3E';
    if (imageUrl.startsWith('http')) return imageUrl;
    const baseUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
    return baseUrl.replace(/\/api\/?$/, '') + imageUrl;
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Pending':
        return <FaShoppingBag className="text-yellow-500" />;
      case 'Processing':
        return <FaBox className="text-blue-500" />;
      case 'Shipped':
        return <FaTruck className="text-purple-500" />;
      case 'Delivered':
        return <FaCheckCircle className="text-green-500" />;
      default:
        return <FaShoppingBag className="text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'Processing':
        return 'bg-blue-100 text-blue-800';
      case 'Shipped':
        return 'bg-purple-100 text-purple-800';
      case 'Delivered':
        return 'bg-green-100 text-green-800';
      case 'Cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredOrders = filter === 'all' 
    ? orders 
    : orders.filter(order => order.orderStatus?.toLowerCase() === filter.toLowerCase());

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">My Orders</h1>
          <p className="text-gray-600">View and track your orders</p>
        </div>

        {/* Filter Tabs */}
        <div className="bg-white rounded-lg shadow-sm mb-6 overflow-hidden">
          <div className="flex flex-wrap border-b">
            <button
              onClick={() => setFilter('all')}
              className={`px-6 py-3 font-medium transition-colors ${
                filter === 'all'
                  ? 'bg-primary-500 text-white'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              All Orders ({orders.length})
            </button>
            <button
              onClick={() => setFilter('pending')}
              className={`px-6 py-3 font-medium transition-colors ${
                filter === 'pending'
                  ? 'bg-primary-500 text-white'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              Pending ({orders.filter(o => o.orderStatus === 'Pending').length})
            </button>
            <button
              onClick={() => setFilter('processing')}
              className={`px-6 py-3 font-medium transition-colors ${
                filter === 'processing'
                  ? 'bg-primary-500 text-white'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              Processing ({orders.filter(o => o.orderStatus === 'Processing').length})
            </button>
            <button
              onClick={() => setFilter('shipped')}
              className={`px-6 py-3 font-medium transition-colors ${
                filter === 'shipped'
                  ? 'bg-primary-500 text-white'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              Shipped ({orders.filter(o => o.orderStatus === 'Shipped').length})
            </button>
            <button
              onClick={() => setFilter('delivered')}
              className={`px-6 py-3 font-medium transition-colors ${
                filter === 'delivered'
                  ? 'bg-primary-500 text-white'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              Delivered ({orders.filter(o => o.orderStatus === 'Delivered').length})
            </button>
          </div>
        </div>

        {/* Orders List */}
        {filteredOrders.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <FaShoppingBag className="text-6xl text-gray-300 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-gray-700 mb-2">No Orders Found</h2>
            <p className="text-gray-500 mb-6">
              {filter === 'all' 
                ? "You haven't placed any orders yet."
                : `You don't have any ${filter} orders.`}
            </p>
            <Link
              to="/products"
              className="inline-block px-8 py-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredOrders.map((order) => (
              <div key={order._id} className="bg-white rounded-lg shadow-sm overflow-hidden">
                {/* Order Header */}
                <div className="bg-gray-50 px-6 py-4 border-b flex flex-wrap items-center justify-between gap-4">
                  <div className="flex flex-wrap items-center gap-6">
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Order Number</p>
                      <p className="font-semibold text-gray-800">#{order.orderNumber || order._id}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Order Date</p>
                      <p className="font-medium text-gray-700">
                        {new Date(order.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Total Amount</p>
                      <p className="font-bold text-primary-600">{(order.totalPrice || 0).toFixed(2)}৳</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.orderStatus)}`}>
                      {getStatusIcon(order.orderStatus)}
                      {order.orderStatus}
                    </span>
                    <Link
                      to={`/order/${order._id}`}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
                    >
                      <FaEye />
                      View Details
                    </Link>
                  </div>
                </div>

                {/* Order Items */}
                <div className="p-6">
                  <h3 className="text-sm font-semibold text-gray-700 mb-3">
                    Order Items ({order.orderItems.length})
                  </h3>
                  <div className="space-y-3">
                    {order.orderItems.slice(0, 3).map((item, index) => (
                      <div key={index} className="flex items-center gap-4">
                        <img
                          src={getImageUrl(item.image)}
                          alt={item.name}
                          className="w-16 h-16 object-cover rounded"
                          onError={(e) => {
                            e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64"%3E%3Crect fill="%23f0f0f0" width="64" height="64"/%3E%3Ctext x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="10" fill="%23999"%3ENo Image%3C/text%3E%3C/svg%3E';
                          }}
                        />
                        <div className="flex-1">
                          <p className="font-medium text-gray-800 line-clamp-1">{item.name}</p>
                          <p className="text-sm text-gray-500">Qty: {item.quantity} × {item.price.toFixed(2)}৳</p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-gray-800">
                            {(item.price * item.quantity).toFixed(2)}৳
                          </p>
                        </div>
                      </div>
                    ))}
                    {order.orderItems.length > 3 && (
                      <p className="text-sm text-gray-500 text-center pt-2">
                        + {order.orderItems.length - 3} more item(s)
                      </p>
                    )}
                  </div>
                </div>

                {/* Order Footer */}
                <div className="bg-gray-50 px-6 py-3 border-t">
                  <div className="flex flex-wrap items-center justify-between gap-4 text-sm">
                    <div className="text-gray-600">
                      <span className="font-medium">Payment Method:</span> {order.paymentMethod}
                      <span className="mx-2">•</span>
                      <span className={`font-medium ${order.paymentStatus === 'Paid' ? 'text-green-600' : 'text-yellow-600'}`}>
                        {order.paymentStatus === 'Paid' ? 'Paid' : 'Pending Payment'}
                      </span>
                    </div>
                    <div className="text-gray-600">
                      <span className="font-medium">Shipping to:</span> {order.shippingAddress?.address || 'N/A'}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrdersPage;
