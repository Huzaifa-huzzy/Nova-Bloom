import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchOrders } from '../store/slices/orderSlice';

const OrderHistory = () => {
  const dispatch = useDispatch();
  const { orders, loading } = useSelector((state) => state.orders);

  useEffect(() => {
    dispatch(fetchOrders());
  }, [dispatch]);

  if (loading) {
    return <div className="text-center py-12">Loading...</div>;
  }

  if (!orders || orders.length === 0) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold mb-4">No orders found</h2>
        <Link
          to="/products"
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition inline-block"
        >
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <h2 className="text-3xl font-bold mb-6">Order History</h2>
      <div className="space-y-4">
        {orders.map((order) => (
          <Link
            key={order._id}
            to={`/orders/${order._id}`}
            className="block bg-white rounded-lg shadow-md p-6 hover:shadow-xl transition"
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-semibold">Order #{order._id.slice(-8)}</h3>
                <p className="text-gray-600">
                  {new Date(order.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-blue-600">
                  ${order.totalPrice.toFixed(2)}
                </p>
                <div className="flex gap-2 mt-2">
                  {order.isPaid ? (
                    <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                      Paid
                    </span>
                  ) : (
                    <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm">
                      Not Paid
                    </span>
                  )}
                  {order.isDelivered ? (
                    <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                      Delivered
                    </span>
                  ) : (
                    <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm">
                      Pending
                    </span>
                  )}
                </div>
              </div>
            </div>
            <div className="border-t pt-4">
              <p className="text-gray-600">
                {order.orderItems.length} item(s)
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default OrderHistory;

