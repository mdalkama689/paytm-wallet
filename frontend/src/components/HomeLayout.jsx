import React from "react";
import TopSection from "../pages/TopSection";
import Footer from "../pages/Footer";
const HomeLayout = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen text-gray-100">
      <TopSection />
      <main className="flex-grow">{children}</main>
      <Footer />
    </div>
  );
};

export default HomeLayout;
