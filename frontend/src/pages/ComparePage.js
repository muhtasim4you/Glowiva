import React from 'react';
import { useCompare } from '../context/CompareContext';
import { Link } from 'react-router-dom';

const getImageUrl = (imageUrl) => {
  if (!imageUrl) return null;
  if (imageUrl.startsWith('http')) return imageUrl;
  const baseUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
  return baseUrl.replace(/\/api\/?$/, '') + imageUrl;
};

const ComparePage = () => {
  const { compareItems, removeFromCompare, clearCompare } = useCompare();

  if (compareItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-3xl font-bold mb-4">No Products to Compare</h1>
        <p className="text-gray-600 mb-8">Add some products to compare!</p>
        <Link to="/products" className="btn-primary">
          Browse Products
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Compare Products</h1>
        <button onClick={clearCompare} className="btn-secondary">
          Clear All
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="compare-table">
          <thead>
            <tr>
              <th className="w-32">Property</th>
              {compareItems.map((item) => (
                <th key={item._id}>
                  <img src={getImageUrl(item.images?.[0]) || '/placeholder.svg'} alt={item.name} className="w-32 h-32 object-cover mx-auto mb-2" />
                  <p className="text-sm">{item.name}</p>
                  <button
                    onClick={() => removeFromCompare(item._id)}
                    className="text-red-500 text-xs mt-2"
                  >
                    Remove
                  </button>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="font-semibold">Price</td>
              {compareItems.map((item) => (
                <td key={item._id} className="text-center text-primary-500 font-bold">
                  {(item.discountPrice || item.price).toFixed(2)}৳
                </td>
              ))}
            </tr>
            <tr>
              <td className="font-semibold">Brand</td>
              {compareItems.map((item) => (
                <td key={item._id} className="text-center">
                  {item.brand?.name || 'N/A'}
                </td>
              ))}
            </tr>
            <tr>
              <td className="font-semibold">Rating</td>
              {compareItems.map((item) => (
                <td key={item._id} className="text-center">
                  {(item.ratings ?? 0).toFixed(1)} ⭐
                </td>
              ))}
            </tr>
            <tr>
              <td className="font-semibold">Stock</td>
              {compareItems.map((item) => (
                <td key={item._id} className="text-center">
                  {item.stock > 0 ? 'In Stock' : 'Out of Stock'}
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ComparePage;
