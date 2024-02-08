import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";

import Main from "./Pages/Main";
import Login from "./Pages/Login";
import Dashboard from "./Pages/Dashboard";
import Donation from "./Pages/Donation";
import PrayerService from "./Pages/PrayerService";
import PastorialCareService from "./Pages/PastorialCare";
import JoinUs from "./Pages/JoinUs";

import RegistrationEvent from "./Components/Registration Forms/RegistrationEvent";
import RegistrationConnectGroup from "./Components/Registration Forms/RegisterConnectGroup";
import RegistrationVolunteer from "./Components/Registration Forms/RegistrationVolunteer";
import Events from "./Pages/Events";

import EventList from "./Pages/Dashboard Contents/Attendees List/EventList";

import ViewParticipantsModal from "./Pages/Dashboard Contents/Dashboard Components/ViewParticipantsModal";
import VolunteersList from "./Pages/Dashboard Contents/Attendees List/VolunteersList";
import ConnectgroupList from "./Pages/Dashboard Contents/Attendees List/ConnectgroupList";
import RegisterAdmin from "./Pages/RegisterAdmin";
import { Toaster } from "react-hot-toast";
import axios from "axios";

axios.defaults.baseURL = "https://nlsw-api-omega.vercel.app";
axios.defaults.withCredentials = true;

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(
    localStorage.getItem("token") ? true : false
  );

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsAuthenticated(true);
      console.log("Token retrieved from local storage:", token);
    }
  }, []);
  
  
    

  const handleLogin = (token) => {
    localStorage.setItem("token", token);
    setIsAuthenticated(true);
    console.log("Token retrieved from local storage:", token);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
  };

  return (
    <>
      <Toaster position="bottom-right" toastOptions={{ duration: 2000 }} />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Main />} />
          <Route
            path="/login"
            element={<Login handleLogin={handleLogin} />}
          />
          <Route path="/donate" element={<Donation />} />
          <Route path="/prayer" element={<PrayerService />} />
          <Route path="/pastorialcare" element={<PastorialCareService />} />
          {/* Use a Route component for conditional rendering */}
          <Route
            path="/dashboard"
            element={
              isAuthenticated ? (
                <Dashboard handleLogout={handleLogout} />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
        
          <Route path="/joinus" element={<JoinUs />} />
          <Route path="/registrationevent" element={<RegistrationEvent />} />
          <Route path="/registrationconnectgroup" element={<RegistrationConnectGroup />} />
          <Route path="/registrationvolunteer" element={<RegistrationVolunteer />} />
          <Route path="/registeradmin" element={<RegisterAdmin />} />
          <Route path="/events" element={<Events />} />


          <Route path="/ViewParticipantsModal" element={<ViewParticipantsModal />} />
          <Route path="/VolunteersList" element={<VolunteersList />} />
          <Route path="/ConnectgroupList" element={<ConnectgroupList />} />          
          <Route path="/EventVolunteerList" element={<EventList />} />

        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
