import { useState } from 'react';
import axios from 'axios';
import { CATEGORIES, ui } from '../utils/constants';

export default function AdminView({ 
  sareeName, setSareeName, 
  sareeMaterial, setSareeMaterial, 
  sareeDesc, setSareeDesc, 
  uploadVariants, setUploadVariants, 
  excelFile, setExcelFile, 
  isUploading, handleProductUpload, 
  products, fetchProducts 
}) {
  const [editingProduct, setEditingProduct] = useState(null);
  const [editForm, setEditForm] = useState({
    name: '',
    material: 'Cotton',
    description: '',
    variants: []
  });

  const handleEditClick = (product) => {
    setEditingProduct(product._id);
    setEditForm({
      name: product.name,
      material: product.material,
      description: product.description || '',
      variants: product.variants ? product.variants.map(v => ({
        color: v.color || '',
        design: v.design || '',
        price: v.price || 0,
        stockStatus: v.stockStatus || 'In Stock',
        existingImages: v.images || [],
        existingVideo: v.videoUrl || '',
        newImages: null,
        newVideo: null
      })) : []
    });
  };

  const handleUpdateProduct = async (e, id) => {
    e.preventDefault();
    try {
      const API_BASE = (import.meta.env?.VITE_API_URL || 'http://localhost:5000').replace(/\/$/, '');
      const formData = new FormData();
      formData.append('name', editForm.name);
      formData.append('material', editForm.material);
      formData.append('description', editForm.description);

      const variantsMeta = editForm.variants.map((v) => ({
        color: v.color || 'Standard',
        design: v.design || 'Standard',
        price: Number(v.price) || 0,
        stockStatus: v.stockStatus || 'In Stock',
        existingImages: v.existingImages || [],
        existingVideo: v.existingVideo || ''
      }));

      formData.append('variantsMeta', JSON.stringify(variantsMeta));

      editForm.variants.forEach((v, vIdx) => {
        if (v.newImages && v.newImages.length > 0) {
          for (let j = 0; j < v.newImages.length; j++) {
            formData.append(`variantImages_${vIdx}`, v.newImages[j]);
          }
        }
        if (v.newVideo) {
          formData.append(`variantVideo_${vIdx}`, v.newVideo);
        }
      });

      await axios.put(`${API_BASE}/api/products/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      alert("Product and media updated successfully!");
      setEditingProduct(null);
      if (fetchProducts) fetchProducts();
    } catch (err) {
      console.error("Update error details:", err.response?.data || err.message);
      alert(`Failed to update product: ${err.response?.data?.message || err.message}`);
    }
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm("Are you sure you want to delete this saree from inventory?")) return;
    try {
      const API_BASE = (import.meta.env?.VITE_API_URL || 'http://localhost:5000').replace(/\/$/, '');
      await axios.delete(`${API_BASE}/api/products/${id}`);
      alert("Product deleted successfully!");
      if (fetchProducts) fetchProducts();
    } catch (err) {
      console.error(err);
      alert("Failed to delete product.");
    }
  };

  const handleExcelUpload = async (e) => {
    e.preventDefault();
    if (!excelFile) return alert("Please select an Excel file first.");
    const formData = new FormData();
    formData.append('file', excelFile);
    try {
      const API_BASE = (import.meta.env?.VITE_API_URL || 'http://localhost:5000').replace(/\/$/, '');
      const res = await axios.post(`${API_BASE}/api/upload-sarees`, formData);
      alert(res.data.message);
      if (fetchProducts) fetchProducts();
    } catch (err) { 
      alert("Bulk upload failed."); 
    }
  };

  return (
    <div className="space-y-12 max-w-6xl mx-auto pb-20">
      <div className="space-y-2 border-b border-black/10 pb-6">
        <span className="text-[10px] uppercase tracking-[0.25em] text-[#777] font-medium block">Admin Dashboard</span>
        <h2 className="saree-brand-title-dark text-3xl md:text-4xl tracking-wide font-normal">Manage Bhairavi Threads Inventory</h2>
      </div>

      {/* UPLOAD NEW SAREE FORM */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <form onSubmit={handleProductUpload} className="bg-[#fafafa] p-8 rounded-2xl border border-black/5 space-y-6 shadow-sm">
          <h3 className="text-xl font-serif">Add Saree with Variants & Videos</h3>
          
          <div className="space-y-4">
            <div>
              <label className="text-[10px] font-semibold text-[#777] uppercase tracking-widest block mb-1">Saree Name</label>
              <input type="text" placeholder="e.g. Royal Banarasi Silk" required value={sareeName} onChange={(e) => setSareeName(e.target.value)} className={ui.input} />
            </div>
            <div>
              <label className="text-[10px] font-semibold text-[#777] uppercase tracking-widest block mb-1">Category / Material</label>
              <select value={sareeMaterial} onChange={(e) => setSareeMaterial(e.target.value)} className={ui.select}>
                {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>
            </div>
            <div>
              <label className="text-[10px] font-semibold text-[#777] uppercase tracking-widest block mb-1">Description</label>
              <textarea rows={3} placeholder="Saree description..." value={sareeDesc} onChange={(e) => setSareeDesc(e.target.value)} className={`${ui.input} w-full`} />
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t border-black/10">
            <h4 className="text-xs uppercase tracking-widest font-semibold text-[#777]">Color & Design Variants</h4>
            {uploadVariants.map((v, idx) => (
              <div key={idx} className="bg-white p-4 rounded-xl border border-black/10 space-y-3 relative">
                {uploadVariants.length > 1 && (
                  <button type="button" onClick={() => setUploadVariants(uploadVariants.filter((_, i) => i !== idx))} className="absolute top-3 right-3 text-red-600 font-semibold text-[10px] uppercase">Remove ×</button>
                )}
                <p className="text-[10px] font-semibold uppercase tracking-widest text-[#1a1a1a]">Variant #{idx + 1}</p>
                <div className="grid grid-cols-2 gap-3">
                  <input type="text" placeholder="Color (e.g. Crimson)" required value={v.color} onChange={(e) => {
                    const updated = [...uploadVariants];
                    updated[idx].color = e.target.value;
                    setUploadVariants(updated);
                  }} className={ui.input} />
                  <input type="text" placeholder="Design (e.g. Classic)" required value={v.design} onChange={(e) => {
                    const updated = [...uploadVariants];
                    updated[idx].design = e.target.value;
                    setUploadVariants(updated);
                  }} className={ui.input} />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <input type="number" placeholder="Price (₹)" required value={v.price} onChange={(e) => {
                    const updated = [...uploadVariants];
                    updated[idx].price = e.target.value;
                    setUploadVariants(updated);
                  }} className={ui.input} />
                  <select value={v.stockStatus} onChange={(e) => {
                    const updated = [...uploadVariants];
                    updated[idx].stockStatus = e.target.value;
                    setUploadVariants(updated);
                  }} className={ui.select}>
                    <option value="In Stock">In Stock</option>
                    <option value="Out of Stock">Out of Stock</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-[#777] mb-1">Variant Images *</label>
                  <input type="file" multiple accept="image/*" onChange={(e) => {
                    const updated = [...uploadVariants];
                    updated[idx].images = e.target.files;
                    setUploadVariants(updated);
                  }} className="text-xs" required />
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-[#777] mb-1">Variant Video (Optional)</label>
                  <input type="file" accept="video/*" onChange={(e) => {
                    const updated = [...uploadVariants];
                    updated[idx].video = e.target.files[0];
                    setUploadVariants(updated);
                  }} className="text-xs" />
                </div>
              </div>
            ))}
            <button type="button" onClick={() => setUploadVariants([...uploadVariants, { color: '', design: '', price: '', stockStatus: 'In Stock', images: null, video: null, videoUrl: '' }])} className={`px-5 py-2 text-[10px] uppercase tracking-widest ${ui.ghostBtn}`}>
              + Add Another Variant
            </button>
          </div>

          <button type="submit" disabled={isUploading} className={`w-full py-4 text-xs uppercase tracking-widest ${ui.primaryBtn}`}>
            {isUploading ? 'Uploading Video & Images...' : 'Publish Saree Collection'}
          </button>
        </form>

        <div className="space-y-8">
          <div className="bg-[#fafafa] p-8 rounded-2xl border border-black/5 space-y-4 shadow-sm">
            <h3 className="text-xl font-serif">Bulk Excel Upload</h3>
            <p className="text-xs text-[#666]">Upload an Excel file containing saree inventory records to bulk-import items.</p>
            <input type="file" accept=".xlsx, .xls" onChange={(e) => setExcelFile(e.target.files[0])} className="text-xs py-2" />
            <button onClick={handleExcelUpload} className={`w-full py-3 text-xs uppercase tracking-widest ${ui.primaryBtn}`}>
              Upload Excel Sheet
            </button>
          </div>
        </div>
      </div>

      {/* EXISTING INVENTORY CRUD TABLE */}
      <div className="bg-[#fafafa] p-8 rounded-2xl border border-black/5 space-y-6 shadow-sm">
        <h3 className="text-2xl font-serif">Current Inventory ({products?.length || 0} Sarees)</h3>
        
        {(!products || products.length === 0) ? (
          <p className="text-sm text-[#777] py-6">No products found in inventory.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="border-b border-black/10 text-[10px] uppercase tracking-widest text-[#777]">
                  <th className="py-3 px-4">Saree Name</th>
                  <th className="py-3 px-4">Material</th>
                  <th className="py-3 px-4">Price</th>
                  <th className="py-3 px-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map(product => (
                  <tr key={product._id} className="border-b border-black/5 hover:bg-white/60 transition-colors">
                    {editingProduct === product._id ? (
                      <td colSpan={4} className="py-4 px-4">
                        <form onSubmit={(e) => handleUpdateProduct(e, product._id)} className="space-y-6 bg-white p-6 rounded-xl border border-black/10">
                          <h4 className="font-serif text-lg">Edit Product & Media</h4>
                          
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="text-[10px] font-semibold text-[#777] uppercase tracking-widest block mb-1">Name</label>
                              <input type="text" value={editForm.name} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} className={ui.input} required />
                            </div>
                            <div>
                              <label className="text-[10px] font-semibold text-[#777] uppercase tracking-widest block mb-1">Material</label>
                              <select value={editForm.material} onChange={(e) => setEditForm({ ...editForm, material: e.target.value })} className={ui.select}>
                                {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                              </select>
                            </div>
                          </div>

                          <div>
                            <label className="text-[10px] font-semibold text-[#777] uppercase tracking-widest block mb-1">Description</label>
                            <textarea rows={2} value={editForm.description} onChange={(e) => setEditForm({ ...editForm, description: e.target.value })} className={`${ui.input} w-full`} />
                          </div>

                          <div className="space-y-4 pt-4 border-t border-black/10">
                            <h5 className="text-xs uppercase tracking-widest font-semibold text-[#777]">Variants, Images & Videos</h5>
                            {editForm.variants.map((v, vIdx) => (
                              <div key={vIdx} className="bg-[#fafafa] p-4 rounded-xl border border-black/10 space-y-3">
                                <div className="grid grid-cols-3 gap-3">
                                  <div>
                                    <label className="text-[9px] uppercase tracking-widest text-[#777] block mb-1">Color</label>
                                    <input type="text" value={v.color} onChange={(e) => {
                                      const updated = [...editForm.variants];
                                      updated[vIdx].color = e.target.value;
                                      setEditForm({ ...editForm, variants: updated });
                                    }} className={ui.input} />
                                  </div>
                                  <div>
                                    <label className="text-[9px] uppercase tracking-widest text-[#777] block mb-1">Design</label>
                                    <input type="text" value={v.design} onChange={(e) => {
                                      const updated = [...editForm.variants];
                                      updated[vIdx].design = e.target.value;
                                      setEditForm({ ...editForm, variants: updated });
                                    }} className={ui.input} />
                                  </div>
                                  <div>
                                    <label className="text-[9px] uppercase tracking-widest text-[#777] block mb-1">Price (₹)</label>
                                    <input type="number" value={v.price} onChange={(e) => {
                                      const updated = [...editForm.variants];
                                      updated[vIdx].price = e.target.value;
                                      setEditForm({ ...editForm, variants: updated });
                                    }} className={ui.input} />
                                  </div>
                                </div>

                                <div>
                                  <span className="text-[9px] uppercase tracking-widest text-[#777] block mb-1">Existing Images:</span>
                                  <div className="flex gap-2 flex-wrap">
                                    {v.existingImages?.map((imgUrl, imgIdx) => (
                                      <img key={imgIdx} src={imgUrl} alt="" className="w-12 h-16 object-cover rounded border" />
                                    ))}
                                  </div>
                                </div>

                                <div>
                                  <label className="text-[9px] uppercase tracking-widest text-[#777] block mb-1">Add More Images for Variant</label>
                                  <input type="file" multiple accept="image/*" onChange={(e) => {
                                    const updated = [...editForm.variants];
                                    updated[vIdx].newImages = e.target.files;
                                    setEditForm({ ...editForm, variants: updated });
                                  }} className="text-xs" />
                                </div>

                                <div>
                                  <span className="text-[9px] uppercase tracking-widest text-[#777] block mb-1">Existing Video:</span>
                                  {v.existingVideo ? (
                                    <video src={v.existingVideo} controls className="w-32 h-20 object-cover rounded border mb-2" />
                                  ) : (
                                    <p className="text-[10px] text-[#777] mb-2">No video attached</p>
                                  )}
                                  <label className="text-[9px] uppercase tracking-widest text-[#777] block mb-1">Replace/Add Video</label>
                                  <input type="file" accept="video/*" onChange={(e) => {
                                    const updated = [...editForm.variants];
                                    updated[vIdx].newVideo = e.target.files[0];
                                    setEditForm({ ...editForm, variants: updated });
                                  }} className="text-xs" />
                                </div>
                              </div>
                            ))}
                          </div>

                          <div className="flex gap-3 pt-2">
                            <button type="submit" className={`px-6 py-2.5 text-[10px] uppercase tracking-widest ${ui.primaryBtn}`}>Save Changes</button>
                            <button type="button" onClick={() => setEditingProduct(null)} className={`px-6 py-2.5 text-[10px] uppercase tracking-widest ${ui.ghostBtn}`}>Cancel</button>
                          </div>
                        </form>
                      </td>
                    ) : (
                      <>
                        <td className="py-4 px-4 font-medium text-[#1a1a1a]">
                          <div className="flex items-center gap-3">
                            {product.variants?.[0]?.images?.[0] && (
                              <img src={product.variants[0].images[0]} alt="" className="w-10 h-12 object-cover rounded" />
                            )}
                            <span>{product.name}</span>
                          </div>
                        </td>
                        <td className="py-4 px-4 text-[#666]">{product.material}</td>
                        <td className="py-4 px-4 font-serif">₹{product.variants?.[0]?.price || 'N/A'}</td>
                        <td className="py-4 px-4 space-x-3">
                          <button onClick={() => handleEditClick(product)} className="text-xs font-semibold text-blue-600 hover:underline">Edit Media & Info</button>
                          <button onClick={() => handleDeleteProduct(product._id)} className="text-xs font-semibold text-red-600 hover:underline">Delete</button>
                        </td>
                      </>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}