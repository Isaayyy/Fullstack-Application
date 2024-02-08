import { useState } from 'react';
import "../Pages/Page Styles/PastorialCare.css";
import NavBar from "../Components/NavBar";
import Footer from "../Components/Footer";
import axios from "axios";
import { toast } from "react-hot-toast";

const PastorialCare = () => {
  // State for handling input values
 
  const [pastorialData, setpastorialData] = useState({
    name: '',
    date: getCurrentDate(), // Set initial date to the current date
    pastorialText: '',
  });

  function getCurrentDate() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const { name, date, pastorialText } = pastorialData;
  
    try {
      const response = await axios.post('/pastorial/addpastorial', {
        name,
        date,
        pastorialText,
      });
  
      const responseData = response.data; // Rename to avoid conflict
  
      if (responseData.error) {
        toast.error(responseData.error);
      } else {
        // Update only the relevant part of the state
        setpastorialData((prevData) => ({
          ...prevData,
          message: 'Pastorial care request successfully created!',
        }));
        toast.success('Pastorial care request successfully created!');
  
        setpastorialData({
          name: '',
          date: getCurrentDate(), // Set date to the current date after submission
          pastorialText: '',
        });
      }
    } catch (error) {
      console.log(error);
    }
  };


 
  return (
    <>
      <div className="pastorial-care-header-container">
        <NavBar />

        <div className="pastorial-care-text-container">
          <div className="pastorial-care-text-wrapper">
            <div className="pastorial-video-container">
              <iframe className="pastorial-video"
              src="https://www.youtube.com/embed/gKcxpNsaZRg?si=O8H92gZTc5BKDtTC" 
              title="YouTube video player" //frameborder="0" 
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; 
              gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
            </div>
            <h1 className="pastorial-care-title">Pastorial Care REQUEST</h1>
          </div>
        </div>
      </div>

      <div className="pastorial-care-section-container">
        <form onSubmit={handleSubmit}>
          <div className="pastorial-care-request-container">
            <div className="pastorial-care-wrapper">
              <div className="pastorial-care-input-container">
                <label htmlFor="name">Name:</label>
                <input
                  type="text"
                  id="pastorial-careclientname"
                  value={pastorialData.name}
                  onChange={(e) => setpastorialData({ ...pastorialData, name: e.target.value })}
                  />
              </div>

              <div className="pastorial-care-input-container">
                <label htmlFor="date">Date:</label>
                <input
                  placeholder="Date:"
                  type="date"
                  id="pastorialcareclientdate"
                  value={pastorialData.date}
                  onChange={(e) => setpastorialData({ ...pastorialData, date: e.target.value })}
                  disabled 
                />
              </div>
            </div>

            <div className="pastorial-care-input-container">
              <textarea
                placeholder="Enter pastorial-care..."
                id="pastorial-careText"
                value={pastorialData.pastorialText}
                onChange={(e) => setpastorialData({ ...pastorialData, pastorialText: e.target.value })}
              />
            </div>

            <button type="submit" className="pastorial-care-button">
              <span className="pastorial-care-button-span">Submit</span>
            </button>
          </div>
        </form>
      </div>

      <div className="pastorial-care-footer-container">
        <Footer />
      </div>
    </>
  );
};

export default PastorialCare;
