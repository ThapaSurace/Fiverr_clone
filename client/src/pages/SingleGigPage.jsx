import React, { useEffect, useState } from "react";
import {
  AiOutlineClockCircle,
  AiFillHeart,
  AiFillStar,
  AiOutlineShareAlt,
} from "react-icons/ai";
import {BiRevision} from "react-icons/bi"
import { FaHandPointRight, FaAngleDoubleRight } from "react-icons/fa";
import { GoReport } from "react-icons/go";
import Sliderr from "../components/Slider";
import { Link,useParams } from "react-router-dom";
import avtar from "../assests/avtar.jpg";
import Reviews from "../components/Review/Reviews";
import { LazyLoadImage } from "react-lazy-load-image-component";
import GigsCard from "../components/Card/GigsCard";
import Layout from "../utils/Layout";
import { useAuth } from "../context/AuthContext";
import { useSingleGigQuery, useRelatedGigsQuery } from "../api/GigApi/GigApi";
import ItemBasedRecom from "../components/Recommendation/ItemBasedRecom";
import OrderSlider from "../components/Order/OrderSlider";
import { Tooltip } from "react-tooltip";
import ReportModal from "../components/ReportModal";
import { useModal } from "../context/AuthModalContext";
import AuthModal from "../components/AuthModal/AuthModal"
import CategoryName from "../components/Layouts/CategoryName";
import { useSingleUserQuery } from "../api/UserApi/UserApi";

