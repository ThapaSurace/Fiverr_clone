import React from "react";
import { useGetItemRecomendationQuery } from "../../api/RecomendationApi/RecomendationApi";
import Loading from "../../utils/loading";
import GigsCard from "../Card/GigsCard";
import Sliderr from "../Slider";
import { useAuth } from "../../context/AuthContext";

const ItemBasedRecom = ({ gigId }) => {
  const {user} = useAuth()
  const { error, isLoading, data } = useGetItemRecomendationQuery(gigId,user);
  return (
    <>
      {data && data?.length > 0 ? (
        <div className="container mb-10 mt-20">
          <h1 className="font-bold text-xl md:text-2xl mb-2 md:mb-6 text-[#404145] tracking-wider">
            People Who Viewed This Service Also Viewed{" "}
          </h1>

          {isLoading ? (
            <Loading type={"spin"} color={"black"} height={20} width={20} />
          ) : error ? (
            "Something went wrong"
          ) : data && data?.length > 0 ? (
            <Sliderr slidesToShow={4} arrowsScroll={3} duration={300}>
              {data?.map((gig) => (
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
    </>
  );
};

export default ItemBasedRecom;
