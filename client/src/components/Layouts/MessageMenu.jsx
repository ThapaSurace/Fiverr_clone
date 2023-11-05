import { Popover, Transition } from "@headlessui/react";
import { Fragment, useState } from "react";
import { AiFillMessage } from "react-icons/ai";
import { useAuth } from "../../context/AuthContext";
import newRequest from "../../utils/newRequest";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useGetConservationQuery } from "../../api/MessageApi/MessageApi";
import avtar from "../../assests/avtar.jpg";
import { LazyLoadImage } from "react-lazy-load-image-component";
import moment from "moment";
import MessageModal from "../Message/MessageModal";

const MessageMenu = () => {
  const { user } = useAuth();
  let [isOpen, setIsOpen] = useState(false);
  const [selectedConversationId, setSelectedConversationId] = useState(null);
  const [buyerNames, setBuyerNames] = useState({});
  const [sellerNames, setSellerNames] = useState({});
  const [uId, setUId] = useState("");

  function closeModal() {
    setIsOpen(false);
    setSelectedConversationId(null);
  }
  const queryClient = useQueryClient();

  const { isLoading, error, data } = useGetConservationQuery();

  useQuery({
    queryKey: ["userss"],
    queryFn: () =>
      Promise.all([
        ...data?.map((data) =>
          newRequest.get(`/user/${data.buyerId}`).then((res) => res.data)
        ),
        ...data?.map((data) =>
          newRequest.get(`/user/${data.sellerId}`).then((res) => res.data)
        ),
      ]).then((users) => {
        const [buyerDetails, sellerDetails] = users.reduce(
          (acc, user, index) => {
            if (index < data.length) {
              acc[0][data[index].buyerId] = user;
            } else {
              acc[1][data[index - data.length].sellerId] = user;
            }
            return acc;
          },
          [{}, {}]
        );
        setBuyerNames(buyerDetails);
        setSellerNames(sellerDetails);
        return { buyerDetails, sellerDetails };
      }),
    enabled: !!data?.length, // Run the query when there is data available
  });

  //update marked as read
  const mutation = useMutation({
    mutationFn: async (id) => {
      await newRequest.put(`/conversation/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["conversations"]);
    },
  });

  const handleLastMessageClick = (id) => {
    mutation.mutate(id)
    setSelectedConversationId(id); // Set the selected conversation ID when the "Last Message" link is clicked
    setIsOpen(true); // Open the message modal

    const selectedConversation = data.find(
      (conversation) => conversation.id === id
    );
    const selectedUserId = user?.isSeller
      ? selectedConversation?.buyerId
      : selectedConversation?.sellerId;
    setUId(selectedUserId);
  };

  const filteredUnreadConversations = data?.filter((conversation) => {
    if (user.isSeller) {
      return !conversation.readBySeller;
    } else {
      return !conversation.readByBuyer;
    }
  });

  return (
    <>
      <Popover className="relative z-50">
        {({ open }) => (
          <>
            <Popover.Button
              className={`
            ${open ? "" : "text-opacity-90"}
            relative group inline-flex items-center rounded-md  py-2 text-base font-medium hover:text-opacity-100 px-2`}
            >
              <AiFillMessage size={25} />
              {filteredUnreadConversations?.length > 0 && (
                <span className="absolute top-0 -right-2 font-bold">
                  ({filteredUnreadConversations?.length})
                </span>
              )}
            </Popover.Button>
            <Transition
              as={Fragment}
              enter="transition ease-out duration-200"
              enterFrom="opacity-0 translate-y-1"
              enterTo="opacity-100 translate-y-0"
              leave="transition ease-in duration-150"
              leaveFrom="opacity-100 translate-y-0"
              leaveTo="opacity-0 translate-y-1"
            >
              <Popover.Panel
                className="absolute left-1/2 z-50 mt-3 -translate-x-1/2 transform  w-[400px] bg-white shadow-custom 
          rounded-md py-6 px-4"
              >
                {isLoading ? (
                  "loading"
                ) : error ? (
                  "Something went wrong"
                ) : data?.length === 0 ? (
                  <div className="flex items-center justify-center h-60">
                    <p className="text-darkteal">No Message</p>
                  </div>
                ) : (
                  <div className="flex flex-col gap-y-4">
                    {data.map((conservation) => (
                      <div
                      key={conservation._id}
                        onClick={() => handleLastMessageClick(conservation.id)}
                        className={`flex min-w-0 gap-x-4 border-b border-slate-300 p-2 rounded-md cursor-pointer ${
                         ( (user?.isSeller && !conservation.readBySeller) || (!user?.isSeller && !conservation.readByBuyer)) && "bg-sky-100"
                        }`}
                      >
                        <LazyLoadImage
                          className="h-12 w-12 flex-none rounded-full bg-slate-50"
                          src={avtar}
                          alt=""
                        />
                        <div className="min-w-0 flex-auto">
                          {user?.isSeller ? (
                            <p className="text-sm font-semibold leading-6 text-slate-900">
                              {buyerNames[conservation.buyerId]?.username}
                            </p>
                          ) : (
                            <p className="text-sm font-semibold leading-6 text-slate-900">
                              {sellerNames[conservation.sellerId]?.username}
                            </p>
                          )}
                          {conservation.lastMessage ? (
                            <p className="mt-1 truncate text-xs leading-5 text-slate-500">
                              {conservation.lastMessage}
                            </p>
                          ) : (
                            "..."
                          )}
                          <p className="text-end text-sm font-extralight italic text-slate-600">
                            {moment(conservation.createdAt)
                              .subtract(10, "days")
                              .calendar()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </Popover.Panel>
            </Transition>
          </>
        )}
      </Popover>
      <MessageModal
        isOpen={isOpen}
        closeModal={closeModal}
        cId={selectedConversationId}
        uId={uId}
      />
    </>
  );
};

export default MessageMenu;
