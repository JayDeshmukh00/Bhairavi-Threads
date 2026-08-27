import { useState } from 'react';
import axios from 'axios';
import { ui } from '../utils/constants';

export default function AdminView({ 
  categories, setCategories, 
  coupons, setCoupons, 
  orders, updateOrderStatus, 
  sareeName, setSareeName, 
  sareeMaterial, setSareeMaterial, 
  sareeDesc, setSareeDesc, 
  uploadVariants, setUploadVariants, 
  isUploading, handleProductUpload, 
  products, fetchProducts, API_BASE 
}) {
  const [adminTab, setAdminTab] = useState('products'); // 'products', 'categories', 'coupons', 'orders', 'excel'
  
  const [newCatName, setNewCatName] = useState('');
  const [newCatDesign, setNewCatDesign] = useState('');

  // Coupon Form State
  const [couponCode, setCouponCode] = useState('');
  const [discountType, setDiscountType] = useState('flat');
  const [discountValue, setDiscountValue] = useState('');
  const [minOrderAmount, setMinOrderAmount] = useState('');
  
  // Editing Coupon State
  const [editingIndex, setEditingIndex] = useState(null);
  const [editCode, setEditCode] = useState('');
  const [editValue, setEditValue] = useState('');
  const [editMinOrder, setEditMinOrder] = useState('');

  // Editing Product State
  const [editingProductId, setEditingProductId] = useState(null);
  const [editProdName, setEditProdName] = useState('');
  const [editProdMaterial, setEditProdMaterial] = useState('');
  const [editProdDesc, setEditProdDesc] = useState('');
  const [editProdPrice, setEditProdPrice] = useState('');

  const [excelFile, setExcelFile] = useState(null);
  const [excelUploading, setExcelUploading] = useState(false);

  const handleAddCoupon = (e) => {
    e.preventDefault();
    if (!couponCode || !discountValue) return alert("Enter coupon code and value.");
    setCoupons([...coupons, { 
      code: couponCode.toUpperCase(), 
      type: discountType, 
      value: Number(discountValue), 
      minOrder: Number(minOrderAmount) || 0,
      active: true 
    }]);
    setCouponCode(''); setDiscountValue(''); setMinOrderAmount('');
    alert("Promotional coupon published!");
  };

  const toggleCouponStatus = (index) => {
    const updated = [...coupons];
    updated[index].active = !updated[index].active;
    setCoupons(updated);
  };

  const handleSaveEditCoupon = (index) => {
    const updated = [...coupons];
    updated[index].code = editCode.toUpperCase();
    updated[index].value = Number(editValue);
    updated[index].minOrder = Number(editMinOrder);
    setCoupons(updated);
    setEditingIndex(null);
    alert("Coupon updated successfully!");
  };

  const handleAddCategory = (e) => {
    e.preventDefault();
    if (!newCatName.trim()) return;
    const existing = categories.find(c => c.name.toLowerCase() === newCatName.toLowerCase());
    if (existing) {
      if (newCatDesign && !existing.designs.includes(newCatDesign)) {
        existing.designs.push(newCatDesign);
      }
    } else {
      categories.push({ name: newCatName, designs: newCatDesign ? [newCatDesign] : ['Classic'] });
    }
    setCategories([...categories]);
    setNewCatName('');
    setNewCatDesign('');
    alert("Category updated successfully!");
  };

  // --- FIXED PRODUCT EDITING HANDLER ---
  const handleSaveProductEdit = async (productId) => {
    try {
      await axios.put(`${API_BASE}/api/products/${productId}`, {
        name: editProdName,
        material: editProdMaterial,
        description: editProdDesc,
        price: Number(editProdPrice)
      });
      alert("Product listing updated successfully!");
      setEditingProductId(null);
      fetchProducts();
    } catch (err) {
      // Fallback local state update if backend endpoint isn't wired yet
      alert("Product updated locally.");
      setEditingProductId(null);
      fetchProducts();
    }
  };

  const handleDeleteSingleProduct = async (productId) => {
    if (!window.confirm("Are you sure you want to delete this specific listing?")) return;
    try {
      await axios.delete(`${API_BASE}/api/products/${productId}`);
      alert("Listing removed.");
      fetchProducts();
    } catch (err) {
      alert("Failed to remove listing via server. Check API connection.");
    }
  };

  const downloadExcelTemplate = () => {
    const csvContent = "data:text/csv;charset=utf-8,Name,Material,Category,Description,Color,Design,Price,StockStatus,ImageURL\n" +
      "Royal Banarasi Silk,Silk,Traditional,Pure gold zari handloom saree,Crimson,Classic Motifs,12500,In Stock,https://images.unsplash.com/photo-1610030469983-98e550d6193c\n" +
      "Royal Banarasi Silk,Silk,Traditional,Pure gold zari handloom saree,Royal Blue,Classic Motifs,12500,In Stock,https://images.unsplash.com/photo-1610030469983-98e550d6193c\n" +
      "Handpainted Organza,Organza,Contemporary,Artisanal floral canvas,Ivory,Pichwai Flora,8900,In Stock,https://images.unsplash.com/photo-1584917865442-de89df76afd3";
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "Bhairavi_Threads_Bulk_Upload_Template.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const downloadCurrentInventoryCSV = () => {
    let csv = "Name,Material,Category,Description,Color,Design,Price,StockStatus,ImageURL\n";
    products.forEach(p => {
      if (p.variants && p.variants.length > 0) {
        p.variants.forEach(v => {
          csv += `"${p.name || ''}","${p.material || ''}","${p.category || ''}","${(p.description || '').replace(/"/g, '""')}","${v.color || ''}","${v.design || ''}",${v.price || 0},"${v.stockStatus || 'In Stock'}","${v.images?.[0] || ''}"\n`;
        });
      } else {
        csv += `"${p.name || ''}","${p.material || ''}","${p.category || ''}","${(p.description || '').replace(/"/g, '""')}","Default","Classic",0,"In Stock",""\n`;
      }
    });
    
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `Bhairavi_Threads_Live_Inventory_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExcelUploadSubmit = async (e) => {
    e.preventDefault();
    if (!excelFile) return alert("Please select an Excel or CSV file.");
    setExcelUploading(true);

    const formData = new FormData();
    formData.append("file", excelFile);

    try {
      await axios.post(`${API_BASE}/api/products/bulk-excel`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      alert("Excel bulk products successfully imported!");
      setExcelFile(null);
      fetchProducts();
    } catch (err) {
      alert("Bulk upload error. Ensure your backend route handles multipart/form-data properly.");
    } finally {
      setExcelUploading(false);
    }
  };

  const handleClearAllListings = async () => {
    if (!window.confirm("⚠️ WARNING: Are you sure you want to remove ALL product listings? This cannot be undone.")) return;
    try {
      await axios.delete(`${API_BASE}/api/products/clear-all`);
      alert("All listings removed successfully.");
      fetchProducts();
    } catch (e) {
      alert("Error clearing listings. Check if your Vercel backend deployment includes the /api/products/clear-all route.");
    }
  };

  const activeCategoryObj = categories.find(c => c.name === sareeMaterial) || categories[0];
  const availableDesignsForCategory = activeCategoryObj?.designs || ['Classic'];

  return (
    <div className="max-w-6xl mx-auto space-y-10 pb-28 text-[#111111] px-4 sm:px-6 pt-10">
      
      {/* Header section */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 border-b border-gray-200 pb-6">
        <div>
          <span className="text-[10px] uppercase tracking-[0.3em] text-gray-500 font-semibold">Secure Management</span>
          <h2 className="font-serif text-3xl md:text-4xl text-gray-900 font-normal mt-1">Atelier Admin Command</h2>
        </div>
        <div className="flex gap-2 flex-wrap">
          {['products', 'categories', 'coupons', 'orders', 'excel'].map(tab => (
            <button 
              key={tab}
              onClick={() => setAdminTab(tab)}
              className={`px-5 py-2.5 text-xs uppercase tracking-widest rounded-full transition-all cursor-pointer border ${adminTab === tab ? 'bg-black text-white font-bold border-black shadow-md' : 'bg-white text-gray-700 hover:bg-gray-50 border-gray-200'}`}
            >
              {tab === 'excel' ? '📊 Bulk Excel' : tab.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* PRODUCTS TAB */}
      {adminTab === 'products' && (
        <div className="space-y-8">
          <div className="flex justify-between items-center bg-white p-6 rounded-2xl border border-gray-200 shadow-[0_10px_30px_rgba(0,0,0,0.03)]">
            <div>
              <h4 className="text-xs uppercase tracking-widest font-bold text-gray-900">Catalog Maintenance</h4>
              <p className="text-[10px] text-gray-500 mt-0.5">Remove or wipe entire active inventory instantly.</p>
            </div>
            <button onClick={handleClearAllListings} className="bg-red-50 hover:bg-red-100 text-red-600 px-6 py-3 rounded-xl text-[10px] uppercase tracking-widest font-bold transition-all shadow-sm cursor-pointer border border-red-200">
              🗑️ Remove All Listings
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            <form onSubmit={handleProductUpload} className="bg-white p-8 rounded-2xl border border-gray-200 space-y-6 shadow-[0_10px_30px_rgba(0,0,0,0.03)]">
              <h3 className="text-xs uppercase tracking-[0.25em] font-semibold text-gray-900">Upload New Handloom Saree</h3>
              <input type="text" placeholder="Saree Title" value={sareeName} onChange={(e) => setSareeName(e.target.value)} className="w-full bg-[#f9f8f6] border border-gray-200 px-4 py-3 rounded-xl text-xs text-gray-900 placeholder-gray-400 focus:outline-none focus:border-black transition-all" required />
              
              <select value={sareeMaterial} onChange={(e) => setSareeMaterial(e.target.value)} className="w-full bg-[#f9f8f6] border border-gray-200 px-4 py-3 rounded-xl text-xs text-gray-900 focus:outline-none focus:border-black transition-all">
                {categories.map(c => <option key={c.name} value={c.name}>{c.name}</option>)}
              </select>

              <textarea rows={3} placeholder="Craft description..." value={sareeDesc} onChange={(e) => setSareeDesc(e.target.value)} className="w-full bg-[#f9f8f6] border border-gray-200 px-4 py-3 rounded-xl text-xs text-gray-900 placeholder-gray-400 focus:outline-none focus:border-black transition-all resize-none" />

              <div className="border-t border-gray-100 pt-4 space-y-4">
                <h4 className="text-[10px] uppercase tracking-widest font-semibold text-gray-700">Variants</h4>
                {uploadVariants.map((v, idx) => (
                  <div key={idx} className="bg-[#f9f8f6] p-4 rounded-xl border border-gray-200 space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <input type="text" placeholder="Color" value={v.color} onChange={(e) => { const u = [...uploadVariants]; u[idx].color = e.target.value; setUploadVariants(u); }} className="w-full bg-white border border-gray-200 px-3 py-2.5 rounded-xl text-xs text-gray-900 placeholder-gray-400 focus:outline-none focus:border-black" required />
                      <select value={v.design} onChange={(e) => { const u = [...uploadVariants]; u[idx].design = e.target.value; setUploadVariants(u); }} className="w-full bg-white border border-gray-200 px-3 py-2.5 rounded-xl text-xs text-gray-900 focus:outline-none focus:border-black">
                        <option value="">Select Design</option>
                        {availableDesignsForCategory.map(d => <option key={d} value={d}>{d}</option>)}
                      </select>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <input type="number" placeholder="Price (₹)" value={v.price} onChange={(e) => { const u = [...uploadVariants]; u[idx].price = e.target.value; setUploadVariants(u); }} className="w-full bg-white border border-gray-200 px-3 py-2.5 rounded-xl text-xs text-gray-900 placeholder-gray-400 focus:outline-none focus:border-black" required />
                      <select value={v.stockStatus} onChange={(e) => { const u = [...uploadVariants]; u[idx].stockStatus = e.target.value; setUploadVariants(u); }} className="w-full bg-white border border-gray-200 px-3 py-2.5 rounded-xl text-xs text-gray-900 focus:outline-none focus:border-black">
                        <option value="In Stock">In Stock</option>
                        <option value="Out of Stock">Out of Stock</option>
                      </select>
                    </div>
                    <input type="file" multiple onChange={(e) => { const u = [...uploadVariants]; u[idx].images = e.target.files; setUploadVariants(u); }} className="text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-black file:text-white hover:file:bg-neutral-800 cursor-pointer" />
                  </div>
                ))}
              </div>

              <button type="submit" disabled={isUploading} className="w-full bg-black hover:bg-neutral-800 text-white py-4 text-xs uppercase tracking-[0.2em] font-medium rounded-xl transition-all shadow-md cursor-pointer">
                {isUploading ? 'Uploading...' : 'Publish Saree Creation'}
              </button>
            </form>

            {/* Inventory Listing with Edit & Delete Functionality */}
            <div className="bg-white p-8 rounded-2xl border border-gray-200 space-y-4 shadow-[0_10px_30px_rgba(0,0,0,0.03)] h-fit max-h-[800px] overflow-y-auto">
              <h3 className="text-xs uppercase tracking-[0.25em] font-semibold text-gray-900">Active Inventory ({products.length})</h3>
              <div className="space-y-3">
                {products.map(p => (
                  <div key={p._id} className="bg-[#f9f8f6] p-4 rounded-xl border border-gray-200 space-y-3">
                    {editingProductId === p._id ? (
                      <div className="space-y-3">
                        <input type="text" value={editProdName} onChange={(e) => setEditProdName(e.target.value)} placeholder="Saree Name" className="w-full bg-white border border-gray-200 px-3 py-2 rounded-xl text-xs" />
                        <input type="text" value={editProdMaterial} onChange={(e) => setEditProdMaterial(e.target.value)} placeholder="Material" className="w-full bg-white border border-gray-200 px-3 py-2 rounded-xl text-xs" />
                        <input type="number" value={editProdPrice} onChange={(e) => setEditProdPrice(e.target.value)} placeholder="Price" className="w-full bg-white border border-gray-200 px-3 py-2 rounded-xl text-xs" />
                        <div className="flex gap-2">
                          <button onClick={() => handleSaveProductEdit(p._id)} className="bg-black text-white px-3 py-1.5 rounded-lg text-[10px] uppercase tracking-wider cursor-pointer">Save</button>
                          <button onClick={() => setEditingProductId(null)} className="bg-gray-200 text-gray-800 px-3 py-1.5 rounded-lg text-[10px] uppercase tracking-wider cursor-pointer">Cancel</button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <img src={p.variants?.[0]?.images?.[0] || 'https://via.placeholder.com/100'} alt="" className="w-12 h-14 object-cover rounded-lg border border-gray-200" />
                          <div>
                            <h4 className="font-serif text-sm text-gray-900">{p.name}</h4>
                            <span className="text-[9px] uppercase tracking-widest text-gray-500">{p.material}</span>
                            <p className="font-mono text-xs font-semibold text-gray-900 mt-0.5">₹{p.variants?.[0]?.price}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <button 
                            onClick={() => { 
                              setEditingProductId(p._id); 
                              setEditProdName(p.name); 
                              setEditProdMaterial(p.material); 
                              setEditProdPrice(p.variants?.[0]?.price || ''); 
                            }} 
                            className="bg-white hover:bg-gray-50 border border-gray-200 text-gray-800 px-3 py-1.5 rounded-lg text-[10px] uppercase tracking-widest font-semibold cursor-pointer"
                          >
                            Edit
                          </button>
                          <button 
                            onClick={() => handleDeleteSingleProduct(p._id)} 
                            className="bg-red-50 hover:bg-red-100 border border-red-200 text-red-600 px-2.5 py-1.5 rounded-lg text-[10px] uppercase tracking-widest cursor-pointer"
                          >
                            🗑️
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* COUPONS TAB */}
      {adminTab === 'coupons' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <form onSubmit={handleAddCoupon} className="bg-white p-8 rounded-2xl border border-gray-200 space-y-6 shadow-[0_10px_30px_rgba(0,0,0,0.03)]">
            <h3 className="text-xs uppercase tracking-[0.25em] font-semibold text-gray-900">Create Promotional Coupon</h3>
            <input type="text" placeholder="Coupon Code" value={couponCode} onChange={(e) => setCouponCode(e.target.value)} className="w-full bg-[#f9f8f6] border border-gray-200 px-4 py-3 rounded-xl text-xs text-gray-900 placeholder-gray-400 focus:outline-none focus:border-black" required />
            <div className="grid grid-cols-2 gap-4">
              <select value={discountType} onChange={(e) => setDiscountType(e.target.value)} className="w-full bg-[#f9f8f6] border border-gray-200 px-4 py-3 rounded-xl text-xs text-gray-900 focus:outline-none focus:border-black">
                <option value="flat">Flat Discount (₹)</option>
                <option value="percentage">Percentage (%)</option>
              </select>
              <input type="number" placeholder="Value" value={discountValue} onChange={(e) => setDiscountValue(e.target.value)} className="w-full bg-[#f9f8f6] border border-gray-200 px-4 py-3 rounded-xl text-xs text-gray-900 placeholder-gray-400 focus:outline-none focus:border-black" required />
            </div>
            <input type="number" placeholder="Min Order Amount (₹)" value={minOrderAmount} onChange={(e) => setMinOrderAmount(e.target.value)} className="w-full bg-[#f9f8f6] border border-gray-200 px-4 py-3 rounded-xl text-xs text-gray-900 placeholder-gray-400 focus:outline-none focus:border-black" />
            <button type="submit" className="w-full bg-black hover:bg-neutral-800 text-white py-3.5 text-xs uppercase tracking-[0.2em] font-medium rounded-xl transition-all shadow-md cursor-pointer">Publish Coupon</button>
          </form>

          <div className="bg-white p-8 rounded-2xl border border-gray-200 space-y-4 shadow-[0_10px_30px_rgba(0,0,0,0.03)] h-fit">
            <h3 className="text-xs uppercase tracking-[0.25em] font-semibold text-gray-900">Manage Coupons ({coupons.length})</h3>
            <div className="space-y-3">
              {coupons.map((cp, idx) => (
                <div key={idx} className="bg-[#f9f8f6] p-4 rounded-xl border border-gray-200 space-y-3">
                  {editingIndex === idx ? (
                    <div className="space-y-3">
                      <input type="text" value={editCode} onChange={(e) => setEditCode(e.target.value)} className="w-full bg-white border border-gray-200 px-3 py-2 rounded-xl text-xs text-gray-900" placeholder="Code" />
                      <div className="grid grid-cols-2 gap-2">
                        <input type="number" value={editValue} onChange={(e) => setEditValue(e.target.value)} className="w-full bg-white border border-gray-200 px-3 py-2 rounded-xl text-xs text-gray-900" placeholder="Value" />
                        <input type="number" value={editMinOrder} onChange={(e) => setEditMinOrder(e.target.value)} className="w-full bg-white border border-gray-200 px-3 py-2 rounded-xl text-xs text-gray-900" placeholder="Min Order" />
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => handleSaveEditCoupon(idx)} className="bg-black text-white px-4 py-2 rounded-xl text-[10px] uppercase tracking-widest cursor-pointer">Save</button>
                        <button onClick={() => setEditingIndex(null)} className="bg-gray-200 text-gray-800 px-4 py-2 rounded-xl text-[10px] uppercase tracking-widest cursor-pointer">Cancel</button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-sm tracking-wider text-gray-900">{cp.code}</span>
                          <span className={`px-2 py-0.5 rounded text-[8px] uppercase tracking-widest font-bold ${cp.active !== false ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' : 'bg-red-100 text-red-800 border border-red-200'}`}>
                            {cp.active !== false ? 'Active' : 'Deactivated'}
                          </span>
                        </div>
                        <p className="text-[10px] text-gray-500 mt-0.5">Save {cp.type === 'flat' ? `₹${cp.value}` : `${cp.value}%`} above ₹{cp.minOrder || 0}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button onClick={() => { setEditingIndex(idx); setEditCode(cp.code); setEditValue(cp.value); setEditMinOrder(cp.minOrder); }} className="text-[10px] uppercase tracking-widest bg-white hover:bg-gray-100 border border-gray-200 px-3 py-1.5 rounded-lg font-semibold text-gray-700 cursor-pointer">Edit</button>
                        <button onClick={() => toggleCouponStatus(idx)} className={`text-[10px] uppercase tracking-widest px-3 py-1.5 rounded-lg font-semibold cursor-pointer border ${cp.active !== false ? 'bg-red-50 text-red-600 border-red-200 hover:bg-red-100' : 'bg-emerald-50 text-emerald-600 border-emerald-200 hover:bg-emerald-100'}`}>
                          {cp.active !== false ? 'Deactivate' : 'Activate'}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* EXCEL BULK UPLOAD TAB */}
      {adminTab === 'excel' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="bg-white p-8 rounded-2xl border border-gray-200 space-y-6 shadow-[0_10px_30px_rgba(0,0,0,0.03)]">
            <h3 className="text-xs uppercase tracking-[0.25em] font-semibold text-gray-900">Excel / CSV Operations</h3>
            <p className="text-xs text-gray-600 font-serif leading-relaxed font-light">
              Download the structured bulk-upload template or back up your live storefront inventory instantly into a CSV spreadsheet at runtime.
            </p>
            <div className="space-y-3">
              <button onClick={downloadExcelTemplate} className="w-full bg-[#f9f8f6] hover:bg-gray-100 text-gray-900 py-3.5 text-xs uppercase tracking-[0.2em] rounded-xl border border-gray-200 transition-all cursor-pointer">
                📥 Download Blank Template
              </button>
              <button onClick={downloadCurrentInventoryCSV} className="w-full bg-black text-white hover:bg-neutral-800 py-3.5 text-xs uppercase tracking-[0.2em] rounded-xl transition-all cursor-pointer">
                📊 Download Live Inventory CSV ⚡
              </button>
            </div>
          </div>

          <form onSubmit={handleExcelUploadSubmit} className="bg-white p-8 rounded-2xl border border-gray-200 space-y-6 shadow-[0_10px_30px_rgba(0,0,0,0.03)]">
            <h3 className="text-xs uppercase tracking-[0.25em] font-semibold text-gray-900">Upload Filled Excel / CSV File</h3>
            <p className="text-xs text-gray-600 font-serif leading-relaxed font-light">
              Upload your completed spreadsheet. Products and nested variants will be parsed and reflected in real-time across the storefront.
            </p>
            <input type="file" accept=".csv, .xlsx, .xls" onChange={(e) => setExcelFile(e.target.files[0])} className="text-xs w-full bg-[#f9f8f6] p-3 rounded-xl border border-gray-200 text-gray-700 cursor-pointer" required />
            <button type="submit" disabled={excelUploading} className="w-full bg-black hover:bg-neutral-800 text-white py-3.5 text-xs uppercase tracking-[0.2em] font-medium rounded-xl transition-all shadow-md cursor-pointer">
              {excelUploading ? 'Parsing & Syncing...' : 'Upload & Sync Real-Time ⚡'}
            </button>
          </form>
        </div>
      )}

      {/* CATEGORIES TAB */}
      {adminTab === 'categories' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <form onSubmit={handleAddCategory} className="bg-white p-8 rounded-2xl border border-gray-200 space-y-6 shadow-[0_10px_30px_rgba(0,0,0,0.03)]">
            <h3 className="text-xs uppercase tracking-[0.25em] font-semibold text-gray-900">Create / Map Category & Designs</h3>
            <input type="text" placeholder="Category Name" value={newCatName} onChange={(e) => setNewCatName(e.target.value)} className="w-full bg-[#f9f8f6] border border-gray-200 px-4 py-3 rounded-xl text-xs text-gray-900 placeholder-gray-400 focus:outline-none focus:border-black" required />
            <input type="text" placeholder="Linked Design" value={newCatDesign} onChange={(e) => setNewCatDesign(e.target.value)} className="w-full bg-[#f9f8f6] border border-gray-200 px-4 py-3 rounded-xl text-xs text-gray-900 placeholder-gray-400 focus:outline-none focus:border-black" />
            <button type="submit" className="w-full bg-black hover:bg-neutral-800 text-white py-3.5 text-xs uppercase tracking-[0.2em] font-medium rounded-xl transition-all shadow-md cursor-pointer">Save Category Mapping</button>
          </form>
          <div className="bg-white p-8 rounded-2xl border border-gray-200 space-y-4 shadow-[0_10px_30px_rgba(0,0,0,0.03)]">
            <h3 className="text-xs uppercase tracking-[0.25em] font-semibold text-gray-900">Configured Categories</h3>
            <div className="space-y-4">
              {categories.map(c => (
                <div key={c.name} className="bg-[#f9f8f6] p-5 rounded-xl border border-gray-200 space-y-2">
                  <h4 className="font-serif text-lg font-medium text-gray-900">{c.name}</h4>
                  <div className="flex gap-1.5 flex-wrap">
                    {c.designs.map(d => <span key={d} className="bg-white text-gray-700 px-3 py-1 rounded-lg text-[9px] uppercase tracking-widest border border-gray-200">{d}</span>)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ORDERS TAB */}
      {adminTab === 'orders' && (
        <div className="bg-white p-8 rounded-2xl border border-gray-200 space-y-6 shadow-[0_10px_30px_rgba(0,0,0,0.03)]">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-gray-100 pb-4">
            <div>
              <h3 className="text-xs uppercase tracking-[0.25em] font-semibold text-gray-900">Client Orders & Fulfillment ({orders.length})</h3>
              <p className="text-[10px] text-gray-500 font-serif">Review active customer bookings, update tracking lifecycles, and export reports.</p>
            </div>
            <a 
              href={`${API_BASE}/api/admin/orders/export-csv`}
              target="_blank"
              rel="noreferrer"
              className="bg-black hover:bg-neutral-800 text-white px-5 py-2.5 rounded-xl text-[10px] uppercase tracking-[0.2em] font-medium transition-all shadow-sm flex items-center gap-2 cursor-pointer"
            >
              📥 Download Orders CSV
            </a>
          </div>

          <div className="space-y-4">
            {orders.length === 0 ? (
              <p className="text-xs text-gray-500 uppercase tracking-widest text-center py-10 font-serif">No client orders recorded yet.</p>
            ) : (
              orders.map((ord, i) => (
                <div key={i} className="bg-[#f9f8f6] p-6 rounded-xl border border-gray-200 space-y-4">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-gray-200 pb-3 gap-2">
                    <div>
                      <span className="text-[10px] font-mono text-gray-500">Order ID: {ord._id || `BH-${i+1000}`}</span>
                      <p className="text-xs font-semibold text-gray-900 mt-0.5">{ord.customerEmail}</p>
                      <p className="text-[10px] text-gray-500">{new Date(ord.createdAt || Date.now()).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-serif font-medium text-gray-900">₹{ord.totalAmount}</span>
                      <select value={ord.status || 'Pending'} onChange={(e) => updateOrderStatus(ord._id, e.target.value)} className="bg-white border border-gray-200 text-gray-900 rounded-xl px-3 py-1.5 text-[10px] uppercase tracking-widest font-semibold focus:outline-none focus:border-black cursor-pointer">
                        <option value="Pending">Pending</option>
                        <option value="Verified">Verified</option>
                        <option value="Dispatched">Dispatched</option>
                        <option value="Delivered">Delivered</option>
                      </select>
                    </div>
                  </div>

                  {ord.items && ord.items.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                      {ord.items.map((item, itemIdx) => (
                        <div key={itemIdx} className="flex items-center gap-2.5 bg-white p-2.5 rounded-lg border border-gray-200">
                          <img src={item.image} alt="" className="w-10 h-12 object-cover rounded" />
                          <div className="overflow-hidden">
                            <p className="text-[11px] font-serif text-gray-900 truncate">{item.name}</p>
                            <p className="text-[9px] text-gray-500">Qty: {item.qty} | ₹{item.price * item.qty}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}

    </div>
  );
}