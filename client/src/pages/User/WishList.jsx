import React from "react";
import GigsCard from "../../components/Card/GigsCard";
import Loading from "../../utils/loading";
import Layout from "../../utils/Layout"
import { useWishlistGigsQuery } from "../../api/GigApi/GigApi";
import { useAuth } from "../../context/AuthContext";

const Mylist = () => {
  const {user} = useAuth()
  const { isLoading, error, data } = useWishlistGigsQuery(user)
  return (
   <Layout>
     <div className="mx-auto max-w-6xl h-[60vh] mt-10 px-2">
      <span className="text-xl font-bold text-gray">My Lists</span>
      {isLoading ? (
        <div>
           <Loading type={"spin"} color={"black"} height={20} width={20} />
        </div>
      ) : error ? (
        "Something went wrong!"
      ) : (
        <div className=" my-4 grid grid-cols-1 px-4 md:px-0 md:grid-cols-4 gap-4">
          {data?.map((list) => (
            <GigsCard key={list._id} gig={list.gigId}   />
          ))}
        </div>
      )}
    </div>
   </Layout>
  );
};

export default Mylist;
