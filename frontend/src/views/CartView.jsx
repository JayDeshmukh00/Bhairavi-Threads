import { useState } from 'react';
import axios from 'axios';
import { ui } from '../utils/constants';

export default function CartView({ 
  cart, updateQty, coupons, 
  handleWhatsAppCheckout, 
  address, setAddress, saveAddress,
  products, setDetailProduct 
}) {
  const [paymentMethod, setPaymentMethod] = useState('whatsapp');
  const [enteredCoupon, setEnteredCoupon] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState(0);
  const [appliedCouponCode, setAppliedCouponCode] = useState('');
  const [celebrationMsg, setCelebrationMsg] = useState('');

  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
  const finalTotal = Math.max(0, subtotal - appliedDiscount);

  const applyCoupon = (codeToApply) => {
    const code = (codeToApply || enteredCoupon).toUpperCase().trim();
    const found = coupons.find(c => c.code === code);
    
    if (!found) return alert("Invalid promotional coupon code.");
    if (found.active === false) return alert("This promotional coupon has been deactivated by the administrator.");
    if (subtotal < (found.minOrder || 0)) return alert(`Minimum order of ₹${found.minOrder} required for this coupon.`);

    let amt = found.type === 'flat' ? found.value : (subtotal * found.value) / 100;
    amt = Math.min(amt, subtotal);
    setDiscountState(amt, found.code);
  };

  const setDiscountState = (amt, code) => {
    setAppliedDiscount(amt);
    setAppliedCouponCode(code);
    setCelebrationMsg(`🎉 Congratulations! You just saved ₹${amt} with code ${code}!`);
    setTimeout(() => setCelebrationMsg(''), 6000);
  };

  const handleUPIPayment = () => {
    if (cart.length === 0) return alert("Trunk is empty.");
    const upiID = "bhairavithreads@upi";
    const upiLink = `upi://pay?pa=${upiID}&pn=Bhairavi%20Threads&am=${finalTotal}&cu=INR&tn=Trousseau%20Payment`;
    window.location.href = upiLink;
  };

  const handleItemClick = (productId) => {
    const foundProduct = products.find(p => p._id === productId);
    if (foundProduct && setDetailProduct) {
      setDetailProduct(foundProduct);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-12 pb-28 text-[#111111] px-4 sm:px-6 pt-10">
      <div className="space-y-2 border-b border-gray-200 pb-6 text-center">
        <span className="text-[10px] uppercase tracking-[0.3em] text-gray-500 font-semibold block">Atelier Selection</span>
        <h2 className="font-serif text-3xl md:text-5xl text-gray-900 font-normal tracking-wide">Your Curated Trunk</h2>
      </div>

      {celebrationMsg && (
        <div className="bg-black text-white p-4 rounded-2xl text-center text-xs uppercase tracking-widest font-bold shadow-md animate-bounce border border-gray-800">
          {celebrationMsg}
        </div>
      )}

      {cart.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-gray-200 space-y-4 shadow-[0_10px_30px_rgba(0,0,0,0.03)]">
          <p className="text-xs uppercase tracking-[0.2em] text-gray-500 font-serif">Your trousseau trunk is currently empty.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="md:col-span-2 space-y-6">
            {cart.map(item => (
              <div 
                key={item.cartKey} 
                onClick={() => handleItemClick(item._id)}
                className="flex gap-6 items-center bg-white p-5 rounded-2xl border border-gray-200 shadow-[0_10px_30px_rgba(0,0,0,0.03)] cursor-pointer hover:border-black transition-all group"
              >
                <img src={item.image} alt={item.name} className="w-20 h-24 object-cover rounded-xl border border-gray-200" />
                <div className="flex-grow space-y-1">
                  <h4 className="font-serif text-lg tracking-wide text-gray-900 group-hover:underline">{item.name}</h4>
                  <p className="text-xs font-serif font-medium text-gray-600">₹{item.price}</p>
                </div>
                <div className="flex items-center gap-3" onClick={(e) => e.stopPropagation()}>
                  <button onClick={() => updateQty(item.cartKey, -1)} className="w-8 h-8 bg-gray-100 border border-gray-200 rounded-full flex items-center justify-center text-xs text-gray-800 hover:bg-black hover:text-white transition-all cursor-pointer">-</button>
                  <span className="text-xs font-semibold text-gray-900">{item.qty}</span>
                  <button onClick={() => updateQty(item.cartKey, 1)} className="w-8 h-8 bg-gray-100 border border-gray-200 rounded-full flex items-center justify-center text-xs text-gray-800 hover:bg-black hover:text-white transition-all cursor-pointer">+</button>
                </div>
              </div>
            ))}

            <div className="bg-white p-8 rounded-2xl border border-gray-200 space-y-5 shadow-[0_10px_30px_rgba(0,0,0,0.03)]">
              <h3 className="text-xs uppercase tracking-[0.25em] font-semibold text-gray-900">Delivery Address & Destination</h3>
              <div className="grid grid-cols-2 gap-4">
                <input type="text" placeholder="Full Name" value={address.fullName} onChange={(e) => setAddress({...address, fullName: e.target.value})} className="w-full bg-[#f9f8f6] border border-gray-200 px-4 py-3 rounded-xl text-xs text-gray-900 placeholder-gray-400 focus:outline-none focus:border-black" />
                <input type="tel" placeholder="Phone Number" value={address.phone} onChange={(e) => setAddress({...address, phone: e.target.value})} className="w-full bg-[#f9f8f6] border border-gray-200 px-4 py-3 rounded-xl text-xs text-gray-900 placeholder-gray-400 focus:outline-none focus:border-black" />
              </div>
              <input type="text" placeholder="Street Address / House No." value={address.street} onChange={(e) => setAddress({...address, street: e.target.value})} className="w-full bg-[#f9f8f6] border border-gray-200 px-4 py-3 rounded-xl text-xs text-gray-900 placeholder-gray-400 focus:outline-none focus:border-black" />
              <div className="grid grid-cols-3 gap-4">
                <input type="text" placeholder="City" value={address.city} onChange={(e) => setAddress({...address, city: e.target.value})} className="w-full bg-[#f9f8f6] border border-gray-200 px-4 py-3 rounded-xl text-xs text-gray-900 placeholder-gray-400 focus:outline-none focus:border-black" />
                <input type="text" placeholder="Pincode" value={address.pincode} onChange={(e) => setAddress({...address, pincode: e.target.value})} className="w-full bg-[#f9f8f6] border border-gray-200 px-4 py-3 rounded-xl text-xs text-gray-900 placeholder-gray-400 focus:outline-none focus:border-black" />
                <input type="text" placeholder="State" value={address.state} onChange={(e) => setAddress({...address, state: e.target.value})} className="w-full bg-[#f9f8f6] border border-gray-200 px-4 py-3 rounded-xl text-xs text-gray-900 placeholder-gray-400 focus:outline-none focus:border-black" />
              </div>
              <button onClick={saveAddress} className="w-full bg-gray-100 hover:bg-gray-200 text-gray-900 py-3 text-[10px] uppercase tracking-[0.25em] rounded-xl border border-gray-200 transition-all cursor-pointer">Save Address</button>
            </div>
          </div>

          <div className="bg-white p-8 rounded-2xl border border-gray-200 space-y-6 h-fit shadow-[0_10px_30px_rgba(0,0,0,0.03)]">
            <h3 className="text-xs uppercase tracking-[0.25em] font-semibold text-gray-900">Trunk Summary</h3>
            
            <div className="space-y-3">
              <label className="text-[9px] uppercase tracking-widest text-gray-500 block">Apply Coupon</label>
              
              {coupons && coupons.filter(c => c.active !== false).length > 0 && (
                <div className="space-y-1.5">
                  <span className="text-[9px] uppercase tracking-wider text-gray-400 block font-medium">Available Offers:</span>
                  <div className="flex flex-wrap gap-2">
                    {coupons.filter(c => c.active !== false).map((c, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => applyCoupon(c.code)}
                        className="text-[10px] bg-[#f9f8f6] hover:bg-black hover:text-white text-gray-800 border border-gray-200 px-2.5 py-1.5 rounded-lg transition-all cursor-pointer text-left font-mono"
                      >
                        <span className="font-bold">{c.code}</span> ({c.type === 'flat' ? `₹${c.value} OFF` : `${c.value}% OFF`}{c.minOrder ? ` over ₹${c.minOrder}` : ''})
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex gap-2 pt-1">
                <input 
                  type="text" 
                  placeholder="CODE (e.g. BHAIRAVI10)" 
                  value={enteredCoupon} 
                  onChange={(e) => setEnteredCoupon(e.target.value)} 
                  className="w-full bg-[#f9f8f6] border border-gray-200 px-3 py-2.5 rounded-xl text-xs text-gray-900 placeholder-gray-400 focus:outline-none focus:border-black" 
                />
                <button onClick={() => applyCoupon()} className="bg-black hover:bg-neutral-800 text-white px-4 rounded-xl text-[10px] uppercase tracking-widest transition-all cursor-pointer">Apply</button>
              </div>
              {appliedCouponCode && <p className="text-[10px] text-emerald-600 font-semibold uppercase tracking-wider">Applied: {appliedCouponCode} (-₹{appliedDiscount})</p>}
            </div>

            <div className="space-y-2 font-serif text-sm border-t border-gray-100 pt-4">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal:</span>
                <span>₹{subtotal}</span>
              </div>
              {appliedDiscount > 0 && (
                <div className="flex justify-between text-emerald-600">
                  <span>Discount:</span>
                  <span>-₹{appliedDiscount}</span>
                </div>
              )}
              <div className="flex justify-between text-lg font-medium pt-2 border-t border-gray-100 text-gray-900">
                <span>Total Investment:</span>
                <span className="text-black font-semibold">₹{finalTotal}</span>
              </div>
            </div>

            <div className="space-y-3 pt-2">
              <label className="text-[9px] uppercase tracking-widest text-gray-500 font-semibold block">Fulfillment Method</label>
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-xs uppercase tracking-wider text-gray-800 cursor-pointer">
                  <input type="radio" name="pay" checked={paymentMethod === 'whatsapp'} onChange={() => setPaymentMethod('whatsapp')} className="accent-black" />
                  WhatsApp Concierge Order
                </label>
                <label className="flex items-center gap-2 text-xs uppercase tracking-wider text-gray-800 cursor-pointer">
                  <input type="radio" name="pay" checked={paymentMethod === 'upi'} onChange={() => setPaymentMethod('upi')} className="accent-black" />
                  Instant UPI App (GPay / PhonePe)
                </label>
              </div>
            </div>

            {paymentMethod === 'whatsapp' ? (
              <button onClick={() => handleWhatsAppCheckout(finalTotal, appliedCouponCode)} className="w-full bg-black hover:bg-neutral-800 text-white py-4 text-xs uppercase tracking-[0.25em] font-medium rounded-xl transition-all shadow-md cursor-pointer">
                Complete via WhatsApp 💬
              </button>
            ) : (
              <button onClick={handleUPIPayment} className="w-full bg-black hover:bg-neutral-800 text-white py-4 text-xs uppercase tracking-[0.25em] font-medium rounded-xl transition-all shadow-md cursor-pointer">
                Pay ₹{finalTotal} via UPI App ⚡
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}