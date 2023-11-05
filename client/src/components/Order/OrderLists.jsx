import React, { useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { GrMail } from "react-icons/gr";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import newRequest from "../../utils/newRequest";
import { LazyLoadImage } from "react-lazy-load-image-component";
import moment from "moment";
import { useAuth } from "../../context/AuthContext";
import { useGetOrderQuery } from "../../api/OrderApi/OrderApi";
import { GiCancel } from "react-icons/gi";
import MessageModal from "../Message/MessageModal";
import { Link } from "react-router-dom";

const OrderList = () => {
  const { user } = useAuth();
  const [buyerNames, setBuyerNames] = useState({});
  const [sellerNames, setSellerNames] = useState({});
  let [isOpen, setIsOpen] = useState(false);
  const [selectedConversationId, setSelectedConversationId] = useState(null);
  const [uId, setUId] = useState("");

  const { isLoading, error, data = [] } = useGetOrderQuery();

  const queryClient = useQueryClient();

  function closeModal() {
    setIsOpen(false);
    setSelectedConversationId(null);
  }

  useQuery({
    queryKey: ["orderusers"],
    queryFn: () =>
      Promise.all([
        ...data.map((order) =>
          newRequest.get(`/user/${order.buyerId}`).then((res) => res.data)
        ),
        ...data.map((order) =>
          newRequest.get(`/user/${order.sellerId}`).then((res) => res.data)
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
      }),
    enabled: !!data.length, // Run the query when there is data available
  });

  const handleContact = async (order) => {
    const sellerId = order.sellerId;
    const buyerId = order.buyerId;
    const id = sellerId + buyerId;

    if (user.isSeller) {
      setUId(buyerId);
    } else {
      setUId(sellerId);
    }
    setSelectedConversationId(id);
    setIsOpen(true);
  };

  const { mutate } = useMutation({
    mutationFn: async (orderId) => {
      return newRequest.put(`/orders/${orderId}/cancel`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["orders"]);
    },
  });

  const handleCancelOrder = (orderId) => {
    mutate(orderId);
  };

  const columns = [
    { field: "_id", headerName: "Order ID", width: 220 },
    ...(user?.isAdmin
      ? [] // If user is admin, don't include the second column
      : [
          {
            field: user?.isSeller ? "buyername" : "sellerName",
            headerName: user?.isSeller ? "Client Name" : "Seller Name",
            width: 100,
            valueGetter: (params) =>
              user?.isSeller
                ? buyerNames[params.row.buyerId]?.username || ""
                : sellerNames[params.row.sellerId]?.username || "",
          },
        ]),
    {
      field: "gigId",
      headerName: "Gig Id",
      width: 300,
      renderCell: (params) => {

        return (
          <Link to={`/order/details/${params.row._id}`}>
            <div className="flex items-center gap-2">
              {params.value}
            </div>
          </Link>
        );
      },
    },
    {
      field: "totalPrice",
      headerName: "Price",
      width: 80,
      renderCell: (params) => {
        return <span>${params.value}</span>;
      },
    },
    {
      field: "date",
      headerName: "Ordered Date",
      width: 150,
      renderCell: (params) => {
        return <div>{moment(params.row.updatedAt).format("MMMM Do YYYY")}</div>;
      },
    },
    // {
    //   field: "deliveryStatus",
    //   headerName: "Delivery Status",
    //   width: 150,
    //   renderCell: (params) => {
    //     return (
    //       <div
    //         className={`font-bold text-[12px] tracking-wider text-white px-1 rounded-md ${
    //           params.value === "inProgress" && "bg-green-400 "
    //         } ${params.value === "delivered" && "bg-rose-500"} ${
    //           params.value === "late" && "bg-red-600"
    //         }`}
    //       >
    //         {params.value}
    //       </div>
    //     );
    //   },
    // },
    {
      field: "status",
      headerName: "Status",
      width: 130,
      renderCell: (params) => {
        return (
          <div
            className={`${params.value === "completed" && " bg-green-400"} ${
              params.value === "canceled" && " bg-red-500"
            } ${
              params.value === "pending" && "bg-blue-400"
            } font-bold px-1 text-white text-[12px] rounded-md`}
          >
            {params.value}
          </div>
        );
      },
    },

    {
      field: "action",
      headerName: "Action",
      width: 150,
      renderCell: (params) => (
        <div className="flex gap-2 items-center">
          <GrMail
            className="text-2xl text-sky-500 cursor-pointer"
            onClick={() => handleContact(params.row)}
          />
          {params.row.status !== "completed" && (
            <GiCancel
              className="text-2xl text-red-800 cursor-pointer"
              onClick={() => handleCancelOrder(params.row._id)}
            />
          )}
        </div>
      ),
    },
  ];
  return (
    <div>
      {isLoading ? (
        "loading..."
      ) : error ? (
        "Something went wrong"
      ) : (
        <>
          <h1 className="text-xl mb-6 text-teal font-bold text-center">
            Order List
          </h1>
          <div style={{ width: "100%" }}>
            <DataGrid
              rows={data}
              disableSelectionOnClick
              columns={columns}
              getRowId={(row) => row._id}
              initialState={{
                pagination: {
                  paginationModel: { page: 0, pageSize: 8 },
                },
              }}
              pageSizeOptions={[8, 16]}
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
    </div>
  );
};

export default OrderList;
