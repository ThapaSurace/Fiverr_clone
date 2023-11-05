import React, { useEffect, useRef, useState, Fragment } from "react";
import { Listbox, Transition } from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";
import GigsCard from "../../components/Card/GigsCard";
import newRequest from "../../utils/newRequest";
import { useQuery } from "@tanstack/react-query";
import { Link, useLocation } from "react-router-dom";
import Loading from "../../utils/loading";
import NoItemsFound from "../../components/NoItemsFound";
import { BiHomeAlt2 } from "react-icons/bi";
import { RxSlash } from "react-icons/rx";
import Layout from "../../utils/Layout";
import CategoryName from "../../components/Layouts/CategoryName";

const type = [
  { name: "Newest", label: "createdAt" },
  { name: "rating", label: "rating" },
];

const Gigs = () => {
  const minRef = useRef();
  const maxRef = useRef();

  const [selected, setSelected] = useState(type[0].label);

  const sort = type.find((t) => t.label === selected);

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const searchString = searchParams.get("cat");
  const search = location.search;

  const { isLoading, error, data, refetch } = useQuery({
    queryKey: ["gigs", search],
    queryFn: () =>
      newRequest
        .get(
          `/gigs${search}&min=${minRef.current.value}&max=${maxRef.current.value}&sort=${sort?.label}`
        )
        .then((res) => {
          return res.data;
        }),
  });

  console.log(data);

  useEffect(() => {
    refetch();
  }, [selected,refetch]);

  const apply = () => {
    refetch();
  };

  return (
    <Layout>
      <CategoryName />
      <div className="container mt-4 px-2">
        <div className="px-4 md:px-0">
          <div className="flex items-center mb-4 font-light">
            <Link to="/">
              <span className="hover:text-primary">
                <BiHomeAlt2 />
              </span>
            </Link>
            <span className="mx-2">
              <RxSlash />
            </span>
            <span>{searchString}</span>
          </div>
          <span className=" font-extrabold text-2xl">AI ARTISTS</span>
          <p className="my-2 text-lightgray text-sm">
            Explore the boundaries of art and technology with Fiverr's artistis
          </p>
          <div className=" flex flex-col md:flex-row gap-2 md:gap-0 justify-between items-center border-b border-[#eee] pb-4">
            <div className="flex items-center gap-2">
              <span className=" font-ligh">Budget</span>
              <input
                className=" border border-lightgray h-6 w-20 md:w-40 px-2 rounded-md focus:outline-none"
                type="number"
                placeholder="min"
                ref={minRef}
              />
              <input
                className=" border border-lightgray h-6 w-20 md:w-40 px-2 rounded-md focus:outline-none"
                type="number"
                placeholder="max"
                ref={maxRef}
              />
              <button
                onClick={apply}
                className="bg-teal text-white h-6 w-20 rounded-md font-bold"
              >
                Apply
              </button>
            </div>
            <div className="flex gap-2 items-center">
              <span className="font-bold">Sort by:</span>
              <div className=" w-32 relative">
                <Listbox value={selected} onChange={setSelected}>
                  <div className="relative mt-1">
                    <Listbox.Button className="relative border border-stone-300 w-full cursor-default rounded-lg bg-white py-2 
                    pl-3 pr-10 text-left focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 
                    focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 
                    focus-visible:ring-offset-orange-300 sm:text-sm">
                      <span className="block truncate">{sort?.name}</span>
                      <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                        <ChevronUpDownIcon
                          className="h-5 w-5 text-gray-400"
                          aria-hidden="true"
                        />
                      </span>
                    </Listbox.Button>
                    <Transition
                      as={Fragment}
                      leave="transition ease-in duration-100"
                      leaveFrom="opacity-100"
                      leaveTo="opacity-0"
                    >
                      <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base 
                      shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                        {type.map((s, sortIdx) => (
                          <Listbox.Option
                            key={sortIdx}
                            className={({ active }) =>
                              `relative cursor-default select-none py-2 pl-10 pr-4 ${
                                active
                                  ? "bg-amber-100 text-amber-900"
                                  : "text-gray-900"
                              }`
                            }
                            value={s.label}
                          >
                            {({ selected }) => (
                              <>
                                <span
                                  className={`block truncate ${
                                    selected ? "font-medium" : "font-normal"
                                  }`}
                                >
                                  {s.name}
                                </span>
                                {selected ? (
                                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-amber-600">
                                    <CheckIcon
                                      className="h-5 w-5"
                                      aria-hidden="true"
                                    />
                                  </span>
                                ) : null}
                              </>
                            )}
                          </Listbox.Option>
                        ))}
                      </Listbox.Options>
                    </Transition>
                  </div>
                </Listbox>
              </div>
            </div>
          </div>
        </div>

        {data?.length === 0 ? (
          <NoItemsFound />
        ) : (
          <div className=" my-4 grid grid-cols-1 px-4 md:px-0 md:grid-cols-4 gap-x-4 gap-y-6">
            {isLoading ? (
              <Loading type={"spin"} color={"black"} height={20} width={20} />
            ) : error ? (
              "Something went wrong"
            ) : (
              data?.map((gig) => <GigsCard gig={gig} key={gig._id} />)
            )}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Gigs;
