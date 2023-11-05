import React from "react";
import avtar from "../../assests/avtar.jpg";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { BsEye } from "react-icons/bs";

const Latest = () => {
  return (
    <div className="shadow-custom mt-8 p-6 flex gap-10">
      <div className="shadow-custom mt-8 p-6 flex-[1]">
        <h1 className="font-bold text-teal text-lg">New Join Member</h1>

        <div className="grid grid-cols-3 mt-8">
          <div>
            <LazyLoadImage
              className="w-6 h-6 object-cover object-center rounded-full"
              src={avtar}
              alt="/"
            />
          </div>
          <div className="text-base font-semibold tracking-wide">John</div>
          <div className="text-base font-semibold flex gap-1 items-center bg-slate-500 px-2 py-1 rounded-md bg-opacity-40">
            <BsEye /> <span>Display</span>
          </div>
        </div>
      </div>

      <div className="shadow-custom mt-8 p-6 flex-[2]">
        <h1 className="font-bold text-teal text-lg">latest transaction</h1>

        <table className="table-auto w-full">
          <thead>
            <tr className="h-12">
              <th className="text-left text-slate-800 text-[18px] font-semibold tracking-wide">
                Customer
              </th>
              <th className="text-left text-slate-800 text-[18px] font-semibold tracking-wide">
                Date
              </th>
              <th className="text-left text-slate-800 text-[18px] font-semibold tracking-wide">
                Amount
              </th>
              <th className="text-left text-slate-800 text-[18px] font-semibold tracking-wide">
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            <tr className="">
              <td className="flex gap-2 items-center">
                <LazyLoadImage
                  className="w-[20px] h-[20px] object-cover object-center rounded-full"
                  src={avtar}
                  alt="/"
                />
                <span className="text-sm font-semibold">Zoro</span>
              </td>
              <td className="text-sm font-semibold">2023 Mar 12</td>
              <td className="text-sm font-semibold">$23.45</td>
              <td className="text-sm font-semibold">pending</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Latest;
