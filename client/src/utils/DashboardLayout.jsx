import React from "react";
import SideBar from "../components/Dashboard/SideBar";
import Navbar from "../components/Dashboard/Navbar";

const DashboardLayout = ({ children }) => {
  return (
    <div className="flex h-[100vh]">
      <div className="flex-[1] sticky top-0">
        <SideBar />
      </div>

      <div className="flex-[6] mb-10">
        <div className="border-b border-[#dadbdd] h-[62.8px]">
          <Navbar />
        </div>
        <div className="max-w-6xl ml-6 mt-10">{children}</div>
      </div>
    </div>
  );
};

export default DashboardLayout;
