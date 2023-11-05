import React from "react";
import SideBar from "../../components/Dashboard/SideBar";
import Navbar from "../../components/Dashboard/Navbar";
import Widgets from "../../components/Dashboard/Widgets";
import Chart from "../../components/Dashboard/Chart";
import Latest from "../../components/Dashboard/Latest";
import { useAuth } from "../../context/AuthContext";
import Todolist from "../../components/Dashboard/Todolist";
import { useRemaningOrderQuery } from "../../api/OrderApi/OrderApi";

const DashBoard = () => {
  const { user } = useAuth();
  const {data,isLoading,error} = useRemaningOrderQuery()
  return (
    <div className="flex h-[100vh]">
      <div className="flex-[1] sticky top-0">
        <SideBar />
      </div>

      <div className="flex-[6] mb-10">
        <div className="border-b border-[#dadbdd] h-[62.8px]">
          <Navbar />
        </div>
        <div className="max-w-6xl mx-auto ml-6 px-2 pb-6">
          <div className="overflow-y-auto max-h-[calc(100vh-62.8px)] scrollbar-hide">
            {/* Add this wrapper */}
            <Widgets />
           {
            isLoading ? "loading..." :
            error ? "Something went wrong!!" : (
              <div className="mt-8">
              <h1 className="text-2xl text-darkteal font-bold mb-4">
                Remanings Order
              </h1>
              <div className="grid grid-cols-3 gap-4">
                <div className="shadow-custom px-4 py-8 rounded-md">
                  <h1 className="font-bold text-teal">Orders in queue</h1>
                  <div className="my-4 flex items-center gap-1">
                    <span className="font-extrabold text-xl mr-4">
                      {data?.numberOfIncompleteOrders}
                    </span>
                  </div>
                </div>
                <div className="shadow-custom px-4 py-8 rounded-md">
                  <h1 className="font-bold text-teal">Expected Earning</h1>
                  <div className="my-4 flex items-center gap-1">
                    <span className="font-extrabold text-xl mr-4">
                      ${data?.totalIncomeFromIncompleteOrders.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            )
           }
            {user?.isAdmin && (
              <>
                <Chart />
                <Latest />
              </>
            )}
            {user?.isSeller && (
              <div className="mt-10">
                <Todolist />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashBoard;
