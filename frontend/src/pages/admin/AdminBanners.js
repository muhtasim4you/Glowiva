import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import { toast } from 'react-toastify';
import { FaEdit, FaTrash, FaPlus, FaImage } from 'react-icons/fa';

const AdminBanners = () => {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingBanner, setEditingBanner] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [mobileImageFile, setMobileImageFile] = useState(null);
  const [mobileImagePreview, setMobileImagePreview] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    description: '',
    image: '',
    mobileImage: '',
    buttonText: 'SHOP NOW',
    buttonLink: '/products',
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
    fetchBanners();
  }, []);

  const fetchBanners = async () => {
    try {
      const { data } = await api.get('/banners');
      const bannersData = Array.isArray(data.data) ? data.data : (Array.isArray(data) ? data : []);
      setBanners(bannersData);
      setLoading(false);
    } catch (error) {
      toast.error('Failed to fetch banners');
      setBanners([]);
      setLoading(false);
    }
  };

  const openAddModal = () => {
    setEditingBanner(null);
    setFormData({
      title: '',
      subtitle: '',
      description: '',
      image: '',
      mobileImage: '',
      buttonText: 'SHOP NOW',
      buttonLink: '/products',
      isActive: true,
      order: 0
    });
    setImageFile(null);
    setImagePreview(null);
    setMobileImageFile(null);
    setMobileImagePreview(null);
    setShowModal(true);
  };

  const openEditModal = (banner) => {
    setEditingBanner(banner);
    setFormData({
      title: banner.title,
      subtitle: banner.subtitle || '',
      description: banner.description || '',
      image: banner.image || '',
      mobileImage: banner.mobileImage || '',
      buttonText: banner.buttonText || 'SHOP NOW',
      buttonLink: banner.buttonLink || '/products',
      isActive: banner.isActive,
      order: banner.order || 0
    });
    setImageFile(null);
    setImagePreview(banner.image ? getImageUrl(banner.image) : null);
    setMobileImageFile(null);
    setMobileImagePreview(banner.mobileImage ? getImageUrl(banner.mobileImage) : null);
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

  const handleMobileImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setMobileImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setMobileImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadImage = async () => {
    if (!imageFile) return formData.image;

    const formDataUpload = new FormData();
    formDataUpload.append('image', imageFile);

    const { data } = await api.post('/upload/banner', formDataUpload, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return data.url;
  };

  const uploadMobileImage = async () => {
    if (!mobileImageFile) return formData.mobileImage;

    const formDataUpload = new FormData();
    formDataUpload.append('image', mobileImageFile);

    const { data } = await api.post('/upload/banner-mobile', formDataUpload, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return data.url;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);
    try {
      let imageUrl = formData.image;
      if (imageFile) {
        imageUrl = await uploadImage();
      }

      if (!imageUrl) {
        toast.error('Please upload a banner image');
        setUploading(false);
        return;
      }

      let mobileImageUrl = formData.mobileImage;
      if (mobileImageFile) {
        mobileImageUrl = await uploadMobileImage();
      }

      const submitData = {
        ...formData,
        image: imageUrl,
        mobileImage: mobileImageUrl || ''
      };

      if (editingBanner) {
        await api.put(`/banners/${editingBanner._id}`, submitData);
        toast.success('Banner updated successfully');
      } else {
        await api.post('/banners', submitData);
        toast.success('Banner created successfully');
      }
      setShowModal(false);
      setImageFile(null);
      setImagePreview(null);
      setMobileImageFile(null);
      setMobileImagePreview(null);
      setUploading(false);
      fetchBanners();
    } catch (error) {
      setUploading(false);
      console.error('Banner save error:', error);
      toast.error(error.response?.data?.error || error.response?.data?.message || error.message || 'Failed to save banner');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this banner?')) {
      try {
        await api.delete(`/banners/${id}`);
        toast.success('Banner deleted successfully');
        fetchBanners();
      } catch (error) {
        toast.error('Failed to delete banner');
      }
    }
  };

  if (loading) return <div className="container mx-auto px-4 py-8"><div className="text-center">Loading...</div></div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Manage Banners / Advertisements</h1>
        <button
          onClick={openAddModal}
          className="bg-primary-500 text-white px-6 py-2 rounded-lg hover:bg-primary-600 flex items-center"
        >
          <FaPlus className="mr-2" /> Add Banner
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {banners.map((banner) => (
          <div key={banner._id} className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="flex flex-col md:flex-row">
              {/* Banner Image */}
              <div className="md:w-1/3 bg-gray-100 flex items-center justify-center p-4">
                {banner.image ? (
                  <img 
                    src={getImageUrl(banner.image)} 
                    alt={banner.title} 
                    className="max-h-48 object-contain"
                  />
                ) : (
                  <FaImage className="text-6xl text-gray-400" />
                )}
              </div>

              {/* Banner Details */}
              <div className="md:w-2/3 p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold mb-2">{banner.title}</h3>
                    {banner.subtitle && <p className="text-lg text-gray-600 mb-2">{banner.subtitle}</p>}
                    {banner.description && <p className="text-gray-500 mb-3">{banner.description}</p>}
                    <div className="flex flex-wrap gap-2 text-sm">
                      <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded">
                        Order: {banner.order}
                      </span>
                      <span className={`px-3 py-1 rounded ${banner.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {banner.isActive ? 'Active' : 'Inactive'}
                      </span>
                      <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded">
                        Button: {banner.buttonText} → {banner.buttonLink}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2 ml-4">
                    <button
                      onClick={() => openEditModal(banner)}
                      className="text-blue-600 hover:text-blue-800 p-2"
                      title="Edit"
                    >
                      <FaEdit size={20} />
                    </button>
                    <button
                      onClick={() => handleDelete(banner._id)}
                      className="text-red-600 hover:text-red-800 p-2"
                      title="Delete"
                    >
                      <FaTrash size={20} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}

        {banners.length === 0 && (
          <div className="text-center py-12 bg-white rounded-lg">
            <FaImage className="text-6xl text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">No banners added yet. Create your first banner!</p>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-lg w-full max-w-2xl my-8">
            <div className="p-6">
              <h2 className="text-2xl font-bold mb-4">
                {editingBanner ? 'Edit Banner' : 'Add Banner'}
              </h2>
              <form onSubmit={handleSubmit}>
                <div className="space-y-4">
                  {/* Banner Image Upload */}
                  <div>
                    <label className="block text-sm font-medium mb-2">Banner Image *</label>
                    
                    {imagePreview && (
                      <div className="mb-3 bg-gray-50 p-4 rounded-lg">
                        <img 
                          src={imagePreview} 
                          alt="Preview" 
                          className="max-h-48 mx-auto object-contain"
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
                            {imageFile ? imageFile.name : 'Click to upload banner image'}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">Recommended: 1920x500px, PNG or JPG</p>
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

                  {/* Mobile Banner Image Upload */}
                  <div>
                    <label className="block text-sm font-medium mb-2">Mobile Image (optional)</label>
                    <p className="text-xs text-gray-500 mb-2">Upload a separate image optimized for mobile screens. If not provided, the desktop image will be used.</p>

                    {mobileImagePreview && (
                      <div className="mb-3 bg-gray-50 p-4 rounded-lg">
                        <img
                          src={mobileImagePreview}
                          alt="Mobile Preview"
                          className="max-h-48 mx-auto object-contain"
                        />
                      </div>
                    )}

                    <div className="flex items-center gap-3">
                      <label className="flex-1 bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer hover:border-pink-500 transition-colors">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleMobileImageChange}
                          className="hidden"
                        />
                        <div className="text-gray-600">
                          <FaImage className="mx-auto h-8 w-8 mb-1 text-gray-400" />
                          <p className="text-sm font-medium">
                            {mobileImageFile ? mobileImageFile.name : 'Click to upload mobile image'}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">Recommended: 800x800px, PNG or JPG</p>
                        </div>
                      </label>

                      {mobileImagePreview && (
                        <button
                          type="button"
                          onClick={() => {
                            setMobileImageFile(null);
                            setMobileImagePreview(null);
                            setFormData({ ...formData, mobileImage: '' });
                          }}
                          className="px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors text-sm"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Title</label>
                      <input
                        type="text"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        placeholder="e.g., UP TO 40% DISCOUNT"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Subtitle</label>
                      <input
                        type="text"
                        value={formData.subtitle}
                        onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                        placeholder="e.g., FLAT 10% DISCOUNT + COMBO OFFER"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Description</label>
                    <input
                      type="text"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="e.g., Confirm Gift 4449 TK Orders"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Button Text</label>
                      <input
                        type="text"
                        value={formData.buttonText}
                        onChange={(e) => setFormData({ ...formData, buttonText: e.target.value })}
                        placeholder="SHOP NOW"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Button Link</label>
                      <input
                        type="text"
                        value={formData.buttonLink}
                        onChange={(e) => setFormData({ ...formData, buttonLink: e.target.value })}
                        placeholder="/products"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                      setMobileImageFile(null);
                      setMobileImagePreview(null);
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
                      editingBanner ? 'Update Banner' : 'Create Banner'
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

export default AdminBanners;
