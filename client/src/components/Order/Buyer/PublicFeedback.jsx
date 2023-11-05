import React from "react";
import Layout from "../../../utils/Layout";
import { useState } from "react";
import Rating from "@mui/material/Rating";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import newRequest from "../../../utils/newRequest";
import { Link, useNavigate, useParams } from "react-router-dom";

const PublicFeedback = () => {
  const [communicationRating, setCommunicationRating] = useState(0);
  const [serviceDescriptionRating, setServiceDescriptionRating] = useState(0);
  const [recommendationRating, setRecommendationRating] = useState(0);
  const [desc, setDesc] = useState("");

  const navigate = useNavigate()

  const {id} = useParams()

  const queryClient = useQueryClient();

  const { mutate, isLoading } = useMutation({
    mutationFn: async (review) => {
      await newRequest.post("/review", review);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["reviews"]);
      setCommunicationRating(0)
      setRecommendationRating(0)
      setServiceDescriptionRating(0)
      setDesc("")
      navigate("/orders")
    },
  });

  const handleReview = () => {
    const review = {
      communicationRating,
      serviceDescriptionRating,
      recommendationRating,
      desc,
      gigId:id
    };
    mutate(review);
    console.log(review)
  };

  return (
    <Layout>
      <div className=" max-w-2xl mx-auto my-10">
        <h1 className="text-slate-400 font-semibold text-2xl">
          Public Feedback
        </h1>
        <p className="text-slate-900 font-bold text-xl tracking-wide">
          Share your experiaence with the community, to help them make better
          decisions.
        </p>
        <div className="flex flex-col gap-4 mt-8">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-slate-800 font-bold">
                Communication with Seller
              </h2>
              <span className="text-slate-500 font-bold">
                How responsive was seller during the process?
              </span>
            </div>
            <Rating
              name="half-rating"
              value={communicationRating}
              precision={0.5}
              onChange={(event, newValue) => {
                setCommunicationRating(newValue);
              }}
            />
          </div>
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-slate-800 font-bold">Service as described</h2>
              <span className="text-slate-500 font-bold">
                Did the gig match the Gig's description?
              </span>
            </div>
            <Rating
              name="half-rating"
              value={serviceDescriptionRating}
              precision={0.5}
              onChange={(event, newValue) => {
                setServiceDescriptionRating(newValue);
              }}
            />
          </div>
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-slate-800 font-bold">
                Buy again or Recommend
              </h2>
              <span className="text-slate-500 font-bold">
                Would you recomendate buying this product?
              </span>
            </div>
            <Rating
              name="half-rating"
              value={recommendationRating}
              precision={0.5}
              onChange={(event, newValue) => {
                setRecommendationRating(newValue);
              }}
            />
          </div>
        </div>
        <div className="mt-8">
          <h2 className="text-slate-900 font-bold mb-2">
            What was it like working with this Seller?
          </h2>
          <textarea
            name="desc"
            id="desc"
            cols="5"
            rows="5"
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
          ></textarea>
        </div>
        <div>
          <button
            disabled={isLoading}
            onClick={handleReview}
            className="btn bg-darkteal w-full p-2 mt-4 disabled:bg-opacity-40"
          >
            Submit
          </button>
        </div>
        <div className="mt-2 text-end">
         <Link to="/orders">
         <span className="font-bold underline text-slate-800 cursor-pointer hover:text-rose-500">Skip</span>
         </Link>
        </div>
      </div>
    </Layout>
  );
};

export default PublicFeedback;
