import React, { useState, useEffect } from "react";
import Header from "../components/Layouts/Header";
import Sliderr from "../components/Slider";
import { cats } from "../data";
import CategoryCard from "../components/Card/CategoryCard";
import Layout from "../utils/Layout";
import UserBasedRecomendation from "../components/Recommendation/UserBasedRecomendation";
import { GrProjects, GrInProgress } from "react-icons/gr";
import { FaUserSecret, FaMoneyCheckAlt } from "react-icons/fa";

const Home = () => {
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  // we use the useEffect hook to listen to the window resize event
  useEffect(() => {
    window.onresize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };
  }, []);

  return (
    <>
      <Layout>
        <Header />
        <div className="my-10">
          <UserBasedRecomendation />
        </div>
        <div className="container mt-16 mb-10 relative px-4 flex gap-2 flex-col">
          <span className=" text-dimGrey text-3xl uppercase tracking-wide font-bold">
            popular services
          </span>
          <div>
            <Sliderr
              slidesToShow={windowSize.width <= 576 ? 1 : 5}
              arrowsScroll={windowSize.width <= 576 ? 1 : 3}
              duration={300}
            >
              {cats.map((c) => (
                <CategoryCard key={c.id} item={c} />
              ))}
            </Sliderr>
          </div>
        </div>

        <div className="my-10 h-[50vh] flex items-center justify-center bg-slate-100 bg-opacity-70">
          <div className="container grid grid-cols-4 gap-6">
            <div className="flex flex-col items-center gap-1">
              <GrProjects size={30} />
              <h1 className="font-bold text-slate-950 text-lg">Post a Job</h1>
              <p className="font-semibold text-center text-slate-700">
                Tell us what you need done in seconds.
              </p>
            </div>
            <div className="flex flex-col items-center gap-2">
              <FaUserSecret size={30} />
              <h1 className="font-bold text-slate-950 text-lg">
                Choose freelancers
              </h1>
              <p className="font-semibold text-center text-slate-700">
                Get your first bid in seconds and choose from the best.
              </p>
            </div>
            <div className="flex flex-col items-center gap-1">
              <GrInProgress size={30} />
              <h1 className="font-bold text-slate-950 text-lg">
                Track progress
              </h1>
              <p className="font-semibold text-center text-slate-700">
                Chat with your freelancer and review their work 24/7.
              </p>
            </div>
            <div className="flex flex-col items-center gap-1">
              <FaMoneyCheckAlt size={30} />
              <h1 className="font-bold text-slate-950 text-lg">Pay safely</h1>
              <p className="font-semibold text-center text-slate-700">
                Only pay when you're completely satisfied.
              </p>
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
};

export default Home;
