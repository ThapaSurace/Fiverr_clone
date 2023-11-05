import React from "react";
import MessageMenu from "../Layouts/MessageMenu";
import NotificationMenu from "../Layouts/NotificationMenu";

const Navbar = () => {

  return (
    <div className="border-b border-[#dadbdd] h-[62.8px] flex justify-end items-center max-w-5xl">
      <div className="flex gap-2 items-center">
        <MessageMenu />
        <NotificationMenu />
      </div>
    </div>
  );
};

export default Navbar;
