import React, { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import newRequest from "../../utils/newRequest";
import moment from "moment/moment";
import { DataGrid } from "@mui/x-data-grid";
import MessageModal from "./MessageModal";
import { useAuth } from "../../context/AuthContext";
import { useGetConservationQuery } from "../../api/MessageApi/MessageApi";

const MessageLists = () => {
  const { user } = useAuth()
  let [isOpen, setIsOpen] = useState(false);
  const [selectedConversationId, setSelectedConversationId] = useState(null);
  const [buyerNames, setBuyerNames] = useState({});
  const [sellerNames, setSellerNames] = useState({});
  const [uId,setUId] = useState("")

  //close message dialog
  function closeModal() {
    setIsOpen(false);
    setSelectedConversationId(null);
  }
  const queryClient = useQueryClient();

  const {
    isLoading,
    error,
    data = [],
  } = useGetConservationQuery()


  useQuery({
    queryKey: ["userss"],
    queryFn: () =>
      Promise.all([
        ...data.map((data) =>
          newRequest.get(`/user/${data.buyerId}`).then((res) => res.data)
        ),
        ...data.map((data) =>
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
    enabled: !!data.length, // Run the query when there is data available
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

  const handleRead = (id) => {
    mutation.mutate(id);
    console.log(id)
  };



  const handleLastMessageClick = (id) => {
    setSelectedConversationId(id); // Set the selected conversation ID when the "Last Message" link is clicked
    setIsOpen(true); // Open the message modal

    const selectedConversation = data.find((conversation) => conversation.id === id);
    const selectedUserId = user?.isSeller ? selectedConversation?.buyerId : selectedConversation?.sellerId;
    setUId(selectedUserId)
  };

  const columns = [
    { field: "_id", headerName: "ID", width: 180 },
    ...(user?.isSeller
      ? [
          {
            field: "buyername",
            headerName: "Client Name",
            width: 180,
            valueGetter: (params) =>
              buyerNames[params.row.buyerId]?.username || "",
          },
        ]
      : [
          {
            field: "sellerName",
            headerName: "Seller Name",
            width: 180,
            valueGetter: (params) =>
              sellerNames[params.row.sellerId]?.username || "",
          },
        ]),
    {
      field: "lastMessage",
      headerName: "Last Message",
      width: 200,
      renderCell: (params) => {
        const msg = params.value;
        const substringLength = 30; // Define the desired length for the substring
        const truncatedTitle =
          msg?.length > substringLength
            ? msg.substring(0, substringLength) + "..." // Add ellipsis if the msg is longer than the desired length
            : msg;

        return (
          <div
            className="cursor-pointer w-full"
            onClick={() => handleLastMessageClick(params.row.id)}
          >
            {truncatedTitle}...
          </div>
        );
      },
    },
    {
      field: "date",
      headerName: "Date",
      width: 180,
      renderCell: (params) => {
        return <div>{moment(params.row.updatedAt).fromNow()}</div>;
      },
    },
    {
      field: "action",
      headerName: "Action",
      width: 150,
      renderCell: (params) => {
        return (
          <div>
            {(user?.isSeller && !params.row?.readBySeller) ||
              (!user?.isSeller && !params.row?.readByBuyer && (
                <button
                  onClick={() => handleRead(params.row?.id)}
                  className=" bg-primary py-1 px-2 rounded-md text-white font-semibold"
                >
                  Mark as read
                </button>
              ))}
          </div>
        );
      },
    },
  ];

  return (
    <>
      {isLoading ? (
        "loading..."
      ) : error ? (
        "Something went wrong"
      ) :  data?.length === 0 ? (
        <div className="h-[80vh] flex justify-center items-center">
          <span>No conservation yet!!</span>
        </div>
      ) : (
        <>
          <h1 className="text-xl mb-6 text-teal font-bold text-center">
            Message List
          </h1>
          <div style={{ width: "100%" }}>
            <DataGrid
              rows={data}
              disableSelectionOnClick
              columns={columns}
              getRowId={(row) => row._id}
              initialState={{
                pagination: {
                  paginationModel: { page: 0, pageSize: 5 },
                },
              }}
              pageSizeOptions={[5, 10]}
            />
          </div>
        </>
      )}
      <MessageModal
        isOpen={isOpen}
        closeModal={closeModal}
        cId={selectedConversationId}
        uId={uId}
      />
    </>
  );
};

export default MessageLists;
