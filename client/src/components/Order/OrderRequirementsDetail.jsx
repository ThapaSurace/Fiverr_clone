import React from "react";
import { AiTwotoneFileZip } from "react-icons/ai";
import { BsImageFill } from "react-icons/bs";
import { MdDoubleArrow } from "react-icons/md";
import { useAuth } from "../../context/AuthContext";

const OrderRequirementsDetail = ({ data, error, isLoading }) => {
  const { user } = useAuth();
  const imageExtensions = [".jpg", ".jpeg", ".png", ".gif", ".svg"];

  const getFileNameFromURL = (url) => {
    const segments = url?.split("/");
    return segments[segments?.length - 1];
  };

  return (
    <div>
      {isLoading ? (
        "loading..."
      ) : error ? (
        "Something went wrong!"
      ) : data?.clientRequirements.document &&
        data?.clientRequirements.document.length === 0 &&
        (!data?.clientRequirements.description ||
          data?.clientRequirements.description.trim() === "") ? (
        <div className="h-[60vh] flex justify-center items-center">
          {user?.isSeller ? (
            <p className="font-bold text-xl text-blackteal">Client has not sent any requirments</p>
          ) : (
            <p className="font-bold text-xl text-blackteal">You have not sent any requirements.</p>
          )}
        </div>
      ) : (
        <div className="py-4 max-w-2xl mx-auto min-h-[60vh]">
          <div>
            <h1 className="text-lg font-bold text-slate-900">Description:</h1>
            <p>{data.clientRequirements.description}</p>
          </div>
          <div className="mt-6">
            <h1 className="text-lg font-bold text-slate-900">Documents:</h1>
            <div className="grid grid-cols-2 gap-4 items-center mt-4">
              {data.clientRequirements.document?.map((doc, index) => (
                <div key={index} className="py-2">
                  <a href={doc} target="_blank" rel="noopener noreferrer">
                    {imageExtensions.some((ext) =>
                      doc?.toLowerCase().endsWith(ext)
                    ) ? (
                      <>
                        <div className="flex items-center gap-4">
                          <MdDoubleArrow size={25} />
                          <div>
                            <img
                              src={doc}
                              alt={`${index}`}
                              className=" w-48 object-cover object-center rounded-md"
                            />
                            <span className=" bg-slate-600 p-2 font-bold text-white rounded-md flex gap-1 items-center mt-3 max-w-fit text-sm">
                              <BsImageFill className="bg-green-500" />
                              <span className="">
                                {getFileNameFromURL(doc)}{" "}
                              </span>
                            </span>
                          </div>
                        </div>
                        <br />
                      </>
                    ) : (
                      <>
                        <div className="flex items-center gap-4">
                          <MdDoubleArrow size={25} />
                          <div className=" bg-slate-600 p-2 rounded-md font-bold text-white flex gap-1 items-center max-w-fit">
                            <AiTwotoneFileZip className=" bg-violet-700" />
                            <span className="">{getFileNameFromURL(doc)} </span>
                          </div>
                        </div>
                        <br />
                      </>
                    )}
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderRequirementsDetail;
