export default function OrdersView({ myOrders }) {
  const getStatusStep = (status) => {
    const steps = ['Ordered', 'Processing', 'Shipped', 'Delivered'];
    return steps.indexOf(status) !== -1 ? steps.indexOf(status) : 0;
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-24 text-[#f8fafc] px-4 sm:px-6 pt-10">
      <div className="text-center space-y-2 border-b border-white/10 pb-6">
        <span className="text-[10px] uppercase tracking-[0.3em] text-[#3b60e4] font-semibold">Client History</span>
        <h2 className="font-serif text-3xl md:text-4xl text-white font-normal">Your Trousseau Orders</h2>
      </div>

      {myOrders.length === 0 ? (
        <div className="text-center py-20 bg-white/[0.02] backdrop-blur-2xl rounded-3xl border border-white/10 space-y-3 shadow-2xl">
          <p className="text-xs uppercase tracking-widest text-gray-400 font-serif">You haven't placed any orders yet.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {myOrders.map((ord, idx) => {
            const currentStep = getStatusStep(ord.status || 'Ordered');
            const steps = ['Ordered', 'Processing', 'Shipped', 'Delivered'];

            return (
              <div key={idx} className="bg-white/[0.02] backdrop-blur-2xl p-8 rounded-3xl border border-white/10 space-y-6 shadow-2xl">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2 border-b border-white/10 pb-4">
                  <div>
                    <span className="text-[10px] uppercase tracking-widest text-blue-300">Order Reference</span>
                    <h4 className="font-mono text-sm font-bold text-white">{ord._id || `BHT-${idx+500}`}</h4>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] uppercase tracking-widest text-gray-400 block">Total Amount</span>
                    <span className="font-serif text-lg font-medium text-blue-300">₹{ord.totalAmount}</span>
                  </div>
                </div>

                {/* Live Progress Bar */}
                <div className="space-y-3">
                  <div className="flex justify-between text-[9px] uppercase tracking-widest text-gray-400">
                    {steps.map((s, sIdx) => (
                      <span key={s} className={sIdx <= currentStep ? 'font-bold text-white' : 'text-gray-600'}>{s}</span>
                    ))}
                  </div>
                  <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden border border-white/10">
                    <div 
                      className="bg-gradient-to-r from-[#1c39bb] to-[#3b60e4] h-full transition-all duration-500 shadow-[0_0_15px_rgba(28,57,187,0.7)]" 
                      style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
                    />
                  </div>
                </div>

                {/* Items Summary */}
                <div className="space-y-2 pt-2">
                  <span className="text-[9px] uppercase tracking-widest text-blue-300 block">Items in Order:</span>
                  <div className="space-y-2">
                    {ord.items?.map((item, itIdx) => (
                      <div key={itIdx} className="flex justify-between items-center bg-white/[0.03] backdrop-blur-md p-3 rounded-xl border border-white/10 text-xs text-gray-200">
                        <span>{item.name} (x{item.qty})</span>
                        <span className="font-serif font-medium text-blue-300">₹{item.price * item.qty}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}