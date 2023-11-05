import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { RxCross2 } from "react-icons/rx";
import { useModal } from "../../context/AuthModalContext";
import Register from "./Register";
import Login from "./Login";

const AuthModal = () => {
  const { closeModal, modalContent, currentContent } = useModal();
  const isOpen = !!modalContent; // Derive isOpen based on modalContent
  return (
    <>
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog
          open={isOpen}
          onClose={closeModal}
          as="div"
          className="relative z-10"
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-stone-300 bg-opacity-75" />
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
                <Dialog.Panel
                  className="w-full max-w-md transform overflow-hidden rounded-2xl 
                bg-white p-6 text-left align-middle shadow-xl transition-all"
                >
                  <div className="flex justify-end">
                    <div>
                      <RxCross2
                        size={25}
                        onClick={closeModal}
                        className="cursor-pointer"
                      />
                    </div>
                  </div>
                  {currentContent === "login" ? <Login /> : <Register />}
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};

export default AuthModal;
