import React from "react";
import { DataGrid } from "@mui/x-data-grid";
import { AiFillDelete } from "react-icons/ai";
import avtar from "../../assests/avtar.jpg";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import newRequest from "../../utils/newRequest";
import {BsPersonDash} from "react-icons/bs"
import { Toast } from "../../utils/Toast";

const UserList = ({ data }) => {
  const queryClient = useQueryClient();
  const { mutate } = useMutation({
    mutationFn: async (id) => {
      await newRequest.delete(`/user/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["allusers"]);
    },
  });

  const handleDelete = (id) => {
    mutate(id);
    Toast("User Deleted Successfully!","text-red-500",<BsPersonDash size={30} className="text-red-600" />)
  };

  const columns = [
    { field: "_id", headerName: "ID", width: 250 },
    {
      field: "username",
      headerName: "Username",
      width: 200,
      renderCell: (params) => {
        return (
          <div className="flex items-center gap-2">
            <img
              className="w-8 h-8 rounded-full object-cover object-center"
              src={params.row.img || avtar}
              alt=""
            />
            {params.row.username}
          </div>
        );
      },
    },
    { field: "email", headerName: "Email", width: 200 },
    {
      field: "country",
      headerName: "Country",
      width: 80,
    },
    {
      field: "action",
      headerName: "Action",
      width: 80,
      renderCell: (params) => {
        return (
          <AiFillDelete
            className="userListDelete text-2xl text-red-500 cursor-pointer"
            onClick={() => handleDelete(params.row._id)}
          />
        );
      },
    },
  ];

  return (
      <div className="max-w-4xl mx-auto">
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
      </div>
  );
};

export default UserList;
