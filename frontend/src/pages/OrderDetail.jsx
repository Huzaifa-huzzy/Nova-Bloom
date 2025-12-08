import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchOrder } from '../store/slices/orderSlice';

const OrderDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { order, loading } = useSelector((state) => state.orders);

  useEffect(() => {
    dispatch(fetchOrder(id));
  }, [dispatch, id]);

  if (loading) {
    return <div className="text-center py-12">Loading...</div>;
  }

  if (!order) {
    return <div className="text-center py-12">Order not found</div>;
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold mb-6">Order Details</h2>
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <h3 className="font-semibold mb-2">Order ID</h3>
            <p className="text-gray-600">#{order._id.slice(-8)}</p>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Order Date</h3>
            <p className="text-gray-600">
              {new Date(order.createdAt).toLocaleString()}
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Payment Status</h3>
            <p className={order.isPaid ? 'text-green-600' : 'text-red-600'}>
              {order.isPaid ? 'Paid' : 'Not Paid'}
            </p>
            {order.paidAt && (
              <p className="text-sm text-gray-600">
                Paid on: {new Date(order.paidAt).toLocaleString()}
              </p>
            )}
          </div>
          <div>
            <h3 className="font-semibold mb-2">Delivery Status</h3>
            <p className={order.isDelivered ? 'text-green-600' : 'text-yellow-600'}>
              {order.isDelivered ? 'Delivered' : 'Pending'}
            </p>
            {order.deliveredAt && (
              <p className="text-sm text-gray-600">
                Delivered on: {new Date(order.deliveredAt).toLocaleString()}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h3 className="text-xl font-bold mb-4">Shipping Address</h3>
        <p className="text-gray-600">
          {order.shippingAddress.address}<br />
          {order.shippingAddress.city}, {order.shippingAddress.postalCode}<br />
          {order.shippingAddress.country}
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h3 className="text-xl font-bold mb-4">Order Items</h3>
        <div className="space-y-4">
          {order.orderItems.map((item, index) => (
            <div key={index} className="flex items-center gap-4 border-b pb-4 last:border-b-0">
              <img
                src={item.image}
                alt={item.name}
                className="w-20 h-20 object-cover rounded"
              />
              <div className="flex-1">
                <h4 className="font-semibold">{item.name}</h4>
                <p className="text-gray-600">Quantity: {item.quantity}</p>
              </div>
              <p className="text-xl font-bold">${(item.price * item.quantity).toFixed(2)}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-bold mb-4">Order Summary</h3>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span>Items Price:</span>
            <span>${order.itemsPrice.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Tax:</span>
            <span>${order.taxPrice.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Shipping:</span>
            <span>${order.shippingPrice.toFixed(2)}</span>
          </div>
          <div className="border-t pt-2 mt-2">
            <div className="flex justify-between text-xl font-bold">
              <span>Total:</span>
              <span>${order.totalPrice.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;

