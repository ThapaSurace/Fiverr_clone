import React, { useState, Fragment } from "react";
import { GiHamburgerMenu } from "react-icons/gi";
import { RxCross1 } from "react-icons/rx";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import newRequest from "../../utils/newRequest";
import avtar from "../../assests/avtar.jpg";
import { AiOutlineHeart } from "react-icons/ai";
import { RiLogoutCircleFill } from "react-icons/ri";
import { GiDragonHead } from "react-icons/gi";
import { Menu, Transition } from "@headlessui/react";
import { useModal } from "../../context/AuthModalContext";
import AuthModal from "../AuthModal/AuthModal";
import { Toast } from "../../utils/Toast";
import NotificationMenu from "./NotificationMenu";
import MessageMenu from "./MessageMenu";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const Navbar = () => {
  const [open, setOpen] = useState(false);
  // const [openOptions, setOpenOptions] = useState(false);

  const { openModal, setCurrentContent } = useModal();

  const { pathname } = useLocation();

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

  const handleRegisterClick = () => {
    setCurrentContent("register");
    openModal(<AuthModal />);
  };

  return (
    <>
      <div className="sticky top-0 z-40">
        <div
          className={`p-2 font-bold tracking-wider  ${
            pathname !== "/"
              ? "bg-white text-black border-b-[0.2px] border-stone-400"
              : "bg-dimGrey text-white tracking-wide "
          }`}
        >
          <div className="max-w-6xl mx-auto flex justify-between items-center ">
            <Link to="/">
              <div className="cursor-pointer text-xl tracking-wide font-bold flex items-center gap-1">
                <span>
                  <GiDragonHead size={40} />
                </span>
                <span>
                  Gi<span className="logo">g</span>Co
                  <span className="logo">nn</span>ect.
                </span>
              </div>
            </Link>

            <div className="hidden gap-4 items-center md:flex">
              <ul className="flex gap-4 cursor-pointer items-center">
                {user && (
                  <Link to="/personal_info">
                    <li>Become a seller</li>
                  </Link>
                )}

                {user && (
                  <>
                    <Link to="/wishlist">
                      <li>
                        <AiOutlineHeart size={25} className="wishlist" />
                      </li>
                    </Link>
                    <li>
                      {/* <MdCircleNotifications size={25} /> */}
                      <NotificationMenu />
                    </li>
                    <li>
                      <MessageMenu />
                    </li>
                  </>
                )}
              </ul>
              {!user ? (
                <div>
                  {/* <Link to="/login"> */}
                  <button
                    className=" mr-4"
                    onClick={() => openModal(<AuthModal />)}
                  >
                    Sign In
                  </button>
                  {/* </Link> */}

                  <button
                    className={`${
                      pathname !== "/"
                        ? " border-teal text-teal"
                        : "border-white"
                    } border-2 px-4 py-1 rounded-md`}
                    onClick={handleRegisterClick}
                  >
                    Join
                  </button>
                </div>
              ) : (
                <Menu as="div" className="relative ml-3">
                  <div>
                    <Menu.Button className="flex max-w-xs items-center rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                      <span className="sr-only">Open user menu</span>
                      <img
                        className="h-8 w-8 rounded-full object-cover"
                        src={user?.img || avtar}
                        alt=""
                      />
                    </Menu.Button>
                  </div>
                  <Transition
                    as={Fragment}
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                  >
                    <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                      {user?.isSeller && (
                        <>
                          <Menu.Item>
                            {({ active }) => (
                              <Link to={`/profile/${user._id}`}>
                                <span
                                  className={classNames(
                                    active ? "bg-teal text-white" : "",
                                    "block px-4 py-2 text-sm text-teal"
                                  )}
                                >
                                  My Profile
                                </span>
                              </Link>
                            )}
                          </Menu.Item>
                          <Menu.Item>
                            {({ active }) => (
                              <Link to="/dashboard">
                                <span
                                  className={classNames(
                                    active ? "bg-teal text-white" : "",
                                    "block px-4 py-2 text-sm text-teal"
                                  )}
                                >
                                  Dashboard
                                </span>
                              </Link>
                            )}
                          </Menu.Item>
                          <Menu.Item>
                            {({ active }) => (
                              <Link to="/addgig">
                                <span
                                  className={classNames(
                                    active ? "bg-teal text-white" : "",
                                    "block px-4 py-2 text-sm text-gray-700 text-teal"
                                  )}
                                >
                                  Add New Gig
                                </span>
                              </Link>
                            )}
                          </Menu.Item>
                        </>
                      )}
                      {!user?.isSeller && (
                        <>
                          <Menu.Item>
                            {({ active }) => (
                              <Link to="/orders">
                                <span
                                  className={classNames(
                                    active ? "bg-teal text-white" : "",
                                    "block px-4 py-2 text-sm text-gray-700 text-teal"
                                  )}
                                >
                                  orders
                                </span>
                              </Link>
                            )}
                          </Menu.Item>
                          <Menu.Item>
                            {({ active }) => (
                              <Link to="/messages">
                                <span
                                  className={classNames(
                                    active ? "bg-teal text-white" : "",
                                    "block px-4 py-2 text-sm text-gray-700 text-teal"
                                  )}
                                >
                                  messages
                                </span>
                              </Link>
                            )}
                          </Menu.Item>
                        </>
                      )}
                      <Menu.Item>
                        {({ active }) => (
                          <span
                            className={classNames(
                              active ? "bg-teal text-white" : "",
                              "block px-4 py-2 text-sm text-gray-700 text-teal cursor-pointer"
                            )}
                            onClick={handleLogout}
                          >
                            logout
                          </span>
                        )}
                      </Menu.Item>
                    </Menu.Items>
                  </Transition>
                </Menu>
              )}
            </div>
            <div
              onClick={() => setOpen(!open)}
              className="md:hidden cursor-pointer"
            >
              <GiHamburgerMenu size={25} />
            </div>
          </div>
        </div>

        {/* mobile navbar */}
        <div
          className={`w-full bg-white h-screen fixed top-0 left-0 ${
            open ? "-translate-x-0 " : "  -translate-x-full"
          } duration-300 ease-in-out`}
        >
          <div className="flex justify-between p-4">
            <div>
              <ul className="flex flex-col gap-4 cursor-pointer items-start font-bold text-lgs">
                <li>Fiver Business</li>
                <li>Explore</li>
                <li>Become a seller</li>
                <li>
                  <button className=" ">Sign In</button>
                </li>
                <li>
                  <button className=" ">Join</button>
                </li>
              </ul>
            </div>
            <div onClick={() => setOpen(!open)} className="cursor-pointer">
              <RxCross1 size={25} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
