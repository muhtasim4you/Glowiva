import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import { toast } from 'react-toastify';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';

const AdminBrands = () => {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingBrand, setEditingBrand] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    logo: ''
  });
  const [uploading, setUploading] = useState(false);
  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);

  // Helper function to get full image URL
  const getImageUrl = (imageUrl) => {
    if (!imageUrl) return null;
    if (imageUrl.startsWith('http')) return imageUrl;
    const baseUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
    return baseUrl.replace(/\/api\/?$/, '') + imageUrl;
  };

  useEffect(() => {
    fetchBrands();
  }, []);

  const fetchBrands = async () => {
    try {
      const { data } = await api.get('/brands');
      const brandsArray = Array.isArray(data.data) ? data.data : (Array.isArray(data) ? data : []);
      setBrands(brandsArray);
      setLoading(false);
    } catch (error) {
      toast.error('Failed to fetch brands');
      setBrands([]);
      setLoading(false);
    }
  };

  const openAddModal = () => {
    setEditingBrand(null);
    setFormData({ name: '', description: '', logo: '' });
    setLogoFile(null);
    setLogoPreview(null);
    setShowModal(true);
  };

  const openEditModal = (brand) => {
    setEditingBrand(brand);
    setFormData({
      name: brand.name,
      description: brand.description || '',
      logo: brand.logo || ''
    });
    setLogoFile(null);
    setLogoPreview(brand.logo ? getImageUrl(brand.logo) : null);
    setShowModal(true);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setLogoFile(file);
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadImage = async () => {
    if (!logoFile) return formData.logo;

    const formDataUpload = new FormData();
    formDataUpload.append('image', logoFile);

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
      // Upload image if a new file was selected
      let logoUrl = formData.logo;
      if (logoFile) {
        logoUrl = await uploadImage();
      }

      const submitData = {
        ...formData,
        logo: logoUrl
      };

      if (editingBrand) {
        await api.put(`/brands/${editingBrand._id}`, submitData);
        toast.success('Brand updated successfully');
      } else {
        await api.post('/brands', submitData);
        toast.success('Brand created successfully');
      }
      setShowModal(false);
      setLogoFile(null);
      setLogoPreview(null);
      fetchBrands();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save brand');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this brand?')) {
      try {
        await api.delete(`/brands/${id}`);
        toast.success('Brand deleted successfully');
        fetchBrands();
      } catch (error) {
        toast.error('Failed to delete brand');
      }
    }
  };

  if (loading) return <div className="container mx-auto px-4 py-8"><div className="text-center">Loading...</div></div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Manage Brands</h1>
        <button
          onClick={openAddModal}
          className="bg-primary-500 text-white px-6 py-2 rounded-lg hover:bg-primary-600 flex items-center"
        >
          <FaPlus className="mr-2" /> Add Brand
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {brands.map((brand) => (
          <div key={brand._id} className="bg-white rounded-lg shadow p-6">
            <div className="flex flex-col items-center text-center">
              {brand.logo ? (
                <img src={getImageUrl(brand.logo)} alt={brand.name} className="h-16 w-16 object-contain mb-4" />
              ) : (
                <div className="h-16 w-16 bg-gray-200 rounded-full flex items-center justify-center mb-4">
                  <span className="text-2xl font-bold text-gray-400">{brand.name.charAt(0)}</span>
                </div>
              )}
              <h3 className="text-lg font-bold mb-2">{brand.name}</h3>
              {brand.description && (
                <p className="text-gray-600 text-sm mb-4">{brand.description}</p>
              )}
              <div className="flex gap-2 mt-auto">
                <button
                  onClick={() => openEditModal(brand)}
                  className="text-blue-600 hover:text-blue-800 p-2"
                >
                  <FaEdit />
                </button>
                <button
                  onClick={() => handleDelete(brand._id)}
                  className="text-red-600 hover:text-red-800 p-2"
                >
                  <FaTrash />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-md">
            <div className="p-6">
              <h2 className="text-2xl font-bold mb-4">
                {editingBrand ? 'Edit Brand' : 'Add Brand'}
              </h2>
              <form onSubmit={handleSubmit}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Brand Name</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Description</label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      rows="3"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Brand Logo</label>
                    
                    {/* Image Preview */}
                    {logoPreview && (
                      <div className="mb-3">
                        <div className="w-24 h-24 rounded-lg overflow-hidden border-2 border-gray-300 mx-auto bg-white p-2">
                          <img 
                            src={logoPreview} 
                            alt="Preview" 
                            className="w-full h-full object-contain"
                          />
                        </div>
                      </div>
                    )}
                    
                    {/* File Upload Button */}
                    <div className="flex items-center gap-3">
                      <label className="flex-1 bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer hover:border-pink-500 transition-colors">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageChange}
                          className="hidden"
                        />
                        <div className="text-gray-600">
                          <svg className="mx-auto h-8 w-8 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                          </svg>
                          <p className="text-sm font-medium">
                            {logoFile ? logoFile.name : 'Click to upload logo'}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">PNG, JPG, SVG up to 5MB</p>
                        </div>
                      </label>
                      
                      {logoPreview && (
                        <button
                          type="button"
                          onClick={() => {
                            setLogoFile(null);
                            setLogoPreview(null);
                            setFormData({ ...formData, logo: '' });
                          }}
                          className="px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors text-sm"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 mt-2">Upload your brand logo for better visibility</p>
                  </div>
                </div>
                <div className="flex justify-end gap-4 mt-6">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
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
                      editingBrand ? 'Update' : 'Create'
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

export default AdminBrands;
