import React from "react";
import { AiFillDelete } from "react-icons/ai";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../../context/AuthContext";
import newRequest from "../../utils/newRequest";
import { Link } from "react-router-dom";
import { LazyLoadImage } from "react-lazy-load-image-component";


const MyGigs = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { isLoading, error, data } = useQuery({
    queryKey: ["mygigs"],
    queryFn: () =>
      newRequest.get(`/gigs?userId=${user._id}`).then((res) => {
        return res.data;
      }),
  });

  const mutation = useMutation({
    mutationFn: (id) => {
      return newRequest.delete(`/gig/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["mygigs"]);
    },
  });

  const handleDelete = (id) => {
    mutation.mutate(id);
  };

  return (
    <div className="container my-10">
      <div className="flex items-center justify-between mb-4">
        <span className="text-2xl font-bold">Gigs</span>
        <Link to="/addgig">
        <button className="btn px-2 py-1">
          Add new gig
        </button>
        </Link>
      </div>
      {isLoading ? (
        "loading..."
      ) : error ? (
        "Something went wrong"
      ) : (
        <table className="table-auto w-full">
          <thead>
            <tr className="h-12">
              <th className=" text-left text-darkteal text-[18px] font-semibold tracking-wide">Image</th>
              <th className=" text-left text-darkteal text-[18px] font-semibold tracking-wide">Title</th>
              <th className=" text-left text-darkteal text-[18px] font-semibold tracking-wide">Price</th>
              <th className=" text-left text-darkteal text-[18px] font-semibold tracking-wide">Sales</th>
              <th className=" text-left text-darkteal text-[18px] font-semibold tracking-wide">Action</th>
            </tr>
          </thead>
          <tbody>
            {data.map((gig) => (
              <tr className="h-12 even:bg-[#f8fcff]" key={gig._id}>
                <td>
                  <LazyLoadImage
                    className="w-[50px] h-[25px] object-cover rounded-md"
                    src={gig.cover}
                    alt={gig.title}
                  />
                </td>
                <td className="text-sm font-semibold tracking-wide text-teal">{gig.title}</td>
                <td className="font-semibold">${gig.price}</td>
                <td className="font-semibold slashed-zero">{gig.sales}</td>
                <td className="text-[#e44242]">
                  <AiFillDelete
                    className="cursor-pointer"
                    size={25}
                    onClick={() => handleDelete(gig._id)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default MyGigs;
