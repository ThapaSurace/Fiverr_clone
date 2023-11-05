import React, { useEffect, useState } from "react";

const OrderDetails = ({ data, isLoading, error }) => {

  const sericeFee = data?.totalPrice * 0.095;

  const deliveryTimeInDays = data?.deliveryTime;


  const [remainingTime, setRemainingTime] = useState(null);

  useEffect(() => {
    if (data) {
      const createdAtDate = new Date(data.createdAt);
      const deliveryDate = new Date(createdAtDate);
      deliveryDate.setDate(createdAtDate.getDate() + deliveryTimeInDays);
  

      const interval = setInterval(() => {
        const currentTime = new Date();
        const timeDifference = deliveryDate - currentTime;

        if (timeDifference > 0) {
          const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
          const hours = Math.floor(
            (timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
          );
          const minutes = Math.floor(
            (timeDifference % (1000 * 60 * 60)) / (1000 * 60)
          );
          const seconds = Math.floor((timeDifference % (1000 * 60)) / 1000);

          setRemainingTime({ days, hours, minutes, seconds });
        } else {
          clearInterval(interval);
          setRemainingTime({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        }
      }, 1000);

      return () => {
        clearInterval(interval);
      };
    }
  }, [data,deliveryTimeInDays]);

  const formatTime = (time) => {
    return time < 10 ? `0${time}` : time;
  };

  return (
    <>
      {isLoading ? (
        "loading..."
      ) : error ? (
        "Something went wrong!!"
      ) : (
        <div className="p-4 min-h-[60vh]">
         
         
               <div className="flex justify-between">
            <div className="flex gap-2 items-center">
              <img
                src={data?.cover}
                alt="/"
                className="w-10 h-10 object-cover object-center rounded-full"
              />
              <p className="font-bold text-slate-800 text-xl">
                {data?.title}
              </p>
            </div>
            <div className="text-slate-800 text-xl font-bold">
              <span>Price: </span>
              <span>${data?.price}</span>
            </div>
          </div>
              

          <div className="mt-6 border-t border-stone-500 pt-2">
            <ul className="grid grid-cols-5 gap-6 mb-2 font-bold text-slate-950 border-b border-stone-500 pb-2">
              <li>Item</li>
              <li>Quantity</li>
              <li>Duration</li>
              <li>Revision</li>
              <li>Price</li>
            </ul>
            <ul className="grid grid-cols-5 gap-6">
              <li className="text-sm font-bold text-slate-600">
                {data?.shortDesc}
              </li>
              <li>{data.quantity}</li>
              <li>{data.deliveryTime} days</li>
              <li>{data.revisionNumber} left</li>
              <li>${data.totalPrice}</li>
            </ul>
            <ul className="grid grid-cols-4 gap-6 mt-6">
              <li className="text-lg font-bold text-slate-600 col-span-3">
                Service Fee
              </li>
              <li className="font-bold">${sericeFee.toFixed(2)}</li>
            </ul>

            <ul className="grid grid-cols-4 gap-6 mt-6">
              <li className="text-lg font-bold text-slate-600 col-span-3">
                Total
              </li>
              <li className="font-bold">
                ${(data.totalPrice + sericeFee).toFixed(2)}
              </li>
            </ul>
          </div>
          {!data.acceptedByBuyer && (
            <>
              <div className="text-gray-800 mt-8 flex justify-center border-t-2 border-slate-950">
                <div className="flex flex-col items-center">
                  <span className="font-bold text-2xl text-slate-900 mb -mt-5 bg-white px-2">
                    Remaining Time
                  </span>
                  {remainingTime ? (
                    <span className=" flex gap-2 mt-6">
                      <span className="bg-rose-600 text-xl font-bold text-white p-4 rounded-md">
                        {remainingTime.days}d
                      </span>{" "}
                      <span className="bg-rose-600 text-xl font-bold text-white p-4 rounded-md">
                        {formatTime(remainingTime.hours)}h
                      </span>
                      <span className="bg-rose-600 text-xl font-bold text-white p-4 rounded-md">
                        {formatTime(remainingTime.minutes)}m
                      </span>
                      <span className="bg-rose-600 text-xl font-bold text-white p-4 rounded-md">
                        {formatTime(remainingTime.seconds)}s
                      </span>
                    </span>
                  ) : (
                    "Calculating..."
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      )}
      <div>
        {/* <p>Created At: {createdAt.toString()}</p>
      <p>Delivery Time: {deliveryTimeInDays} days</p>
      <p>Estimated Delivery Date: {deliveryDate ? deliveryDate.toString() : 'Calculating...'}</p> */}
      </div>
    </>
  );
};

export default OrderDetails;
