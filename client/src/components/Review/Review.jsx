import React, { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import newRequest from "../../utils/newRequest";
import avtar from "../../assests/avtar.jpg";
import { useAuth } from "../../context/AuthContext";
import moment from "moment";
import Rating from "@mui/material/Rating";

const Review = ({ review, userId, refetch }) => {
  const { user } =useAuth()
  
  const [showInput, setShowInput] = useState(false);
  const [replyText, setReplyText] = useState("");

  const { isLoading, error, data } = useQuery({
    queryKey: [review.userId],
    queryFn: () =>
      newRequest.get(`/user/${review.userId}`).then((res) => {
        return res.data;
      }),
  });

  const id = review?._id;

  const { mutate, isLoading: replyLoading } = useMutation({
    mutationFn: async (reply) => {
      return newRequest.put(`/review/${id}/replies`, reply);
    },
    onSuccess: () => {
      // You can reload the data here to reflect the changes
      refetch()
      setReplyText("");
      setShowInput(false);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const reply = {
      replyText,
      userId: user?._id,
    };
    mutate(reply);
  };

  return (
    <>
      {isLoading ? (
        "loading..."
      ) : error ? (
        "Something went wrong"
      ) : (
        <div className=" items-start py-4 flex gap-4 border-b-[1px] border-[#dadbdd]">
    
            <img
              className="w-10 h-10 object-cover object-center rounded-full"
              src={data.img || avtar}
              alt="alt"
            />
          <div>
            <div className="flex flex-col gap-2 items-start">
              <div>
                <div className="font-bold">{data.username}</div>
                <div className="capitalize">{data.country}</div>
              </div>
              <div className="flex gap-2">
                <div className="flex">
                <Rating name="half-rating"  precision={0.5} color="yellow" value={!isNaN((review?.communicationRating + review?.serviceDescriptionRating + review?.recommendationRating) / 3) &&
                parseFloat(((review?.communicationRating + review?.serviceDescriptionRating + review?.recommendationRating) / 3).toFixed(1))} readOnly />
                </div>
                <div className="text-sm font-bold text-slate-400">
                  {moment(review.createdAt).format("MMM Do YY")}
                </div>
              </div>
              <p className="text-[#404145] tracking-wide font-semibold text-[15px] leading-relaxed text-justify">
                {review.desc}
              </p>
            </div>
            <div className=" font-light text-stone-600 mt-1 flex gap-2">
              <span className="cursor-pointer">Like</span>
              <span className="cursor-pointer">Dislike</span>
              {user?._id === userId && (
                <span
                  onClick={() => setShowInput(!showInput)}
                  className="cursor-pointer"
                >
                  reply
                </span>
              )}
            </div>
            {showInput && (
              <form onSubmit={handleSubmit} className="flex gap-1">
                <input
                  type="text"
                  placeholder="Enter your reply"
                  className="border-x-0 border-t-0 rounded-none border-b border-stone-900 placeholder:font-normal focus:ring-0"
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  required
                />
                <button
                  disabled={replyLoading}
                  type="submit"
                  className="btn px-2 text-sm bg-darkteal hover:bg-blackteal"
                >
                  Submit
                </button>
              </form>
            )}
            <div className="mt-4 ml-2">
              {review.replies.map((rep,i) => (
                <div key={i} className="flex gap-2 mb-2">
                  <div>
                    <img
                      className="inline-block h-8 w-8 rounded-full object-cover object-center"
                      src={rep.userId.img || avtar}
                      alt="alt"
                    />
                  </div>
                  <div>
                    <span className="font-bold">{rep.userId.username}</span>
                    <p
                      className="text-[#404145] tracking-wide font-semibold text-[15px] leading-relaxed text-justify"
                      key={rep._id}
                    >
                      {rep.replyText}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Review;
