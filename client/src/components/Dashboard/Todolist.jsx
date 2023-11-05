import React, { useState } from "react";
import { useGetOrderQuery } from "../../api/OrderApi/OrderApi";
import OrderDeliveryModal from "../../components/Order/Seller/OrderDeliveryModal";
import {MdDoubleArrow} from "react-icons/md"
import { Link } from "react-router-dom";

const Todolist = () => {
  let [isOpen, setIsOpen] = useState(false);
  const [orderId, setOrderId] = useState("");

  function openModal(id) {
    setIsOpen(true);
    setOrderId(id);
  }

  const { data, isLoading, error } = useGetOrderQuery();

  const acceptedOrders = data?.filter(order => !order.acceptedByBuyer);


  return (
    <>
      <div className="text-2xl text-darkteal font-bold">Todo List</div>
      <div>
        {isLoading ? (
          "loading"
        ) : error ? (
          "Something went wrong!!"
        ) :
        acceptedOrders?.length === 0 ? (
          <div className="mt-2 font-bold text-slate-400">
            You dont have any work to do!!
          </div>
        )
        :(
          <div className="relative overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                <tr>
                  <th className="px-2 py-3">
                    Order Id
                  </th>
                  <th className="px-2 py-3">
                    quantity
                  </th>
                  <th className="px-2 py-3">
                    price
                  </th>
                  <th className="px-2 py-3">
                    delivery status
                  </th>
                  <th className="px-2 py-3">
                    time remaning
                  </th>
                  <th className="px-2 py-3">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {acceptedOrders.map((order) => (
                  <tr key={order._id} className="bg-white border-b border-teal">
                    <td
                    
                      className="px-2 py-4 font-medium text-gray-900"
                    >
                      {order._id}
                    </td>
                    <td className="px-2 py-4">{order.quantity}</td>
                    <td className="px-2 py-4">${order.totalPrice}</td>
                    <td className={`px-2 py-4`}>
                      <span
                        className={`p-1 rounded-md font-bold tracking-wider text-white ${
                          order.deliveryStatus === "inProgress" &&
                          "bg-green-400"
                        }
                        ${order.deliveryStatus === "delivered" && "bg-rose-400"}
                        ${order.deliveryStatus === "late" && "bg-red-400"}
                        `}
                      >
                        {order.deliveryStatus}
                      </span>
                    </td>
                    <td className="px-2 py-4">{order.remainingDays} days</td>
                    <td className="px-2 py-4 flex gap-1 items-end">
                      <button
                        onClick={() => openModal(order._id)}
                        className="btn px-2 py-1 bg-violet-800 hover:bg-violet-950"
                      >
                        Deliver Now
                      </button>
                      <Link to={`/order/details/${order._id}`}>
                      <span className=" flex gap-1 items-center bg-slate-800 hover:bg-slate-950 text-white font-bold py-1 px-2 rounded-md"><span>More Details</span> <MdDoubleArrow /></span></Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      <OrderDeliveryModal isOpen={isOpen} setIsOpen={setIsOpen} id={orderId} />
    </>
  );
};

export default Todolist;
