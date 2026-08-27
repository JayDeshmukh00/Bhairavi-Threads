import { useState } from 'react';
import axios from 'axios';
import { ui } from '../utils/constants';

const INDIAN_STATES = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", 
  "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", 
  "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram", 
  "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", 
  "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal",
  "Andaman and Nicobar Islands", "Chandigarh", "Dadra and Nagar Haveli and Daman and Diu", 
  "Delhi", "Jammu and Kashmir", "Ladakh", "Lakshadweep", "Puducherry"
];

export default function ProfileView({ userName, userEmail, userPhone, address, setAddress, saveAddress, isAdmin }) {
  const [isFetchingPin, setIsFetchingPin] = useState(false);
  const [citySearch, setCitySearch] = useState(address.city || '');

  // Pincode lookup automation using India Post API
  const handlePincodeChange = async (e) => {
    const pin = e.target.value.replace(/\D/g, '').slice(0, 6);
    setAddress(prev => ({ ...prev, pincode: pin }));

    if (pin.length === 6) {
      setIsFetchingPin(true);
      try {
        const res = await axios.get(`https://api.postalpincode.in/pincode/${pin}`);
        if (res.data && res.data[0].Status === 'Success') {
          const postOffice = res.data[0].PostOffice[0];
          setAddress(prev => ({
            ...prev,
            state: postOffice.State || prev.state,
            city: postOffice.District || postOffice.Block || prev.city
          }));
          setCitySearch(postOffice.District || postOffice.Block || '');
        } else {
          alert("Invalid Pincode. Please verify your postal code.");
        }
      } catch (err) {
        console.error("Pincode lookup error:", err);
      } finally {
        setIsFetchingPin(false);
      }
    }
  };

  const handleSaveWrapper = async (e) => {
    e.preventDefault();
    if (!address.fullName || !address.phone || !address.street || !address.pincode || !address.state || !address.city) {
      return alert("Please fill in all required address fields before saving.");
    }
    try {
      if (typeof saveAddress === 'function') {
        await saveAddress();
      } else {
        alert("Shipping destination updated successfully!");
      }
    } catch (err) {
      alert("Failed to save address. Please check your network connection.");
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-10 pb-28 text-[#111111] px-4 sm:px-6 pt-10">
      <div className="text-center space-y-2 border-b border-gray-200 pb-6">
        <span className="text-[10px] uppercase tracking-[0.3em] text-gray-500 font-semibold">
          {isAdmin ? 'Command Administrator' : 'Atelier Membership'}
        </span>
        <h2 className="font-serif text-3xl md:text-4xl text-gray-900 font-normal">
          {isAdmin ? 'Administrator Profile' : 'Patron Profile'}
        </h2>
        <p className="text-xs font-serif text-gray-600 pt-1 font-light">
          Welcome back, <span className="font-semibold text-gray-900">{userName || 'Patron'}</span> {isAdmin && <span className="ml-2 bg-gray-100 text-gray-900 border border-gray-300 px-2.5 py-0.5 rounded-full text-[9px] uppercase tracking-wider font-sans font-bold shadow-sm">Admin Privileges Active</span>}
        </p>
      </div>

      <form onSubmit={handleSaveWrapper} className="bg-white p-8 rounded-2xl border border-gray-200 space-y-6 shadow-[0_10px_30px_rgba(0,0,0,0.03)]">
        <h3 className="text-xs uppercase tracking-[0.25em] font-semibold text-gray-900">Saved Shipping Destination</h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <input 
            type="text" 
            placeholder="Full Name" 
            value={address.fullName || ''} 
            onChange={(e) => setAddress({...address, fullName: e.target.value})} 
            className="w-full bg-[#f9f8f6] border border-gray-200 px-4 py-3 rounded-xl text-xs text-gray-900 placeholder-gray-400 focus:outline-none focus:border-black" 
            required 
          />
          <input 
            type="tel" 
            placeholder="Phone Number" 
            value={address.phone || ''} 
            onChange={(e) => setAddress({...address, phone: e.target.value})} 
            className="w-full bg-[#f9f8f6] border border-gray-200 px-4 py-3 rounded-xl text-xs text-gray-900 placeholder-gray-400 focus:outline-none focus:border-black" 
            required 
          />
        </div>

        <input 
          type="text" 
          placeholder="Street Address / House No. / Landmark" 
          value={address.street || ''} 
          onChange={(e) => setAddress({...address, street: e.target.value})} 
          className="w-full bg-[#f9f8f6] border border-gray-200 px-4 py-3 rounded-xl text-xs text-gray-900 placeholder-gray-400 focus:outline-none focus:border-black" 
          required 
        />

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Pincode with Auto-fill Trigger */}
          <div className="relative">
            <input 
              type="text" 
              placeholder="Pincode (6 digits)" 
              value={address.pincode || ''} 
              onChange={handlePincodeChange} 
              maxLength={6}
              className="w-full bg-[#f9f8f6] border border-gray-200 px-4 py-3 rounded-xl text-xs text-gray-900 placeholder-gray-400 focus:outline-none focus:border-black" 
              required 
            />
            {isFetchingPin && <span className="absolute right-3 top-3.5 text-[10px] text-gray-500 animate-pulse">Checking...</span>}
          </div>

          {/* State Dropdown */}
          <select 
            value={address.state || ''} 
            onChange={(e) => setAddress({...address, state: e.target.value})} 
            className="w-full bg-[#f9f8f6] border border-gray-200 px-4 py-3 rounded-xl text-xs text-gray-900 focus:outline-none focus:border-black cursor-pointer"
            required
          >
            <option value="">Select State</option>
            {INDIAN_STATES.map(st => <option key={st} value={st}>{st}</option>)}
          </select>

          {/* City / District Input with search feel */}
          <input 
            type="text" 
            placeholder="City / District" 
            value={address.city || ''} 
            onChange={(e) => setAddress({...address, city: e.target.value})} 
            className="w-full bg-[#f9f8f6] border border-gray-200 px-4 py-3 rounded-xl text-xs text-gray-900 placeholder-gray-400 focus:outline-none focus:border-black" 
            required 
          />
        </div>

        <button type="submit" className="w-full bg-black hover:bg-neutral-800 text-white py-4 text-xs uppercase tracking-[0.2em] font-medium rounded-xl transition-all shadow-md cursor-pointer">
          Save Address Details ⚡
        </button>
      </form>
    </div>
  );
}