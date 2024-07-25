import React from "react";
import { Routes, Route } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Home from "./pages/Home";
import SendMoneyLink from "./pages/SendMoneyLink";
import Transaction from "./pages/Transaction";
import AuthWrapper from "./components/AuthWrapper";
import Profile from "./pages/Profile";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";

const App = () => {
  return (
    <>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route element={<AuthWrapper />}>
          <Route path="/" element={<Home />} />
          <Route path="/user/:id" element={<SendMoneyLink />} />
          <Route path="/transaction-history" element={<Transaction />} />
          <Route path="/me" element={<Profile />} />
        </Route>
        <Route path="/forgot/password" element={<ForgotPassword />} />
        <Route path="/reset/password/:token" element={<ResetPassword />} />
      </Routes>
    </>
  );
};

export default App;
