import { useState, useEffect } from 'react';
import axios from 'axios';
import "react-responsive-carousel/lib/styles/carousel.min.css";

import { INITIAL_CATEGORIES, ADMIN_EMAILS, ADMIN_PHONES, MY_WHATSAPP_NUMBER } from './utils/constants';
import Navbar from './components/layout/Navbar';
import AuthModal from './components/common/AuthModal';
import Lightbox from './components/common/Lightbox';
import Toast from './components/common/Toast';
import CustomAlert from './components/common/CustomAlert';

import LandingView from './views/LandingView';
import StoreView from './views/StoreView';
import ProductDetailView from './views/ProductDetailView';
import CartView from './views/CartView';
import WishlistView from './views/WishlistView';
import ProfileView from './views/ProfileView';
import OrdersView from './views/OrdersView';
import AdminView from './views/AdminView';
import SupportView from './views/SupportView';

export default function App() {
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [userName, setUserName] = useState(localStorage.getItem('userName') || '');
  const [userEmail, setUserEmail] = useState(localStorage.getItem('email') || '');
  const [userPhone, setUserPhone] = useState(localStorage.getItem('phone') || '');
  
  const [hasSeenLanding, setHasSeenLanding] = useState(sessionStorage.getItem('seenLanding') === 'true');
  const [currentTab, setCurrentTab] = useState(hasSeenLanding ? 'store' : 'landing');
  
  const [showAuth, setShowAuth] = useState(false);
  const [toast, setToast] = useState(null);
  const [customAlert, setCustomAlert] = useState(null);

  const [products, setProducts] = useState([]);
  const [myOrders, setMyOrders] = useState([]);
  const [allOrders, setAllOrders] = useState([]);
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);

  const [categories, setCategories] = useState(INITIAL_CATEGORIES);
  const [coupons, setCoupons] = useState([
    { code: 'BHAIRAVI10', type: 'percentage', value: 10, minOrder: 1000, active: true },
    { code: 'ATELIER500', type: 'flat', value: 500, minOrder: 5000, active: true }
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [filterDesign, setFilterDesign] = useState('All');
  const [filterColor, setFilterColor] = useState('All');
  const [sortBy, setSortBy] = useState('default');
  const [selectedVariants, setSelectedVariants] = useState({});
  const [address, setAddress] = useState({ fullName: '', phone: '', street: '', city: '', pincode: '', state: '' });

  const [zoomImage, setZoomImage] = useState(null);
  const [detailProduct, setDetailProduct] = useState(null);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');

  const [sareeName, setSareeName] = useState('');
  const [sareeMaterial, setSareeMaterial] = useState(INITIAL_CATEGORIES[0].name);
  const [sareeDesc, setSareeDesc] = useState('');
  const [uploadVariants, setUploadVariants] = useState([
    { color: '', design: '', price: '', stockStatus: 'In Stock', images: null, video: null, videoUrl: '' }
  ]);
  const [isUploading, setIsUploading] = useState(false);

  const API_BASE = (import.meta.env?.VITE_API_URL || 'http://localhost:5000').replace(/\/$/, '');
  
  const isAdmin = userPhone === '9657127253' || ADMIN_EMAILS.includes(userEmail) || ADMIN_PHONES.includes(userPhone);

  const showAlert = (message, type = 'success') => {
    setCustomAlert({ message, type });
    setTimeout(() => setCustomAlert(null), 5000);
  };

  const triggerToast = (title, message, showViewCart = false) => {
    setToast({ title, message, showViewCart });
    setTimeout(() => setToast(null), 5000);
  };

  const fetchData = () => {
    axios.get(`${API_BASE}/api/products`)
      .then(res => {
        const formatted = res.data.map(p => ({
          ...p,
          material: p.material || INITIAL_CATEGORIES[0].name,
          variants: (p.variants && p.variants.length > 0) ? p.variants : [{
            color: 'Standard', design: 'Classic', price: p.price || 500, stockStatus: 'In Stock', images: p.images?.length > 0 ? p.images : [], videoUrl: p.videoUrl || ''
          }]
        }));
        setProducts(formatted);
      })
      .catch(err => console.error("Error fetching products:", err));

    if (userEmail || userPhone) {
      axios.get(`${API_BASE}/api/user/profile?email=${userEmail || `client_${userPhone}@bhairavithreads.com`}`)
        .then(res => { if (res.data.address) setAddress(res.data.address); })
        .catch(err => console.error(err));

      // Fetch personal user orders
      axios.get(`${API_BASE}/api/orders/user?email=${userEmail || `client_${userPhone}@bhairavithreads.com`}`)
        .then(res => setMyOrders(res.data))
        .catch(err => console.error(err));

      // Fetch global orders exclusively for admin
      if (isAdmin) {
        axios.get(`${API_BASE}/api/orders`)
          .then(res => setAllOrders(res.data))
          .catch(err => console.error(err));
      }
    }
  };

  useEffect(() => { fetchData(); }, [userEmail, userPhone]);

  const handleSuccessfulAuth = (userData) => {
    setToken(userData.token);
    setUserName(userData.name || 'Valued Patron');
    setUserEmail(userData.email || '');
    setUserPhone(userData.phone || '');

    localStorage.setItem('token', userData.token);
    localStorage.setItem('userName', userData.name || 'Valued Patron');
    localStorage.setItem('email', userData.email || '');
    localStorage.setItem('phone', userData.phone || '');

    setShowAuth(false);
    showAlert(`Welcome to Bhairavi Threads, ${userData.name || 'Patron'}!`);
  };

  return (
    <div className="bhairavi-site min-h-screen relative bg-[#000103] text-[#f8fafc]">
      <CustomAlert alertInfo={customAlert} onClose={() => setCustomAlert(null)} />

      {currentTab === 'landing' && !hasSeenLanding && !detailProduct ? (
        <LandingView 
          setCurrentTab={(tab) => { sessionStorage.setItem('seenLanding', 'true'); setHasSeenLanding(true); setCurrentTab(tab); }} 
          token={token}
          setShowAuth={setShowAuth}
        />
      ) : (
        <div className="min-h-screen pb-24 bg-[#000103] text-[#f8fafc]">
          <Navbar 
            currentTab={currentTab} 
            setCurrentTab={(tab) => { setDetailProduct(null); setCurrentTab(tab); }} 
            token={token} 
            userName={userName}
            userEmail={userEmail} 
            isAdmin={isAdmin}
            wishlistCount={wishlist.length} 
            cartCount={cart.reduce((a,b)=>a+b.qty,0)} 
            onLogout={() => { setToken(''); setUserName(''); setUserEmail(''); setUserPhone(''); localStorage.clear(); setCurrentTab('store'); setDetailProduct(null); showAlert("Logged out successfully."); }} 
            onOpenAuth={() => setShowAuth(true)} 
            onGoToLanding={() => {
              sessionStorage.removeItem('seenLanding');
              setHasSeenLanding(false);
              setCurrentTab('landing');
              setDetailProduct(null);
            }}
            categories={categories}
          />

          <main className="w-[94%] max-w-[1600px] mx-auto py-8 md:py-12">
            {detailProduct ? (
              <ProductDetailView 
                detailProduct={detailProduct} 
                setDetailProduct={setDetailProduct} 
                setCurrentTab={setCurrentTab}
                selectedVariants={selectedVariants} 
                handleVariantChange={(pId, idx) => setSelectedVariants(prev => ({ ...prev, [pId]: idx }))} 
                setZoomImage={setZoomImage} 
                addToCart={(p) => {
                  if (!token) { setShowAuth(true); return; }
                  triggerToast("Curated to Trunk", `Added ${p.name} to your trousseau.`, true);
                }} 
                reviewRating={reviewRating} 
                setReviewRating={setReviewRating} 
                reviewComment={reviewComment} 
                setReviewComment={setReviewComment} 
                handleAddReview={async (pId) => {
                  if (!token) { setShowAuth(true); return; }
                  try {
                    const res = await axios.post(`${API_BASE}/api/products/${pId}/review`, { userName, rating: reviewRating, comment: reviewComment });
                    setDetailProduct(res.data.product);
                    setReviewComment('');
                    showAlert("Review published successfully!");
                    fetchData();
                  } catch (e) { showAlert("Failed to add review.", "error"); }
                }} 
              />
            ) : currentTab === 'store' || categories.some(c => c.name === currentTab) || currentTab === 'Recently Updated' ? (
              <StoreView 
                products={currentTab === 'Recently Updated' ? [...products].sort((a, b) => new Date(b.updatedAt || 0) - new Date(a.updatedAt || 0)) : products} 
                searchQuery={searchQuery} 
                setSearchQuery={setSearchQuery} 
                filterDesign={filterDesign} 
                setFilterDesign={setFilterDesign} 
                filterColor={filterColor} 
                setFilterColor={setFilterColor} 
                sortBy={sortBy} 
                setSortBy={setSortBy} 
                selectedVariants={selectedVariants} 
                handleVariantChange={(pId, idx) => setSelectedVariants(prev => ({ ...prev, [pId]: idx }))} 
                addToCart={(p) => {
                  if (!token) { setShowAuth(true); return; }
                  const vIndex = selectedVariants[p._id] || 0;
                  const variant = p.variants[vIndex];
                  if (variant.stockStatus === 'Out of Stock') { showAlert("This variant is Out of Stock!", "error"); return; }
                  const cartKey = `${p._id}-${vIndex}`;
                  setCart(prev => {
                    const existing = prev.find(item => item.cartKey === cartKey);
                    if (existing) return prev.map(item => item.cartKey === cartKey ? { ...item, qty: item.qty + 1 } : item);
                    return [...prev, {
                      cartKey, _id: p._id, name: `${p.name} (${variant.color} - ${variant.design})`,
                      price: variant.price, image: variant.images?.[0] || 'https://via.placeholder.com/150', qty: 1
                    }];
                  });
                  triggerToast("Curated to Trunk", `Added ${p.name} to your trousseau bag.`, true);
                }} 
                wishlist={wishlist} 
                setWishlist={setWishlist} 
                setDetailProduct={setDetailProduct} 
                categories={categories}
                currentTab={currentTab}
              />
            ) : currentTab === 'cart' ? (
              <CartView cart={cart} updateQty={(cartKey, delta) => {
                setCart(prev => prev.map(item => {
                  if (item.cartKey === cartKey) {
                    const newQty = item.qty + delta;
                    return newQty > 0 ? { ...item, qty: newQty } : null;
                  }
                  return item;
                }).filter(Boolean));
              }} coupons={coupons} handleWhatsAppCheckout={async (total, code) => {
                if (!token) { setShowAuth(true); return; }
                if (cart.length === 0) { showAlert("Trunk is empty!", "error"); return; }
                try {
                  await axios.post(`${API_BASE}/api/orders`, { customerEmail: userEmail || userPhone, items: cart, totalAmount: total, shippingAddress: address });
                  fetchData();
                } catch(e) {}
                let msg = `New Order for Bhairavi Threads:\n\n*Customer:* ${userName} (${address.phone || userPhone})\n*Destination:* ${address.street || 'N/A'}, ${address.city || ''} - ${address.pincode || ''}\n*Coupon Applied:* ${code || 'None'}\n\n*Items:* \n`;
                cart.forEach((item, i) => msg += `${i+1}. ${item.name} (x${item.qty}) - ₹${item.price * item.qty}\n`);
                msg += `\n*Total Investment:* ₹${total}`;
                window.open(`https://wa.me/${MY_WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`, '_blank');
              }} address={address} setAddress={setAddress} saveAddress={async () => {
                if (!token) { setShowAuth(true); return; }
                try {
                  await axios.put(`${API_BASE}/api/user/address`, { email: userEmail || `client_${userPhone}@bhairavithreads.com`, address });
                  showAlert("Shipping address saved successfully!");
                } catch(e) { showAlert("Failed to save address.", "error"); }
              }} />
            ) : currentTab === 'profile' ? (
              <ProfileView userName={userName} userEmail={userEmail} userPhone={userPhone} address={address} setAddress={setAddress} saveAddress={async () => {
                try {
                  await axios.put(`${API_BASE}/api/user/address`, { email: userEmail || `client_${userPhone}@bhairavithreads.com`, address });
                  showAlert("Profile address updated!");
                } catch(e) { showAlert("Error updating profile.", "error"); }
              }} isAdmin={isAdmin} />
            ) : currentTab === 'my-orders' ? (
              <OrdersView myOrders={myOrders} />
            ) : currentTab === 'support' ? (
              <SupportView />
            ) : currentTab === 'admin' && isAdmin ? (
              <AdminView 
                categories={categories} setCategories={setCategories}
                coupons={coupons} setCoupons={setCoupons}
                orders={allOrders} updateOrderStatus={async (id, status) => {
                  try {
                    await axios.put(`${API_BASE}/api/orders/${id}/status`, { status });
                    showAlert("Order status updated!");
                    fetchData();
                  } catch(e) { showAlert("Status updated locally.", "error"); }
                }}
                sareeName={sareeName} setSareeName={setSareeName} 
                sareeMaterial={sareeMaterial} setSareeMaterial={setSareeMaterial} 
                sareeDesc={sareeDesc} setSareeDesc={setSareeDesc} 
                uploadVariants={uploadVariants} setUploadVariants={setUploadVariants} 
                isUploading={isUploading} handleProductUpload={async (e) => {
                  e.preventDefault();
                  if (!sareeName.trim()) { showAlert("Enter Saree Title.", "error"); return; }
                  setIsUploading(true);
                  const formData = new FormData();
                  formData.append('name', sareeName);
                  formData.append('material', sareeMaterial);
                  formData.append('description', sareeDesc);
                  const variantsMeta = uploadVariants.map(v => ({ color: v.color, design: v.design, price: Number(v.price), stockStatus: v.stockStatus, videoUrl: v.videoUrl || '' }));
                  formData.append('variantsMeta', JSON.stringify(variantsMeta));
                  uploadVariants.forEach((v, vIdx) => {
                    if (v.images) { for (let j = 0; j < v.images.length; j++) formData.append(`variantImages_${vIdx}`, v.images[j]); }
                  });
                  try {
                    await axios.post(`${API_BASE}/api/add-saree-with-variants`, formData);
                    showAlert("Saree creation published successfully!");
                    setSareeName(''); setSareeDesc('');
                    setUploadVariants([{ color: '', design: '', price: '', stockStatus: 'In Stock', images: null, video: null, videoUrl: '' }]);
                    fetchData();
                  } catch (err) { showAlert("Upload failed.", "error"); } finally { setIsUploading(false); }
                }} 
                products={products} fetchProducts={fetchData} API_BASE={API_BASE}
              />
            ) : (
              <div className="text-center py-20">
                <h3 className="text-lg font-serif">Page not found or unauthorized.</h3>
              </div>
            )}
          </main>
        </div>
      )}

      <AuthModal showAuth={showAuth} setShowAuth={setShowAuth} handleSuccessfulAuth={handleSuccessfulAuth} API_BASE={API_BASE} showAlert={showAlert} />
      <Lightbox zoomImage={zoomImage} setZoomImage={setZoomImage} />
      <Toast toast={toast} onViewCart={() => setCurrentTab('cart')} />

      <a href={`https://wa.me/${MY_WHATSAPP_NUMBER}?text=Hello%20Bhairavi%20Threads!`} target="_blank" rel="noreferrer" className="fixed bottom-6 right-6 bg-emerald-600 text-white px-6 py-4 rounded-full shadow-2xl z-[70] font-semibold text-xs uppercase tracking-widest flex items-center gap-2.5 transition-all hover:scale-105 border border-emerald-400/40">
        💬 WhatsApp Support
      </a>
    </div>
  );
}