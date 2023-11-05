import React, { useState } from "react";
import { AiFillStar, AiFillHeart } from "react-icons/ai";
import { BsEmojiHeartEyesFill } from "react-icons/bs";
import { GiHeartMinus } from "react-icons/gi";
import avtar from "../../assests/avtar.jpg";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import newRequest from "../../utils/newRequest";
import { useNavigate } from "react-router-dom";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { useWishlistGigsQuery } from "../../api/GigApi/GigApi";
import { useAuth } from "../../context/AuthContext";
import { useModal } from "../../context/AuthModalContext";
import AuthModal from "../AuthModal/AuthModal";
import { useEffect } from "react";
import { Toast } from "../../utils/Toast";
import { useSingleUserQuery } from "../../api/UserApi/UserApi";

const MAX_TITLE_LENGTH = 50;

const GigsCard = ({ gig }) => {
  const [isScaled, setIsScaled] = useState(false);
  const queryClient = useQueryClient();

  const { user } = useAuth();

  const { openModal } = useModal();

  const navigate = useNavigate();

  const { data: wishlistData, refetch } = useWishlistGigsQuery(user);


  const {
    data: userData,
    isLoading: isUserLoading,
    error: userError,
  } = useSingleUserQuery(gig.userId);

  useEffect(() => {
    refetch();
  }, [refetch]);

  const isGigInWishlist = wishlistData?.some(
    (wishlistItem) => wishlistItem.gigId._id === gig._id
  );

  const { mutate } = useMutation({
    mutationFn: async (gigId) => {
      await newRequest.post(`/wishlist`, { gigId });
      queryClient.invalidateQueries("wishlists");
    },
  });

  const handleMyList = (id) => {
    setIsScaled(!isScaled);
    if (user) {
      mutate(id);

      if (!isGigInWishlist) {
        Toast(
          "Gig added to wishlist",
          "text-rose-500",
          <BsEmojiHeartEyesFill size={30} className="text-rose-500" />
        );
      } else {
        Toast(
          "Gig removed from wishlist",
          "text-red-700",
          <GiHeartMinus size={30} className="text-red-700" />
        );
      }
    } else {
      openModal(<AuthModal />);
    }
  };

  const { mutate: clickMutate } = useMutation({
    mutationFn: async (gigId) => {
      await newRequest.post("itemrecomm", { gigId });
    },
  });

  const handleClick = (id) => {
    clickMutate(id);
    navigate(`/gig/${id}`);
  };

  return (
    <div className="flex flex-col gap-2  cursor-pointer mr-4">
      <div className="relative">
        <LazyLoadImage
          src={gig.cover}
          className=" w-full h-48 object-cover rounded-md"
          alt="/"
        />
        <AiFillHeart
          className={`absolute top-2 right-2 ${
            isGigInWishlist ? "text-rose-500" : "text-white"
          } ${isScaled ? "animate-heart" : ""}`}
          onClick={() => handleMyList(gig._id)}
          size={25}
        />
      </div>
      <div onClick={() => handleClick(gig._id)}>
        <div className="flex flex-col gap-1 px-2 justify-between">
          <div className="flex items-center gap-2">
            {isUserLoading ? (
              "loading..."
            ) : userError ? (
              "Something went wrong"
            ) : (
              <>
                <img
                  src={userData.img || avtar}
                  className=" w-6 h-6 rounded-full"
                  alt="/"
                />
                <span className="text-bold">{userData.username}</span>
              </>
            )}
          </div>

          <div className="md:h-[50px] md:max-h-[50px]">
            <span className="font-bold text-lightblack tracking-wide leading-5 hover:underline">
              {/* {gig.title} */}
              {gig?.title.length > MAX_TITLE_LENGTH
                ? `${gig.title.substring(0, MAX_TITLE_LENGTH)}...`
                : gig.title}
            </span>
          </div>
          <div className="flex gap-2 items-center ">
            <AiFillStar />
           <div>
           <span className="text-yellow-800">
              {!isNaN(gig.totalStars / gig.starNumber) &&
                parseFloat((gig.totalStars / gig.starNumber).toFixed(1))}
               
            </span>
            <span className=" ml-[1px] text-stone-900 font-semibold">({gig.starNumber})</span>
           </div>
          </div>

          <div>
            <span className="text-black font-bold">${gig.price}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GigsCard;
