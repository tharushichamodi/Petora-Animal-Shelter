import { useState, useEffect } from 'react';
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import Axios from "axios";
import { motion } from "framer-motion";
import { Tooltip } from 'react-tooltip';
import 'react-tooltip/dist/react-tooltip.css';

import {RegisterPet} from './training_coordinator_dashboard'
let coordiSelectedPkg = null
function TrainingBootcamp (){
   const[ showBookings, setShowBookings] = useState(false)
    let userID = Number(localStorage.getItem("userID")) || 0; // Replace with actual logged-in user ID
    
    return(
        <div className="CD_dashboard_layout">
            {showBookings &&
            <div style={{position:'fixed', top:'0', left:'0', backdropFilter:'blur(5px)', width:'100vw', height:'100vh', backgroundColor:'rgba(0,0,0,0.1)'}} onClick={() => setShowBookings(false)}></div>
            }
            <div className="CD_main_content_area">
                <h1>Training and Bootcamp Services</h1>
                <div style={{display:'flex', justifyContent:'space-between',alignItems:'center', padding:'0px 50px', width:'90%', backgroundColor:'rgba(255, 240, 217, 1)', height:'10vh', borderRadius:'20px'}}>
                    <span style={{fontSize:'25px', fontWeight:'bold'}}>View My Bookings</span>
                    <span style={{backgroundColor:'black', color:'white', borderRadius:'50px',  padding:'10px 20px', fontSize:'14px', cursor:'pointer'}}
                        onClick={() => setShowBookings(true)}>View Now</span>
                </div>
                {showBookings &&
                <TrainingCalendar onClick={(e)=> e.stopPropagation()}/>
                }
                <RegisterPet coordiSelectedPkg={coordiSelectedPkg} cd={true} userID={userID} />
                
            </div>
        </div>
    )
}

export default TrainingBootcamp;



export function TrainingCalendar() {
  const [bookings, setBookings] = useState([]);
  const [dateDetails, setDateDetails] = useState({});
  const userID = Number(localStorage.getItem("userID"));

  useEffect(() => {
    if (!userID) return;
    Axios.get(`http://localhost:3001/trainingBooking/api/trainingBookings/${userID}`)
      .then(res => {
        setBookings(res.data);
        const details = {};
        res.data.forEach(b => {
          const date = new Date(b.bookingDate).toDateString();
          details[date] = {
            petName: b.petName,
            packageName: b.packageName,
            time: b.bookingTime,
          };
        });
        setDateDetails(details);
      })
      .catch(err => console.error("Error fetching bookings:", err));
  }, [userID]);

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      width: "100vw",
      height: '100vh',
      position: 'fixed',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      zIndex: 1000,
      backgroundColor: 'transparent',
      pointerEvents: 'none'
    }}
    onClick={(e) => e.stopPropagation()}>
      <motion.div
        className="training-calendar-container"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{
          maxWidth: "700px",
          background: "#fffdf8",
          borderRadius: "20px",
          boxShadow: "0 8px 25px rgba(139, 69, 19, 0.15)",
          padding: "30px",
          border: "2px solid #e5d3b3",
        }}
        
      >
        <h2 style={{
          textAlign: "center",
          marginBottom: "25px",
          color: "#4e342e",
          fontWeight: "600",
          fontFamily: "Poppins, sans-serif",
        }}>
          🐾 My Training Bookings
        </h2>

        <Calendar
          tileClassName={({ date }) => {
            const key = date.toDateString();
            return dateDetails[key] ? "has-booking" : "";
          }}
          tileContent={({ date }) => {
            const key = date.toDateString();
            if (dateDetails[key]) {
              const d = dateDetails[key];
              return (
                <div>
                  <div
                    data-tooltip-id={key}
                    style={{
                      width: "8px",
                      height: "8px",
                      background: "#8B5E3C",
                      borderRadius: "50%",
                      margin: "0 auto",
                      marginTop: "5px",
                    }}
                  ></div>

                  <Tooltip
                    id={key}
                    place="top"
                    style={{
                      backgroundColor: '#8B5E3C',
                      color: 'white',
                      borderRadius: '8px',
                      fontSize: '0.9rem',
                      padding: '8px'
                    }}
                  >
                    <div><strong>Date:</strong> {key}</div>
                    <div><strong>Time:</strong> {d.time}</div>
                    <div><strong>Pet:</strong> {d.petName}</div>
                    <div><strong>Package:</strong> {d.packageName}</div>
                  </Tooltip>
                </div>
              );
            }
            return null;
          }}
        />
      </motion.div>
    </div>
  );
}

