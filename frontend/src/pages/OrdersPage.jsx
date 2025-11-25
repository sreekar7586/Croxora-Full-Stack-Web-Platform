import { useState, useEffect } from 'react';
import { Package } from 'lucide-react';
import api from '../utils/api';

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const { data } = await api.get('/orders');
      setOrders(data.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const statusColors = {
      pending: 'badge-warning',
      processing: 'badge-info',
      shipped: 'badge-primary',
      delivered: 'badge-success',
      cancelled: 'badge-error',
    };
    return statusColors[status] || 'badge-ghost';
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">My Orders</h1>

      {orders.length === 0 ? (
        <div className="text-center py-20">
          <Package size={64} className="mx-auto mb-4 text-base-content/30" />
          <p className="text-xl text-base-content/60">No orders yet</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order._id} className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <div className="flex flex-wrap justify-between items-start gap-4">
                  <div>
                    <p className="text-sm text-base-content/60">Order ID</p>
                    <p className="font-mono">{order._id}</p>
                  </div>
                  <div>
                    <p className="text-sm text-base-content/60">Date</p>
                    <p>{new Date(order.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-base-content/60">Status</p>
                    <div className={`badge ${getStatusBadge(order.status)}`}>
                      {order.status}
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-base-content/60">Total</p>
                    <p className="text-2xl font-bold">${order.totalPrice.toFixed(2)}</p>
                  </div>
                </div>

                <div className="divider"></div>

                <div className="space-y-2">
                  {order.orderItems.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-4">
                      <img
                        src={item.image || 'https://via.placeholder.com/80'}
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded"
                      />
                      <div className="flex-1">
                        <p className="font-semibold">{item.name}</p>
                        <p className="text-sm text-base-content/60">
                          Quantity: {item.quantity} × ${item.price.toFixed(2)}
                        </p>
                      </div>
                      <p className="font-bold">
                        ${(item.quantity * item.price).toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="divider"></div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="font-semibold mb-2">Shipping Address</p>
                    <p className="text-sm">
                      {order.shippingAddress.street}<br />
                      {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}<br />
                      {order.shippingAddress.country}
                    </p>
                  </div>
                  <div>
                    <p className="font-semibold mb-2">Payment Status</p>
                    <div className={`badge ${order.isPaid ? 'badge-success' : 'badge-warning'}`}>
                      {order.isPaid ? 'Paid' : 'Pending'}
                    </div>
                    {order.isPaid && order.paidAt && (
                      <p className="text-sm mt-1">
                        Paid on {new Date(order.paidAt).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrdersPage;
