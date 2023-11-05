import React from "react";
import DashboardLayout from "../../utils/DashboardLayout";
import OrderLists from "../../components/Order/OrderLists";

const OrderList = () => {

  return (
    <DashboardLayout>
      <OrderLists />
    </DashboardLayout>
  );
};

export default OrderList;
