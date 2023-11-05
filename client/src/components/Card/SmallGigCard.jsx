import React from "react";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { AiFillStar } from "react-icons/ai";
import { Link } from "react-router-dom";

const MAX_TITLE_LENGTH = 55;

const SmallGigCard = ({ gig }) => {
  return (
    <div className=" shadow-custom p-4 rounded-md">
      <div className="flex gap-4">
        <div className="flex-[1]">
          <LazyLoadImage
            src={gig.cover}
            alt="/"
            className="w-full h-20 rounded-sm shadow-sm object-cover object-center"
          />
        </div>

        <div className="flex-[2]">
          <span className="font-bold capitalize text-stone-900">{gig.cat}</span>
          <p className="text-sm font-semibold text-[#a5a1a1] my-2">
            {gig?.title.length > MAX_TITLE_LENGTH
              ? `${gig.title.substring(0, MAX_TITLE_LENGTH)}...`
              : gig.title}
          </p>
          <div className="flex gap-1 items-center text-slate-950">
            <AiFillStar />
            <span>
              {!isNaN(gig.totalStars / gig.starNumber) &&
                Math.round(gig.totalStars / gig.starNumber)}
            </span>
          </div>
        </div>
      </div>
      <div className="flex justify-between items-center mt-4">
        <span className="font-semibold text-xl">${gig.price}</span>
        <Link to={`/gig/${gig._id}`}>
        <button className="border border-[#dadbdd] px-4 py-1 rounded-md font-bold text-slate-800 hover:bg-slate-200 duration-200 ease-in-out">
          More Details
        </button>
        </Link>
      </div>
    </div>
  );
};

export default SmallGigCard;
