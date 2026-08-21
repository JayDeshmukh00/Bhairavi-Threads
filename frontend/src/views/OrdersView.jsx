export default function OrdersView({ myOrders }) {
  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <h2 className="text-3xl font-serif">My Order History</h2>
      {myOrders.length === 0 ? (
        <p className="text-sm text-[#777] py-12">You have not placed any orders yet.</p>
      ) : (
        <div className="space-y-6">
          {myOrders.map(order => (
            <div key={order._id} className="bg-[#fafafa] p-6 rounded-2xl border border-black/5 space-y-4">
              <div className="flex justify-between items-center pb-3 border-b border-black/10">
                <span className="text-xs uppercase tracking-widest font-semibold text-[#777]">Order ID: {order._id}</span>
                <span className="text-xs font-semibold px-3 py-1 rounded-full bg-emerald-100 text-emerald-800">{order.status || 'Confirmed'}</span>
              </div>
              <div className="space-y-2">
                {order.items?.map((item, i) => (
                  <div key={i} className="flex justify-between text-sm">
                    <span>{item.name} (x{item.qty})</span>
                    <span>₹{item.price * item.qty}</span>
                  </div>
                ))}
              </div>
              <div className="pt-3 border-t border-black/10 flex justify-between font-serif text-lg">
                <span>Total Amount</span>
                <span>₹{order.totalAmount}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}