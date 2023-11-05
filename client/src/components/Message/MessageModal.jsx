import React, { useState, Fragment, useEffect, useRef } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { RxCross2 } from "react-icons/rx";
import { IoMdSend } from "react-icons/io";
import { CgAttachment } from "react-icons/cg";
import { BsFillImageFill } from "react-icons/bs";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import newRequest from "../../utils/newRequest";
import { useAuth } from "../../context/AuthContext";
import avtar from "../../assests/avtar.jpg";
import { LazyLoadImage } from "react-lazy-load-image-component";
import upload from "../../utils/upload";

const MessageModal = ({ isOpen, closeModal, cId, uId }) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [file, setFile] = useState("");
  const [docFile, setDocFile] = useState("");
  const [docFileName, setDocFileName] = useState("");
  const [desc, setDesc] = useState("");

  const messagesContainerRef = useRef(null);

  const { isLoading, error, data, refetch } = useQuery({
    queryKey: ["messages"],
    queryFn: () =>
      newRequest.get(`/messages/${cId}`).then((res) => {
        return res.data;
      }),
    enabled: !!cId,
  });

  const { data: uData } = useQuery({
    queryKey: [uId],
    queryFn: () =>
      newRequest.get(`/user/${uId}`).then((res) => {
        return res.data;
      }),
    enabled: !!uId,
  });

  const { mutate, isLoading: mLoading } = useMutation({
    mutationFn: (message) => {
      return newRequest.post(`/message`, message);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["messages"]);
    },
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = await upload(file);
    const docUrl = await upload(docFile);
    mutate({
      conversationId: cId,
      desc: desc,
      img: url,
      docUrl: docUrl,
      docName: docFileName,
    });
    setDesc("");
    setFile("");
    setDocFile("");
    setDocFileName("");
  };

  useEffect(() => {
    refetch();
    if (data && data.length > 0) {
      // Scroll to the bottom of the container after messages are updated
      scrollToBottom();
    }
  }, [cId, data,refetch]);

  const scrollToBottom = () => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop =
        messagesContainerRef.current.scrollHeight;
    }
  };

  const downloadFileFromCloudinary = (url, fileName) => {
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = fileName;
    anchor.style.display = "none"; // Hide the anchor element
    document.body.appendChild(anchor); // Append the anchor to the document
    anchor.click(); // Programmatically trigger the click event
    document.body.removeChild(anchor); // Remove the anchor from the document after download
  };

  return (
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
                    className="text-lg font-bold tracking-wide leading-6 text-teal"
                  >
                    Message {uData?.username}
                  </Dialog.Title>
                  <button
                    type="button"
                    className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-lg font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                    onClick={closeModal}
                  >
                    <RxCross2 />
                  </button>
                </div>

                <div
                  ref={messagesContainerRef}
                  className="mt-2 h-[400px] my-4 flex flex-col gap-5 overflow-y-scroll p-2 scrollbar-thin scrollbar-thumb-lightgray"
                >
                  {isLoading
                    ? "loading..."
                    : error
                    ? "Something went wrong"
                    : data?.map((m) => (
                        <div
                          className={`flex gap-2 max-w-xl mb-2 ${
                            m.userId === user._id
                              ? "justify-end"
                              : "justify-start"
                          }`}
                          key={m._id}
                        >
                          <LazyLoadImage
                            className="inline-block object-cover h-6 w-6 rounded-full cursor-pointer"
                            src={user?.img || avtar}
                            alt="/"
                          />
                          <div className="flex flex-col gap-1">
                            {m?.desc && (
                              <p
                                className={`p-4 text-sm tracking-wide leading-6 rounded-[0px_20px_20px_20px] font-bold inline ${
                                  m.userId === user._id
                                    ? "bg-lightblue text-white"
                                    : "bg-[#cccccc]"
                                }`}
                              >
                                {m.desc}
                              </p>
                            )}

                            {m?.img && (
                              <LazyLoadImage
                                src={m.img}
                                alt="/"
                                // className={`transition-transform duration-300 ease-in-out ${
                                //   isZoomed
                                //     ? "scale-105 cursor-zoom-out"
                                //     : "cursor-zoom-in w-52 mt-4 object-cover object-center  "
                                // }`}
                                className="w-52 mt-4 object-cover object-center"
                              />
                            )}

                            {m?.docName && (
                              <p
                                onClick={() =>
                                  downloadFileFromCloudinary(
                                    m.docUrl,
                                    m.docName
                                  )
                                }
                                className="p-4 mt-4 text-sm text-white tracking-wide leading-6 rounded-[0px_20px_20px_20px] font-bold bg-lightblue cursor-pointer"
                              >
                                {m?.docName}
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                </div>

                <hr className="my-4 text-lightgray" />
                <form
                  className="flex items-center gap-4"
                  onSubmit={handleSubmit}
                >
                  <div>
                    <label htmlFor="file">
                      <BsFillImageFill className="text-xl text-[#98fb98] cursor-pointer" />
                    </label>
                    <input
                      id="file"
                      type="file"
                      name="file"
                      className="hidden"
                      onChange={(e) => setFile(e.target.files[0])}
                    />
                  </div>
                  <div>
                    <label htmlFor="docFile">
                      <CgAttachment className="text-xl cursor-pointer" />
                    </label>
                    <input
                      id="docFile"
                      type="file"
                      name="docFile"
                      className="hidden"
                      onChange={(e) => {
                        setDocFile(e.target.files[0]);
                        if (e.target.files[0]) {
                          setDocFileName(e.target.files[0].name);
                        }
                      }}
                    />
                  </div>
                  <input
                    type="text"
                    placeholder="write your message"
                    className="border-[1px] border-lightgray focus:outline-none px-2 py-3  rounded-md bg-[#f9f9f9] focus:bg-white"
                    value={desc}
                    onChange={(e) => setDesc(e.target.value)}
                  />

                  <button
                    type="submit"
                    disabled={mLoading}
                    className="bg-[#86c5da] px-5 py-3 text-white font-bold rounded-md tracking-wide flex justify-center items-center 
                    hover:bg-[#44a6c6] hover:scale-105 ease-in-out duration-200 disabled:cursor-not-allowed"
                  >
                    <IoMdSend size={22} />
                  </button>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default MessageModal;
