import { useState } from 'react';
import { ui } from '../utils/constants';

export default function CartView({ 
  cart, updateQty, coupons, 
  handleWhatsAppCheckout, 
  address, setAddress, saveAddress 
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
    setAppliedDiscount(amt);
    setAppliedCouponCode(found.code);
    setCelebrationMsg(`🎉 Congratulations! You just saved ₹${amt} with code ${found.code}!`);
    setTimeout(() => setCelebrationMsg(''), 6000);
  };

  const handleUPIPayment = () => {
    if (cart.length === 0) return alert("Trunk is empty.");
    const upiID = "bhairavithreads@upi";
    const upiLink = `upi://pay?pa=${upiID}&pn=Bhairavi%20Threads&am=${finalTotal}&cu=INR&tn=Trousseau%20Payment`;
    window.location.href = upiLink;
  };

  return (
    <div className="max-w-5xl mx-auto space-y-12 pb-24 text-[#f8fafc] px-4 sm:px-6 pt-10">
      <div className="space-y-2 border-b border-white/10 pb-6 text-center">
        <span className="text-[10px] uppercase tracking-[0.3em] text-[#3b60e4] font-semibold block">Atelier Selection</span>
        <h2 className="font-serif text-3xl md:text-5xl text-white font-normal tracking-wide">Your Curated Trunk</h2>
      </div>

      {celebrationMsg && (
        <div className="bg-[#1c39bb] text-white p-4 rounded-2xl text-center text-xs uppercase tracking-widest font-bold shadow-[0_0_30px_rgba(28,57,187,0.7)] animate-bounce border border-blue-400">
          {celebrationMsg}
        </div>
      )}

      {cart.length === 0 ? (
        <div className="text-center py-20 bg-white/[0.02] backdrop-blur-2xl rounded-3xl border border-white/10 space-y-4 shadow-2xl">
          <p className="text-xs uppercase tracking-[0.2em] text-gray-400 font-serif">Your trousseau trunk is currently empty.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="md:col-span-2 space-y-6">
            {cart.map(item => (
              <div key={item.cartKey} className="flex gap-6 items-center bg-white/[0.02] backdrop-blur-2xl p-5 rounded-2xl border border-white/10 shadow-xl">
                <img src={item.image} alt={item.name} className="w-20 h-24 object-cover rounded-xl border border-white/10" />
                <div className="flex-grow space-y-1">
                  <h4 className="font-serif text-lg tracking-wide text-white">{item.name}</h4>
                  <p className="text-xs font-serif font-medium text-blue-300">₹{item.price}</p>
                </div>
                <div className="flex items-center gap-3">
                  <button onClick={() => updateQty(item.cartKey, -1)} className="w-8 h-8 bg-white/5 border border-white/20 rounded-full flex items-center justify-center text-xs text-white hover:bg-[#1c39bb] hover:border-blue-400 transition-all cursor-pointer">-</button>
                  <span className="text-xs font-semibold text-white">{item.qty}</span>
                  <button onClick={() => updateQty(item.cartKey, 1)} className="w-8 h-8 bg-white/5 border border-white/20 rounded-full flex items-center justify-center text-xs text-white hover:bg-[#1c39bb] hover:border-blue-400 transition-all cursor-pointer">+</button>
                </div>
              </div>
            ))}

            <div className="bg-white/[0.02] backdrop-blur-2xl p-8 rounded-3xl border border-white/10 space-y-5 shadow-2xl">
              <h3 className="text-xs uppercase tracking-[0.25em] font-semibold text-blue-300">Delivery Address & Destination</h3>
              <div className="grid grid-cols-2 gap-4">
                <input type="text" placeholder="Full Name" value={address.fullName} onChange={(e) => setAddress({...address, fullName: e.target.value})} className="w-full bg-[#02040c]/90 border border-white/20 px-4 py-3 rounded-xl text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#3b60e4]" />
                <input type="tel" placeholder="Phone Number" value={address.phone} onChange={(e) => setAddress({...address, phone: e.target.value})} className="w-full bg-[#02040c]/90 border border-white/20 px-4 py-3 rounded-xl text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#3b60e4]" />
              </div>
              <input type="text" placeholder="Street Address / House No." value={address.street} onChange={(e) => setAddress({...address, street: e.target.value})} className="w-full bg-[#02040c]/90 border border-white/20 px-4 py-3 rounded-xl text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#3b60e4]" />
              <div className="grid grid-cols-3 gap-4">
                <input type="text" placeholder="City" value={address.city} onChange={(e) => setAddress({...address, city: e.target.value})} className="w-full bg-[#02040c]/90 border border-white/20 px-4 py-3 rounded-xl text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#3b60e4]" />
                <input type="text" placeholder="Pincode" value={address.pincode} onChange={(e) => setAddress({...address, pincode: e.target.value})} className="w-full bg-[#02040c]/90 border border-white/20 px-4 py-3 rounded-xl text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#3b60e4]" />
                <input type="text" placeholder="State" value={address.state} onChange={(e) => setAddress({...address, state: e.target.value})} className="w-full bg-[#02040c]/90 border border-white/20 px-4 py-3 rounded-xl text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#3b60e4]" />
              </div>
              <button onClick={saveAddress} className="w-full bg-white/5 hover:bg-white/10 text-white py-3 text-[10px] uppercase tracking-[0.25em] rounded-xl border border-white/20 transition-all cursor-pointer">Save Address</button>
            </div>
          </div>

          <div className="bg-white/[0.02] backdrop-blur-2xl p-8 rounded-3xl border border-white/10 space-y-6 h-fit shadow-2xl">
            <h3 className="text-xs uppercase tracking-[0.25em] font-semibold text-blue-300">Trunk Summary</h3>
            
            <div className="space-y-2">
              <label className="text-[9px] uppercase tracking-widest text-gray-400 block">Apply Coupon</label>
              <div className="flex gap-2">
                <input 
                  type="text" 
                  placeholder="CODE (e.g. BHAIRAVI10)" 
                  value={enteredCoupon} 
                  onChange={(e) => setEnteredCoupon(e.target.value)} 
                  className="w-full bg-[#02040c]/90 border border-white/20 px-3 py-2.5 rounded-xl text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#3b60e4]" 
                />
                <button onClick={() => applyCoupon()} className="bg-[#1c39bb] hover:bg-[#3b60e4] text-white px-4 rounded-xl text-[10px] uppercase tracking-widest transition-all cursor-pointer border border-blue-400/40">Apply</button>
              </div>
              {appliedCouponCode && <p className="text-[10px] text-emerald-400 font-semibold uppercase tracking-wider">Applied: {appliedCouponCode} (-₹{appliedDiscount})</p>}
            </div>

            <div className="space-y-2 font-serif text-sm border-t border-white/10 pt-4">
              <div className="flex justify-between text-gray-300">
                <span>Subtotal:</span>
                <span>₹{subtotal}</span>
              </div>
              {appliedDiscount > 0 && (
                <div className="flex justify-between text-emerald-400">
                  <span>Discount:</span>
                  <span>-₹{appliedDiscount}</span>
                </div>
              )}
              <div className="flex justify-between text-lg font-medium pt-2 border-t border-white/10 text-white">
                <span>Total Investment:</span>
                <span className="text-blue-300">₹{finalTotal}</span>
              </div>
            </div>

            <div className="space-y-3 pt-2">
              <label className="text-[9px] uppercase tracking-widest text-gray-400 font-semibold block">Fulfillment Method</label>
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-xs uppercase tracking-wider text-gray-200 cursor-pointer">
                  <input type="radio" name="pay" checked={paymentMethod === 'whatsapp'} onChange={() => setPaymentMethod('whatsapp')} className="accent-[#1c39bb]" />
                  WhatsApp Concierge Order
                </label>
                <label className="flex items-center gap-2 text-xs uppercase tracking-wider text-gray-200 cursor-pointer">
                  <input type="radio" name="pay" checked={paymentMethod === 'upi'} onChange={() => setPaymentMethod('upi')} className="accent-[#1c39bb]" />
                  Instant UPI App (GPay / PhonePe)
                </label>
              </div>
            </div>

            {paymentMethod === 'whatsapp' ? (
              <button onClick={() => handleWhatsAppCheckout(finalTotal, appliedCouponCode)} className="w-full bg-[#1c39bb] hover:bg-[#3b60e4] text-white py-4 text-xs uppercase tracking-[0.25em] font-medium rounded-xl transition-all shadow-xl cursor-pointer border border-blue-400/40">
                Complete via WhatsApp 💬
              </button>
            ) : (
              <button onClick={handleUPIPayment} className="w-full bg-[#1c39bb] hover:bg-[#3b60e4] text-white py-4 text-xs uppercase tracking-[0.25em] font-medium rounded-xl transition-all shadow-xl cursor-pointer border border-blue-400/40">
                Pay ₹{finalTotal} via UPI App ⚡
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}