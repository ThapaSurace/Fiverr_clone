import React from "react";
import { GiDragonHead } from "react-icons/gi";
import { RiDashboardFill } from "react-icons/ri";
import { FaUsers, FaCreditCard, FaUserSecret } from "react-icons/fa";
import { MdAutoAwesomeMotion, MdReport } from "react-icons/md";
import { Link } from "react-router-dom";
import { RiMessage2Fill } from "react-icons/ri";
import { useAuth } from "../../context/AuthContext";
import { ImProfile } from "react-icons/im";
import { BiLogOutCircle } from "react-icons/bi";
import newRequest from "../../utils/newRequest";
import { Toast } from "../../utils/Toast";
import { RiLogoutCircleFill } from "react-icons/ri";

const SideBar = () => {
  const { user, dispatch } = useAuth();

  const handleLogout = async () => {
    try {
      await newRequest.post("/auth/logout");
      dispatch({ type: "LOGOUT" });
      Toast(
        "User Logout Successfully",
        "text-red-700",
        <RiLogoutCircleFill size={30} className="text-red-700" />
      );
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <div className="border-r border-[#dadbdd] h-full sticky top-14">
      <Link to="/">
        <div className="cursor-pointer text-lg tracking-wide font-bold flex items-center gap-1 border-b border-[#dadbdd] py-4 pl-4">
          <span>
            <GiDragonHead size={30} />
          </span>
          <span>
            Gi<span className="logo">g</span>Co
            <span className="logo">nn</span>ect.
          </span>
        </div>
      </Link>

      <div className="px-4 mt-4">
        <ul className="flex flex-col gap-4">
          <div>
            <p className="text-sm font-bold text-[#999] mb-2">MAIN</p>
            <Link to="/dashboard">
              <li className="flex gap-1 items-center mb-2 cursor-pointer hover:bg-[#ece8ff] p-1 rounded-md">
                <RiDashboardFill size={25} className=" text-blue-950" />
                <span className=" text-base text-darkteal font-bold">
                  Dashboard
                </span>
              </li>
            </Link>
          </div>
          <div>
            <p className="text-sm font-bold text-[rgb(153,153,153)] mb-2">
              LISTS
            </p>
            <Link to="/giglist">
              <li className="flex gap-1 items-center mb-2 cursor-pointer hover:bg-[#ece8ff] p-1 rounded-md">
                <MdAutoAwesomeMotion size={25} className=" text-yellow-950" />
                <span className=" text-base text-darkteal font-bold">
                  Products
                </span>
              </li>
            </Link>
            <Link to="/orderlist">
              <li className="flex gap-1 items-center mb-2 cursor-pointer hover:bg-[#ece8ff] p-1 rounded-md">
                <FaCreditCard size={25} className="text-emerald-800" />
                <span className=" text-base text-darkteal font-bold">
                  Orders
                </span>
              </li>
            </Link>
            <Link to="/messagelist">
              <li className="flex gap-1 items-center mb-2 cursor-pointer hover:bg-[#ece8ff] p-1 rounded-md">
                <RiMessage2Fill size={25} className=" text-sky-900" />
                <span className=" text-base text-darkteal font-bold">
                  Messages
                </span>
              </li>
            </Link>
          </div>

          {user?.isAdmin && (
            <div>
              <p className="text-sm font-bold text-[#999] mb-2">USER</p>
              <Link to="/clients">
                <li className="flex gap-1 items-center mb-2 cursor-pointer hover:bg-[#ece8ff] p-1 rounded-md">
                  <FaUsers size={25} className="text-slate-800" />
                  <span className=" text-base text-darkteal font-bold">
                    Clients
                  </span>
                </li>
              </Link>
              <Link to="/freelancers">
                <li className="flex gap-1 items-center mb-2 cursor-pointer hover:bg-[#ece8ff] p-1 rounded-md">
                  <FaUserSecret size={25} className=" text-violet-950" />
                  <span className=" text-base text-darkteal font-bold">
                    Freelancers
                  </span>
                </li>
              </Link>
            </div>
          )}
          {user.isAdmin && (
            <div>
              <p className="text-sm font-bold text-[#999] mb-2">Reports</p>
              <Link to="/reports">
                <li className="flex gap-1 items-center mb-2 cursor-pointer hover:bg-[#ece8ff] p-1 rounded-md">
                  <MdReport size={25} className=" text-orange-800" />
                  <span className="text-base text-darkteal font-bold">
                    Report
                  </span>
                </li>
              </Link>
            </div>
          )}

          <div>
            <p className="text-sm font-bold text-[#999] mb-2">OPTIONS</p>
            {user?.isSeller && (
              <Link to={`/profile/${user._id}`}>
                <li className="flex gap-1 items-center mb-2 cursor-pointer hover:bg-[#ece8ff] p-1 rounded-md">
                  <ImProfile size={25} className=" text-violet-800" />
                  <span className=" text-base text-darkteal font-bold">
                    Profile
                  </span>
                </li>
              </Link>
            )}
            <Link to="/orderlist">
              <li className="flex gap-1 items-center mb-2 cursor-pointer hover:bg-[#ece8ff] p-1 rounded-md">
                <BiLogOutCircle size={25} className="text-emerald-800" />
                <span
                  onClick={handleLogout}
                  className=" text-base text-darkteal font-bold"
                >
                  Logout
                </span>
              </li>
            </Link>
          </div>
        </ul>
      </div>
    </div>
  );
};

export default SideBar;
