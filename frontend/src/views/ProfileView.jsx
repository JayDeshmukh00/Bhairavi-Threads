import { ui } from '../utils/constants';

export default function ProfileView({ userEmail, address, setAddress, saveAddress }) {
  return (
    <div className="max-w-3xl mx-auto py-8 px-4 sm:px-6">
      <div className="bg-[#fafafa] border border-black/5 rounded-2xl p-6 sm:p-10 shadow-sm space-y-8">
        <div>
          <span className="text-[10px] uppercase tracking-widest text-[#777] font-semibold">Account Settings</span>
          <h2 className="saree-brand-title-dark text-2xl sm:text-3xl mt-1">Customer Profile & Shipping</h2>
          <p className="text-xs text-[#666] mt-1">Logged in as: <strong className="text-[#1a1a1a]">{userEmail}</strong></p>
        </div>

        <form onSubmit={saveAddress} className="space-y-6 pt-4 border-t border-black/10">
          <h3 className="text-xs uppercase tracking-widest font-semibold text-[#1a1a1a]">Saved Shipping Address</h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] font-semibold text-[#777] uppercase tracking-widest block mb-1.5">Full Name</label>
              <input 
                type="text" 
                placeholder="Enter recipient full name" 
                value={address.fullName} 
                onChange={(e) => setAddress({ ...address, fullName: e.target.value })} 
                className={ui.input} 
                required 
              />
            </div>
            <div>
              <label className="text-[10px] font-semibold text-[#777] uppercase tracking-widest block mb-1.5">Phone Number</label>
              <input 
                type="tel" 
                placeholder="10-digit mobile number" 
                value={address.phone} 
                onChange={(e) => setAddress({ ...address, phone: e.target.value })} 
                className={ui.input} 
                required 
              />
            </div>
          </div>

          <div>
            <label className="text-[10px] font-semibold text-[#777] uppercase tracking-widest block mb-1.5">Street Address / House No.</label>
            <input 
              type="text" 
              placeholder="House/Flat no., Street name, Landmark" 
              value={address.street} 
              onChange={(e) => setAddress({ ...address, street: e.target.value })} 
              className={ui.input} 
              required 
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-[10px] font-semibold text-[#777] uppercase tracking-widest block mb-1.5">City</label>
              <input 
                type="text" 
                placeholder="City" 
                value={address.city} 
                onChange={(e) => setAddress({ ...address, city: e.target.value })} 
                className={ui.input} 
                required 
              />
            </div>
            <div>
              <label className="text-[10px] font-semibold text-[#777] uppercase tracking-widest block mb-1.5">Pincode</label>
              <input 
                type="text" 
                placeholder="Pincode" 
                value={address.pincode} 
                onChange={(e) => setAddress({ ...address, pincode: e.target.value })} 
                className={ui.input} 
                required 
              />
            </div>
            <div>
              <label className="text-[10px] font-semibold text-[#777] uppercase tracking-widest block mb-1.5">State</label>
              <input 
                type="text" 
                placeholder="State" 
                value={address.state} 
                onChange={(e) => setAddress({ ...address, state: e.target.value })} 
                className={ui.input} 
                required 
              />
            </div>
          </div>

          <div className="pt-4">
            <button type="submit" className={`w-full sm:w-auto px-8 py-3.5 text-xs uppercase tracking-widest ${ui.primaryBtn}`}>
              Save Shipping Details
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}