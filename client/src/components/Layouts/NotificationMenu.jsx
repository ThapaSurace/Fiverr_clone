import { Popover, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { MdCircleNotifications } from "react-icons/md";
import { GiSplitCross } from "react-icons/gi";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import newRequest from "../../utils/newRequest";
import { useAuth } from "../../context/AuthContext";
import moment from "moment";
import { Toast } from "../../utils/Toast";
import { useNavigate } from "react-router-dom";

export default function NotificationMenu() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const id = user?._id;
  const { data, isLoading, error } = useQuery({
    queryKey: ["notifications"],
    queryFn: async () =>
      {
        if(user) {
          const res= await newRequest.get(`/notification/${id}`)
          return res.data
        }else{
          return []
        }
      },
      enabled:!!user
  });

  const unreadNotifications = data?.filter(
    (notification) => notification.status === "unread"
  );

  const { mutate } = useMutation({
    mutationFn: async (notificationId) => {
      return newRequest.delete(`/notification/${notificationId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["notifications"]);
    },
  });

  const { mutate: statusmutate } = useMutation({
    mutationFn: async (notificationId) => {
      return newRequest.put(`/notification/${notificationId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["notifications"]);
    },
  });

  const handleStatus = (nid, oid) => {
    statusmutate(nid);
    if (user.isSeller) {
      navigate(`/dashboard`);
    } else {
      navigate(`/order/details/${oid}`);
    }
  };

  const deleteNotification = (nId) => {
    mutate(nId);
    Toast(
      "Notification has been deleted",
      "text-rose-500",
      <MdCircleNotifications size={30} className="text-rose-500" />
    );
  };

  return (
    <div className="">
      <Popover className="relative z-50">
        {({ open }) => (
          <>
            <Popover.Button
              className={`
                ${open ? "" : "text-opacity-90"}
                relative group inline-flex items-center rounded-md py-2 text-base font-medium hover:text-opacity-100 px-2`}
            >
              <MdCircleNotifications size={25} />
              {unreadNotifications?.length > 0 && (
                <span className="absolute top-0 -right-1 font-bold">
                  ({unreadNotifications?.length})
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
                <div className="py-2 flex flex-col gap-4 overflow-y-auto max-h-[300px] scrollbar-hide">
                  {isLoading ? (
                    "loading..."
                  ) : error ? (
                    "Something went wrong!!"
                  ) : data?.length === 0 ? (
                    <div className="flex items-center justify-center h-60">
                      <p className="text-darkteal">No Notification</p>
                    </div>
                  ) : (
                    data.map((notif) => (
                      <div
                        key={notif._id}
                        className={` text-stone-700 border-b border-slate-300 p-2 rounded-md ${
                          notif.status === "unread" &&
                          "bg-sky-100 bg-opacity-40"
                        } `}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <div
                            onClick={() =>
                              handleStatus(notif._id, notif.orderId)
                            }
                          >
                            <p className="tracking-wide italic font-semibold text-slate-900 text-sm hover:text-sky-400 cursor-pointer">
                              {notif.message}
                            </p>
                          </div>
                          <GiSplitCross className="cursor-pointer"
                            onClick={() => deleteNotification(notif._id)}
                          />
                        </div>
                        <div className="text-[10px] text-end mt-2">
                          {moment(notif.createdAt).format("MMM Do YY")}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </Popover.Panel>
            </Transition>
          </>
        )}
      </Popover>
    </div>
  );
}
