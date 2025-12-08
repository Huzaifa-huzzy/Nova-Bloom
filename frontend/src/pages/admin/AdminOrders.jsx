import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchOrders, updateOrderToDelivered } from '../../store/slices/orderSlice';
import { toast } from 'react-toastify';

const AdminOrders = () => {
  const dispatch = useDispatch();
  const { orders, loading } = useSelector((state) => state.orders);

  useEffect(() => {
    dispatch(fetchOrders());
  }, [dispatch]);

  const handleDeliver = (orderId) => {
    dispatch(updateOrderToDelivered(orderId))
      .unwrap()
      .then(() => {
        toast.success('Order marked as delivered');
      })
      .catch((error) => {
        toast.error(error);
      });
  };

  if (loading) {
    return <div className="text-center py-12">Loading...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto">
      <h2 className="text-3xl font-bold mb-6">Admin Orders</h2>
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 text-left">Order ID</th>
              <th className="px-6 py-3 text-left">User</th>
              <th className="px-6 py-3 text-left">Date</th>
              <th className="px-6 py-3 text-left">Total</th>
              <th className="px-6 py-3 text-left">Paid</th>
              <th className="px-6 py-3 text-left">Delivered</th>
              <th className="px-6 py-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id} className="border-b">
                <td className="px-6 py-4">
                  <Link
                    to={`/orders/${order._id}`}
                    className="text-gray-900 hover:underline"
                  >
                    #{order._id.slice(-8)}
                  </Link>
                </td>
                <td className="px-6 py-4">
                  {order.user?.name || order.user?.email || 'N/A'}
                </td>
                <td className="px-6 py-4">
                  {new Date(order.createdAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4">${order.totalPrice.toFixed(2)}</td>
                <td className="px-6 py-4">
                  {order.isPaid ? (
                    <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                      Paid
                    </span>
                  ) : (
                    <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm">
                      Not Paid
                    </span>
                  )}
                </td>
                <td className="px-6 py-4">
                  {order.isDelivered ? (
                    <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                      Delivered
                    </span>
                  ) : (
                    <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm">
                      Pending
                    </span>
                  )}
                </td>
                <td className="px-6 py-4">
                  {!order.isDelivered && (
                    <button
                      onClick={() => handleDeliver(order._id)}
                      className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                    >
                      Mark Delivered
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminOrders;

