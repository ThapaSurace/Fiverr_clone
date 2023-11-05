import React, { useState } from "react";
import { AiOutlineSearch } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import { Toast } from "../../utils/Toast";

const Header = () => {
  const [input, setInput] = useState("");
  const navigate = useNavigate();

  const handleSubmit = () => {
    if (input === "") {
      Toast("Please Enter Text", "text-red-400");
    } else {
      navigate(`/gigs?search=${input}`);
    }
  };

  const handlePopularSearch = (item) => {
    navigate(`/gigs?cat=${item}`)
  }

  return (
    <div className="h-[60vh] bg-hero-pattern bg-no-repeat bg-cover bg-opacity-10 ">
      <div className=" max-w-6xl mx-auto h-full flex items-center px-4">
        <div className="text-white flex flex-col gap-6 max-w-4xl px-4 md:px-0">
          <div className="font-bold text-xl md:text-4xl flex flex-col">
            <span>Find the best freelance services</span>
            <span>For your business</span>
          </div>
          <div className=" w-full md:w-[90%] flex items-center bg-white text-black h-10 rounded-l-md pl-2">
            <div className="flex items-center gap-2 basis-[80%]">
              <AiOutlineSearch size={25} />
              <input
                className="w-full h-full border-none outline-none focus:outline-none focus:ring-0 placeholder:text-sm placeholder:tracking-wide"
                type="text"
                placeholder="What service are you looking for today?"
                onChange={(e) => setInput(e.target.value)}
              />
            </div>
            <button
              type="submit"
              onClick={handleSubmit}
              className=" basis-[20%] bg-darkteal w-full h-full text-white font-bold tracking-wide"
            >
              Search
            </button>
          </div>
          <div className="flex gap-2 items-center">
            <span>Popular:</span>
            <div className="flex flex-wrap gap-2 text-xs">
              <button onClick={()=>handlePopularSearch('Wordpress')} className="border-2 border-white p-1 rounded-lg hover:bg-white hover:text-gray  hover:scale-110 hover:font-bold  transition-all duration-300 ease-in-out">
                wordpress
              </button>
              <button onClick={()=>handlePopularSearch('logo design')} className="border-2 border-white p-1 rounded-lg hover:bg-white hover:text-gray  hover:scale-110 hover:font-bold  transition-all duration-300 ease-in-out">
                logo design
              </button>
              <button onClick={()=>handlePopularSearch('AI ARTISTS')} className="border-2 border-white p-1 rounded-lg hover:bg-white hover:text-gray  hover:scale-110 hover:font-bold  transition-all duration-300 ease-in-out">
                AI ARTISTS
              </button>
              <button onClick={()=>handlePopularSearch('seo')} className="border-2 border-white p-1 rounded-lg hover:bg-white hover:text-gray  hover:scale-110 hover:font-bold  transition-all duration-300 ease-in-out">
                seo
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
