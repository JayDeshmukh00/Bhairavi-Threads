export default function OrdersView({ myOrders }) {
  const getStatusStep = (status) => {
    const steps = ['Pending', 'Verified', 'Dispatched', 'Delivered'];
    return steps.indexOf(status) !== -1 ? steps.indexOf(status) : 0;
  };

  return (
    <div className="max-w-5xl mx-auto space-y-10 pb-28 text-[#111111] px-4 sm:px-6 pt-10">
      <div className="text-center space-y-2 border-b border-gray-200 pb-6">
        <span className="text-[10px] uppercase tracking-[0.3em] text-gray-500 font-semibold">Atelier Ledger</span>
        <h2 className="font-serif text-3xl md:text-4xl text-gray-900 font-normal">My Trousseau Orders ({myOrders.length})</h2>
      </div>

      {myOrders.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-gray-200 space-y-3 shadow-[0_10px_30px_rgba(0,0,0,0.03)]">
          <p className="text-xs uppercase tracking-widest text-gray-500 font-serif">No active or past orders found in your ledger.</p>
        </div>
      ) : (
        <div className="space-y-8">
          {myOrders.map(order => {
            const currentStep = getStatusStep(order.status);
            return (
              <div key={order._id} className="bg-white p-6 sm:p-8 rounded-2xl border border-gray-200 space-y-6 shadow-[0_10px_30px_rgba(0,0,0,0.03)]">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-gray-100 pb-4 gap-2">
                  <div>
                    <span className="text-[9px] font-mono uppercase tracking-widest text-gray-400">Order ID: {order._id}</span>
                    <p className="text-xs text-gray-500">{new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="px-3 py-1 rounded-full text-[10px] uppercase tracking-widest font-bold bg-gray-100 text-gray-900 border border-gray-200">
                      {order.status || 'Pending'}
                    </span>
                    <span className="font-serif font-medium text-gray-900 text-sm">₹{order.totalAmount}</span>
                  </div>
                </div>

                {/* Visual Progress Timeline */}
                <div className="py-2">
                  <div className="grid grid-cols-4 gap-2 text-center">
                    {['Pending', 'Verified', 'Dispatched', 'Delivered'].map((step, idx) => (
                      <div key={step} className="space-y-1">
                        <div className={`h-1.5 rounded-full transition-all ${idx <= currentStep ? 'bg-black' : 'bg-gray-100 border border-gray-200'}`} />
                        <span className={`text-[9px] uppercase tracking-widest block ${idx <= currentStep ? 'text-gray-900 font-bold' : 'text-gray-400'}`}>{step}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Ordered Items Preview */}
                <div className="space-y-3 pt-2">
                  <h4 className="text-[10px] uppercase tracking-widest font-semibold text-gray-500">Curated Pieces</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {order.items?.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-3 bg-[#f9f8f6] p-3 rounded-xl border border-gray-100">
                        <img src={item.image} alt="" className="w-12 h-14 object-cover rounded-lg" />
                        <div className="overflow-hidden">
                          <p className="text-xs font-serif text-gray-900 truncate">{item.name}</p>
                          <p className="text-[10px] text-gray-500">Qty: {item.qty} | ₹{item.price * item.qty}</p>
                        </div>
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