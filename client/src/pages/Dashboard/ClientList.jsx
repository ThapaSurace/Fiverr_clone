import React from "react";
import UserList from "../../components/Dashboard/UserList";
import { useGetAllUsers } from "../../api/UserApi/UserApi";
import DashboardLayout from "../../utils/DashboardLayout";

const ClientList = () => {
  const { data, isLoading, error } = useGetAllUsers("non-seller");
  return (
    <>
     <DashboardLayout>
     <h1 className="text-xl mb-6 text-teal font-bold text-center">
        User Lists
      </h1>
      {isLoading ? (
        "loading..."
      ) : error ? (
        "Something went wrong!!"
      ) : (
        <UserList data={data} />
      )}
     </DashboardLayout>
    </>
  );
};

export default ClientList;
