import React from "react";
import Layout from "../../utils/Layout";
import { useGetSingleOrderQuery } from "../../api/OrderApi/OrderApi";
import { useParams } from "react-router-dom";
import { Tab } from "@headlessui/react";
import OrderDetails from "../../components/Order/OrderDetails";
import OrderRequirementsDetail from "../../components/Order/OrderRequirementsDetail";
import OederDeliveredDetails from "../../components/Order/Buyer/OrderDeliveredDetails";
import { useAuth } from "../../context/AuthContext";
import RevisionDetails from "../../components/Order/RevisionDetails";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const OrderDetail = () => {
  const { id } = useParams();
  const { data, isLoading, error } = useGetSingleOrderQuery(id);
  const {user} = useAuth()

  const lists = [
    { name: 'Details' },
    { name: 'Requirements' },
    { name: 'Revision Details' },
  ]

  if (!user?.isSeller) {
    lists.push({ name: "Your Order" });
  }


  return (
    <Layout>
      <div className="container py-4">
        <h1 className="text-2xl font-bold text-darkteal text-center tracking-wide">Finalized the order</h1>
        <div className="w-full px-2 mt-6 sm:px-0">
          <Tab.Group>
            <Tab.List className="flex space-x-1 rounded-xl bg-blue-900/20 p-1">
              {lists.map((item,i) => (
                <Tab
                  key={i}
                  className={({ selected }) =>
                    classNames(
                      "w-full rounded-lg py-2.5 text-sm font-medium leading-5 text-blue-700",
                      "ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2",
                      selected
                        ? "bg-white shadow"
                        : "text-blue-100 hover:bg-white/[0.12] hover:text-white"
                    )
                  }
                >
                  {item.name}
                </Tab>
              ))}
            </Tab.List>
            <Tab.Panels>
              <Tab.Panel>
                <OrderDetails data={data} error={error} isLoading={isLoading} />
              </Tab.Panel>
              <Tab.Panel>
                <OrderRequirementsDetail data={data} error={error} isLoading={isLoading} />
              </Tab.Panel>
              <Tab.Panel>
                <RevisionDetails  data={data} error={error} isLoading={isLoading} />
              </Tab.Panel>
              <Tab.Panel>
                <OederDeliveredDetails data={data} error={error} isLoading={isLoading} />
              </Tab.Panel>
              
            </Tab.Panels>
          </Tab.Group>
        </div>
      </div>
    </Layout>
  );
};

export default OrderDetail;
