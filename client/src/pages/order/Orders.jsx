import React from "react";
import Layout from "../../utils/Layout";
import OrderList from "../../components/Order/OrderLists";

const Orders = () => {
  return (
    <Layout>
      <div className="container min-h-[60vh] my-10">
        <OrderList />
      </div>
    
    </Layout>
  );
};

export default Orders;
