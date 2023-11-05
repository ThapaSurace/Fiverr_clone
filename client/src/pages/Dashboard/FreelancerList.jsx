import React from "react";
import { useGetAllUsers } from "../../api/UserApi/UserApi";
import UserList from "../../components/Dashboard/UserList";
import DashboardLayout from "../../utils/DashboardLayout";

const FreelancerList = () => {
  const { data, isLoading, error } = useGetAllUsers("seller");
  return (
    <>
      <DashboardLayout>
        <h1 className="text-xl mb-6 text-teal font-bold text-center">
          Freelancer Lists
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

export default FreelancerList;
