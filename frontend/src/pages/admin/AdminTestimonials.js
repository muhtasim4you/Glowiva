import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import { toast } from 'react-toastify';
import { FaEdit, FaTrash, FaPlus, FaImage, FaStar } from 'react-icons/fa';

const AdminTestimonials = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [formData, setFormData] = useState({
    customerName: '',
    image: '',
    rating: 5,
    isActive: true,
    order: 0
  });

  // Helper function to get full image URL
  const getImageUrl = (imageUrl) => {
    if (!imageUrl) return null;
    if (imageUrl.startsWith('http')) return imageUrl;
    const baseUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
    return baseUrl.replace(/\/api\/?$/, '') + imageUrl;
  };

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    try {
      const { data } = await api.get('/testimonials/admin');
      const testimonialsData = Array.isArray(data.data) ? data.data : (Array.isArray(data) ? data : []);
      setTestimonials(testimonialsData);
      setLoading(false);
    } catch (error) {
      toast.error('Failed to fetch testimonials');
      setTestimonials([]);
      setLoading(false);
    }
  };

  const openAddModal = () => {
    setEditingTestimonial(null);
    setFormData({
      customerName: '',
      image: '',
      rating: 5,
      isActive: true,
      order: 0
    });
    setImageFile(null);
    setImagePreview(null);
    setShowModal(true);
  };

  const openEditModal = (testimonial) => {
    setEditingTestimonial(testimonial);
    setFormData({
      customerName: testimonial.customerName,
      image: testimonial.image || '',
      rating: testimonial.rating || 5,
      isActive: testimonial.isActive,
      order: testimonial.order || 0
    });
    setImageFile(null);
    setImagePreview(testimonial.image ? getImageUrl(testimonial.image) : null);
    setShowModal(true);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadImage = async () => {
    if (!imageFile) return formData.image;

    const formDataUpload = new FormData();
    formDataUpload.append('image', imageFile);

    try {
      setUploading(true);
      const { data } = await api.post('/upload/single', formDataUpload, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      setUploading(false);
      return data.url;
    } catch (error) {
      setUploading(false);
      throw error;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let imageUrl = formData.image;
      if (imageFile) {
        imageUrl = await uploadImage();
      }

      if (!imageUrl) {
        toast.error('Please upload a testimonial image');
        return;
      }

      if (!formData.customerName.trim()) {
        toast.error('Please enter customer name');
        return;
      }

      const submitData = {
        ...formData,
        image: imageUrl
      };

      if (editingTestimonial) {
        await api.put(`/testimonials/${editingTestimonial._id}`, submitData);
        toast.success('Testimonial updated successfully');
      } else {
        await api.post('/testimonials', submitData);
        toast.success('Testimonial created successfully');
      }
      setShowModal(false);
      setImageFile(null);
      setImagePreview(null);
      fetchTestimonials();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to save testimonial');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this testimonial?')) {
      try {
        await api.delete(`/testimonials/${id}`);
        toast.success('Testimonial deleted successfully');
        fetchTestimonials();
      } catch (error) {
        toast.error('Failed to delete testimonial');
      }
    }
  };

  if (loading) return <div className="container mx-auto px-4 py-8"><div className="text-center">Loading...</div></div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Manage Customer Testimonials</h1>
        <button
          onClick={openAddModal}
          className="bg-primary-500 text-white px-6 py-2 rounded-lg hover:bg-primary-600 flex items-center"
        >
          <FaPlus className="mr-2" /> Add Testimonial
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {testimonials.map((testimonial) => (
          <div key={testimonial._id} className="bg-white rounded-lg shadow-md overflow-hidden">
            {/* Testimonial Image */}
            <div className="bg-gray-100 flex items-center justify-center p-4 h-64">
              {testimonial.image ? (
                <img 
                  src={getImageUrl(testimonial.image)} 
                  alt={testimonial.customerName} 
                  className="h-full w-full object-contain"
                />
              ) : (
                <FaImage className="text-6xl text-gray-400" />
              )}
            </div>

            {/* Testimonial Details */}
            <div className="p-4">
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1">
                  <h3 className="text-lg font-bold mb-2">{testimonial.customerName}</h3>
                  <div className="flex items-center gap-1 mb-2">
                    {[...Array(5)].map((_, i) => (
                      <FaStar 
                        key={i} 
                        className={i < testimonial.rating ? 'text-yellow-400' : 'text-gray-300'}
                        size={16}
                      />
                    ))}
                    <span className="ml-2 text-sm text-gray-600">{testimonial.rating}.0</span>
                  </div>
                  <div className="flex flex-wrap gap-2 text-sm">
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                      Order: {testimonial.order}
                    </span>
                    <span className={`px-2 py-1 rounded text-xs ${testimonial.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {testimonial.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex gap-2 pt-3 border-t">
                <button
                  onClick={() => openEditModal(testimonial)}
                  className="flex-1 text-blue-600 hover:bg-blue-50 p-2 rounded transition-colors flex items-center justify-center"
                  title="Edit"
                >
                  <FaEdit className="mr-1" /> Edit
                </button>
                <button
                  onClick={() => handleDelete(testimonial._id)}
                  className="flex-1 text-red-600 hover:bg-red-50 p-2 rounded transition-colors flex items-center justify-center"
                  title="Delete"
                >
                  <FaTrash className="mr-1" /> Delete
                </button>
              </div>
            </div>
          </div>
        ))}

        {testimonials.length === 0 && (
          <div className="col-span-full text-center py-12 bg-white rounded-lg">
            <FaImage className="text-6xl text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">No testimonials added yet. Create your first testimonial!</p>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-lg w-full max-w-2xl my-8">
            <div className="p-6">
              <h2 className="text-2xl font-bold mb-4">
                {editingTestimonial ? 'Edit Testimonial' : 'Add Testimonial'}
              </h2>
              <form onSubmit={handleSubmit}>
                <div className="space-y-4">
                  {/* Testimonial Image Upload */}
                  <div>
                    <label className="block text-sm font-medium mb-2">Testimonial Image *</label>
                    
                    {imagePreview && (
                      <div className="mb-3 bg-gray-50 p-4 rounded-lg">
                        <img 
                          src={imagePreview} 
                          alt="Preview" 
                          className="max-h-64 mx-auto object-contain"
                        />
                      </div>
                    )}
                    
                    <div className="flex items-center gap-3">
                      <label className="flex-1 bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-pink-500 transition-colors">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageChange}
                          className="hidden"
                        />
                        <div className="text-gray-600">
                          <FaImage className="mx-auto h-12 w-12 mb-2 text-gray-400" />
                          <p className="text-sm font-medium">
                            {imageFile ? imageFile.name : 'Click to upload testimonial image'}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">Upload customer feedback screenshot (PNG or JPG)</p>
                        </div>
                      </label>
                      
                      {imagePreview && (
                        <button
                          type="button"
                          onClick={() => {
                            setImageFile(null);
                            setImagePreview(null);
                            setFormData({ ...formData, image: '' });
                          }}
                          className="px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors text-sm"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Customer Name *</label>
                    <input
                      type="text"
                      value={formData.customerName}
                      onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                      placeholder="e.g., Sarah Johnson"
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Rating</label>
                      <select
                        value={formData.rating}
                        onChange={(e) => setFormData({ ...formData, rating: parseInt(e.target.value) })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                      >
                        <option value="5">5 Stars</option>
                        <option value="4">4 Stars</option>
                        <option value="3">3 Stars</option>
                        <option value="2">2 Stars</option>
                        <option value="1">1 Star</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Display Order</label>
                      <input
                        type="number"
                        value={formData.order}
                        onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                        min="0"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                      />
                      <p className="text-xs text-gray-500 mt-1">Lower numbers appear first</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Status</label>
                      <select
                        value={formData.isActive}
                        onChange={(e) => setFormData({ ...formData, isActive: e.target.value === 'true' })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                      >
                        <option value="true">Active</option>
                        <option value="false">Inactive</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-4 mt-6">
                  <button
                    type="button"
                    onClick={() => {
                      setShowModal(false);
                      setImageFile(null);
                      setImagePreview(null);
                    }}
                    disabled={uploading}
                    className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={uploading}
                    className="px-6 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 disabled:opacity-50 flex items-center gap-2"
                  >
                    {uploading ? (
                      <>
                        <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Uploading...
                      </>
                    ) : (
                      editingTestimonial ? 'Update Testimonial' : 'Create Testimonial'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminTestimonials;
