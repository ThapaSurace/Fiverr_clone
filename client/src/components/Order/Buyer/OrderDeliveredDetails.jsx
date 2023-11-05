import React, { useState } from "react";
import { AiTwotoneFileZip } from "react-icons/ai";
import { RadioGroup } from "@headlessui/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import newRequest from "../../../utils/newRequest";
import Loading from "../../../utils/loading";
import { useNavigate } from "react-router-dom";


const revision = [
  {
    name: "I still need revision",
  },
  {
    name: "I received a partial delivery",
  },
  {
    name: "I'm dissastified with quality",
  },
  {
    name: "I didn't received anything",
  },
];

const OederDeliveredDetails = ({ data, error, isLoading }) => {
  const [rejected, setRejected] = useState(false);
  const [selected, setSelected] = useState(null);
  const [desc, setDesc] = useState("");

  const queryClient = useQueryClient();
  const navigate = useNavigate()

  const imageExtensions = [".jpg", ".jpeg", ".png", ".gif", ".svg"];

  const getFileNameFromURL = (url) => {
    const segments = url?.split("/");
    return segments[segments?.length - 1];
  };

  const { mutate, isLoading: approvableLoading } = useMutation({
    mutationFn: async (revisionData) => {
      await newRequest.put(`/order/approvable/${data?._id}`, revisionData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["orders"]);
      setRejected(false);
    },
  });

  const handleApprove = (type) => {
    const revisionTitle = selected?.name;
    const revisionDesc = desc;
    const revisionData =
      type === "reject" ? { revisionTitle, revisionDesc } : {};
    mutate(revisionData);
    
  if (type === "approve") {
    // Navigate to the rating page
   navigate(`/order/completed/${data.gigId}/rating`)
  }
  };


  return (
    <>
      <div className="max-w-2xl mx-auto py-4">
        {data?.finishedProduct.document &&
        data?.finishedProduct.document.length === 0 &&
        (!data?.finishedProduct.description ||
          data?.finishedProduct.description.trim() === "") ? (
          <div className="flex justify-center items-center  min-h-[60vh]">
            <p className="text-2xl font-bold text-darkteal">Your Order hasnot been delivered by seller</p>
          </div>
        ) : isLoading ? (
          "loading..."
        ) : error ? (
          "Something went wrong!"
        ) : (
          <>
            <div className="py-4 border-b border-stone-600">
              <div>
                <h1 className="text-lg font-bold text-slate-900">
                  Description:
                </h1>
                <p>{data.finishedProduct.description}</p>
              </div>
              <div className="mt-6">
                <h1 className="text-lg font-bold text-slate-900">Documents:</h1>
                {data.finishedProduct.document?.map((doc, index) => (
                  <div key={index} className="py-2">
                    <a href={doc} target="_blank" rel="noopener noreferrer">
                      {imageExtensions.some((ext) =>
                        doc?.toLowerCase().endsWith(ext)
                      ) ? (
                        <>
                          <h1 className="font-bold capitalize text-darkteal mb-1">
                            Images
                          </h1>
                          <img
                            src={doc}
                            alt={`${index}`}
                            className=" w-64 object-cover object-center"
                          />
                          <br />
                        </>
                      ) : (
                        <>
                          <div className="flex flex-col gap-2">
                            <h1 className="font-bold capitalize text-darkteal mb-1">
                              files
                            </h1>
                            <div className=" bg-slate-600 p-2 rounded-md font-bold text-white flex gap-1 items-center">
                              <AiTwotoneFileZip />
                              <span className="">
                                {getFileNameFromURL(doc)}{" "}
                              </span>
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
            <div>
              {data?.revisionReason ? (
                <div>
                  <div className="mt-4 flex items-end">
                    <p className="font-bold text-xl text-slate-900">
                      Wating for revisied product
                    </p>
                    <Loading
                      ype={"spin"}
                      color={"black"}
                      height={20}
                      width={20}
                    />
                  </div>
                  <div>{data.revisionNumber} revision left</div>
                </div>
              ) : (
                <>
                  {data.acceptedByBuyer !== true && (
                    <div className="mt-4">
                     <h1 className="text-darkteal font-bold text-xl">
                        Are you pleased with the delivery and ready to approve
                        it?
                      </h1>
                 
                      {!rejected ? (
                        <div className="flex  gap-4 mt-4">
                          <button
                            onClick={() => handleApprove("approve")}
                            disabled={approvableLoading}
                            className="border-2 border-green-500 py-2 px-4 rounded-md text-sm text-slate-800 font-bold hover:bg-green-500 hover:text-white transition-all ease-in-out duration-300 disabled:bg-opacity-30"
                          >
                            {approvableLoading ? "loading.." : "Approve"}
                          </button>
                          <button
                            onClick={() => setRejected(!rejected)}
                            disabled={approvableLoading}
                            className="border-2 border-red-500 py-2 px-4 rounded-md text-sm text-slate-800 font-bold hover:bg-red-500 hover:text-white transition-all ease-in-out duration-300 disabled:bg-opacity-30"
                          >
                            {approvableLoading ? "loading.." : "reject"}
                          </button>
                        </div>
                      ) : (
                        <div className="mt-4">
                          <RadioGroup value={selected} onChange={setSelected}>
                            <RadioGroup.Label className="sr-only">
                              Server size
                            </RadioGroup.Label>
                            <div className="space-y-2">
                              {revision
                                .filter(
                                  (rev) =>
                                    rev.name !== "I still need revision" ||
                                    data.revisionNumber > 0
                                )
                                .map((rev) => (
                                  <RadioGroup.Option
                                    key={rev.name}
                                    value={rev}
                                    className={({ active, checked }) =>
                                      `${
                                        active
                                          ? "ring-2 ring-white ring-opacity-60 ring-offset-2 ring-offset-sky-300"
                                          : ""
                                      }
                  ${
                    checked ? "bg-sky-900 bg-opacity-75 text-white" : "bg-white"
                  }
                    relative flex cursor-pointer rounded-lg px-5 py-4 shadow-custom focus:outline-none`
                                    }
                                  >
                                    {({ active, checked }) => (
                                      <>
                                        <div className="flex w-full items-center justify-between">
                                          <div className="flex items-center">
                                            <div className="text-sm">
                                              <RadioGroup.Label
                                                as="p"
                                                className={`font-bold text-slate-900 tracking-wide  ${
                                                  checked
                                                    ? "text-white"
                                                    : " text-slate-800"
                                                }`}
                                              >
                                                {rev.name}
                                              </RadioGroup.Label>
                                            </div>
                                          </div>
                                          {checked && (
                                            <div className="shrink-0 text-white">
                                              <CheckIcon className="h-6 w-6" />
                                            </div>
                                          )}
                                        </div>
                                      </>
                                    )}
                                  </RadioGroup.Option>
                                ))}
                            </div>
                          </RadioGroup>

                          <div className="mt-4">
                            <label className="label" htmlFor="desc">
                              Description
                            </label>
                            <textarea
                              name="desc"
                              id="desc"
                              cols="5"
                              rows="5"
                              placeholder="Explain the reason..."
                              value={desc}
                              onChange={(e) => setDesc(e.target.value)}
                            ></textarea>
                          </div>
                          <div className="mt-4">
                            <button
                              disabled={approvableLoading}
                              onClick={() => handleApprove("reject")}
                              className="w-full bg-teal text-white font-bold p-2 rounded-md disabled:bg-opacity-30"
                            >
                              {approvableLoading ? "loading..." : "Submit"}
                            </button>
                          </div>
                          <div className="font-bold text-end text-slate-700 hover:cursor-pointer hover:underline">cancel</div>
                        </div>
                      )}
                    </div>
                  )}
                </>
              )}
            </div>
          </>
        )}
      </div>
    </>
  );
};

function CheckIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <circle cx={12} cy={12} r={12} fill="#fff" opacity="0.2" />
      <path
        d="M7 13l3 3 7-7"
        stroke="#fff"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default OederDeliveredDetails;
