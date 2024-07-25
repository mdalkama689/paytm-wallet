import React from "react";
import HomeLayout from "../components/HomeLayout";
import YourBalance from "../pages/YourBalance";
import Search from "../pages/Search";
const Home = () => {
  return (
    <HomeLayout>
      <YourBalance />
      <Search />
    </HomeLayout>
  );
};

export default Home;
