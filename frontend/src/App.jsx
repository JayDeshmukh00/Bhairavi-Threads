import { useState, useEffect } from 'react';
import axios from 'axios';
import "react-responsive-carousel/lib/styles/carousel.min.css";

import { collectionsList, MY_WHATSAPP_NUMBER, CATEGORIES } from './utils/constants';
import AuthModal from './components/common/AuthModal';
import Lightbox from './components/common/Lightbox';
import Navbar from './components/layout/Navbar';
import LandingView from './views/LandingView';
import StoreView from './views/StoreView';
import ProductDetailView from './views/ProductDetailView';
import CartView from './views/CartView';
import WishlistView from './views/WishlistView';
import ProfileView from './views/ProfileView';
import OrdersView from './views/OrdersView';
import AdminView from './views/AdminView';

export default function App() {
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [userEmail, setUserEmail] = useState(localStorage.getItem('email') || '');
  
  // Show landing page only if session storage doesn't mark it as seen
  const [hasSeenLanding, setHasSeenLanding] = useState(sessionStorage.getItem('seenLanding') === 'true');
  const [currentTab, setCurrentTab] = useState(hasSeenLanding ? 'store' : 'landing');
  
  const [isLoginView, setIsLoginView] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showAuth, setShowAuth] = useState(false);

  const [products, setProducts] = useState([]);
  const [myOrders, setMyOrders] = useState([]);
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);

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
  const [sareeMaterial, setSareeMaterial] = useState('Cotton');
  const [sareeDesc, setSareeDesc] = useState('');
  const [uploadVariants, setUploadVariants] = useState([
    { color: '', design: '', price: '', stockStatus: 'In Stock', images: null, video: null, videoUrl: '' }
  ]);
  const [excelFile, setExcelFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [activeTechnique, setActiveTechnique] = useState(collectionsList[0]);

  const API_BASE = (import.meta.env?.VITE_API_URL || 'http://localhost:5000').replace(/\/$/, '');

  const fetchData = () => {
    axios.get(`${API_BASE}/api/products`)
      .then(res => {
        const formatted = res.data.map(p => ({
          ...p,
          material: p.material || 'Cotton',
          variants: (p.variants && p.variants.length > 0) ? p.variants : [{
            color: 'Standard', design: 'Classic', price: p.price || 500, stockStatus: 'In Stock', images: p.images?.length > 0 ? p.images : [], videoUrl: p.videoUrl || ''
          }]
        }));
        setProducts(formatted);
      })
      .catch(err => console.error("Error fetching products:", err));

    if (userEmail) {
      axios.get(`${API_BASE}/api/user/profile?email=${userEmail}`)
        .then(res => { if (res.data.address) setAddress(res.data.address); })
        .catch(err => console.error(err));

      axios.get(`${API_BASE}/api/orders/user?email=${userEmail}`)
        .then(res => setMyOrders(res.data))
        .catch(err => console.error(err));
    }
  };

  useEffect(() => { fetchData(); }, [userEmail]);

  const handleEnterStore = (tab = 'store') => {
    sessionStorage.setItem('seenLanding', 'true');
    setHasSeenLanding(true);
    setCurrentTab(tab);
  };

  const handleVariantChange = (productId, index) => {
    setSelectedVariants(prev => ({ ...prev, [productId]: index }));
  };

  const saveAddress = async (e) => {
    e.preventDefault();
    if (!token) { alert("Please log in."); setCurrentTab('store'); return; }
    try {
      await axios.put(`${API_BASE}/api/user/address`, { email: userEmail, address });
      alert("Shipping address saved successfully!");
    } catch (err) { alert("Failed to save address."); }
  };

  const handleAddReview = async (productId) => {
    if (!token) { alert("Please log in."); setShowAuth(true); return; }
    if (!reviewComment.trim()) return alert("Please enter a review comment.");
    try {
      const res = await axios.post(`${API_BASE}/api/products/${productId}/review`, {
        userName: userEmail.split('@')[0], rating: reviewRating, comment: reviewComment
      });
      alert("Review added successfully!");
      setDetailProduct(res.data.product);
      setReviewComment('');
      fetchData();
    } catch (err) { alert("Failed to add review."); }
  };

  const addToCart = (product) => {
    if (!token) { alert("Please log in first."); setShowAuth(true); return; }
    const vIndex = selectedVariants[product._id] || 0;
    const variant = product.variants[vIndex];
    if (variant.stockStatus === 'Out of Stock') return alert("This variant is Out of Stock!");

    const cartItemKey = `${product._id}-${vIndex}`;
    setCart(prev => {
      const existing = prev.find(item => item.cartKey === cartItemKey);
      if (existing) return prev.map(item => item.cartKey === cartItemKey ? { ...item, qty: item.qty + 1 } : item);
      return [...prev, {
        cartKey: cartItemKey, _id: product._id, name: `${product.name} (${variant.color} - ${variant.design})`,
        price: variant.price, image: variant.images?.[0] || 'https://via.placeholder.com/150', qty: 1
      }];
    });
    alert("Added variant to bag!");
  };

  const updateQty = (cartKey, delta) => {
    setCart(prev => prev.map(item => {
      if (item.cartKey === cartKey) {
        const newQty = item.qty + delta;
        return newQty > 0 ? { ...item, qty: newQty } : null;
      }
      return item;
    }).filter(Boolean));
  };

  const handleWhatsAppCheckout = async () => {
    if (!token) { setShowAuth(true); return; }
    if (cart.length === 0) return alert("Bag is empty!");
    const total = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
    try {
      await axios.post(`${API_BASE}/api/orders`, { customerEmail: userEmail, items: cart, totalAmount: total, shippingAddress: address });
      fetchData();
    } catch (e) { console.error(e); }

    let msg = `New Order for Bhairavi Threads:\n\n*Customer Address:* ${address.fullName || userEmail}, ${address.street || 'N/A'}, ${address.city || ''} - ${address.pincode || ''}\n\n*Items:* \n`;
    cart.forEach((item, i) => msg += `${i+1}. ${item.name} (x${item.qty}) - ₹${item.price * item.qty}\n`);
    msg += `\nTotal: ₹${total}`;
    window.open(`https://wa.me/${MY_WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  const handleAuth = async (e) => {
    e.preventDefault();
    const endpoint = isLoginView ? '/api/login' : '/api/signup';
    try {
      const res = await axios.post(`${API_BASE}${endpoint}`, { email, password });
      if (isLoginView) {
        setToken(res.data.token); setUserEmail(email);
        localStorage.setItem('token', res.data.token); localStorage.setItem('email', email);
        setShowAuth(false); setCurrentTab('store');
      } else {
        setIsLoginView(true); setPassword(''); alert("Account created! Please log in.");
      }
    } catch (err) { alert("Authentication failed."); }
  };

  const handleProductUpload = async (e) => {
    e.preventDefault();
    if (!sareeName.trim()) return alert("Enter Saree Name.");
    setIsUploading(true);
    const formData = new FormData();
    formData.append('name', sareeName); formData.append('material', sareeMaterial); formData.append('description', sareeDesc);
    const variantsMeta = uploadVariants.map(v => ({ color: v.color, design: v.design, price: Number(v.price), stockStatus: v.stockStatus, videoUrl: v.videoUrl || '' }));
    formData.append('variantsMeta', JSON.stringify(variantsMeta));

    uploadVariants.forEach((v, vIdx) => {
      if (v.images) { for (let j = 0; j < v.images.length; j++) formData.append(`variantImages_${vIdx}`, v.images[j]); }
      if (v.video) formData.append(`variantVideo_${vIdx}`, v.video);
    });

    try {
      await axios.post(`${API_BASE}/api/add-saree-with-variants`, formData);
      alert("Saree uploaded successfully!");
      setSareeName(''); setSareeDesc('');
      setUploadVariants([{ color: '', design: '', price: '', stockStatus: 'In Stock', images: null, video: null, videoUrl: '' }]);
      fetchData();
    } catch (err) { alert("Upload failed."); } finally { setIsUploading(false); }
  };

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.material.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategoryNavbar = currentTab === 'Recently Updated' 
      ? true 
      : CATEGORIES.includes(currentTab) 
        ? p.material === currentTab 
        : true;
    const matchesDesign = filterDesign === 'All' || p.variants?.some(v => v.design === filterDesign);
    const matchesColor = filterColor === 'All' || p.variants?.some(v => v.color === filterColor);
    return matchesSearch && matchesCategoryNavbar && matchesDesign && matchesColor;
  });

  const displayedProducts = currentTab === 'Recently Updated'
    ? [...filteredProducts].sort((a, b) => new Date(b.updatedAt || 0) - new Date(a.updatedAt || 0))
    : filteredProducts;

  return (
    <div className="bhairavi-site min-h-screen relative bg-white text-[#1a1a1a]">
      {currentTab === 'landing' && !hasSeenLanding && !detailProduct ? (
        <LandingView 
          setCurrentTab={handleEnterStore} 
          token={token}
          setIsLoginView={setIsLoginView}
          setShowAuth={setShowAuth}
          activeTechnique={activeTechnique} 
          setActiveTechnique={setActiveTechnique} 
        />
      ) : (
        <div className="min-h-screen pb-24 bg-white text-[#1a1a1a]">
          <Navbar 
            currentTab={currentTab} 
            setCurrentTab={(tab) => { setDetailProduct(null); setCurrentTab(tab); }} 
            token={token} 
            userEmail={userEmail} 
            wishlistCount={wishlist.length} 
            cartCount={cart.reduce((a,b)=>a+b.qty,0)} 
            onLogout={() => { setToken(''); setUserEmail(''); localStorage.clear(); setCurrentTab('store'); setDetailProduct(null); }} 
            onOpenAuth={() => { setIsLoginView(true); setShowAuth(true); }} 
            onGoToLanding={() => {
              sessionStorage.removeItem('seenLanding');
              setHasSeenLanding(false);
              setCurrentTab('landing');
              setDetailProduct(null);
            }}
          />

          {/* Professional Fluid Widescreen Container */}
          <main className="w-[94%] max-w-[1600px] mx-auto py-8 md:py-12">
            {detailProduct ? (
              <ProductDetailView 
                detailProduct={detailProduct} 
                setDetailProduct={setDetailProduct} 
                setCurrentTab={setCurrentTab}
                selectedVariants={selectedVariants} 
                handleVariantChange={handleVariantChange} 
                setZoomImage={setZoomImage} 
                addToCart={addToCart} 
                reviewRating={reviewRating} 
                setReviewRating={setReviewRating} 
                reviewComment={reviewComment} 
                setReviewComment={setReviewComment} 
                handleAddReview={handleAddReview} 
              />
            ) : currentTab === 'store' || CATEGORIES.includes(currentTab) || currentTab === 'Recently Updated' ? (
              <StoreView 
                products={displayedProducts} 
                searchQuery={searchQuery} 
                setSearchQuery={setSearchQuery} 
                filterDesign={filterDesign} 
                setFilterDesign={setFilterDesign} 
                filterColor={filterColor} 
                setFilterColor={setFilterColor} 
                sortBy={sortBy} 
                setSortBy={setSortBy} 
                selectedVariants={selectedVariants} 
                handleVariantChange={handleVariantChange} 
                addToCart={addToCart} 
                wishlist={wishlist} 
                setWishlist={setWishlist} 
                setDetailProduct={setDetailProduct} 
              />
            ) : currentTab === 'cart' ? (
              <CartView cart={cart} updateQty={updateQty} handleWhatsAppCheckout={handleWhatsAppCheckout} address={address} setAddress={setAddress} saveAddress={saveAddress} />
            ) : currentTab === 'wishlist' ? (
              <WishlistView products={products} wishlist={wishlist} setWishlist={setWishlist} addToCart={addToCart} setDetailProduct={setDetailProduct} />
            ) : currentTab === 'profile' ? (
              <ProfileView userEmail={userEmail} address={address} setAddress={setAddress} saveAddress={saveAddress} />
            ) : currentTab === 'my-orders' ? (
              <OrdersView myOrders={myOrders} />
            ) : currentTab === 'admin' ? (
              <AdminView 
                sareeName={sareeName} 
                setSareeName={setSareeName} 
                sareeMaterial={sareeMaterial} 
                setSareeMaterial={setSareeMaterial} 
                sareeDesc={sareeDesc} 
                setSareeDesc={setSareeDesc} 
                uploadVariants={uploadVariants} 
                setUploadVariants={setUploadVariants} 
                excelFile={excelFile} 
                setExcelFile={setExcelFile} 
                isUploading={isUploading} 
                handleProductUpload={handleProductUpload} 
                products={products}
                fetchProducts={fetchData}
              />
            ) : null}
          </main>
        </div>
      )}

      <AuthModal showAuth={showAuth} setShowAuth={setShowAuth} isLoginView={isLoginView} setIsLoginView={setIsLoginView} handleAuth={handleAuth} email={email} setEmail={setEmail} password={password} setPassword={setPassword} />
      <Lightbox zoomImage={zoomImage} setZoomImage={setZoomImage} />

      <a href={`https://wa.me/${MY_WHATSAPP_NUMBER}?text=Hello Bhairavi Threads!`} target="_blank" rel="noreferrer" className="fixed bottom-6 right-6 bg-[#2fae60] text-white px-6 py-4 rounded-full shadow-2xl z-[65] font-semibold text-xs uppercase tracking-widest flex items-center gap-2.5 transition-all hover:scale-105">
        💬 Chat with us
      </a>
    </div>
  );
}