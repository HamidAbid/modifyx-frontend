import React from "react";
import PropTypes from "prop-types";


const CartSummary = ({
  subtotal = 0,
  shipping = 0,
  tax = 0,
  total = 0,
  onCheckout,
}) => {
  return (
    <div className="rounded-lg  p-6 shadow-sm bg-slate-900">
      <h2 className="text-lg font-semibold text-red-600 mb-4 ">
        Order Summary
      </h2>

      <div className="space-y-4 text-sm text-slate-300">
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span>{subtotal.toFixed(2)}</span>
        </div>

        <div className="flex justify-between">
          <span>Shipping</span>
          <span>
            {shipping === 0 ? (
              <span className="text-green-600 font-medium">Free</span>
            ) : (
              `$${shipping.toFixed(2)}`
            )}
          </span>
        </div>

        {shipping > 0 && (
          <p className="text-xs text-red-600 -mt-3 ml-1">
            Free shipping on orders over $100
          </p>
        )}

        <div className="flex justify-between">
          <span>Tax</span>
          <span>{tax.toFixed(2)}</span>
        </div>

        <div className="border-t border-gray-200 pt-4 flex justify-between text-base font-semibold text-gray-900">
          <span>Total</span>
          <span>${total.toFixed(2)}</span>
        </div>
      </div>

      <div className="mt-6">
        <button
          
          
          className="w-full btn p-2"
          onClick={onCheckout}
          aria-label="Proceed to checkout"
        >
          Proceed to Checkout
        </button>
      </div>

      <p className="mt-4 text-xs text-center text-gray-500 leading-relaxed">
        Shipping charges are calculated at checkout based on your location and
        delivery preferences.
      </p>
    </div>
  );
};



export default CartSummary;
