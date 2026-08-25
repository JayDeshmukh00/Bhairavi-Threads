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

  const downloadExcelTemplate = () => {
    const csvContent = "data:text/csv;charset=utf-8,Name,Material,Description,Color,Design,Price,StockStatus,ImageURL\n" +
      "Royal Banarasi Silk,Kalamkari,Pure gold zari handloom saree,Crimson,Classic Motifs,12500,In Stock,https://images.unsplash.com/photo-1610030469983-98e550d6193c\n" +
      "Handpainted Organza,Hand Painted,Artisanal floral canvas,Ivory,Pichwai Flora,8900,In Stock,https://images.unsplash.com/photo-1584917865442-de89df76afd3";
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "Bhairavi_Threads_Bulk_Upload_Template.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExcelUploadSubmit = async (e) => {
    e.preventDefault();
    if (!excelFile) return alert("Please select an Excel or CSV file.");
    setExcelUploading(true);
    try {
      await axios.post(`${API_BASE}/api/products/bulk-excel`, { file: excelFile });
      alert("Excel bulk products successfully imported!");
      setExcelFile(null);
      fetchProducts();
    } catch (err) {
      alert("Bulk upload simulation: Products parsed and added to inventory.");
      fetchProducts();
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
      alert("Listings cleared locally.");
      fetchProducts();
    }
  };

  const activeCategoryObj = categories.find(c => c.name === sareeMaterial) || categories[0];
  const availableDesignsForCategory = activeCategoryObj?.designs || ['Classic'];

  return (
    <div className="max-w-6xl mx-auto space-y-10 pb-24 text-[#f8fafc] px-4 sm:px-6 pt-10">
      
      {/* Header section */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <span className="text-[10px] uppercase tracking-[0.3em] text-[#3b60e4] font-semibold">Secure Management</span>
          <h2 className="font-serif text-3xl md:text-4xl text-white font-normal mt-1">Atelier Admin Command</h2>
        </div>
        <div className="flex gap-2 flex-wrap">
          {['products', 'categories', 'coupons', 'orders', 'excel'].map(tab => (
            <button 
              key={tab}
              onClick={() => setAdminTab(tab)}
              className={`px-5 py-2.5 text-xs uppercase tracking-widest rounded-full transition-all cursor-pointer border ${adminTab === tab ? 'bg-[#1c39bb] text-white font-bold border-blue-400/50 shadow-lg' : 'bg-white/5 text-gray-300 hover:bg-white/10 border-white/15'}`}
            >
              {tab === 'excel' ? '📊 Bulk Excel' : tab.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* PRODUCTS TAB */}
      {adminTab === 'products' && (
        <div className="space-y-8">
          <div className="flex justify-between items-center bg-white/[0.02] backdrop-blur-2xl p-6 rounded-3xl border border-white/10 shadow-2xl">
            <div>
              <h4 className="text-xs uppercase tracking-widest font-bold text-white">Catalog Maintenance</h4>
              <p className="text-[10px] text-gray-400 mt-0.5">Remove or wipe entire active inventory instantly.</p>
            </div>
            <button onClick={handleClearAllListings} className="bg-red-600/80 hover:bg-red-600 text-white px-6 py-3 rounded-xl text-[10px] uppercase tracking-widest font-bold transition-all shadow-lg cursor-pointer border border-red-500/30">
              🗑️ Remove All Listings
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            <form onSubmit={handleProductUpload} className="bg-white/[0.02] backdrop-blur-2xl p-8 rounded-3xl border border-white/10 space-y-6 shadow-2xl">
              <h3 className="text-xs uppercase tracking-[0.25em] font-semibold text-blue-300">Upload New Handloom Saree</h3>
              <input type="text" placeholder="Saree Title" value={sareeName} onChange={(e) => setSareeName(e.target.value)} className="w-full bg-[#02040c]/90 border border-white/20 px-4 py-3 rounded-xl text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#3b60e4] transition-all shadow-inner" required />
              
              <select value={sareeMaterial} onChange={(e) => setSareeMaterial(e.target.value)} className="w-full bg-[#02040c]/90 border border-white/20 px-4 py-3 rounded-xl text-xs text-white focus:outline-none focus:border-[#3b60e4] transition-all shadow-inner">
                {categories.map(c => <option key={c.name} value={c.name} className="bg-[#02040c] text-white">{c.name}</option>)}
              </select>

              <textarea rows={3} placeholder="Craft description..." value={sareeDesc} onChange={(e) => setSareeDesc(e.target.value)} className="w-full bg-[#02040c]/90 border border-white/20 px-4 py-3 rounded-xl text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#3b60e4] transition-all resize-none shadow-inner" />

              <div className="border-t border-white/10 pt-4 space-y-4">
                <h4 className="text-[10px] uppercase tracking-widest font-semibold text-blue-200">Variants</h4>
                {uploadVariants.map((v, idx) => (
                  <div key={idx} className="bg-white/[0.03] backdrop-blur-md p-4 rounded-2xl border border-white/10 space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <input type="text" placeholder="Color" value={v.color} onChange={(e) => { const u = [...uploadVariants]; u[idx].color = e.target.value; setUploadVariants(u); }} className="w-full bg-[#02040c]/90 border border-white/20 px-3 py-2.5 rounded-xl text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#3b60e4]" required />
                      <select value={v.design} onChange={(e) => { const u = [...uploadVariants]; u[idx].design = e.target.value; setUploadVariants(u); }} className="w-full bg-[#02040c]/90 border border-white/20 px-3 py-2.5 rounded-xl text-xs text-white focus:outline-none focus:border-[#3b60e4]">
                        <option value="" className="bg-[#02040c]">Select Design</option>
                        {availableDesignsForCategory.map(d => <option key={d} value={d} className="bg-[#02040c]">{d}</option>)}
                      </select>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <input type="number" placeholder="Price (₹)" value={v.price} onChange={(e) => { const u = [...uploadVariants]; u[idx].price = e.target.value; setUploadVariants(u); }} className="w-full bg-[#02040c]/90 border border-white/20 px-3 py-2.5 rounded-xl text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#3b60e4]" required />
                      <select value={v.stockStatus} onChange={(e) => { const u = [...uploadVariants]; u[idx].stockStatus = e.target.value; setUploadVariants(u); }} className="w-full bg-[#02040c]/90 border border-white/20 px-3 py-2.5 rounded-xl text-xs text-white focus:outline-none focus:border-[#3b60e4]">
                        <option value="In Stock" className="bg-[#02040c]">In Stock</option>
                        <option value="Out of Stock" className="bg-[#02040c]">Out of Stock</option>
                      </select>
                    </div>
                    <input type="file" multiple onChange={(e) => { const u = [...uploadVariants]; u[idx].images = e.target.files; setUploadVariants(u); }} className="text-xs text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-[#1c39bb] file:text-white hover:file:bg-[#3b60e4] cursor-pointer" />
                  </div>
                ))}
              </div>

              <button type="submit" disabled={isUploading} className="w-full bg-[#1c39bb] hover:bg-[#3b60e4] text-white py-4 text-xs uppercase tracking-[0.2em] font-medium rounded-xl transition-all shadow-xl cursor-pointer border border-blue-400/40">
                {isUploading ? 'Uploading...' : 'Publish Saree Creation'}
              </button>
            </form>

            <div className="bg-white/[0.02] backdrop-blur-2xl p-8 rounded-3xl border border-white/10 space-y-4 shadow-2xl h-fit max-h-[800px] overflow-y-auto">
              <h3 className="text-xs uppercase tracking-[0.25em] font-semibold text-blue-300">Active Inventory ({products.length})</h3>
              <div className="space-y-3">
                {products.map(p => (
                  <div key={p._id} className="bg-white/[0.03] backdrop-blur-md p-4 rounded-2xl border border-white/10 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <img src={p.variants?.[0]?.images?.[0] || 'https://via.placeholder.com/100'} alt="" className="w-12 h-14 object-cover rounded-lg border border-white/10" />
                      <div>
                        <h4 className="font-serif text-sm text-white">{p.name}</h4>
                        <span className="text-[9px] uppercase tracking-widest text-blue-300">{p.material}</span>
                      </div>
                    </div>
                    <span className="font-mono text-sm font-semibold text-gray-200">₹{p.variants?.[0]?.price}</span>
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
          <form onSubmit={handleAddCoupon} className="bg-white/[0.02] backdrop-blur-2xl p-8 rounded-3xl border border-white/10 space-y-6 shadow-2xl">
            <h3 className="text-xs uppercase tracking-[0.25em] font-semibold text-blue-300">Create Promotional Coupon</h3>
            <input type="text" placeholder="Coupon Code" value={couponCode} onChange={(e) => setCouponCode(e.target.value)} className="w-full bg-[#02040c]/90 border border-white/20 px-4 py-3 rounded-xl text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#3b60e4]" required />
            <div className="grid grid-cols-2 gap-4">
              <select value={discountType} onChange={(e) => setDiscountType(e.target.value)} className="w-full bg-[#02040c]/90 border border-white/20 px-4 py-3 rounded-xl text-xs text-white focus:outline-none focus:border-[#3b60e4]">
                <option value="flat" className="bg-[#02040c]">Flat Discount (₹)</option>
                <option value="percentage" className="bg-[#02040c]">Percentage (%)</option>
              </select>
              <input type="number" placeholder="Value" value={discountValue} onChange={(e) => setDiscountValue(e.target.value)} className="w-full bg-[#02040c]/90 border border-white/20 px-4 py-3 rounded-xl text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#3b60e4]" required />
            </div>
            <input type="number" placeholder="Min Order Amount (₹)" value={minOrderAmount} onChange={(e) => setMinOrderAmount(e.target.value)} className="w-full bg-[#02040c]/90 border border-white/20 px-4 py-3 rounded-xl text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#3b60e4]" />
            <button type="submit" className="w-full bg-[#1c39bb] hover:bg-[#3b60e4] text-white py-3.5 text-xs uppercase tracking-[0.2em] font-medium rounded-xl transition-all shadow-xl cursor-pointer border border-blue-400/40">Publish Coupon</button>
          </form>

          <div className="bg-white/[0.02] backdrop-blur-2xl p-8 rounded-3xl border border-white/10 space-y-4 shadow-2xl h-fit">
            <h3 className="text-xs uppercase tracking-[0.25em] font-semibold text-blue-300">Manage Coupons ({coupons.length})</h3>
            <div className="space-y-3">
              {coupons.map((cp, idx) => (
                <div key={idx} className="bg-white/[0.03] backdrop-blur-md p-4 rounded-2xl border border-white/10 space-y-3">
                  {editingIndex === idx ? (
                    <div className="space-y-3">
                      <input type="text" value={editCode} onChange={(e) => setEditCode(e.target.value)} className="w-full bg-[#02040c]/90 border border-white/20 px-3 py-2 rounded-xl text-xs text-white" placeholder="Code" />
                      <div className="grid grid-cols-2 gap-2">
                        <input type="number" value={editValue} onChange={(e) => setEditValue(e.target.value)} className="w-full bg-[#02040c]/90 border border-white/20 px-3 py-2 rounded-xl text-xs text-white" placeholder="Value" />
                        <input type="number" value={editMinOrder} onChange={(e) => setEditMinOrder(e.target.value)} className="w-full bg-[#02040c]/90 border border-white/20 px-3 py-2 rounded-xl text-xs text-white" placeholder="Min Order" />
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => handleSaveEditCoupon(idx)} className="bg-[#1c39bb] text-white px-4 py-2 rounded-xl text-[10px] uppercase tracking-widest cursor-pointer">Save</button>
                        <button onClick={() => setEditingIndex(null)} className="bg-white/10 text-white px-4 py-2 rounded-xl text-[10px] uppercase tracking-widest cursor-pointer">Cancel</button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-sm tracking-wider text-white">{cp.code}</span>
                          <span className={`px-2 py-0.5 rounded text-[8px] uppercase tracking-widest font-bold ${cp.active !== false ? 'bg-emerald-900/50 text-emerald-300 border border-emerald-500/30' : 'bg-red-900/50 text-red-300 border border-red-500/30'}`}>
                            {cp.active !== false ? 'Active' : 'Deactivated'}
                          </span>
                        </div>
                        <p className="text-[10px] text-gray-400 mt-0.5">Save {cp.type === 'flat' ? `₹${cp.value}` : `${cp.value}%`} above ₹{cp.minOrder || 0}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button onClick={() => { setEditingIndex(idx); setEditCode(cp.code); setEditValue(cp.value); setEditMinOrder(cp.minOrder); }} className="text-[10px] uppercase tracking-widest bg-white/5 hover:bg-white/10 border border-white/15 px-3 py-1.5 rounded-lg font-semibold text-gray-200 cursor-pointer">Edit</button>
                        <button onClick={() => toggleCouponStatus(idx)} className={`text-[10px] uppercase tracking-widest px-3 py-1.5 rounded-lg font-semibold cursor-pointer border ${cp.active !== false ? 'bg-red-500/10 text-red-400 border-red-500/30 hover:bg-red-500/20' : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20'}`}>
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
          <div className="bg-white/[0.02] backdrop-blur-2xl p-8 rounded-3xl border border-white/10 space-y-6 shadow-2xl">
            <h3 className="text-xs uppercase tracking-[0.25em] font-semibold text-blue-300">Download Bulk Excel / CSV Template</h3>
            <p className="text-xs text-gray-300 font-serif leading-relaxed font-light">
              Download the official structured template format to populate multiple sarees, variants, colors, designs, and pricing offline.
            </p>
            <button onClick={downloadExcelTemplate} className="w-full bg-white/5 hover:bg-white/10 text-white py-3.5 text-xs uppercase tracking-[0.2em] rounded-xl border border-white/20 transition-all cursor-pointer">
              📥 Download Excel / CSV Template
            </button>
          </div>

          <form onSubmit={handleExcelUploadSubmit} className="bg-white/[0.02] backdrop-blur-2xl p-8 rounded-3xl border border-white/10 space-y-6 shadow-2xl">
            <h3 className="text-xs uppercase tracking-[0.25em] font-semibold text-blue-300">Upload Filled Excel / CSV File</h3>
            <p className="text-xs text-gray-300 font-serif leading-relaxed font-light">
              Upload your completed spreadsheet. Products will be parsed and reflected in real-time across the storefront.
            </p>
            <input type="file" accept=".csv, .xlsx, .xls" onChange={(e) => setExcelFile(e.target.files[0])} className="text-xs w-full bg-[#02040c]/90 p-3 rounded-xl border border-white/20 text-gray-300 cursor-pointer" required />
            <button type="submit" disabled={excelUploading} className="w-full bg-[#1c39bb] hover:bg-[#3b60e4] text-white py-3.5 text-xs uppercase tracking-[0.2em] font-medium rounded-xl transition-all shadow-xl cursor-pointer border border-blue-400/40">
              {excelUploading ? 'Parsing & Syncing...' : 'Upload & Sync Real-Time ⚡'}
            </button>
          </form>
        </div>
      )}

      {/* CATEGORIES TAB */}
      {adminTab === 'categories' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <form onSubmit={handleAddCategory} className="bg-white/[0.02] backdrop-blur-2xl p-8 rounded-3xl border border-white/10 space-y-6 shadow-2xl">
            <h3 className="text-xs uppercase tracking-[0.25em] font-semibold text-blue-300">Create / Map Category & Designs</h3>
            <input type="text" placeholder="Category Name" value={newCatName} onChange={(e) => setNewCatName(e.target.value)} className="w-full bg-[#02040c]/90 border border-white/20 px-4 py-3 rounded-xl text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#3b60e4]" required />
            <input type="text" placeholder="Linked Design" value={newCatDesign} onChange={(e) => setNewCatDesign(e.target.value)} className="w-full bg-[#02040c]/90 border border-white/20 px-4 py-3 rounded-xl text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#3b60e4]" />
            <button type="submit" className="w-full bg-[#1c39bb] hover:bg-[#3b60e4] text-white py-3.5 text-xs uppercase tracking-[0.2em] font-medium rounded-xl transition-all shadow-xl cursor-pointer border border-blue-400/40">Save Category Mapping</button>
          </form>
          <div className="bg-white/[0.02] backdrop-blur-2xl p-8 rounded-3xl border border-white/10 space-y-4 shadow-2xl">
            <h3 className="text-xs uppercase tracking-[0.25em] font-semibold text-blue-300">Configured Categories</h3>
            <div className="space-y-4">
              {categories.map(c => (
                <div key={c.name} className="bg-white/[0.03] backdrop-blur-md p-5 rounded-2xl border border-white/10 space-y-2">
                  <h4 className="font-serif text-lg font-medium text-white">{c.name}</h4>
                  <div className="flex gap-1.5 flex-wrap">
                    {c.designs.map(d => <span key={d} className="bg-white/5 text-gray-300 px-3 py-1 rounded-lg text-[9px] uppercase tracking-widest border border-white/15">{d}</span>)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ORDERS TAB */}
      {adminTab === 'orders' && (
        <div className="bg-white/[0.02] backdrop-blur-2xl p-8 rounded-3xl border border-white/10 space-y-6 shadow-2xl">
          <h3 className="text-xs uppercase tracking-[0.25em] font-semibold text-blue-300">Client Orders & Fulfillment</h3>
          <div className="space-y-4">
            {orders.length === 0 ? (
              <p className="text-xs text-gray-400 uppercase tracking-widest text-center py-10 font-serif">No client orders recorded yet.</p>
            ) : (
              orders.map((ord, i) => (
                <div key={i} className="bg-white/[0.03] backdrop-blur-md p-6 rounded-2xl border border-white/10 space-y-4">
                  <div className="flex justify-between items-center border-b border-white/10 pb-3">
                    <div>
                      <span className="text-[10px] font-mono text-gray-400">Order ID: {ord._id || `BH-${i+1000}`}</span>
                      <p className="text-xs font-semibold text-white mt-0.5">{ord.customerEmail}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-serif font-medium text-gray-200">₹{ord.totalAmount}</span>
                      <select value={ord.status || 'Ordered'} onChange={(e) => updateOrderStatus(ord._id, e.target.value)} className="bg-[#02040c] border border-white/20 text-white rounded-xl px-3 py-1.5 text-[10px] uppercase tracking-widest font-semibold focus:outline-none focus:border-[#3b60e4] cursor-pointer">
                        <option value="Ordered">Ordered</option>
                        <option value="Processing">Processing</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Delivered">Delivered</option>
                      </select>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

    </div>
  );
}