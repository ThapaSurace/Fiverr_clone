import React from "react";
import { AiOutlineArrowUp, AiOutlineArrowDown } from "react-icons/ai";
import {
  useCompareIncomeQuery,
  useCompareOrderQuery,
  useTotalIncomeQuery,
} from "../../api/OrderApi/OrderApi";
import { useCompareUserQuery } from "../../api/UserApi/UserApi";
import { useAuth } from "../../context/AuthContext";

const Widgets = () => {
  const { user } = useAuth();
  const { data = [] } = useCompareIncomeQuery();
  const { data: orderData } = useCompareOrderQuery();
  const { data: userNumber } = useCompareUserQuery();
  const { data: totalIncome } = useTotalIncomeQuery();

  // Default value for previous month order data if not available
  const previousMonthOrderData = orderData?.previousMonth || 0;
  const currentMonthOrderData = orderData?.currentMonth || 0;

  // Default value for previous month income data if not available
  const previousMonthIncomeData = data?.previousMonthTotalIncome || 0;
  const currentMonthIncomeData = data?.currentMonthTotalIncome || 0;

  // Default value for previous month income data if not available
  const previousMonthUserData = userNumber?.previousMonth?.clientUsers || 0;
  const currentMonthUserData = userNumber?.currentMonth?.clientUsers || 0;

  // Default value for previous month income data if not available
  const previousMonthSellerUserData =
    userNumber?.previousMonth?.sellerUsers || 0;
  const currentMonthSellerUserData = userNumber?.currentMonth?.sellerUsers || 0;

  // Calculate percentage values
  const orderPercentage =
    previousMonthOrderData !== 0
      ? Math.floor((currentMonthOrderData * 100) / previousMonthOrderData - 100)
      : 0;

  const incomePercentage =
    previousMonthIncomeData !== 0
      ? Math.floor(
          (currentMonthIncomeData * 100) / previousMonthIncomeData - 100
        )
      : 0;

  const clientUserPercentage =
    previousMonthUserData !== 0
      ? Math.floor((currentMonthUserData * 100) / previousMonthUserData - 100)
      : 0;

  const sellerUserPercentage =
    previousMonthSellerUserData !== 0
      ? Math.floor(
          (currentMonthSellerUserData * 100) / previousMonthSellerUserData - 100
        )
      : 0;

  return (
    <div className="grid grid-cols-4 gap-10 mt-4">
      <div className="shadow-custom px-4 py-8 rounded-md">
        <h1 className="font-bold text-teal">No. Of Orders</h1>
        <div className="my-4 flex items-center gap-1">
          <span className="font-extrabold text-xl mr-4">
            {currentMonthOrderData}
          </span>
          <span>% {orderPercentage}</span>

          <span className="text-2xl">
            {orderPercentage < 0 ? (
              <AiOutlineArrowDown className="text-red-500" />
            ) : (
              <AiOutlineArrowUp className="text-green-500" />
            )}
          </span>
        </div>
        <p className="font-semibold text-lightgray text-sm">
          Compared to last month
        </p>
      </div>

      <div className="shadow-custom px-4 py-8 rounded-md">
        <h1 className="font-bold text-teal">Revanue</h1>
        <div className="my-4">
          <div className="my-4 flex items-center gap-1">
            <span className="font-extrabold text-xl mr-4">
              ${currentMonthIncomeData.toFixed(2)}
            </span>
            <span>% {incomePercentage.toFixed(2)}</span>

            <span className="text-2xl">
              {incomePercentage < 0 ? (
                <AiOutlineArrowDown className="text-red-500" />
              ) : (
                <AiOutlineArrowUp className="text-green-500" />
              )}
            </span>
          </div>
        </div>
        <p className="font-semibold text-lightgray text-sm">
          Compared to last month
        </p>
      </div>

      {user?.isAdmin && (
        <>
          <div className="shadow-custom px-4 py-8 rounded-md">
            <h1 className="font-bold text-teal">Client</h1>
            <div className="my-4 flex items-center gap-1">
              <span className="font-extrabold text-xl mr-4">
                {currentMonthUserData}
              </span>
              <span>% {clientUserPercentage.toFixed(2)}</span>

              <span className="text-2xl">
                {clientUserPercentage < 0 ? (
                  <AiOutlineArrowDown className="text-red-500" />
                ) : (
                  <AiOutlineArrowUp className="text-green-500" />
                )}
              </span>
            </div>
            <p className="font-semibold text-lightgray text-sm">
              Compared to last month
            </p>
          </div>

          <div className="shadow-custom px-4 py-8 rounded-md">
            <h1 className="font-bold text-teal">Freelancer</h1>
            <div className="my-4 flex items-center gap-1">
              <span className="font-extrabold text-xl mr-4">
                {currentMonthSellerUserData}
              </span>
              <span>% {sellerUserPercentage.toFixed(2)}</span>

              <span className="text-2xl">
                {sellerUserPercentage < 0 ? (
                  <AiOutlineArrowDown className="text-red-500" />
                ) : (
                  <AiOutlineArrowUp className="text-green-500" />
                )}
              </span>
            </div>
            <p className="font-semibold text-lightgray text-sm">
              Compared to last month
            </p>
          </div>
        </>
      )}

      <div className="shadow-custom px-4 py-8 rounded-md">
        <h1 className="font-bold text-teal">Total Earning</h1>
        <div className="my-4 flex items-center gap-1">
          <span className="font-extrabold text-xl mr-4">
            ${totalIncome?.totalIncome.toFixed(2)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default Widgets;
