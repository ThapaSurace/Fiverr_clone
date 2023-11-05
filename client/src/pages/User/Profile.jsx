import React, { useState } from "react";
import avtar from "../../assests/avtar.jpg";
import { BiCurrentLocation, BiMessageRounded } from "react-icons/bi";
import { BsSend } from "react-icons/bs";
import { AiFillStar } from "react-icons/ai";
import { useQuery, useMutation } from "@tanstack/react-query";
import newRequest from "../../utils/newRequest";
import { useAuth } from "../../context/AuthContext";
import Layout from "../../utils/Layout";
import SmallGigCard from "../../components/Card/SmallGigCard";
import { useParams } from "react-router-dom";
import MessageModal from "../../components/Message/MessageModal";
import { useModal } from "../../context/AuthModalContext";

const Profile = () => {
  const { user } =useAuth();
  const { id } = useParams();

  let [isOpen, setIsOpen] = useState(false)

  const {openModal} = useModal()
  
  //close message dialog
  function closeModal() {
    setIsOpen(false)
  }

  const convId = id + user?._id;
  
  // get single freelancer info
  const { isLoading, error, data } = useQuery({
    queryKey: ["freelancer"],
    queryFn: () =>
      newRequest.get(`/freelancer/${id}`).then((res) => {
        return res.data;
      }),
  });
  
  // get list of gig related to specific freelancer
  const { data: gigData } = useQuery({
    queryKey: ["mygigs"],
    queryFn: () =>
      newRequest.get(`/gigs?userId=${id}`).then((res) => {
        return res.data;
      }),
  });
  
  
  const { data: convData } = useQuery({
    queryKey: ["conv"],
    queryFn: () =>
      newRequest.get(`/conversation/${convId}`).then((res) => {
        return res.data;
      }),
    
        retry: (failureCount, error) => {
          // Customize the retry behavior here.
          // For example, you can return false to stop retrying on error.
          // You can also inspect the failureCount or error object to determine when to retry.
          console.error('Error fetching conversation data:', error);
          return false;
        },
      
  });

  
  // create new conservation
  const { mutate } = useMutation({
    mutationFn: (to) => {
      return newRequest.post(`/conversation`, to);
    },
    onSuccess: (cdata) => {
      const conversationId = cdata?.data?.id;
      console.log(conversationId);
      if (conversationId) {
        // navigate(`/message/${conversationId}`);
        setIsOpen(true)
      } else {
        // Handle the case where the conversation ID is not available.
        console.error("Conversation ID not available.");
      }
    },
  });
  
  
  const handleConservation = () => {
    if (convData) {
      // navigate(`/message/${convData?.id}`);
      setIsOpen(true)
    } else {
      mutate({ to: id });
    }
  };

  return (
    <Layout>
      <div className="container gap-16 py-10 px-4 lg:px-0">
        {isLoading ? (
          "loading..."
        ) : error ? (
          "Something went wrong!!"
        ) : (
          <div className="flex justify-between gap-10">
            <div className="">
              <div className="flex gap-4 items-center">
                <img
                  src={avtar}
                  alt="/"
                  className="w-[200px] h-[200px] rounded-full object-cover object-center"
                />
                <div className="flex flex-col gap-2">
                  <div>
                    <span className="tracking-wider font-bold text-2xl mr-1">
                      {data.display_name}
                    </span>
                    <span className="italic text-gray text-sm font-semibold">
                      @{data.userId.username}
                    </span>
                  </div>

                  <div className="flex gap-1 items-center">
                    <AiFillStar size={22} />{" "}
                    <span className="font-bold">4.9</span>
                  </div>

                  <div className="flex gap-4 items-center text-slate-700 font-bold capitalize">
                    <div className="flex gap-1 items-center">
                      <span>
                        <BiCurrentLocation size={22} />
                      </span>
                      <span>{user?.country}</span>
                    </div>

                    <div className="flex gap-1 items-center">
                      <span>
                        <BiMessageRounded size={22} />
                      </span>
                      <div className="flex gap-2 items-center">
                        <span>Speaks</span>
                        <div className="">
                          {data.languages.map((lan, i) => (
                            <span key={i} className="text-sm mr-2">
                              {lan}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="text-sm text-slate-400 font-semibold tracking-wider">
                    <span>Member Since</span> <span>23 May 2023</span>
                  </div>
                </div>
              </div>

              <div className="h-min p-4 bg-white mt-10 flex flex-col gap-y-10 max-w-4xl">
                <div>
                  <h1 className="font-bold tracking-wider text-teal text-xl">
                    About Me
                  </h1>

                  <p className="text-gray font-semibold tracking-wider leading-tight mt-4">
                    {data.desc}
                  </p>
                </div>

                <div>
                  <h1 className="font-bold tracking-wider text-teal text-xl">
                    I'm an expert in
                  </h1>

                  <div className="flex gap-2 flex-wrap mt-4">
                    {data.skills.map((skill, i) => (
                      <span
                        key={i}
                        className="text-sm font-bold tracking-wide text-gray border border-[#dadbdd] p-2 rounded-md cursor-pointer"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h1 className="font-bold tracking-wider text-teal text-xl mb-2">
                    Academedic Qualification and Certificate
                  </h1>

                  <div className="border-t border-[#dadbdd] py-4">
                    <span className="font-bold tracking-wider text-teal ml-4">
                      Educations
                    </span>

                    <div className="mt-4 ml-4">
                      {data?.educations?.map((edu, i) => (
                        <div key={i} className="flex justify-between">
                          <div className="font-bold text-dimGrey">
                            {edu.major}
                          </div>
                          <div className="text-[#b2b2b2] font-semibold text-sm  flex gap-1 tracking-wide">
                            <div>{edu.collegeName},</div>
                            <div>
                              <span>Graduated </span>
                              {edu.selectedEducationYear}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="border-t border-[#dadbdd] py-4">
                    <span className="font-bold tracking-wider text-teal ml-4">
                      Certificates
                    </span>

                    <div className="mt-4 ml-4">
                      {data?.certificates?.map((cer, i) => (
                        <div key={i} className="flex justify-between">
                          <div className="font-bold text-dimGrey">
                            {cer.certificate}
                          </div>
                          <div className="text-[#b2b2b2] font-semibold text-sm  flex gap-1 tracking-wide">
                            <div>{cer.from},</div>
                            <div>
                              <span>Graduated </span>
                              {cer.year}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

           {
            !user?.isSeller && (
              <div className="border border-[#dadbdd] flex justify-center items-center px-10 w-[400px] shadow-custom rounded-md h-[200px]">
              <div className=" flex flex-col gap-y-4 items-center">
                <button
                  onClick={handleConservation}
                  type="button"
                  className=" bg-green-400 hover:bg-green-500 duration-200 ease-in-out text-white py-2 font-bold rounded-md flex justify-center items-center w-[300px]"
                >
                  <div className="flex gap-1 items-center">
                    <BsSend /> <span>Contact Me</span>
                  </div>
                </button>
                <span className=" text-slate-600 text-sm font-semibold">
                  Average Response Time: 3 hours
                </span>
              </div>
            </div>
            )
           }
          </div>
        )}

        <div className="mt-10 px-4 lg:px-0 ">
          <h1 className="font-bold  text-teal text-xl mb-8">See My Gigs</h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3  gap-10 ">
            {gigData?.map((gig) => (
              <SmallGigCard key={gig._id} gig={gig} />
            ))}
          </div>
        </div>
      </div>
      <MessageModal isOpen={isOpen} closeModal={closeModal} cId={convId} />
    </Layout>
  );
};

export default Profile;
