import React from "react";
import DashboardLayout from "../../utils/DashboardLayout";
import { DataGrid } from "@mui/x-data-grid";
import { AiFillDelete } from "react-icons/ai";
import newRequest from "../../utils/newRequest";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import moment from "moment";
import { BiEdit } from "react-icons/bi";
import { Link, useNavigate } from "react-router-dom";
import { GigContext } from "../../context/GigContext";

const GigList = () => {
  const { user } = useContext(AuthContext);
  const  gigContext = useContext(GigContext)
  const navigate = useNavigate()
  const queryClient = useQueryClient();
  const {
    isLoading,
    error,
    data = [],
  } = useQuery({
    queryKey: ["mygiglists"],
    queryFn: async () =>
      {
        let apiUrl = '/gigs';

        if (!user.isAdmin) {
          apiUrl += `?userId=${user._id}`;
        }
    
        return newRequest.get(apiUrl).then((res) => {
          return res.data;
        });
      }
  });
  console.log(data)

  const mutation = useMutation({
    mutationFn: (id) => {
      return newRequest.delete(`/gig/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["mygigs"]);
    },
  });

  const handleDelete = (id) => {
    mutation.mutate(id);
  };

  const handleEdit = (gig) => {
    gigContext.setSelectedGig(gig);
    navigate("/addgig")
  };

  const columns = [
    { field: "_id", headerName: "ID", width: 150 },
    {
      field: "gig",
      headerName: "Gig",
      width: 300,
      renderCell: (params) => {
        const title = params.row.title;
        const substringLength = 30;
        const truncatedTitle =
          title?.length > substringLength
            ? title.substring(0, substringLength) + "..." 
            : title;

        return (
          <div className="flex items-center gap-2">
            <img
              className="w-8 h-8 rounded-full object-cover object-center"
              src={params.row.cover}
              alt=""
            />
            {truncatedTitle}
          </div>
        );
      },
    },
    { field: "price", headerName: "Price", width: 80 },
    {
      field: "cat",
      headerName: "Category",
      width: 120,
    },
    {
      field: "sale",
      headerName: "Sale",
      width: 80,
    },
    {
      field: "date",
      headerName: "Date",
      width: 180,
      renderCell: (params) => {
        return <div>{moment(params.row.updatedAt).format("MMMM Do YYYY")}</div>;
      },
    },
    {
      field: "action",
      headerName: "Action",
      width: 100,
      renderCell: (params) => {
        return (
          <div className="flex gap-1 items-center">
            {
              user?.isSeller && (
                <BiEdit className="text-2xl text-sky-500 cursor-pointer" onClick={()=> handleEdit(params.row)} />
              )
            }
            <AiFillDelete className="text-2xl text-red-500 cursor-pointer" onClick={() => handleDelete(params.row._id)} />
          </div>
        );
      },
    },
  ];
  return (
    <DashboardLayout>
      {isLoading ? (
        "loading..."
      ) : error ? (
        "Something went wrong"
      ) : (
        <>
          <h1 className="text-xl mb-4 text-teal font-bold text-center">
            Gig Lists
          </h1>
         {
          user?.isSeller && (
            <div className="flex justify-end mb-4"><Link to="/addgig"><button className="btn px-4 py-1 bg-teal text-end hover:bg-teal">Add New Gig</button></Link></div>
          )
         }
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
    </DashboardLayout>
  );
};

export default GigList;
