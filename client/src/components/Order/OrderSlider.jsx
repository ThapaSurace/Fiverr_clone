import { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { GrSubtractCircle, GrAddCircle } from "react-icons/gr";
import { useReducer } from "react";
import { INITIAL_STATE, OrderReducer } from "../../reducer/orderReducer";
import { useNavigate } from "react-router-dom";

const OrderSlider = ({ open, setOpen, gig, id }) => {
  const [state, dispatch] = useReducer(OrderReducer, INITIAL_STATE);
  const navigate = useNavigate()
  
  const calculateTotalPrice = () => {
    let total = gig?.price * state.quantity;
    if (state.extras) {
      total += 10; // Extra-fast delivery cost
    }
    return total;
  };

  const totalPrice = calculateTotalPrice()

  const totalPriceWithServiceFee = totalPrice + totalPrice * 0.095

  const handlePayment = () => {
    navigate(`/pay/${id}?totalPrice=${totalPriceWithServiceFee}&quantity=${state.quantity}`); // Passing selectedQuantity
  }

  return (
    <>
     <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={setOpen}>
        <Transition.Child
          as={Fragment}
          enter="ease-in-out duration-500"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in-out duration-500"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-stone-300 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
              <Transition.Child
                as={Fragment}
                enter="transform transition ease-in-out duration-500 sm:duration-700"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transform transition ease-in-out duration-500 sm:duration-700"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
              >
                <Dialog.Panel className="pointer-events-auto relative w-screen max-w-md">
                  <Transition.Child
                    as={Fragment}
                    enter="ease-in-out duration-500"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in-out duration-500"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                  >
                    <div className="absolute left-0 top-0 -ml-8 flex pr-2 pt-4 sm:-ml-10 sm:pr-4">
                      <button
                        type="button"
                        className="relative rounded-md text-gray-300 focus:outline-none"
                        onClick={() => setOpen(false)}
                      >
                        <span className="absolute -inset-2.5" />
                        <span className="sr-only">Close panel</span>
                        <div className="bg-black text-white rounded-full"><XMarkIcon className="h-8 w-8" aria-hidden="true" /></div>
                      </button>
                    </div>
                  </Transition.Child>
                  <div className="flex h-full flex-col overflow-y-scroll bg-white py-6 shadow-xl">
                    <div className="px-4 sm:px-6">
                      <Dialog.Title className="text-base font-semibold leading-6 text-gray-900 border-b border-stone-900 pb-2">
                        Order Options
                      </Dialog.Title>
                    </div>
                    <div className="relative mt-6 flex-1 px-4 sm:px-6">
                      <div className="border-b border-stone-900 pb-6">
                        <div className="flex justify-between">
                          <span className="text-xl font-bold">
                            {gig?.shortTitle}
                          </span>
                          <span className="text-xl">${totalPrice}</span>
                        </div>
                        <p className="mt-6 tracking-wide leading-normal text-stone-600">
                          {gig?.title}
                        </p>
                      </div>

                      <div className="mt-8">
                        <h1 className="mb-4 font-bold text-xl">
                          How often do you need this order?
                        </h1>
                        <div className="border-2 border-stone-950 rounded-md px-4 py-6">
                          <div className="flex justify-between border-b border-stone-500 pb-4">
                            <span className="font-bold text-lg">Total</span>
                            <span className="text-lg">${totalPrice}</span>
                          </div>
                          <div className="flex justify-between mt-4">
                            <span className="text-lg font-semibold">
                              Gig Quantity
                            </span>
                            <div className="flex items-center gap-2">
                              <GrSubtractCircle
                                size={25}
                                className="cursor-pointer"
                                onClick={() => {
                                  if (state.quantity > 1) {
                                    dispatch({
                                      type: "SET_QUANTITY",
                                      payload: state.quantity - 1,
                                    });
                                  }
                                }}
                              />
                              <span className="text-xl">{state.quantity}</span>
                              <GrAddCircle
                                size={25}
                                className="cursor-pointer"
                                onClick={() => {
                                  if (state.quantity < 20) {
                                    dispatch({
                                      type: "SET_QUANTITY",
                                      payload: Math.min(state.quantity + 1, 20), // Ensure quantity doesn't exceed 20
                                    });
                                  }
                                }}
                              />
                            </div>
                          </div>
                        </div>
                      </div>

                     {
                      gig?.deliveryTime >= 4 && (
                        <div className="mt-8">
                        <h1 className="mb-4 font-bold text-xl">
                          Upgrade your order with extras
                        </h1>
                        <div className="border border-stone-500 rounded-md px-4 py-6">
                          <div className="flex items-center justify-between">
                            <p className="font-semibold tracking-wide">
                              Extra-fast 2-day delivery
                            </p>
                            <div className="flex items-center">
                              <input
                                id="default-checkbox"
                                type="checkbox"
                                value=""
                                className="w-4 h-4 text-stone-900 bg-gray-100 border-gray-300 rounded focus:ring-stone-900 
                                focus:ring-2"
                                onChange={() => dispatch({ type: "TOGGLE_EXTRAS" })}
                              />
                              <label
                                htmlFor="default-checkbox"
                                className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                              ></label>
                            </div>
                          </div>
                          <span className="mt-4 font-semibold">$10</span>
                        </div>
                      </div>
                      ) 
                     }

                      <div className="mt-4 flex justify-between items-center">
                        <span className="font-bold text-lg">Service Fee</span>
                        <span className="text-lg">${(calculateTotalPrice() * 0.095).toFixed(2)}</span>
                      </div>

                      <div className="mt-8 w-full">
                        <button className="btn bg-teal hover:bg-darkteal py-2 w-full" onClick={handlePayment}>
                          Continue US(${totalPriceWithServiceFee.toFixed(2)})
                        </button>
                      </div>
                      <div className="flex justify-center items-center mt-1">
                        <span className="text-sm text-center font-bold text-stone-500">
                          You won't be charge yet
                        </span>
                      </div>
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
    </>
  );
};

export default OrderSlider;
