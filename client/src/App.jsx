import React from "react";
import Home from "./pages/Home";
import Gigs from "./pages/Gig/Gigs";
import AddNewGig from "./pages/Gig/AddNewGig";
import Orders from "./pages/order/Orders";
import SingleGigPage from "./pages/SingleGigPage";
import Messages from "./pages/User/Messages";

import Success from "./pages/order/Success";
import { Route, Routes } from "react-router-dom";
import PrivateRoute from "./utils/PrivateRoute";
import Wishlist from "./pages/User/WishList";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Profile from "./pages/User/Profile";
import SellerForm from "./pages/SellerForm";
import Dashboard from "./pages/Dashboard/Dashboard";
import ClientList from "./pages/Dashboard/ClientList";
import GigList from "./pages/Dashboard/GigList";
import OrderList from "./pages/Dashboard/OrderList";
import MessageList from "./pages/Dashboard/MessageList";
import OrderSlider from "./components/Order/OrderSlider";
import Pay from "./pages/order/Pay";
import { AuthModalProvider } from "./context/AuthModalContext";
import { AuthContextProvider } from "./context/AuthContext";
import { GigProvider } from "./context/GigContext";
import FreelancerList from "./pages/Dashboard/FreelancerList";
import ReportList from "./pages/Dashboard/ReportList";
import MyGigs from "./pages/User/MyGigs";
import OrderDetail from "./pages/order/OrderDetail";
import OrderRequirement from "./pages/order/OrderRequirement";
import PublicFeedback from "./components/Order/Buyer/PublicFeedback";
import EmailVerification from "./pages/EmailVerification";

function App() {
  const queryClient = new QueryClient();

  return (
    <>
      <ToastContainer />
      <QueryClientProvider client={queryClient}>
        <AuthContextProvider>
          <AuthModalProvider>
            <GigProvider>
              <Routes>
                <Route path="/" element={<Home />} exact />
                <Route path="/gigs" element={<Gigs />} />
                <Route path="/gig/:id" element={<SingleGigPage />} />

                <Route path="/test" element={<OrderSlider />} />
                <Route path="/mygigs" element={<MyGigs />} />

                <Route
                  path="/emailconfirmation"
                  element={<EmailVerification />}
                />
                <Route path="/profile/:id" element={<Profile />} />

                <Route element={<PrivateRoute />}>
                  <Route path="/addgig" element={<AddNewGig />} />
                  <Route path="/messages" element={<Messages />} />
                  <Route path="/orders" element={<Orders />} />
                  <Route path="/success" element={<Success />} />
                  <Route path="/wishlist" element={<Wishlist />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/clients" element={<ClientList />} />
                  <Route path="/freelancers" element={<FreelancerList />} />
                  <Route path="/personal_info" element={<SellerForm />} />
                  <Route path="/giglist" element={<GigList />} />
                  <Route path="/orderlist" element={<OrderList />} />
                  <Route path="/messagelist" element={<MessageList />} />
                  <Route path="/reports" element={<ReportList />} />
                  <Route path="/order/details/:id" element={<OrderDetail />} />
                  <Route
                    path="/order/requirement/:id"
                    element={<OrderRequirement />}
                  />
                  <Route
                    path="/order/completed/:id/rating"
                    element={<PublicFeedback />}
                  />

                  <Route path="/pay/:id" element={<Pay />} />
                </Route>
              </Routes>
            </GigProvider>
          </AuthModalProvider>
        </AuthContextProvider>
      </QueryClientProvider>
    </>
  );
}

export default App;
