import "./App.css";
import { Route, Routes, useLocation } from "react-router-dom";
import Header from "./elements/Header";
import Login from "./components/Login";
import Home from "./components/Home";
import Planning from "./components/Planning";
import Vendor from "./components/Vendor";
import AddVendors from "./components/AddVednors";
import FullVendorView from "./components/FullVendorView";
import { useEffect, useState } from "react";
import VendorByCategory from "./components/VendorByCategory";
import { useNavigate } from "react-router-dom";
import ChatBox from "./components/ChatBox";
import Profile from "./components/Profile";
import Footer from "./elements/Footer";

function App() {
  const location = useLocation();
  const [uid, setUid] = useState("");
  const [user, setUser] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    checkLogin();
  }, []);

  const checkLogin = () => {
    const userInfo = localStorage.getItem("userInfo");
    if (userInfo) {
      const parsedUserInfo = JSON.parse(userInfo);
      setUser(parsedUserInfo.username);
      setUid(parsedUserInfo._id);
    } else {
      navigate("/login");
    }
  };

  const showHeaderFooter = location.pathname !== "/login";

  return (
    <>
      {showHeaderFooter && <Header name={user} />}
      <Routes location={location} key={location.pathname}>
        <Route index element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/vendors" element={<Vendor />} />
        <Route path="/planning" element={<Planning user={user} uid={uid} />} />
        <Route path="/addvendors" element={<AddVendors />} />
        <Route path="/vendor/:id" element={<FullVendorView user={user} />} />
        <Route path="/vendors/:category" element={<VendorByCategory />} />
        {uid && (
          <Route path="/profile" element={<Profile user={user} uid={uid} />} />
        )}
      </Routes>
      {showHeaderFooter && <ChatBox />}
      {showHeaderFooter && <Footer />}
    </>
  );
}

export default App;
