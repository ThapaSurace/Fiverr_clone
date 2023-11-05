import React, { useEffect, useState } from "react";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import newRequest from "../../utils/newRequest";
import { useLocation, useParams } from "react-router-dom";
import CheckoutForm from "../../components/Order/CheckoutForm";
import { GiDragonHead } from "react-icons/gi";

const stripePromise = loadStripe(
  "pk_test_51MA7IMJ2OBAH3T0wYna1oHGUfWpwXDQjakHApKXk5tZzFVFAlr9o82gT2ll2wpKFhBfoS2oFcvyLZcJCSFyd1qGn00E8xWYz5S"
);

const Pay = () => {
  const [clientSecret, setClientSecret] = useState("");

  const { id } = useParams();

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const totalPrice = searchParams.get('totalPrice');
  const quantity = searchParams.get('quantity');

  useEffect(() => {
    if (id && totalPrice && quantity) { // Check if both id and totalPrice are present
      const makeRequest = async () => {
        try {
          const res = await newRequest.post(`/orders/create-payment-intent/${id}`, {
            totalPrice,
            quantity
          });
          setClientSecret(res.data.clientSecret);
        } catch (err) {
          console.log(err);
        }
      };
      makeRequest();
    }
  }, [id, totalPrice, quantity]); 

  const appearance = {
    theme: "stripe",
  };

  const options = {
    clientSecret,
    appearance,
  };

  return (
    <>
      <div className="sticky top-0 z-40 border-b border-stone-400 py-4">
        <div className="container">
          <div className="cursor-pointer text-xl tracking-wide font-bold flex items-center gap-1">
            <span>
              <GiDragonHead size={40} />
            </span>
            <span>
              Gi<span className="logo">g</span>Co
              <span className="logo">nn</span>ect.
            </span>
          </div>
        </div>
      </div>
      <div className="mt-8">
        {clientSecret && (
          <Elements options={options} stripe={stripePromise}>
            <CheckoutForm />
          </Elements>
        )}
      </div>
      <div className="border-t border-stone-400 py-4 ">
        <div className="container">
          <p className="text-sm text-stone-400">
            Payments are processed by GigScout International Ltd., Gig Limited,
            and Gig Inc. See{" "}
            <span className="text-stone-800">Payment Terms</span>
          </p>
        </div>
      </div>
    </>
  );
};

export default Pay;
