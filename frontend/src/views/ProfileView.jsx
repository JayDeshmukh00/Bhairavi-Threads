import { ui } from '../utils/constants';

export default function ProfileView({ userName, userEmail, userPhone, address, setAddress, saveAddress, isAdmin }) {
  return (
    <div className="max-w-3xl mx-auto space-y-10 pb-24 text-[#f8fafc] px-4 sm:px-6 pt-10">
      <div className="text-center space-y-2 border-b border-white/10 pb-6">
        <span className="text-[10px] uppercase tracking-[0.3em] text-[#3b60e4] font-semibold">
          {isAdmin ? 'Command Administrator' : 'Atelier Membership'}
        </span>
        <h2 className="font-serif text-3xl md:text-4xl text-white font-normal">
          {isAdmin ? 'Administrator Profile' : 'Patron Profile'}
        </h2>
        <p className="text-xs font-serif text-gray-300 pt-1 font-light">
          Welcome back, <span className="font-semibold text-white">{userName || 'Patron'}</span> {isAdmin && <span className="ml-2 bg-[#1c39bb]/50 text-blue-200 border border-blue-400/40 px-2.5 py-0.5 rounded-full text-[9px] uppercase tracking-wider font-sans font-bold shadow-md">Admin Privileges Active</span>}
        </p>
      </div>

      <div className="bg-white/[0.02] backdrop-blur-2xl p-8 rounded-3xl border border-white/10 space-y-6 shadow-2xl">
        <h3 className="text-xs uppercase tracking-[0.25em] font-semibold text-blue-300">Saved Shipping Destination</h3>
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
        <button onClick={saveAddress} className="w-full bg-[#1c39bb] hover:bg-[#3b60e4] text-white py-4 text-xs uppercase tracking-[0.2em] font-medium rounded-xl transition-all shadow-xl cursor-pointer border border-blue-400/40">
          Save Address Details
        </button>
      </div>
    </div>
  );
}