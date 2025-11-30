import { useState, useContext, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import { useCart } from "../context/cartContext";
import { useAuth } from "../context/authContext";
import axios from "axios";

const Checkout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { cartItems, setCartItems } = useCart();
  const { token } = useAuth();
  const stripe = useStripe();
  const elements = useElements();

  const [showConfirmation, setShowConfirmation] = useState(false);
  const [orderNumber, setOrderNumber] = useState("");
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    deliveryNotes: "",
    paymentMethod: "creditCard",
    deliveryOption: "regular",
  });
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [summary, setSummary] = useState({
    subtotal: 0,
    shipping: 0,
    tax: 0,
    sameDayDelivery: 0,
    total: 0,
  });

  useEffect(() => {
    const sameDayDelivery = formData.deliveryOption === "sameDay" ? 5 : 0;
    if (location.state) {
      setSummary({
        subtotal: location.state.subtotal || 0,
        shipping: location.state.shipping || 0,
        tax: location.state.tax || 0,
        sameDayDelivery,
        total: (location.state.total || 0) + sameDayDelivery,
      });
    } else {
      const subtotal = cartItems.reduce(
        (total, item) =>
          total +
          (item.customData?.price || item.product?.price || 0) *
            (item.quantity || 1),
        0
      );
      const shipping = subtotal > 100 ? 0 : 10.99;
      const tax = subtotal * 0.07;
      const total = subtotal + shipping + tax + sameDayDelivery;
      setSummary({ subtotal, shipping, tax, sameDayDelivery, total });
    }
  }, [location.state, cartItems, formData.deliveryOption]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.firstName) errors.firstName = "First name is required";
    if (!formData.lastName) errors.lastName = "Last name is required";
    if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email))
      errors.email = "Valid email is required";
    if (!formData.phone) errors.phone = "Phone number is required";
    if (!formData.address) errors.address = "Address is required";
    if (!formData.city) errors.city = "City is required";
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const errors = validateForm();
    setFormErrors(errors);
    if (Object.keys(errors).length > 0) return setIsSubmitting(false);

    try {
      let paymentMethodId = null;

      if (formData.paymentMethod === "creditCard") {
        const cardElement = elements.getElement(CardElement);
        const { error, paymentMethod } = await stripe.createPaymentMethod({
          type: "card",
          card: cardElement,
          billing_details: {
            name: `${formData.firstName} ${formData.lastName}`,
            email: formData.email,
          },
        });

        if (error) {
          console.error(error);
          return setIsSubmitting(false);
        }

        paymentMethodId = paymentMethod.id;
      }

      const newOrderNumber = `ORD-${Date.now()}`;
      setOrderNumber(newOrderNumber);

      const normalizedItems = cartItems.map((item) => {
        if (item.itemType === "custom") {
          return {
            itemType: "custom",
            name: item.customData.name,
            price: item.customData.price,
            quantity: item.quantity,
            image: item.customData.image,
           
          };
        } else {
          return {
            itemType: "standard",
            product: item.product._id,
            name: item.product.name,
            price: item.product.price,
            quantity: item.quantity,
           
          };
        }
      });

      const orderData = {
        orderNumber: newOrderNumber,
        items: normalizedItems,
        shippingAddress: {
          street: formData.address,
          city: formData.city,
        },
        customer: {
          name: `${formData.firstName} ${formData.lastName}`,
          email: formData.email,
          phone: formData.phone,
        },
        paymentMethod: formData.paymentMethod,
        deliveryOption: formData.deliveryOption,
        shippingCharges: summary.shipping,
        total: summary.total,
        stripePaymentMethodId: paymentMethodId,
      };
      console.log(orderData);
      const response = await axios.post(
        "/api/orders/payment",
        { orderData },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response || response.status >= 400) {
        throw new Error("Failed to save order to database");
      }

      console.log("Order saved to database");
      setShowConfirmation(true);
      setCartItems([]);
    } catch (err) {
      console.error("Checkout error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCloseConfirmation = () => {
    setShowConfirmation(false);
    navigate("/");
  };

  return (
    <div className="bg-slate-950 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-6 text-red-600 text-center">
          Checkout
        </h1>
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 lg:grid-cols-3 gap-8"
          autoComplete='off'
          
        >
          <div className="lg:col-span-2">
            <div className="bg-slate-900 p-6 rounded shadow">
              <input
                type="text"
                name="firstName"
                placeholder="First Name"
                value={formData.firstName}
                onChange={handleInputChange}
                className="input-field w-full mb-4 p-2 text-medium bg-slate-800 outline-none border-none"
              />
              <input
                type="text"
                name="lastName"
                placeholder="Last Name"
                value={formData.lastName}
                onChange={handleInputChange}
                className="input-field w-full mb-4 p-2 text-medium bg-slate-800 outline-none border-none"
              />
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleInputChange}
                className="input-field w-full mb-4 p-2 text-medium bg-slate-800 outline-none border-none"
              />
              <input
                type="tel"
                name="phone"
                placeholder="Phone"
                value={formData.phone}
                onChange={handleInputChange}
                className="input-field w-full mb-4 p-2 text-medium bg-slate-800 outline-none border-none"
              />
              <input
                type="text"
                name="address"
                placeholder="Address"
                value={formData.address}
                onChange={handleInputChange}
                className="input-field w-full mb-4 p-2 text-medium bg-slate-800 outline-none border-none"
              />
              <input
                type="text"
                name="city"
                placeholder="City"
                value={formData.city}
                onChange={handleInputChange}
                className="input-field w-full mb-4 p-2 text-medium bg-slate-800 outline-none border-none"
              />

              <div className="mb-4 text-white">
                <label className="mr-4">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="creditCard"
                    checked={formData.paymentMethod === "creditCard"}
                    onChange={handleInputChange}
                  /> {" "}
                   Credit Card
                </label>
                <label className="ml-4">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="cashOnDelivery"
                    checked={formData.paymentMethod === "cashOnDelivery"}
                    onChange={handleInputChange}
                  />{" "}
                  Cash on Delivery
                </label>
              </div>

              {formData.paymentMethod === "creditCard" && (
                <div className="mb-6">
                  <label className="block mb-2 text-sm font-medium text-red-600">
                    Card Details
                  </label>
                  <div className="p-4 text-white border rounded-md">
                    <CardElement
  id="card-element"
  options={{
    hidePostalCode: true,
    style: {
      base: {
        color: "#ffffff",
        fontSize: "16px",
        fontFamily: "Inter, sans-serif",
        "::placeholder": {
          color: "#9ca3af", // placeholder text color
        },
      },
      invalid: {
        color: "#ff4d4f",
      },
    },
  }}
/>

                  </div>
                </div>
              )}
            </div>
          </div>

          <div>
            <div className="bg-slate-900 p-6 rounded shadow sticky top-8 text-slate-200">
              <h2 className="text-lg font-semibold mb-4 text-red-600">Order Summary</h2>
              <p className="flex justify-between items-center"><span>Subtotal:</span> <span>PKR {summary.subtotal.toFixed(2)}</span></p>
              <p className="flex justify-between items-center"><span>Shipping:</span> <span>PKR {summary.shipping.toFixed(2)}</span></p>
              <p className="flex justify-between items-center"><span>Tax:</span> <span>PKR {summary.tax.toFixed(2)}</span></p>
              {formData.deliveryOption === "sameDay" && (
                <p>
                  Same Day Delivery: PKR {summary.sameDayDelivery.toFixed(2)}
                </p>
              )}
              <hr className="my-4" />
              <p className="font-bold text-lg text-red-600">
                Total: PKR {summary.total.toFixed(2)}
              </p>
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn p-2 w-full mt-6 "
              >
                {isSubmitting ? "Processing..." : "Place Order"}
              </button>
            </div>
          </div>
        </form>

        {showConfirmation && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 p-6 text-center">
              <h2 className="text-2xl font-bold text-green-600 mb-4">
                Thank You!
              </h2>
              <p>
                Your order has been placed successfully. And a Email sent to
                your Mail
              </p>
              <button
                onClick={handleCloseConfirmation}
                className="btn-primary mt-6"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Checkout;
