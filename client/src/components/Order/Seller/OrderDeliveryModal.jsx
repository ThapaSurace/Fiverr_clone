import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useState } from "react";
import { RxCross2 } from "react-icons/rx";
import { CgAttachment } from "react-icons/cg";
import upload from "../../../utils/upload";
import { AiFillFileText } from "react-icons/ai";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import newRequest from "../../../utils/newRequest";

const OrderDeliveryModal = ({ isOpen, setIsOpen, id }) => {
  const [files, setMultipleFiles] = useState([]);
  const [uploadedFile, setUploadedFile] = useState([]);
  const [desc, setDesc] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const queryClient = useQueryClient();

  function closeModal() {
    setIsOpen(false);
    setUploadedFile([]);
    setDesc("");
  }

  const handleUpload = async () => {
    setIsLoading(true);
    try {
      const mfiles = await Promise.all(
        [...files].map(async (file) => {
          const url = await upload(file);
          return url;
        })
      );
      setUploadedFile(mfiles);
      setIsLoading(false);
      setDesc("");
    } catch (err) {
      console.log(err);
    }
  };

  const handleRemoveFile = (index) => {
    const updatedFiles = [...uploadedFile];
    updatedFiles.splice(index, 1);
    setUploadedFile(updatedFiles);
  };

  const { mutate } = useMutation({
    mutationFn: async (finishedProduct) => {
      await newRequest.put(`/order/delivered/${id}`,finishedProduct);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["orders"]);
    },
  });
  

  const submitOrder = () => {
    if (uploadedFile?.length === 0) {
      // Don't submit if no files are uploaded
      return;
    }
    const finishedProduct = {
      document: uploadedFile,
      description: desc,
    };
    mutate(finishedProduct);
    closeModal();
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
                      Deliver Order
                    </Dialog.Title>
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-lg font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                      onClick={closeModal}
                    >
                      <RxCross2 />
                    </button>
                  </div>
                  <div className="mt-6">
                    <div className="flex gap-4">
                      <label
                        className="label gap-1 items-center border border-slate-400 rounded-md px-2 py-1 cursor-pointer inline-block"
                        htmlFor="images"
                      >
                        <div className="flex gap-1 items-center">
                          <span>
                            <CgAttachment />
                          </span>
                        </div>
                      </label>
                      <button
                        disabled={isLoading}
                        className="btn px-2 py-1 bg-darkteal disabled:bg-opacity-40"
                        onClick={handleUpload}
                      >
                        {isLoading ? "Uploading..." : "Upload file"}
                      </button>
                    </div>
                    <input
                      className="hidden border-none focus:outline-none cursor-pointer file:border-none file:hover:border-2 file:font-bold file:bg-teal fil file:text-white file:hover:bg-[#5f9ea0]  file:cursor-pointer w-min file:rounded-lg file:px-2 file:py-1 "
                      type="file"
                      id="images"
                      multiple
                      onChange={(e) => setMultipleFiles(e.target.files)}
                    />
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {uploadedFile.map((url, index) => (
                      <div key={index} className="mt-2">
                        {url.toLowerCase().endsWith(".png") ||
                        url.toLowerCase().endsWith(".jpg") ||
                        url.toLowerCase().endsWith(".jpeg") ||
                        url.toLowerCase().endsWith(".gif") ||
                        url.toLowerCase().endsWith(".svg") ? (
                          <div className=" w-36 relative">
                            <LazyLoadImage
                              src={url}
                              alt={index}
                              className="h-w-full  object-center object-cover rounded-md"
                            />
                            <RxCross2
                              className="absolute top-2 right-2 bg-black text-white text-xl cursor-pointer"
                              onClick={() => handleRemoveFile(index)}
                            />
                            <span className="font-bold">
                              {" "}
                              {files[index]?.name}
                            </span>
                          </div>
                        ) : (
                          <div>
                            <div className="mb-4 font-bold tracking-wide flex gap-1 items-center">
                              <span className="text-white bg-red-400 px-2 py-1 rounded-md flex gap-1 items-center">
                                <AiFillFileText />{" "}
                                <span className="text-sm">
                                  {files[index]?.name}
                                </span>
                              </span>
                              <RxCross2
                                size={22}
                                onClick={() => handleRemoveFile(index)}
                                className="text-red-600 cursor-pointer"
                              />
                            </div>
                            {/* <a
                              href={url}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              No. of Document: {index + 1}
                            </a> */}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                  <div>
                    <p className="text-end font-semibold text-slate-700">
                      {" "}
                      No of Documents: {uploadedFile?.length}
                    </p>
                  </div>
                  <div className="flex flex-col gap-1 mt-6 border-t border-stone-500 pt-4">
                    <label className="label" htmlFor="desc">
                      Description
                    </label>
                    <textarea
                      name="desc"
                      id="desc"
                      cols="30"
                      rows="3"
                      placeholder="Say Something..."
                      value={desc}
                      onChange={(e) => setDesc(e.target.value)}
                    ></textarea>
                  </div>
                  <button
                    disabled={isLoading || uploadedFile?.length === 0}
                    onClick={submitOrder}
                    className="btn py-2 w-full mt-4 bg-darkteal hover:bg-blackteal disabled:bg-opacity-40 disabled:cursor-not-allowed"
                  >
                    Send
                  </button>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};

export default OrderDeliveryModal;
