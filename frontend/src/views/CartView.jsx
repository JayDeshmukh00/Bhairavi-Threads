import { useState } from 'react';
import { ui } from '../utils/constants';

export default function CartView({ cart, updateQty, handleWhatsAppCheckout, address, setAddress, saveAddress }) {
  const [paymentMethod, setPaymentMethod] = useState('whatsapp');
  const total = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);

  const handleUPIPayment = () => {
    if (cart.length === 0) return alert("Trunk is empty.");
    const upiID = "bhairavithreads@upi";
    const upiLink = `upi://pay?pa=${upiID}&pn=Bhairavi%20Threads&am=${total}&cu=INR&tn=Trousseau%20Payment`;
    window.location.href = upiLink;
  };

  return (
    <div className="max-w-5xl mx-auto space-y-12 pb-24 text-[#1a1a1a]">
      <div className="space-y-2 border-b border-black/10 pb-6 text-center">
        <span className="text-[10px] uppercase tracking-[0.3em] text-[#777] font-medium block">Atelier Selection</span>
        <h2 className="saree-brand-title-dark text-3xl md:text-5xl font-normal tracking-wide">Your Curated Trunk</h2>
      </div>

      {cart.length === 0 ? (
        <div className="text-center py-20 bg-[#f4f1ea] rounded-3xl border border-black/10 space-y-4">
          <p className="text-xs uppercase tracking-[0.2em] text-[#777]">Your trousseau trunk is currently empty.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="md:col-span-2 space-y-6">
            {cart.map(item => (
              <div key={item.cartKey} className="flex gap-6 items-center bg-[#f4f1ea] p-5 rounded-2xl border border-black/10 shadow-sm">
                <img src={item.image} alt={item.name} className="w-20 h-24 object-cover rounded-xl" />
                <div className="flex-grow space-y-1">
                  <h4 className="font-serif text-lg tracking-wide">{item.name}</h4>
                  <p className="text-xs font-serif font-medium text-[#444]">₹{item.price}</p>
                </div>
                <div className="flex items-center gap-3">
                  <button onClick={() => updateQty(item.cartKey, -1)} className="w-8 h-8 bg-white border border-black/15 rounded-full flex items-center justify-center text-xs hover:bg-black hover:text-white transition-all">-</button>
                  <span className="text-xs font-semibold">{item.qty}</span>
                  <button onClick={() => updateQty(item.cartKey, 1)} className="w-8 h-8 bg-white border border-black/15 rounded-full flex items-center justify-center text-xs hover:bg-black hover:text-white transition-all">+</button>
                </div>
              </div>
            ))}

            {/* Shipping Address Form */}
            <div className="bg-[#f4f1ea] p-8 rounded-3xl border border-black/10 space-y-5 shadow-sm">
              <h3 className="text-xs uppercase tracking-[0.25em] font-semibold text-[#1a1a1a]">Delivery Address & Trousseau Destination</h3>
              <div className="grid grid-cols-2 gap-4">
                <input type="text" placeholder="Full Name" value={address.fullName} onChange={(e) => setAddress({...address, fullName: e.target.value})} className={ui.input} />
                <input type="tel" placeholder="Phone Number" value={address.phone} onChange={(e) => setAddress({...address, phone: e.target.value})} className={ui.input} />
              </div>
              <input type="text" placeholder="Street Address / House No." value={address.street} onChange={(e) => setAddress({...address, street: e.target.value})} className={ui.input} />
              <div className="grid grid-cols-3 gap-4">
                <input type="text" placeholder="City" value={address.city} onChange={(e) => setAddress({...address, city: e.target.value})} className={ui.input} />
                <input type="text" placeholder="Pincode" value={address.pincode} onChange={(e) => setAddress({...address, pincode: e.target.value})} className={ui.input} />
                <input type="text" placeholder="State" value={address.state} onChange={(e) => setAddress({...address, state: e.target.value})} className={ui.input} />
              </div>
              <button onClick={saveAddress} className={`w-full py-3 text-[10px] uppercase tracking-[0.25em] ${ui.ghostBtn}`}>Save Address</button>
            </div>
          </div>

          {/* Order Summary & Checkout Options */}
          <div className="bg-[#f4f1ea] p-8 rounded-3xl border border-black/10 space-y-6 h-fit shadow-sm">
            <h3 className="text-xs uppercase tracking-[0.25em] font-semibold text-[#1a1a1a]">Trunk Summary</h3>
            <div className="flex justify-between text-sm font-serif border-b border-black/10 pb-4">
              <span>Total Investment:</span>
              <span className="text-xl font-medium">₹{total}</span>
            </div>

            <div className="space-y-4">
              <label className="text-[10px] uppercase tracking-[0.2em] text-[#777] font-semibold block">Select Completion Method</label>
              <div className="space-y-3">
                <label className="flex items-center gap-3 text-xs uppercase tracking-wider cursor-pointer">
                  <input type="radio" name="payment" checked={paymentMethod === 'whatsapp'} onChange={() => setPaymentMethod('whatsapp')} />
                  Private WhatsApp Concierge
                </label>
                <label className="flex items-center gap-3 text-xs uppercase tracking-wider cursor-pointer">
                  <input type="radio" name="payment" checked={paymentMethod === 'upi'} onChange={() => setPaymentMethod('upi')} />
                  Direct UPI App (GPay / PhonePe)
                </label>
              </div>
            </div>

            {paymentMethod === 'whatsapp' ? (
              <button onClick={handleWhatsAppCheckout} className={`w-full py-4 text-xs uppercase tracking-[0.25em] ${ui.primaryBtn}`}>
                Complete via WhatsApp 💬
              </button>
            ) : (
              <button onClick={handleUPIPayment} className={`w-full py-4 text-xs uppercase tracking-[0.25em] ${ui.primaryBtn}`}>
                Pay ₹{total} via UPI App ⚡
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}