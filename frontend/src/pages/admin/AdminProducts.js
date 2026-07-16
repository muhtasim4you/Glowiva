import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../utils/api';
import { toast } from 'react-toastify';
import { FaEdit, FaTrash, FaPlus, FaSearch, FaImage } from 'react-icons/fa';

const getImageUrl = (imageUrl) => {
  if (!imageUrl) return null;
  if (imageUrl.startsWith('http')) return imageUrl;
  const baseUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
  return baseUrl.replace(/\/api\/?$/, '') + imageUrl;
};

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    discountPrice: '',
    category: '',
    subcategory: '',
    brand: '',
    stock: '',
    images: [],
    skinTypes: [],
    featured: false,
    bestSeller: false,
    newArrival: false
  });

  const [availableSubcategories, setAvailableSubcategories] = useState([]);

  useEffect(() => {
    fetchProducts();
    fetchCategories();
    fetchBrands();
  }, []);

  const fetchProducts = async () => {
    try {
      const { data } = await api.get('/products?limit=1000');
      const productsArray = Array.isArray(data) ? data : (data.data || data.products || []);
      setProducts(productsArray);
      setLoading(false);
    } catch (error) {
      toast.error('Failed to fetch products');
      setProducts([]);
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const { data } = await api.get('/categories');
      const categoriesArray = Array.isArray(data) ? data : (data.data || data.categories || []);
      
      // Separate parent categories and subcategories
      const parents = categoriesArray.filter(cat => !cat.parentCategory);
      const subs = categoriesArray.filter(cat => cat.parentCategory);
      
      setCategories(parents);
      setSubcategories(subs);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
      setCategories([]);
      setSubcategories([]);
    }
  };

  const fetchBrands = async () => {
    try {
      const { data } = await api.get('/brands');
      const brandsArray = Array.isArray(data) ? data : (data.data || data.brands || []);
      setBrands(brandsArray);
    } catch (error) {
      console.error('Failed to fetch brands:', error);
      setBrands([]);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name === 'category') {
      // Load subcategories for selected parent category
      const selectedCategoryId = value;
      const subs = subcategories.filter(sub => 
        sub.parentCategory && (sub.parentCategory._id === selectedCategoryId || sub.parentCategory === selectedCategoryId)
      );
      setAvailableSubcategories(subs);
      setFormData({
        ...formData,
        category: value,
        subcategory: ''
      });
    } else if (name === 'subcategory') {
      // When subcategory is selected, it becomes the actual category for the product
      setFormData({
        ...formData,
        subcategory: value,
        // If subcategory is selected, use it as the actual category
        actualCategory: value || formData.category
      });
    } else {
      setFormData({
        ...formData,
        [name]: type === 'checkbox' ? checked : value
      });
    }
  };

  const handleSkinTypeChange = (e) => {
    const { value, checked } = e.target;
    let updatedSkinTypes = [...formData.skinTypes];
    
    if (checked) {
      // Add skin type if checked
      if (!updatedSkinTypes.includes(value)) {
        updatedSkinTypes.push(value);
      }
    } else {
      // Remove skin type if unchecked
      updatedSkinTypes = updatedSkinTypes.filter(type => type !== value);
    }
    
    setFormData({
      ...formData,
      skinTypes: updatedSkinTypes
    });
  };

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    const uploadedUrls = [];
    
    for (const file of files) {
      const formDataUpload = new FormData();
      formDataUpload.append('image', file);

      try {
        const { data } = await api.post('/upload/single', formDataUpload, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        // Store only the relative path - Nginx/backend will serve it
        uploadedUrls.push(data.url);
      } catch (error) {
        toast.error(`Failed to upload ${file.name}`);
        console.error('Upload error:', error);
      }
    }

    if (uploadedUrls.length > 0) {
      setFormData(prev => ({ ...prev, images: [...prev.images, ...uploadedUrls] }));
      toast.success(`${uploadedUrls.length} image(s) uploaded successfully`);
    }
  };

  const addImageField = () => {
    setFormData({ ...formData, images: [...formData.images, ''] });
  };

  const removeImageField = (index) => {
    const newImages = formData.images.filter((_, i) => i !== index);
    setFormData({ ...formData, images: newImages });
  };

  const openAddModal = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      description: '',
      price: '',
      discountPrice: '',
      category: '',
      subcategory: '',
      brand: '',
      stock: '',
      images: [],
      skinTypes: [],
      featured: false,
      bestSeller: false,
      newArrival: false
    });
    setAvailableSubcategories([]);
    setShowModal(true);
  };

  const openEditModal = (product) => {
    setEditingProduct(product);
    
    const productCategoryId = product.category?._id || product.category || '';
    
    // Check if the product's category is a child category
    const isChildCategory = subcategories.find(sub => sub._id === productCategoryId);
    
    let parentCategoryId = '';
    let subcategoryId = '';
    
    if (isChildCategory) {
      // Product is assigned to a child category (e.g., Serum, Cleanser)
      parentCategoryId = isChildCategory.parentCategory?._id || isChildCategory.parentCategory || '';
      subcategoryId = productCategoryId;
      
      // Load subcategories for this parent
      const subs = subcategories.filter(sub => 
        sub.parentCategory && (sub.parentCategory._id === parentCategoryId || sub.parentCategory === parentCategoryId)
      );
      setAvailableSubcategories(subs);
    } else {
      // Product is assigned to a parent category
      parentCategoryId = productCategoryId;
      
      // Load subcategories for this parent
      const subs = subcategories.filter(sub => 
        sub.parentCategory && (sub.parentCategory._id === productCategoryId || sub.parentCategory === productCategoryId)
      );
      setAvailableSubcategories(subs);
    }
    
    setFormData({
      name: product.name || '',
      description: product.description || '',
      price: product.price || '',
      discountPrice: product.discountPrice || '',
      category: parentCategoryId,
      subcategory: subcategoryId,
      brand: product.brand?._id || product.brand || '',
      stock: product.stock || '',
      images: product.images && product.images.length > 0 ? product.images : [''],
      skinTypes: product.skinTypes || [],
      featured: product.featured || false,
      bestSeller: product.bestSeller || false,
      newArrival: product.newArrival || false
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Use subcategory as the actual category if selected, otherwise use parent category
      const productData = {
        ...formData,
        category: formData.subcategory || formData.category,
        images: formData.images.filter(img => img.trim() !== '')
      };
      
      // Remove subcategory from the data being sent (we use it for UI only)
      delete productData.subcategory;
      delete productData.actualCategory;

      if (editingProduct) {
        await api.put(`/products/${editingProduct._id}`, productData);
        toast.success('Product updated successfully');
      } else {
        await api.post('/products', productData);
        toast.success('Product created successfully');
      }
      
      setShowModal(false);
      fetchProducts();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save product');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await api.delete(`/products/${id}`);
        toast.success('Product deleted successfully');
        fetchProducts();
      } catch (error) {
        toast.error('Failed to delete product');
      }
    }
  };

  const filteredProducts = products.filter(product =>
    (product.name || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Manage Products</h1>
        <button
          onClick={openAddModal}
          className="bg-primary-500 text-white px-6 py-2 rounded-lg hover:bg-primary-600 flex items-center"
        >
          <FaPlus className="mr-2" /> Add Product
        </button>
      </div>

      <div className="mb-6">
        <div className="relative">
          <FaSearch className="absolute left-3 top-3 text-gray-400" />
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
          />
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Image</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Brand</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Stock</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredProducts.map((product) => (
                <tr key={product._id}>
                  <td className="px-6 py-4">
                    {product.images && product.images[0] ? (
                      <img src={getImageUrl(product.images[0])} alt={product.name} className="h-12 w-12 object-cover rounded" />
                    ) : (
                      <div className="h-12 w-12 bg-gray-200 rounded flex items-center justify-center">
                        <FaImage className="text-gray-400" />
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4">{product.name}</td>
                  <td className="px-6 py-4">
                    <div>
                      <div>{product.category?.name || 'N/A'}</div>
                      {product.category?.type && product.category.type !== 'regular' && (
                        <span className={`inline-block mt-1 px-2 py-0.5 text-xs font-medium rounded-full ${
                          product.category.type === 'combo' ? 'bg-purple-100 text-purple-700' :
                          product.category.type === 'offer' ? 'bg-red-100 text-red-700' :
                          ''
                        }`}>
                          {product.category.type === 'combo' && '🎁 Combo'}
                          {product.category.type === 'offer' && '🏷️ Offer'}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">{product.brand?.name || 'N/A'}</td>
                  <td className="px-6 py-4">
                    {product.discountPrice ? (
                      <>
                        <span className="line-through text-gray-400">৳{product.price}</span>{' '}
                        <span className="text-primary-500">৳{product.discountPrice}</span>
                      </>
                    ) : (
                      <span>৳{product.price}</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <span className={product.stock > 0 ? 'text-green-600' : 'text-red-600'}>
                      {product.stock}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-1">
                      {product.featured && <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">Featured</span>}
                      {product.bestSeller && <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Best</span>}
                      {product.newArrival && <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">New</span>}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => openEditModal(product)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => handleDelete(product._id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Product Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999] p-4">
          <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto relative z-[10000]">
            <div className="p-6">
              <h2 className="text-2xl font-bold mb-4">
                {editingProduct ? 'Edit Product' : 'Add Product'}
              </h2>
              
              {/* Info box for combo/offer categories */}
              <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg text-sm">
                <p className="font-medium text-blue-900 mb-1">💡 Category Selection Guide:</p>
                <ul className="text-blue-800 space-y-1 ml-4 list-disc">
                  <li><strong>For Skincare Products:</strong> Select "Skincare" as category, then choose specific type (Cleanser, Serum, Moisturizer, etc.) as subcategory</li>
                  <li><strong>For Combos (🎁):</strong> Select a Combo category to show products on the Combo page</li>
                  <li><strong>For Offers (🏷️):</strong> Select an Offer category to show products on the Offers page</li>
                  <li><strong>Note:</strong> If you select a subcategory, the product will be categorized under that specific subcategory</li>
                </ul>
              </div>
              
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium mb-2">Product Name</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium mb-2">Description</label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      required
                      rows="3"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Category</label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    >
                      <option value="">Select Category</option>
                      
                      {/* Regular Categories */}
                      {categories.filter(cat => !cat.type || cat.type === 'regular').length > 0 && (
                        <optgroup label="📁 Regular Categories">
                          {categories.filter(cat => !cat.type || cat.type === 'regular').map(cat => (
                            <option key={cat._id} value={cat._id}>{cat.name}</option>
                          ))}
                        </optgroup>
                      )}
                      
                      {/* Combo Categories */}
                      {categories.filter(cat => cat.type === 'combo').length > 0 && (
                        <optgroup label="🎁 Combo Deals">
                          {categories.filter(cat => cat.type === 'combo').map(cat => (
                            <option key={cat._id} value={cat._id}>{cat.name}</option>
                          ))}
                        </optgroup>
                      )}
                      
                      {/* Offer Categories */}
                      {categories.filter(cat => cat.type === 'offer').length > 0 && (
                        <optgroup label="🏷️ Special Offers">
                          {categories.filter(cat => cat.type === 'offer').map(cat => (
                            <option key={cat._id} value={cat._id}>{cat.name}</option>
                          ))}
                        </optgroup>
                      )}
                    </select>
                    {formData.category && (
                      <p className="text-xs text-gray-500 mt-1">
                        {(() => {
                          const selectedCat = categories.find(c => c._id === formData.category);
                          if (selectedCat?.type === 'combo') return '🎁 This product will appear on the Combo page';
                          if (selectedCat?.type === 'offer') return '🏷️ This product will appear on the Offers page';
                          return '📁 Regular category product';
                        })()}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Subcategory 
                      <span className="text-gray-500 font-normal text-xs ml-2">(Specific Type)</span>
                    </label>
                    <select
                      name="subcategory"
                      value={formData.subcategory}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                      disabled={!formData.category || availableSubcategories.length === 0}
                    >
                      <option value="">
                        {availableSubcategories.length === 0 ? 'No subcategories available' : 'Select Subcategory (Recommended)'}
                      </option>
                      {availableSubcategories.map((subcat) => (
                        <option key={subcat._id} value={subcat._id}>{subcat.name}</option>
                      ))}
                    </select>
                    {formData.subcategory && (
                      <p className="text-xs text-green-600 mt-1">
                        ✓ Product will be categorized under {availableSubcategories.find(s => s._id === formData.subcategory)?.name}
                      </p>
                    )}
                    {formData.category && !formData.subcategory && availableSubcategories.length > 0 && (
                      <p className="text-xs text-amber-600 mt-1">
                        ⚠️ Select a subcategory for better organization
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Brand</label>
                    <select
                      name="brand"
                      value={formData.brand}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    >
                      <option value="">Select Brand</option>
                      {brands.map(brand => (
                        <option key={brand._id} value={brand._id}>{brand.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Price (৳)</label>
                    <input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleInputChange}
                      required
                      min="0"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Discount Price (৳)</label>
                    <input
                      type="number"
                      name="discountPrice"
                      value={formData.discountPrice}
                      onChange={handleInputChange}
                      min="0"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Stock</label>
                    <input
                      type="number"
                      name="stock"
                      value={formData.stock}
                      onChange={handleInputChange}
                      required
                      min="0"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium mb-2">Suitable for Skin Types</label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3 p-4 border border-gray-300 rounded-lg bg-gray-50">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          value="oily"
                          checked={formData.skinTypes.includes('oily')}
                          onChange={handleSkinTypeChange}
                          className="rounded text-primary-500"
                        />
                        <span className="text-sm">Oily</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          value="dry"
                          checked={formData.skinTypes.includes('dry')}
                          onChange={handleSkinTypeChange}
                          className="rounded text-primary-500"
                        />
                        <span className="text-sm">Dry</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          value="combination"
                          checked={formData.skinTypes.includes('combination')}
                          onChange={handleSkinTypeChange}
                          className="rounded text-primary-500"
                        />
                        <span className="text-sm">Combination</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          value="sensitive"
                          checked={formData.skinTypes.includes('sensitive')}
                          onChange={handleSkinTypeChange}
                          className="rounded text-primary-500"
                        />
                        <span className="text-sm">Sensitive</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          value="normal"
                          checked={formData.skinTypes.includes('normal')}
                          onChange={handleSkinTypeChange}
                          className="rounded text-primary-500"
                        />
                        <span className="text-sm">Normal</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          value="all"
                          checked={formData.skinTypes.includes('all')}
                          onChange={handleSkinTypeChange}
                          className="rounded text-primary-500"
                        />
                        <span className="text-sm font-medium">All Skin Types</span>
                      </label>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Select all skin types this product is suitable for</p>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium mb-2">Product Images</label>
                    <div className="mb-3">
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleImageUpload}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                      />
                      <p className="text-xs text-gray-500 mt-1">Upload up to 10 images (max 5MB each)</p>
                    </div>
                    {formData.images.length > 0 && (
                      <div className="grid grid-cols-4 gap-2 mt-3">
                        {formData.images.map((img, index) => (
                          <div key={index} className="relative group">
                            <img src={getImageUrl(img)} alt={`Product ${index + 1}`} className="w-full h-24 object-cover rounded border" />
                            <button
                              type="button"
                              onClick={() => removeImageField(index)}
                              className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <FaTrash size={12} />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="md:col-span-2">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        name="featured"
                        checked={formData.featured}
                        onChange={handleInputChange}
                        className="rounded"
                      />
                      <span className="text-sm font-medium">Featured Product</span>
                    </label>
                  </div>

                  <div className="md:col-span-2">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        name="bestSeller"
                        checked={formData.bestSeller}
                        onChange={handleInputChange}
                        className="rounded"
                      />
                      <span className="text-sm font-medium">Best Seller</span>
                    </label>
                  </div>

                  <div className="md:col-span-2">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        name="newArrival"
                        checked={formData.newArrival}
                        onChange={handleInputChange}
                        className="rounded"
                      />
                      <span className="text-sm font-medium">New Arrival</span>
                    </label>
                  </div>
                </div>

                <div className="flex justify-end gap-4 mt-6">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600"
                  >
                    {editingProduct ? 'Update' : 'Create'} Product
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

export default AdminProducts;
