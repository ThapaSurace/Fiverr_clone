import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { RxCross2 } from "react-icons/rx";
import {AiTwotoneFileZip} from "react-icons/ai"

const RequirementDetailsModal = ({ isOpen, setIsOpen, requirements }) => {
  function closeModal() {
    setIsOpen(false);
  }
  const imageExtensions = [".jpg", ".jpeg", ".png", ".gif", ".svg"];

  const getFileNameFromURL = (url) => {
    const segments = url?.split("/");
    return segments[segments?.length - 1];
  };

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
                  <div className="flex justify-between items-center border-b-2 border-teal pb-4">
                    <Dialog.Title
                      as="h3"
                      className="text-xl font-bold leading-6 text-stone-900"
                    >
                      Order Requirements
                    </Dialog.Title>
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-lg font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                      onClick={closeModal}
                    >
                      <RxCross2 />
                    </button>
                  </div>

                  <div className="py-4">
                    <div>
                      <h1 className="text-lg font-bold text-slate-900">
                        Description:
                      </h1>
                      <p>{requirements.description}</p>
                    </div>
                    <div className="mt-6">
                      <h1 className="text-lg font-bold text-slate-900">
                        Documents:
                      </h1>
                      {requirements.document?.map((doc, index) => (
                        <div key={index} className="py-2">
                          <a
                            href={doc}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {imageExtensions.some((ext) =>
                              doc?.toLowerCase().endsWith(ext)
                            ) ? (
                              <>
                              <h1 className="font-bold capitalize text-darkteal mb-1">Images</h1>
                                <img
                                  src={doc}
                                  alt={`${index}`}
                                  className=" w-64 object-cover object-center"
                                />
                                <br />
                              </>
                            ) : (
                              <>
                               <div className="flex flex-col gap-2">
                                <h1 className="font-bold capitalize text-darkteal mb-1">files</h1>
                                <div className=" bg-slate-600 p-2 rounded-md font-bold text-white flex gap-1 items-center">
                                <AiTwotoneFileZip />
                               <span>{getFileNameFromURL(doc)} </span>
                                </div>
                               </div>
                                <br />
                              </>
                            )}
                          </a>
                        </div>
                      ))}
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

export default RequirementDetailsModal;
