import React from "react";
import Layout from "../../utils/Layout";
import MessageLists from "../../components/Message/MessageLists";
const Messages = () => {
 
  return (
    <Layout>
      <div className='container h-[60vh] mt-10'>
      <MessageLists />
      </div>
    </Layout>
  );
};

export default Messages;
