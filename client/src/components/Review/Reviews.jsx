import React, { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import newRequest from "../../utils/newRequest";
import Review from "./Review";
import { useAuth } from "../../context/AuthContext";

const Reviews = ({ gigId, userId }) => {
  const queryClient = useQueryClient();
  const { user } = useAuth()

  const [desc, setDesc] = useState("");
  const [star, setStar] = useState("1");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { isLoading, error, data, refetch } = useQuery({
    queryKey: ["reviews"],
    queryFn: () =>
      newRequest.get(`/reviews/${gigId}`).then((res) => {
        return res.data;
      }),
  });
  
  const mutation = useMutation({
    mutationFn: async (review) => {
      setIsSubmitting(true);
      await newRequest.post("/review", review);
      setDesc("");
      setStar("1");
      setIsSubmitting(false);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["reviews"]);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    mutation.mutate({ gigId, desc, star });
  };

  return (
    <div className="mb-10">
      <h1 className="font-bold text-xl mb-2">Reviews</h1>
      {data?.length === 0 && (
        <span className=" capitalize text-lightblack tracking-wide font-bold">
          No review yet..
        </span>
      )}

      {isLoading
        ? "loading..."
        : error
        ? "Something went wrong!!"
        : data.map((review) => <Review key={review._id} review={review} userId={userId} refetch={refetch} />)}
      {/* {!user?.isSeller && (
        <div className="mt-4">
          <h3 className="font-bold text-lg mb-2">Add a review</h3>
          <form onSubmit={handleSubmit}>
            <div className="flex gap-1 mb-2">
              <input
                name="review"
                type="text"
                placeholder="Add your review..."
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
              />
              <select value={star} onChange={(e) => setStar(e.target.value)}>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
              </select>
            </div>
            <button
              disabled={isSubmitting}
              className="btn p-2 disabled:cursor-not-allowed"
            >
              Submit
            </button>
          </form>
        </div>
      )} */}
    </div>
  );
};

export default Reviews;
