import React from "react";
import { useQuery } from "@tanstack/react-query";
import newRequest from "../../utils/newRequest";
import GigsCard from "../Card/GigsCard";
import { useGetUserRecomendationQuery } from "../../api/RecomendationApi/RecomendationApi";
import Sliderr from "../Slider";
import { useAuth } from "../../context/AuthContext";

const UserBasedRecomendation = () => {
  const {user} = useAuth()
  const {
    data: recommendedGigs,
  } = useGetUserRecomendationQuery(user?._id)

  console.log(recommendedGigs)

  const {
    data: gigDetails,
  } = useQuery({
    queryKey: ["gigDetails"],
    queryFn: async () => {
      const gigDetailsPromises = recommendedGigs?.data?.map(
        async (recommendedGig) => {
          try {
            const response = await newRequest.get(
              `/gig/single/${recommendedGig.gigId}`
            );
            return response.data;
          } catch (error) {
            console.error("Error fetching gig details:", error);
            return null;
          }
        }
      );
      return Promise.all(gigDetailsPromises);
    },
    enabled: recommendedGigs?.data?.length > 0, // Only fetch if recommendedGigs has data
  });

  // console.log(recommendedGigs?.data)

  console.log(gigDetails)


  return (
    <div>
      {gigDetails && gigDetails?.length > 0 ? (
        <div className="container mb-10 mt-20">
          <h1 className="font-bold text-xl md:text-2xl mb-2 md:mb-6 text-[#404145] tracking-wider">
            Gigs you may like
          </h1>

          { gigDetails && gigDetails?.length > 0 ? (
            <Sliderr slidesToShow={4} arrowsScroll={3} duration={300}>
              {gigDetails?.map((gig) => (
                <GigsCard gig={gig} key={gig._id} />
              ))}
            </Sliderr>
          ) : (
            ""
          )}
        </div>
      ) : (
        ""
      )}
    </div>
  );
};

export default UserBasedRecomendation;
