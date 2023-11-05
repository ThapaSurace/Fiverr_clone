import React, {useState} from "react";
import Layout from "../../utils/Layout";
import { BsCheckCircleFill } from "react-icons/bs";
import { CgAttachment } from "react-icons/cg";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useGetSingleOrderQuery } from "../../api/OrderApi/OrderApi";
import { useMutation } from "@tanstack/react-query";
import newRequest from "../../utils/newRequest";
import upload from "../../utils/upload";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { RxCross2 } from "react-icons/rx";
import { AiFillFileText } from "react-icons/ai";

const OrderRequirement = () => {
  const [files, setMultipleFiles] = useState([]);
  const [uploadedFile, setUploadedFile] = useState([]);
  const [desc, setDesc] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const {id} = useParams()
  const {data} = useGetSingleOrderQuery(id)

  const navigate = useNavigate()

  const handleUpload = async () => {
    setIsLoading(true);
    try {
      const mfiles = await Promise.all(
        [...files].map(async (file) => {
          const url = await upload(file);
          return url;
        })
      );
      setUploadedFile(mfiles);
      setIsLoading(false);
    } catch (err) {
      console.log(err);
    }
  };

  const handleRemoveFile = (index) => {
    const updatedFiles = [...uploadedFile];
    updatedFiles.splice(index, 1);
    setUploadedFile(updatedFiles);
  };

  const {mutate} = useMutation({
    mutationFn: async (requirement) => {
     return await newRequest.put(`/order/requirement/${data?._id}`,requirement)
    },
    onSuccess: () => {
      setUploadedFile([])
      setDesc("")
      navigate("/orders")
    }
  })

  const handleSubmit = () => {
    const requirements = {
      document: uploadedFile,
      description: desc,
    };
    mutate(requirements)
  }


  return (
    <Layout>
      <div className=" max-w-2xl mx-auto py-10">
        <div className="flex gap-4 items-center bg-green-400 bg-opacity-60 p-2 rounded-md">
          <BsCheckCircleFill size={30} />
          <div>
            <h1 className="text-xl text-slate-950 font-bold tracking-wider capitalize">
              Thank you for your purchase
            </h1>
            <span className="text-sm font-bold">
              A recipt was sent to your email
            </span>
          </div>
        </div>

        <div className="mt-4 border border-stone-300 rounded-md p-4">
          <h1 className="border-b border-stone-300 pb-2 font-bold text-lg text-slate-950">
            Submit Your Requirement
          </h1>
          <h2 className="font-bold mt-2">
            The seller need the following information to start working on Your
            order:
          </h2>
          <div className="mt-4 text-sm">
            <h3 className="font-bold text-slate-500">
              1. Do you have an idea of what you want ? or should i suprise you
              ?
            </h3>
            <textarea
              className="mt-3"
              name="dec"
              id="desc"
              cols="3"
              rows="4"
              value={desc}
              onChange={e=>setDesc(e.target.value)}
            ></textarea>
          </div>
          <div className="mt-4 text-sm">
            <h3 className="font-bold text-slate-500">
              2. Attach files (optional)
            </h3>
            <div className="flex gap-2 mt-2">
              <label
                className="label gap-1 items-center border border-slate-400 rounded-md px-2 py-1 cursor-pointer inline-block"
                htmlFor="images"
              >
                <div className="flex gap-1 items-center">
                  <span>
                    <CgAttachment />
                  </span>
                </div>
              </label>
              <button
                disabled={isLoading}
                type="button"
                className="px-2 p-2 bg-sky-400 font-bold text-white rounded-md tracking-wide"
                onClick={handleUpload}
              >
                {isLoading ? "Uploading..." : "Upload file"}
              </button>
              <input
                className="hidden border-none focus:outline-none cursor-pointer file:border-none file:hover:border-2 file:font-bold file:bg-teal fil file:text-white file:hover:bg-[#5f9ea0]  file:cursor-pointer w-min file:rounded-lg file:px-2 file:py-1 "
                type="file"
                id="images"
                multiple
                onChange={(e) => setMultipleFiles(e.target.files)}
              />
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
                    {uploadedFile?.map((url, index) => (
                      <div key={index} className="mt-2">
                        {url?.toLowerCase().endsWith(".png") ||
                        url?.toLowerCase().endsWith(".jpg") ||
                        url?.toLowerCase().endsWith(".jpeg") ||
                        url?.toLowerCase().endsWith(".gif") ||
                        url?.toLowerCase().endsWith(".svg") ? (
                          <div className=" w-36 relative">
                            <LazyLoadImage
                              src={url}
                              alt={index}
                              className="h-w-full  object-center object-cover rounded-md"
                            />
                            <RxCross2
                              className="absolute top-2 right-2 bg-black text-white text-xl cursor-pointer"
                              onClick={() => handleRemoveFile(index)}
                            />
                            <span className="font-bold">
                              {" "}
                              {files[index]?.name}
                            </span>
                          </div>
                        ) : (
                          <div>
                            <div className="mb-4 font-bold tracking-wide flex gap-1 items-center">
                              <span className="text-white bg-red-400 px-2 py-1 rounded-md flex gap-1 items-center">
                                <AiFillFileText />{" "}
                                <span className="text-sm">
                                  {files[index]?.name}
                                </span>
                              </span>
                              <RxCross2
                                size={22}
                                onClick={() => handleRemoveFile(index)}
                                className="text-red-600 cursor-pointer"
                              />
                            </div>
                            {/* <a
                              href={url}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              No. of Document: {index + 1}
                            </a> */}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
          </div>
          <div>
            <button onClick={handleSubmit} className="btn w-full py-2 mt-6 bg-darkteal">Submit</button>
          </div>
         <Link to="/orders">
         <p className="text-end mt-3 text-slate-400 font-bold hover:underline cursor-pointer">Skip</p>
         </Link>
        </div>
      </div>
    </Layout>
  );
};

export default OrderRequirement;