const SingleGigPage = () => {
  const { user } = useAuth();
  const { id } = useParams();

  const [open, setOpen] = useState(false);
  let [isOpen, setIsOpen] = useState(false)
  const {openModal} = useModal()

  const { isLoading, error, data, refetch } = useSingleGigQuery(id);

  const {
    isLoading: isLoadingRelatedGig,
    error: errorRelatedGig,
    data: relatedGigs,
    refetch: relatedGig,
  } = useRelatedGigsQuery(id);

  const {data:userData,isLoading:isUserLoading,error:userError} = useSingleUserQuery(data?.userId)

  console.log(userData)

  useEffect(() => {
    relatedGig();
    refetch();
  }, [id,refetch,relatedGig]);

  const handlePayment = () => {
    if (!user) {
     openModal(<AuthModal />)
    } else {
      setOpen(true);
    }
  };

  const handleReport = () => {
    setIsOpen(true)
  }

  return (
    <Layout>
      <CategoryName />
      <div className="container my-5 md:my-10 flex flex-col md:flex-row justify-between gap-5 md:gap-20  px-4">
        {isLoading ? (
          "loading.."
        ) : error ? (
          "Something went wrong!!"
        ) : (
          <>
            <div className="flex-[3] order-last md:order-first">
              <h1 className="font-semibold tracking-wide text-xl md:text-3xl mb-4">
                {data.title}
              </h1>
              <div className="flex items-center gap-2 mb-4">
               {
                isUserLoading ? "loading..."
                :userError ? "Something went wrong!"
                : (
                  <div>
                  <Link
                    className="cursor-pointer"
                    to={`/profile/${userData._id}`}
                  >
                    <LazyLoadImage
                      className="inline-block h-8 w-8 rounded-full mr-2"
                      src={userData.img || avtar}
                      alt="alt"
                    />
                    <span className="font-bold hover:underline">
                      {userData.username}
                    </span>
                  </Link>
                </div>
                )
               }
                <div className="flex gap-2 items-center text-[#fce24f]">
                  <AiFillStar />
                  <span>
                    {!isNaN(data.totalStars / data.starNumber) &&
                      parseFloat(
                        (data.totalStars / data.starNumber).toFixed(1)
                      )}
                  </span>
                </div>
              </div>

             {
              data?.images && data?.images.length > 0 && (
                <Sliderr
                className="rounded-md overflow-hidden"
                slidesToShow={1}
                arrowsScroll={1}
                duration={300}
              >
                {data?.images?.map((image, i) => (
                  <LazyLoadImage
                    className="h-[400px] object-cover"
                    src={image}
                    alt="alt"
                    key={i}
                  />
                ))}
              </Sliderr>
              ) 
             }

              <div className="mt-4 mb-8">
                <h1 className="font-bold text-2xl mb-4">About the gigs</h1>
                <p className="text-[#62646a] tracking-wide leading-6">
                  {data.desc}
                </p>
              </div>

              {/* related gigs */}
              <div>
                {relatedGigs?.length !== 0 && (
                  <div className="mb-8 bg-[#fafafa] p-4 border border-[#e4e5e7] rounded-md">
                    {isLoadingRelatedGig ? (
                      "loading..."
                    ) : errorRelatedGig ? (
                      "Something went wrong!!"
                    ) : (
                      <>
                        <span className="text-3xl font-bold tracking-wider">
                          Related Gigs
                        </span>

                        <Sliderr
                          slidesToShow={2}
                          arrowsScroll={2}
                          duration={300}
                        >
                          {relatedGigs?.map((gig) => (
                            <div className="mt-4">
                              <GigsCard gig={gig} key={gig._id} />
                            </div>
                          ))}
                        </Sliderr>
                      </>
                    )}
                  </div>
                )}
              </div>

              {/* Review */}
              <Reviews gigId={id} userId={data.userId} />
            </div>

            {/* Features card */}
            <div className="flex-[1]">
              <div className="flex justify-end">
                <div className="flex gap-4 items-center mb-6">
                  <div
                    data-tooltip-id="my-tooltip"
                    data-tooltip-content="Add to wisshlist"
                    data-tooltip-place="bottom"
                  >

                    <AiFillHeart
                      size={25}
                      className="text-stone-200 cursor-pointer"
                    />
                  </div>

                <div  data-tooltip-id="my-tooltip"
                    data-tooltip-content="Share this gig"
                    data-tooltip-place="bottom">  <AiOutlineShareAlt size={25} className="cursor-pointer" /></div>

                {
                  user &&  <div  data-tooltip-id="my-tooltip"
                  data-tooltip-content="Report this gig"
                  data-tooltip-place="bottom"
                  onClick={handleReport}> <GoReport size={25} className="cursor-pointer" /></div>
                }
                </div>
              </div>
              <div className=" w-full md:w-96 p-4 flex flex-col gap-4 shadow-custom rounded-md md:sticky top-24">
                <div className="flex justify-between">
                  <span className="font-bold">{data.shortTitle}</span>
                  <div className="text-xl">
                    <span className="mr-1">$</span>
                    {data.price}
                  </div>
                </div>
                <p className="text-sm font-semibold tracking-wider">{data.shortDesc}</p>
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2">
                    <AiOutlineClockCircle size={22} />
                    <div className="text-sm font-bold text-slate-700">
                      <div>{data.deliveryTime} <span>days</span></div>
                    </div>
                    </div>
                    <div className="flex items-center gap-2">
                    <BiRevision size={22} />
                    <div className="text-sm font-bold text-slate-700">
                      <div>{data.revisionNumber} <span>times</span></div>
                    </div>
                    </div>
                  </div>
                  <div className="flex flex-col gap-1">
                    {data.features.map((feature, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <span className=" text-darkteal">
                          <FaHandPointRight />
                        </span>
                        <span className="text-lightgray text-sm">
                          {feature}
                        </span>
                      </div>
                    ))}
                  </div>
                  <button
                    onClick={handlePayment}
                    className="btn bg-teal hover:bg-darkteal mt-4 py-2 px-4 w-full flex items-center"
                  >
                    <span className=" basis-[90%]">Continue</span>
                    <FaAngleDoubleRight className="basis-[10%]" />
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      <Tooltip id="my-tooltip" />

      <ReportModal isOpen={isOpen} setIsOpen={setIsOpen} id={id}  />

      {/* Item Based Recommendation */}
      <ItemBasedRecom gigId={id} />

      {/* Order Slide */}
      <OrderSlider open={open} setOpen={setOpen} gig={data} id={id} />
    </Layout>
  );
};

export default SingleGigPage;
