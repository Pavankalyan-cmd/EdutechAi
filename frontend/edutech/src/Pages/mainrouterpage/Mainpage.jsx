import { ToastContainer } from "react-toastify";
import { Route, Routes, Link } from "react-router-dom";
import LandingPage from "../LandingPage/LandingPage";
import Login from "../Login/Login";
import Signup from "../Signup/Signup";
import ApplicationLayout from "../../layouts/ApplicationLayout";

export default function Mainpage() {
  return (
    <div>
      <ToastContainer />
      <Routes>
        <Route element={<LandingPage />} path="/" />
        <Route
          path="/Login"
          element={<Login />} // Redirect if not signed in
        />
        <Route path="/signup" element={<Signup />} />
        <Route path="*" element={<ApplicationLayout />} />
      </Routes>
    </div>
  );
}
