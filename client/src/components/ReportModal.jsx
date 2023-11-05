import React from "react";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useState } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { RadioGroup } from "@headlessui/react";
import { useMutation } from "@tanstack/react-query";
import newRequest from "../utils/newRequest";
import { plans } from "../data";

const ReportModal = ({ isOpen, setIsOpen,id }) => {
  const [selected, setSelected] = useState(null);
  const [desc, setDesc] = useState("");

  function closeModal() {
    setIsOpen(false);
    setSelected(null);
  }

  const {mutate, isLoading} = useMutation({
    mutationFn: async (report) => {
      await newRequest.post(`/report`,report);
    },
  })

  const submitReport = () => {
    console.log(id)
    const reportDetail = {
      gigId: id,
      reportType: selected?.name,
      desc
    }
    mutate(reportDetail)
    closeModal()
  }

  return (
    <>
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={closeModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900 flex justify-between items-center border-b border-stone-500 pb-4"
                  >
                    <h1 className="text-xl capitalize font-bold">
                      Report this gig
                    </h1>
                    <XMarkIcon
                      className="h-8 w-8 cursor-pointer"
                      aria-hidden="true"
                      onClick={closeModal}
                    />
                  </Dialog.Title>
                  <div className="mt-2">
                    <div>
                      <p className="text-lg font-bold text-stone-800">
                        Let us know why you would like to report this Gig
                      </p>
                      <span className="font-bold text-sm text-stone-500">
                        Your report will be kept anonymous
                      </span>
                    </div>
                    <div>
                      <div className="w-full px-4 py-4">
                        <div className="mx-auto w-full max-w-md">
                          <RadioGroup value={selected} onChange={setSelected}>
                            <RadioGroup.Label className="sr-only">
                              Server size
                            </RadioGroup.Label>
                            <div className="space-y-2">
                              {plans.map((plan) => (
                                <RadioGroup.Option
                                  key={plan.name}
                                  value={plan}
                                  className={({ active, checked }) =>
                                    `${
                                      active
                                        ? "ring-2 ring-white ring-opacity-60 ring-offset-2 ring-offset-sky-300"
                                        : ""
                                    }
                  ${
                    checked ? "bg-sky-900 bg-opacity-75 text-white" : "bg-white"
                  }
                    relative flex cursor-pointer rounded-lg px-5 py-4 shadow-custom focus:outline-none`
                                  }
                                >
                                  {({ active, checked }) => (
                                    <>
                                      <div className="flex w-full items-center justify-between">
                                        <div className="flex items-center">
                                          <div className="text-sm">
                                            <RadioGroup.Label
                                              as="p"
                                              className={`font-medium  ${
                                                checked
                                                  ? "text-white"
                                                  : "text-gray-900"
                                              }`}
                                            >
                                              {plan.name}
                                            </RadioGroup.Label>
                                          </div>
                                        </div>
                                        {checked && (
                                          <div className="shrink-0 text-white">
                                            <CheckIcon className="h-6 w-6" />
                                          </div>
                                        )}
                                      </div>
                                    </>
                                  )}
                                </RadioGroup.Option>
                              ))}
                            </div>
                          </RadioGroup>
                        </div>
                      </div>
                      {selected && (
                        <div className="px-4">
                          <label
                            htmlFor="desc"
                            className="font-semibold text-stone-500"
                          >
                            Additional information (optional)
                          </label>
                          <textarea
                            name="desc"
                            id="desc"
                            cols="30"
                            rows="4"
                            onChange={(e) => setDesc(e.target.value)}
                          ></textarea>
                        </div>
                      )}
                      <div>
                        <button onClick={submitReport} disabled={isLoading} className="btn w-full py-2 mt-4 bg-darkteal">{
                          isLoading ? "loading..." : "Submit"
                        }</button>
                      </div>
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};

function CheckIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <circle cx={12} cy={12} r={12} fill="#fff" opacity="0.2" />
      <path
        d="M7 13l3 3 7-7"
        stroke="#fff"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default ReportModal;
