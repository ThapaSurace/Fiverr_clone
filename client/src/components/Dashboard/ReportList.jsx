import React from 'react'
import { DataGrid } from "@mui/x-data-grid";

const ReportList = ({data}) => {
    const columns = [
        { field: "_id", headerName: "ID", width: 250 },
        {
          field: "gigId",
          headerName: "Gig Id",
          width: 250,
        },
        { field: "reportType", headerName: "Report Type", width: 250 },
        {
          field: "desc",
          headerName: "Description",
          width: 250,
        },
        // {
        //   field: "action",
        //   headerName: "Action",
        //   width: 80,
        //   renderCell: (params) => {
        //     return (
        //       <AiFillDelete
        //         className="userListDelete text-2xl text-red-500 cursor-pointer"
        //         onClick={() => handleDelete(params.row._id)}
        //       />
        //     );
        //   },
        // },
      ];
  return (
    <div className="max-w-6xl mx-auto">
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
  )
}

export default ReportList