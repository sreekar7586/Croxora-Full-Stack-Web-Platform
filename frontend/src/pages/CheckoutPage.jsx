import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import api from '../utils/api';
import { useCartStore } from '../store/cartStore';
import toast from 'react-hot-toast';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const CheckoutForm = ({ cart, shippingAddress }) => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const [processing, setProcessing] = useState(false);
  const { clearCart } = useCartStore();

  const calculateTotal = () => {
    const itemsPrice = cart.totalPrice;
    const shippingPrice = itemsPrice > 50 ? 0 : 5.99;
    const taxPrice = itemsPrice * 0.1;
    const totalPrice = itemsPrice + shippingPrice + taxPrice;
    return { itemsPrice, shippingPrice, taxPrice, totalPrice };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setProcessing(true);

    try {
      const { itemsPrice, shippingPrice, taxPrice, totalPrice } = calculateTotal();

      // Create order
      const orderData = {
        orderItems: cart.items.map(item => ({
          product: item.product._id,
          name: item.product.name,
          quantity: item.quantity,
          price: item.price,
          image: item.product.images?.[0]?.url
        })),
        shippingAddress,
        paymentMethod: 'stripe',
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice
      };

      const { data: orderResponse } = await api.post('/orders', orderData);
      const order = orderResponse.data;

      // Create payment intent
      const { data: paymentData } = await api.post('/payment/create-intent', {
        amount: totalPrice,
        orderId: order._id
      });

      // Confirm payment
      const { error, paymentIntent } = await stripe.confirmCardPayment(
        paymentData.data.clientSecret,
        {
          payment_method: {
            card: elements.getElement(CardElement),
          }
        }
      );

      if (error) {
        throw new Error(error.message);
      }

      if (paymentIntent.status === 'succeeded') {
        // Confirm payment on backend
        await api.post('/payment/confirm', {
          paymentIntentId: paymentIntent.id,
          orderId: order._id
        });

        toast.success('Order placed successfully!');
        await clearCart();
        navigate('/orders');
      }
    } catch (error) {
      console.error('Payment error:', error);
      toast.error(error.message || 'Payment failed');
    } finally {
      setProcessing(false);
    }
  };

  const { itemsPrice, shippingPrice, taxPrice, totalPrice } = calculateTotal();

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title">Payment Information</h2>
          <div className="p-4 border rounded-lg">
            <CardElement
              options={{
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
              }}
            />
          </div>
        </div>
      </div>

      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title">Order Summary</h2>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Items</span>
              <span>${itemsPrice.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping</span>
              <span>{shippingPrice === 0 ? 'FREE' : `$${shippingPrice.toFixed(2)}`}</span>
            </div>
            <div className="flex justify-between">
              <span>Tax</span>
              <span>${taxPrice.toFixed(2)}</span>
            </div>
            <div className="divider"></div>
            <div className="flex justify-between text-xl font-bold">
              <span>Total</span>
              <span>${totalPrice.toFixed(2)}</span>
            </div>
          </div>

          <button
            type="submit"
            disabled={!stripe || processing}
            className="btn btn-primary btn-block mt-4"
          >
            {processing ? (
              <span className="loading loading-spinner"></span>
            ) : (
              `Pay $${totalPrice.toFixed(2)}`
            )}
          </button>
        </div>
      </div>
    </form>
  );
};

const CheckoutPage = () => {
  const { cart, fetchCart } = useCartStore();
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [step, setStep] = useState(1);
  const [shippingAddress, setShippingAddress] = useState(null);

  useEffect(() => {
    fetchCart();
  }, []);

  const onSubmitAddress = (data) => {
    setShippingAddress(data);
    setStep(2);
  };

  if (!cart || cart.items?.length === 0) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Checkout</h1>

      <div className="max-w-2xl mx-auto">
        {/* Steps */}
        <ul className="steps steps-horizontal w-full mb-8">
          <li className={`step ${step >= 1 ? 'step-primary' : ''}`}>Shipping</li>
          <li className={`step ${step >= 2 ? 'step-primary' : ''}`}>Payment</li>
        </ul>

        {step === 1 && (
          <form onSubmit={handleSubmit(onSubmitAddress)} className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title">Shipping Address</h2>
              
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Street Address</span>
                </label>
                <input
                  type="text"
                  className={`input input-bordered ${errors.street ? 'input-error' : ''}`}
                  {...register('street', { required: 'Street address is required' })}
                />
                {errors.street && (
                  <label className="label">
                    <span className="label-text-alt text-error">{errors.street.message}</span>
                  </label>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">City</span>
                  </label>
                  <input
                    type="text"
                    className={`input input-bordered ${errors.city ? 'input-error' : ''}`}
                    {...register('city', { required: 'City is required' })}
                  />
                  {errors.city && (
                    <label className="label">
                      <span className="label-text-alt text-error">{errors.city.message}</span>
                    </label>
                  )}
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">State</span>
                  </label>
                  <input
                    type="text"
                    className={`input input-bordered ${errors.state ? 'input-error' : ''}`}
                    {...register('state', { required: 'State is required' })}
                  />
                  {errors.state && (
                    <label className="label">
                      <span className="label-text-alt text-error">{errors.state.message}</span>
                    </label>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Zip Code</span>
                  </label>
                  <input
                    type="text"
                    className={`input input-bordered ${errors.zipCode ? 'input-error' : ''}`}
                    {...register('zipCode', { required: 'Zip code is required' })}
                  />
                  {errors.zipCode && (
                    <label className="label">
                      <span className="label-text-alt text-error">{errors.zipCode.message}</span>
                    </label>
                  )}
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Country</span>
                  </label>
                  <input
                    type="text"
                    className={`input input-bordered ${errors.country ? 'input-error' : ''}`}
                    {...register('country', { required: 'Country is required' })}
                  />
                  {errors.country && (
                    <label className="label">
                      <span className="label-text-alt text-error">{errors.country.message}</span>
                    </label>
                  )}
                </div>
              </div>

              <button type="submit" className="btn btn-primary btn-block mt-4">
                Continue to Payment
              </button>
            </div>
          </form>
        )}

        {step === 2 && (
          <Elements stripe={stripePromise}>
            <CheckoutForm cart={cart} shippingAddress={shippingAddress} />
          </Elements>
        )}
      </div>
    </div>
  );
};

export default CheckoutPage;
