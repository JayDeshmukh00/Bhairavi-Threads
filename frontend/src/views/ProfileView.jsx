import { ui } from '../utils/constants';

export default function ProfileView({ userName, userEmail, userPhone, address, setAddress, saveAddress, isAdmin }) {
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

      <div className="bg-white p-8 rounded-2xl border border-gray-200 space-y-6 shadow-[0_10px_30px_rgba(0,0,0,0.03)]">
        <h3 className="text-xs uppercase tracking-[0.25em] font-semibold text-gray-900">Saved Shipping Destination</h3>
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
        <button onClick={saveAddress} className="w-full bg-black hover:bg-neutral-800 text-white py-4 text-xs uppercase tracking-[0.2em] font-medium rounded-xl transition-all shadow-md cursor-pointer">
          Save Address Details
        </button>
      </div>
    </div>
  );
}