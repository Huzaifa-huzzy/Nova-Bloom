import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { fetchCart } from '../store/slices/cartSlice';
import { createOrder, updateOrderToPaid } from '../store/slices/orderSlice';
import axios from 'axios';
import { toast } from 'react-toastify';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const CheckoutForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { cart } = useSelector((state) => state.cart);
  const { order, loading } = useSelector((state) => state.orders);
  const [shippingAddress, setShippingAddress] = useState({
    address: '',
    city: '',
    postalCode: '',
    country: ''
  });
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    dispatch(fetchCart());
  }, [dispatch]);

  const handleAddressChange = (e) => {
    setShippingAddress({
      ...shippingAddress,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    if (!shippingAddress.address || !shippingAddress.city || !shippingAddress.postalCode || !shippingAddress.country) {
      toast.error('Please fill in all shipping address fields');
      return;
    }

    setProcessing(true);

    try {
      // Create order
      const orderResult = await dispatch(createOrder({
        shippingAddress,
        paymentMethod: 'stripe'
      })).unwrap();

      // Create payment intent
      const { data } = await axios.post(`${API_URL}/payments/create-intent`, {
        orderId: orderResult._id
      });

      // Confirm payment
      const cardElement = elements.getElement(CardElement);
      const { error, paymentIntent } = await stripe.confirmCardPayment(data.clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            name: shippingAddress.address
          }
        }
      });

      if (error) {
        toast.error(error.message);
        setProcessing(false);
      } else if (paymentIntent.status === 'succeeded') {
        // Update order to paid
        await dispatch(updateOrderToPaid({
          orderId: orderResult._id,
          paymentData: {
            id: paymentIntent.id,
            status: paymentIntent.status,
            update_time: new Date().toISOString(),
            email_address: paymentIntent.receipt_email
          }
        })).unwrap();

        toast.success('Payment successful!');
        navigate(`/orders/${orderResult._id}`);
      }
    } catch (error) {
      toast.error(error || 'Payment failed');
      setProcessing(false);
    }
  };

  if (!cart || !cart.items || cart.items.length === 0) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
        <button
          onClick={() => navigate('/products')}
          className="bg-gray-900 text-white px-6 py-3 rounded-lg hover:bg-black transition"
        >
          Continue Shopping
        </button>
      </div>
    );
  }

  const calculateTotal = () => {
    const itemsPrice = cart.items.reduce((total, item) => {
      return total + (item.product.price * item.quantity);
    }, 0);
    const taxPrice = itemsPrice * 0.1;
    const shippingPrice = itemsPrice > 100 ? 0 : 10;
    return itemsPrice + taxPrice + shippingPrice;
  };

  const cardElementOptions = {
    style: {
      base: {
        fontSize: '16px',
        color: '#424770',
        '::placeholder': {
          color: '#aab7c4',
        },
      },
      invalid: {
        color: '#9e2146',
      },
    },
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold mb-6">Checkout</h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h3 className="text-xl font-bold mb-4">Shipping Address</h3>
            <div className="space-y-4">
              <input
                type="text"
                name="address"
                placeholder="Address"
                value={shippingAddress.address}
                onChange={handleAddressChange}
                required
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
              />
              <input
                type="text"
                name="city"
                placeholder="City"
                value={shippingAddress.city}
                onChange={handleAddressChange}
                required
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
              />
              <input
                type="text"
                name="postalCode"
                placeholder="Postal Code"
                value={shippingAddress.postalCode}
                onChange={handleAddressChange}
                required
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
              />
              <input
                type="text"
                name="country"
                placeholder="Country"
                value={shippingAddress.country}
                onChange={handleAddressChange}
                required
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
              />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-bold mb-4">Payment Details</h3>
            <div className="border rounded-lg p-4">
              <CardElement options={cardElementOptions} />
            </div>
          </div>
        </div>
        <div>
          <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
            <h3 className="text-2xl font-bold mb-4">Order Summary</h3>
            <div className="space-y-2 mb-4">
              {cart.items.map((item) => (
                <div key={item._id} className="flex justify-between">
                  <span>
                    {item.product.name} x {item.quantity}
                  </span>
                  <span>${(item.product.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
              <div className="border-t pt-2 mt-2">
                <div className="flex justify-between text-xl font-bold">
                  <span>Total:</span>
                  <span>${calculateTotal().toFixed(2)}</span>
                </div>
              </div>
            </div>
            <button
              type="submit"
              disabled={!stripe || processing || loading}
              className="w-full bg-gray-900 text-white py-3 rounded-lg font-semibold hover:bg-black transition disabled:bg-gray-400"
            >
              {processing ? 'Processing...' : `Pay $${calculateTotal().toFixed(2)}`}
            </button>
          </div>
        </div>
      </div>
    </form>
  );
};

const Checkout = () => {
  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm />
    </Elements>
  );
};

export default Checkout;

