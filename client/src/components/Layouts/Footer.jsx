import React from "react";
import {
  BsTwitter,
  BsFacebook,
  BsInstagram,
  BsPinterest,
  BsLinkedin,
} from "react-icons/bs";

const Footer = () => {
  return (
    <div className="bg-[ffffff] pt-5 md:pt-10 shadow-custom">
      <div className="max-w-6xl mx-auto py-4">
        <div className="flex flex-col gap-4 md:gap-0 px-4 md:p-0 md:flex-row justify-between ">
          <div>
            <h1 className="font-bold text-xl mb-4">Categories</h1>
            <ul className="text-[#74767e] flex flex-col gap-4 font-semibold tracking-wider">
              <li className=" hover:text-lightblue cursor-pointer">Graphics & Design</li>
              <li className=" hover:text-lightblue cursor-pointer">Digital Marketing</li>
              <li className=" hover:text-lightblue cursor-pointer">Writing & Translation</li>
              <li className=" hover:text-lightblue cursor-pointer">Video & Animation</li>
              <li className=" hover:text-lightblue cursor-pointer">Music & Audio</li>
              <li className=" hover:text-lightblue cursor-pointer">Programming & Tech</li>
              <li className=" hover:text-lightblue cursor-pointer">Data</li>
            </ul>
          </div>
          <div>
            <h1 className="font-bold text-xl mb-4">About</h1>
            <ul className="text-[#74767e] flex flex-col gap-4 font-semibold tracking-wider">
              <li className=" hover:text-lightblue cursor-pointer">Careers</li>
              <li className=" hover:text-lightblue cursor-pointer">Press & News</li>
              <li className=" hover:text-lightblue cursor-pointer">Partnerships</li>
              <li className=" hover:text-lightblue cursor-pointer">Privacy Policy</li>
              <li className=" hover:text-lightblue cursor-pointer">Terms of Service</li>
            </ul>
          </div>
          <div>
            <h1 className="font-bold text-xl mb-4">Support</h1>
            <ul className="text-[#74767e] flex flex-col gap-4 font-semibold tracking-wider">
              <li className=" hover:text-lightblue cursor-pointer">Help & Support</li>
              <li className=" hover:text-lightblue cursor-pointer">Trust & Safety</li>
              <li className=" hover:text-lightblue cursor-pointer">Selling on GigScout</li>
              <li className=" hover:text-lightblue cursor-pointer">Buying on Fiverr</li>
            </ul>
          </div>
          <div>
            <h1 className="font-bold text-xl mb-4">Community</h1>
            <ul className="text-[#74767e] flex flex-col gap-4 font-semibold tracking-wider">
              <li className=" hover:text-lightblue cursor-pointer">Customer Success Stories</li>
              <li className=" hover:text-lightblue cursor-pointer">Community Hub</li>
              <li className=" hover:text-lightblue cursor-pointer">Forum</li>
              <li className=" hover:text-lightblue cursor-pointer">Events</li>
              <li className=" hover:text-lightblue cursor-pointer">Blog</li>
              <li className=" hover:text-lightblue cursor-pointer">Influencers</li>
            </ul>
          </div>
        </div>
      </div>
      <div className=" border-t-[1px] border-lightblack">
          <div className="max-w-6xl flex flex-col gap-2 md:gap-0 md:flex-row justify-between items-center py-2 mx-auto">
          <div>
           <span className=" text-2xl font-extrabold mr-2 md:mr-24"> GigConnect. </span><span className=" text-lightgray font-extralight ">© GigConnect International Ltd. 2023</span>
          </div>
          <div className="flex gap-4 items-center text-2xl text-gray cursor-pointer">
            <BsFacebook className=" hover:text-lightblue cursor-pointer hover:scale-125 transition-all ease-in-out duration-200" />
            <BsInstagram className=" hover:text-lightblue cursor-pointer hover:scale-125 transition-all ease-in-out duration-200" />
            <BsPinterest className=" hover:text-lightblue cursor-pointer hover:scale-125 transition-all ease-in-out duration-200" />
            <BsLinkedin className=" hover:text-lightblue cursor-pointer hover:scale-125 transition-all ease-in-out duration-200" />
            <BsTwitter className=" hover:text-lightblue cursor-pointer hover:scale-125 transition-all ease-in-out duration-200" />
          </div>
          </div>
        </div>
    </div>
  );
};

export default Footer;
