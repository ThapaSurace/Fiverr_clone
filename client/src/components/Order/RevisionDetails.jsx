import React from "react";
import { useAuth } from "../../context/AuthContext";

const RevisionDetails = ({ data, isLoading, error }) => {
  const {user} = useAuth()
  return (
    <>
      <div className="max-w-2xl mx-auto my-10 flex flex-col gap-y-6 min-h-[40vh]">
        {!data?.revisionReason ? (
          <div className="flex justify-center items-center">
            <p className="text-2xl font-bold text-slate-900">
              {
                user?.isSeller ? "No revision has been sent for this order yet" : "You havent send for any revision related to this product yet."
              }
            </p>
          </div>
        ) : isLoading ? (
          "loading..."
        ) : error ? (
          "Something went wrong!"
        ) : (
          <>
            <div>
              <h1 className="text-2xl font-bold text-slate-900 mb-4">Title</h1>
              <p className="text-slate-500 font-bold tracking-wide leading-normal text-justify">
                {data.revisionReason.revisionTitle}
              </p>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900 mb-4">
                Description
              </h1>
              <p className="text-slate-500 font-bold tracking-wide leading-normal text-justify">
                {data.revisionReason.revisionDesc}
              </p>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default RevisionDetails;
